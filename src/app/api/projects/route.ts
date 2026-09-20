import { NextResponse } from "next/server";

import { validateRequestBody } from "@/lib/api-validation";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/projects";
import { getServerSession } from "@/lib/session";

export async function GET() {
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
        route: "/api/projects",
        method: "GET",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const res = NextResponse.json({ projects }, { status: 200 });
    logger.apiRoute({
      route: "/api/projects",
      method: "GET",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { count: projects.length },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    logger.apiRoute({
      route: "/api/projects",
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

export async function POST(request: Request) {
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
        route: "/api/projects",
        method: "POST",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;

    const validation = await validateRequestBody(request, createProjectSchema);
    if (!validation.success) {
      logger.apiRoute({
        route: "/api/projects",
        method: "POST",
        status: 400,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return validation.response;
    }

    const project = await prisma.project.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        type: validation.data.type,
        targetUsers: validation.data.targetUsers,
        goal: validation.data.goal,
        constraints: validation.data.constraints,
        tech: validation.data.tech,
        scale: validation.data.scale,
        budget: validation.data.budget,
        userId: session.user.id,
      },
    });

    const res = NextResponse.json({ project }, { status: 201 });
    logger.apiRoute({
      route: "/api/projects",
      method: "POST",
      status: 201,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { projectId: project.id, projectName: project.name },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    logger.apiRoute({
      route: "/api/projects",
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
