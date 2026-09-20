import { describe, expect, it, vi } from "vitest";

import { ProjectError } from "./projects";
import {
  createRequirementSchema,
  getAuthorizedRequirement,
  updateRequirementSchema,
} from "./requirements";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    requirement: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

describe("createRequirementSchema", () => {
  it("validates a full valid requirement payload", () => {
    const input = {
      title: "  User Authentication via OAuth  ",
      description: "  Support Google and GitHub OAuth providers  ",
      category: "Security",
      priority: "High",
      constraints: "Must complete in < 2 seconds",
      assumptions: "Users have valid email addresses",
      status: "draft",
    };

    const parsed = createRequirementSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual({
        title: "User Authentication via OAuth",
        description: "Support Google and GitHub OAuth providers",
        category: "Security",
        priority: "High",
        constraints: "Must complete in < 2 seconds",
        assumptions: "Users have valid email addresses",
        status: "draft",
      });
    }
  });

  it("applies defaults for priority and status", () => {
    const input = {
      title: "Export to CSV",
      category: "Functional",
    };

    const parsed = createRequirementSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.priority).toBe("Medium");
      expect(parsed.data.status).toBe("draft");
      expect(parsed.data.description).toBeNull();
      expect(parsed.data.constraints).toBeNull();
      expect(parsed.data.assumptions).toBeNull();
    }
  });

  it("accepts all valid categories", () => {
    const categories = [
      "Functional",
      "Non-functional",
      "Security",
      "Performance",
      "AI",
      "Data",
      "Infrastructure",
      "Business",
    ];

    for (const category of categories) {
      const parsed = createRequirementSchema.safeParse({
        title: `Test ${category}`,
        category,
      });
      expect(parsed.success).toBe(true);
    }
  });

  it("rejects invalid category", () => {
    const parsed = createRequirementSchema.safeParse({
      title: "Test invalid",
      category: "RandomCategory",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects empty or whitespace title", () => {
    expect(
      createRequirementSchema.safeParse({
        title: "   ",
        category: "Functional",
      }).success,
    ).toBe(false);

    expect(
      createRequirementSchema.safeParse({
        title: "",
        category: "Functional",
      }).success,
    ).toBe(false);

    expect(
      createRequirementSchema.safeParse({
        category: "Functional",
      }).success,
    ).toBe(false);
  });

  it("rejects title exceeding 200 characters", () => {
    const longTitle = "a".repeat(201);
    const parsed = createRequirementSchema.safeParse({
      title: longTitle,
      category: "Functional",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("updateRequirementSchema", () => {
  it("allows partial updates", () => {
    const parsed = updateRequirementSchema.safeParse({
      status: "confirmed",
      priority: "Critical",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe("confirmed");
      expect(parsed.data.priority).toBe("Critical");
    }
  });

  it("rejects empty update payload", () => {
    const parsed = updateRequirementSchema.safeParse({});
    expect(parsed.success).toBe(false);
  });

  it("rejects empty title in update", () => {
    const parsed = updateRequirementSchema.safeParse({
      title: "   ",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("getAuthorizedRequirement", () => {
  it("throws 400 for empty or invalid ID", async () => {
    await expect(getAuthorizedRequirement("", "user-1")).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("throws 404 when requirement does not exist", async () => {
    vi.mocked(prisma.requirement.findUnique).mockResolvedValueOnce(null);

    await expect(
      getAuthorizedRequirement("req-999", "user-1"),
    ).rejects.toThrowError(ProjectError);
    await expect(
      getAuthorizedRequirement("req-999", "user-1"),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Requirement not found",
    });
  });

  it("throws 403 when parent project belongs to another user", async () => {
    vi.mocked(prisma.requirement.findUnique).mockResolvedValueOnce({
      id: "req-1",
      title: "Secret Req",
      description: null,
      category: "Security",
      priority: "High",
      constraints: null,
      assumptions: null,
      status: "draft",
      projectId: "proj-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      project: {
        id: "proj-1",
        userId: "owner-user-456",
        name: "Owner Project",
      },
    } as any);

    await expect(
      getAuthorizedRequirement("req-1", "attacker-user-789"),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: expect.stringContaining("Forbidden"),
    });
  });

  it("returns requirement when user is the owner of parent project", async () => {
    const mockRequirement = {
      id: "req-1",
      title: "My Req",
      description: "Description",
      category: "Performance",
      priority: "Medium",
      constraints: null,
      assumptions: null,
      status: "confirmed",
      projectId: "proj-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      project: {
        id: "proj-1",
        userId: "owner-user-456",
        name: "Owner Project",
      },
    };

    vi.mocked(prisma.requirement.findUnique).mockResolvedValueOnce(
      mockRequirement as any,
    );

    const result = await getAuthorizedRequirement("req-1", "owner-user-456");
    expect(result).toEqual(mockRequirement);
  });
});
