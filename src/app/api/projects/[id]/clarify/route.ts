import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { ProjectError, getAuthorizedProject } from "@/lib/projects";
import {
  fromPrismaCategory,
  toPrismaCategory,
} from "@/lib/requirements";
import { runClarificationAgent } from "@/lib/clarification-agent";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getServerSession } from "@/lib/session";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const startTime = performance.now();
  let userId: string | undefined;

  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      const res = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
      logger.apiRoute({
        route: "/api/projects/[id]/clarify",
        method: "POST",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;

    // Rate limiting: 10 requests per 60 seconds per user
    const rateLimit = checkRateLimit(`clarify:${session.user.id}`, 10, 60000);
    if (!rateLimit.allowed) {
      const res = NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${rateLimit.resetInSeconds}s before requesting more clarifications.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
          },
        },
      );
      logger.apiRoute({
        route: "/api/projects/[id]/clarify",
        method: "POST",
        status: 429,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return res;
    }

    const { id } = await context.params;
    const project = await getAuthorizedProject(id, session.user.id);

    // Fetch existing requirements for context
    const rawRequirements = await prisma.requirement.findMany({
      where: { projectId: id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
      },
      take: 20,
    });

    const existingRequirements = rawRequirements.map((r) => ({
      ...r,
      category: fromPrismaCategory(r.category),
    }));

    // Run clarification agent
    const aiResult = await runClarificationAgent({
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type,
      targetUsers: project.targetUsers,
      goal: project.goal,
      constraints: project.constraints,
      tech: project.tech,
      scale: project.scale,
      budget: project.budget,
      existingRequirements,
    });

    // Persist generated clarifications
    const createdClarifications = await Promise.all(
      aiResult.clarifications.map((item) =>
        prisma.clarification.create({
          data: {
            question: item.question,
            ambiguity: item.ambiguity,
            options: item.options,
            category: item.category ? toPrismaCategory(item.category) : undefined,
            requirementId: item.requirementId ?? null,
            projectId: id,
            status: "pending",
          },
        }),
      ),
    );

    const serializedClarifications = createdClarifications.map((c) => ({
      ...c,
      category: c.category ? fromPrismaCategory(c.category) : null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    const res = NextResponse.json(
      {
        summary: aiResult.summary,
        clarifications: serializedClarifications,
      },
      { status: 201 },
    );
    logger.apiRoute({
      route: `/api/projects/${id}/clarify`,
      method: "POST",
      status: 201,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: {
        projectId: id,
        generatedCount: serializedClarifications.length,
      },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]/clarify",
        method: "POST",
        status: error.statusCode,
        durationMs,
        userId,
        error,
      });
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    logger.apiRoute({
      route: "/api/projects/[id]/clarify",
      method: "POST",
      status: 500,
      durationMs,
      userId,
      error,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
