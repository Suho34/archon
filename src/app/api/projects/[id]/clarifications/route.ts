import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { ProjectError, getAuthorizedProject } from "@/lib/projects";
import { fromPrismaCategory } from "@/lib/requirements";
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
        route: "/api/projects/[id]/clarifications",
        method: "GET",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    await getAuthorizedProject(id, session.user.id);

    const rawClarifications = await prisma.clarification.findMany({
      where: {
        projectId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const clarifications = rawClarifications.map((c) => ({
      ...c,
      category: c.category ? fromPrismaCategory(c.category) : null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    const res = NextResponse.json({ clarifications }, { status: 200 });
    logger.apiRoute({
      route: `/api/projects/${id}/clarifications`,
      method: "GET",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { count: clarifications.length, projectId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]/clarifications",
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
      route: "/api/projects/[id]/clarifications",
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
