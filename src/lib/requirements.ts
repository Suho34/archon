import { RequirementCategory as PrismaRequirementCategory } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { ProjectError } from "@/lib/projects";
import {
  REQUIREMENT_CATEGORIES,
  REQUIREMENT_PRIORITIES,
  REQUIREMENT_STATUSES,
  RequirementCategory,
} from "@/lib/requirement-types";

export {
  REQUIREMENT_CATEGORIES,
  REQUIREMENT_PRIORITIES,
  REQUIREMENT_STATUSES,
} from "@/lib/requirement-types";
export type {
  RequirementCategory,
  RequirementPriority,
  RequirementStatus,
} from "@/lib/requirement-types";

export function toPrismaCategory(
  category: RequirementCategory,
): PrismaRequirementCategory {
  if (category === "Non-functional") {
    return "Non_functional" as PrismaRequirementCategory;
  }
  return category as PrismaRequirementCategory;
}

export function fromPrismaCategory(
  category: PrismaRequirementCategory | string,
): RequirementCategory {
  if (category === "Non_functional" || category === "Non-functional") {
    return "Non-functional";
  }
  return category as RequirementCategory;
}

/**
 * Zod schema for creating a requirement
 */
export const createRequirementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  category: z.enum(REQUIREMENT_CATEGORIES, {
    message: `Category must be one of: ${REQUIREMENT_CATEGORIES.join(", ")}`,
  }),
  priority: z.enum(REQUIREMENT_PRIORITIES).default("Medium"),
  constraints: z
    .string()
    .trim()
    .max(2000, "Constraints cannot exceed 2000 characters")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  assumptions: z
    .string()
    .trim()
    .max(2000, "Assumptions cannot exceed 2000 characters")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  status: z.enum(REQUIREMENT_STATUSES).default("draft"),
});

export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;

/**
 * Zod schema for updating a requirement
 */
export const updateRequirementSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined ? undefined : val && val.length > 0 ? val : null,
      ),
    category: z.enum(REQUIREMENT_CATEGORIES).optional(),
    priority: z.enum(REQUIREMENT_PRIORITIES).optional(),
    constraints: z
      .string()
      .trim()
      .max(2000, "Constraints cannot exceed 2000 characters")
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined ? undefined : val && val.length > 0 ? val : null,
      ),
    assumptions: z
      .string()
      .trim()
      .max(2000, "Assumptions cannot exceed 2000 characters")
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined ? undefined : val && val.length > 0 ? val : null,
      ),
    status: z.enum(REQUIREMENT_STATUSES).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export type UpdateRequirementInput = z.infer<typeof updateRequirementSchema>;

/**
 * Verifies that a requirement exists and its parent project belongs to the authenticated user.
 * Throws a ProjectError with status 404 (if not found) or 403 (if forbidden).
 */
export async function getAuthorizedRequirement(
  requirementId: string,
  userId: string,
) {
  if (!requirementId || typeof requirementId !== "string") {
    throw new ProjectError("Invalid requirement ID", 400);
  }

  const requirement = await prisma.requirement.findUnique({
    where: { id: requirementId },
    include: {
      project: {
        select: {
          id: true,
          userId: true,
          name: true,
        },
      },
    },
  });

  if (!requirement) {
    throw new ProjectError("Requirement not found", 404);
  }

  if (requirement.project.userId !== userId) {
    throw new ProjectError(
      "Forbidden: You do not have permission to access this requirement",
      403,
    );
  }

  return requirement;
}
