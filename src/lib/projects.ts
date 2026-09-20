import { z } from "zod";

import { prisma } from "@/lib/prisma";

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  type?: string | null;
  targetUsers?: string | null;
  goal?: string | null;
  constraints?: string | null;
  tech?: string[];
  scale?: string | null;
  budget?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  type?: string | null;
  targetUsers?: string | null;
  goal?: string | null;
  constraints?: string | null;
  tech?: string[];
  scale?: string | null;
  budget?: string | null;
}

export class ProjectError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ProjectError";
  }
}

function parseTechArray(input: unknown): string[] {
  const raw = Array.isArray(input) ? input : typeof input === "string" ? input.split(",") : [];
  return [...new Set(raw.filter((i): i is string => typeof i === "string").map((s) => s.trim()).filter(Boolean))];
}

const cleanString = (input: unknown): string | null =>
  typeof input === "string" && input.trim().length > 0 ? input.trim() : null;

export const createProjectSchema = z
  .object({
    name: z
      .string({ message: "Project name is required" })
      .trim()
      .min(1, "Project name is required")
      .max(100, "Project name cannot exceed 100 characters"),
    description: z.string().trim().nullable().optional(),
    type: z.string().trim().nullable().optional(),
    targetUsers: z.string().trim().nullable().optional(),
    target_users: z.string().trim().nullable().optional(),
    goal: z.string().trim().nullable().optional(),
    constraints: z.string().trim().nullable().optional(),
    tech: z.union([z.array(z.string()), z.string()]).optional(),
    scale: z.string().trim().nullable().optional(),
    budget: z.string().trim().nullable().optional(),
  })
  .transform((data) => ({
    name: data.name,
    description: cleanString(data.description),
    type: cleanString(data.type),
    targetUsers: cleanString(data.targetUsers ?? data.target_users),
    goal: cleanString(data.goal),
    constraints: cleanString(data.constraints),
    tech: parseTechArray(data.tech),
    scale: cleanString(data.scale),
    budget: cleanString(data.budget),
  }));

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Project name cannot be empty")
      .max(100, "Project name cannot exceed 100 characters")
      .optional(),
    description: z.string().trim().nullable().optional(),
    type: z.string().trim().nullable().optional(),
    targetUsers: z.string().trim().nullable().optional(),
    target_users: z.string().trim().nullable().optional(),
    goal: z.string().trim().nullable().optional(),
    constraints: z.string().trim().nullable().optional(),
    tech: z.union([z.array(z.string()), z.string()]).optional(),
    scale: z.string().trim().nullable().optional(),
    budget: z.string().trim().nullable().optional(),
  })
  .transform((data) => {
    const res: UpdateProjectInput = {};
    if (data.name !== undefined) res.name = data.name;
    if (data.description !== undefined) res.description = cleanString(data.description);
    if (data.type !== undefined) res.type = cleanString(data.type);
    if (data.targetUsers !== undefined || data.target_users !== undefined) {
      res.targetUsers = cleanString(data.targetUsers ?? data.target_users);
    }
    if (data.goal !== undefined) res.goal = cleanString(data.goal);
    if (data.constraints !== undefined) res.constraints = cleanString(data.constraints);
    if (data.tech !== undefined) res.tech = parseTechArray(data.tech);
    if (data.scale !== undefined) res.scale = cleanString(data.scale);
    if (data.budget !== undefined) res.budget = cleanString(data.budget);
    return res;
  });

export function validateCreateProjectInput(raw: unknown): {
  valid: boolean;
  data?: CreateProjectInput;
  error?: string;
} {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "Request body must be a valid JSON object" };
  }
  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { valid: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  return { valid: true, data: parsed.data };
}

export function validateUpdateProjectInput(raw: unknown): {
  valid: boolean;
  data?: UpdateProjectInput;
  error?: string;
} {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "Request body must be a valid JSON object" };
  }
  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { valid: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  return { valid: true, data: parsed.data };
}

/**
 * Verifies that a project exists and belongs to the authenticated user.
 * Throws a ProjectError with status 404 (if not found) or 403 (if forbidden).
 */
export async function getAuthorizedProject(projectId: string, userId: string) {
  if (!projectId || typeof projectId !== "string") {
    throw new ProjectError("Invalid project ID", 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new ProjectError("Project not found", 404);
  }

  if (project.userId !== userId) {
    throw new ProjectError(
      "Forbidden: You do not have permission to access this project",
      403,
    );
  }

  return project;
}
