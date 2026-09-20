import { NextResponse } from "next/server";

import { validateRequestBody } from "@/lib/api-validation";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { ProjectError } from "@/lib/projects";
import {
  fromPrismaCategory,
  getAuthorizedRequirement,
  toPrismaCategory,
  updateRequirementSchema,
} from "@/lib/requirements";
import { getServerSession } from "@/lib/session";

interface RouteContext {
  params: Promise<{ id: string }>;
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
        route: "/api/requirements/[id]",
        method: "PATCH",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    await getAuthorizedRequirement(id, session.user.id);

    const validation = await validateRequestBody(request, updateRequirementSchema);
    if (!validation.success) {
      logger.apiRoute({
        route: `/api/requirements/${id}`,
        method: "PATCH",
        status: 400,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return validation.response;
    }

    const updateData: Record<string, any> = { ...validation.data };
    if (validation.data.category) {
      updateData.category = toPrismaCategory(validation.data.category);
    }

    const updatedRequirement = await prisma.requirement.update({
      where: { id },
      data: updateData,
    });

    const res = NextResponse.json(
      {
        requirement: {
          ...updatedRequirement,
          category: fromPrismaCategory(updatedRequirement.category),
        },
      },
      { status: 200 },
    );
    logger.apiRoute({
      route: `/api/requirements/${id}`,
      method: "PATCH",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { requirementId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/requirements/[id]",
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
      route: "/api/requirements/[id]",
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
        route: "/api/requirements/[id]",
        method: "DELETE",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    await getAuthorizedRequirement(id, session.user.id);

    await prisma.requirement.delete({
      where: { id },
    });

    const res = NextResponse.json(
      { success: true, message: "Requirement deleted successfully" },
      { status: 200 },
    );
    logger.apiRoute({
      route: `/api/requirements/${id}`,
      method: "DELETE",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { requirementId: id },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/requirements/[id]",
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
      route: "/api/requirements/[id]",
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
