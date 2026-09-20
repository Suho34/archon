import { NextResponse } from "next/server";

import { validateRequestBody } from "@/lib/api-validation";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { ProjectError, getAuthorizedProject } from "@/lib/projects";
import {
  createRequirementSchema,
  fromPrismaCategory,
  toPrismaCategory,
} from "@/lib/requirements";
import { getServerSession } from "@/lib/session";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
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
        route: "/api/projects/[id]/requirements",
        method: "GET",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    await getAuthorizedProject(id, session.user.id);

    const rawRequirements = await prisma.requirement.findMany({
      where: {
        projectId: id,
      },
      orderBy: [
        { category: "asc" },
        { createdAt: "desc" },
      ],
    });

    const requirements = rawRequirements.map((r) => ({
      ...r,
      category: fromPrismaCategory(r.category),
    }));

    const res = NextResponse.json({ requirements }, { status: 200 });
    logger.apiRoute({
      route: `/api/projects/${id}/requirements`,
      method: "GET",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { count: requirements.length, projectId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]/requirements",
        method: "GET",
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
      route: "/api/projects/[id]/requirements",
      method: "GET",
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
        route: "/api/projects/[id]/requirements",
        method: "POST",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    await getAuthorizedProject(id, session.user.id);

    const validation = await validateRequestBody(request, createRequirementSchema);
    if (!validation.success) {
      logger.apiRoute({
        route: `/api/projects/${id}/requirements`,
        method: "POST",
        status: 400,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return validation.response;
    }

    const created = await prisma.requirement.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        category: toPrismaCategory(validation.data.category),
        priority: validation.data.priority,
        constraints: validation.data.constraints,
        assumptions: validation.data.assumptions,
        status: validation.data.status,
        projectId: id,
      },
    });

    const res = NextResponse.json(
      {
        requirement: {
          ...created,
          category: fromPrismaCategory(created.category),
        },
      },
      { status: 201 },
    );
    logger.apiRoute({
      route: `/api/projects/${id}/requirements`,
      method: "POST",
      status: 201,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { requirementId: created.id, projectId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]/requirements",
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
      route: "/api/projects/[id]/requirements",
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
