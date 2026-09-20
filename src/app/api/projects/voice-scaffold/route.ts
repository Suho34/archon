import { NextResponse } from "next/server";

import { validateRequestBody } from "@/lib/api-validation";
import { logger } from "@/lib/logger";
import { getServerSession } from "@/lib/session";
import {
  scaffoldProjectFromVoice,
  voiceScaffoldRequestSchema,
} from "@/lib/voice-scaffold";

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
        route: "/api/projects/voice-scaffold",
        method: "POST",
        status: 401,
        durationMs: Math.round(performance.now() - startTime),
      });
      return res;
    }

    userId = session.user.id;

    const validation = await validateRequestBody(
      request,
      voiceScaffoldRequestSchema,
    );
    if (!validation.success) {
      logger.apiRoute({
        route: "/api/projects/voice-scaffold",
        method: "POST",
        status: 400,
        durationMs: Math.round(performance.now() - startTime),
        userId,
      });
      return validation.response;
    }

    const scaffoldedData = await scaffoldProjectFromVoice(
      validation.data.transcript,
    );

    const res = NextResponse.json(
      { scaffold: scaffoldedData },
      { status: 200 },
    );
    logger.apiRoute({
      route: "/api/projects/voice-scaffold",
      method: "POST",
      status: 200,
      durationMs: Math.round(performance.now() - startTime),
      userId,
      metadata: { projectName: scaffoldedData.name },
    });
    return res;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    logger.apiRoute({
      route: "/api/projects/voice-scaffold",
      method: "POST",
      status: 500,
      durationMs,
      userId,
      error,
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
