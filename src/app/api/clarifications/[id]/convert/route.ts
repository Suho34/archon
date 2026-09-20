import { NextResponse } from "next/server";

import { validateRequestBody } from "@/lib/api-validation";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { ProjectError } from "@/lib/projects";
import {
  convertClarificationSchema,
  getAuthorizedClarification,
} from "@/lib/clarifications";
import {
  fromPrismaCategory,
  toPrismaCategory,
} from "@/lib/requirements";
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
        route: "/api/clarifications/[id]/convert",
        method: "POST",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;
    const { id } = await context.params;
    const clarification = await getAuthorizedClarification(id, session.user.id);

    const validation = await validateRequestBody(request, convertClarificationSchema);
    if (!validation.success) {
      logger.apiRoute({
        route: `/api/clarifications/${id}/convert`,
        method: "POST",
        status: 400,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return validation.response;
    }

    const answerText = clarification.answer || "Confirmed by user";

    if (validation.data.target === "requirement") {
      const category =
        validation.data.category ||
        (clarification.category
          ? fromPrismaCategory(clarification.category)
          : "Functional");
      const title = validation.data.title?.trim() || clarification.question;

      const requirement = await prisma.requirement.create({
        data: {
          title,
          description: `Decision: ${answerText}\n\nResolved Context: ${clarification.ambiguity || "Architectural clarification"}`,
          category: toPrismaCategory(category),
          priority: validation.data.priority || "Medium",
          status: "confirmed",
          projectId: clarification.projectId,
        },
      });

      await prisma.clarification.update({
        where: { id },
        data: {
          status: "converted",
          convertedReqId: requirement.id,
        },
      });

      const res = NextResponse.json(
        {
          success: true,
          target: "requirement",
          requirement: {
            ...requirement,
            category: fromPrismaCategory(requirement.category),
          },
        },
        { status: 201 },
      );
      logger.apiRoute({
        route: `/api/clarifications/${id}/convert`,
        method: "POST",
        status: 201,
        durationMs: Math.round(performance.now() - startTime),
        userId,
        metadata: { target: "requirement", requirementId: requirement.id },
      });
      return res;
    } else {
      // target === "constraint"
      const constraintLine = `• ${clarification.question}: ${answerText}`;
      const existingConstraints = clarification.project.constraints?.trim();
      const updatedConstraints = existingConstraints
        ? `${existingConstraints}\n${constraintLine}`
        : constraintLine;

      const updatedProject = await prisma.project.update({
        where: { id: clarification.projectId },
        data: {
          constraints: updatedConstraints,
        },
      });

      await prisma.clarification.update({
        where: { id },
        data: {
          status: "converted",
        },
      });

      const res = NextResponse.json(
        {
          success: true,
          target: "constraint",
          constraints: updatedProject.constraints,
        },
        { status: 200 },
      );
      logger.apiRoute({
        route: `/api/clarifications/${id}/convert`,
        method: "POST",
        status: 200,
        durationMs: Math.round(performance.now() - startTime),
        userId,
        metadata: { target: "constraint", projectId: clarification.projectId },
      });
      return res;
    }
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (error instanceof ProjectError) {
      logger.apiRoute({
        route: "/api/clarifications/[id]/convert",
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
      route: "/api/clarifications/[id]/convert",
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
