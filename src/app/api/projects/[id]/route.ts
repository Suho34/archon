import { NextResponse } from "next/server";

import { validateRequestBody } from "@/lib/api-validation";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
  ProjectError,
  getAuthorizedProject,
  updateProjectSchema,
} from "@/lib/projects";
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
        route: "/api/projects/[id]",
        method: "GET",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    const project = await getAuthorizedProject(id, session.user.id);

    const res = NextResponse.json({ project }, { status: 200 });
    logger.apiRoute({
      route: `/api/projects/${id}`,
      method: "GET",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { projectId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]",
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
      route: "/api/projects/[id]",
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

export async function PATCH(request: Request, context: RouteContext) {
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
        route: "/api/projects/[id]",
        method: "PATCH",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    // Verify ownership before updating
    await getAuthorizedProject(id, session.user.id);

    const validation = await validateRequestBody(request, updateProjectSchema);
    if (!validation.success) {
      logger.apiRoute({
        route: `/api/projects/${id}`,
        method: "PATCH",
        status: 400,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return validation.response;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: validation.data,
    });

    const res = NextResponse.json({ project: updatedProject }, { status: 200 });
    logger.apiRoute({
      route: `/api/projects/${id}`,
      method: "PATCH",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { projectId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]",
        method: "PATCH",
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
      route: "/api/projects/[id]",
      method: "PATCH",
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

export async function DELETE(request: Request, context: RouteContext) {
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
        route: "/api/projects/[id]",
        method: "DELETE",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    // Verify ownership before deleting
    await getAuthorizedProject(id, session.user.id);

    await prisma.project.delete({
      where: { id },
    });

    const res = NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 },
    );
    logger.apiRoute({
      route: `/api/projects/${id}`,
      method: "DELETE",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { projectId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/projects/[id]",
        method: "DELETE",
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
      route: "/api/projects/[id]",
      method: "DELETE",
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
