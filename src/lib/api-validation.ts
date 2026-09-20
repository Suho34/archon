import { NextResponse } from "next/server";
import { z } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

/**
 * Validates a Next.js Request body against a Zod schema.
 * Handles empty bodies, invalid JSON parsing, and schema validation errors.
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ValidationResult<T>> {
  let body: unknown;

  try {
    const rawText = await request.text();
    body = rawText && rawText.trim().length > 0 ? JSON.parse(rawText) : {};
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      ),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const message = firstIssue?.message ?? "Invalid input";
    return {
      success: false,
      response: NextResponse.json(
        {
          error: message,
          issues: result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      ),
    };
  }

  return { success: true, data: result.data };
}
