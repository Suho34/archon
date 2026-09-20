import { describe, expect, it, vi } from "vitest";

import {
  ProjectError,
  getAuthorizedProject,
  validateCreateProjectInput,
  validateUpdateProjectInput,
} from "./projects";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

describe("validateCreateProjectInput", () => {
  it("validates and formats a complete valid project payload", () => {
    const input = {
      name: "  Archon Platform  ",
      description: "  A calmer place to do your best work  ",
      type: "Full Stack Web App",
      targetUsers: "Engineers and product designers",
      goal: "Streamline developer workflows",
      constraints: "Budget under $10,000",
      tech: ["Next.js", "TypeScript", "Prisma", "Next.js"],
      scale: "MVP",
      budget: "$10,000",
    };

    const result = validateCreateProjectInput(input);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({
      name: "Archon Platform",
      description: "A calmer place to do your best work",
      type: "Full Stack Web App",
      targetUsers: "Engineers and product designers",
      goal: "Streamline developer workflows",
      constraints: "Budget under $10,000",
      tech: ["Next.js", "TypeScript", "Prisma"],
      scale: "MVP",
      budget: "$10,000",
    });
  });

  it("handles tech passed as comma-separated string", () => {
    const input = {
      name: "Mobile App",
      tech: "React Native, Expo, Tailwind CSS, Expo",
    };

    const result = validateCreateProjectInput(input);
    expect(result.valid).toBe(true);
    expect(result.data?.tech).toEqual(["React Native", "Expo", "Tailwind CSS"]);
  });

  it("handles target_users snake_case fallback", () => {
    const input = {
      name: "API Service",
      target_users: "Backend Developers",
    };

    const result = validateCreateProjectInput(input);
    expect(result.valid).toBe(true);
    expect(result.data?.targetUsers).toBe("Backend Developers");
  });

  it("rejects when name is missing or empty", () => {
    expect(validateCreateProjectInput({ name: "   " }).valid).toBe(false);
    expect(validateCreateProjectInput({}).valid).toBe(false);
    expect(validateCreateProjectInput(null).valid).toBe(false);
  });

  it("rejects when name exceeds max length", () => {
    const longName = "a".repeat(101);
    const result = validateCreateProjectInput({ name: longName });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot exceed 100 characters");
  });
});

describe("validateUpdateProjectInput", () => {
  it("allows partial updates", () => {
    const result = validateUpdateProjectInput({
      name: "Updated Name",
      scale: "Enterprise",
    });
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({
      name: "Updated Name",
      scale: "Enterprise",
    });
  });

  it("rejects update with empty name", () => {
    const result = validateUpdateProjectInput({ name: "   " });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot be empty");
  });
});

describe("getAuthorizedProject ownership authorization check", () => {
  it("throws 400 for invalid ID", async () => {
    await expect(getAuthorizedProject("", "user-123")).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("throws 404 when project does not exist", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(null);

    await expect(
      getAuthorizedProject("proj-999", "user-123"),
    ).rejects.toThrowError(ProjectError);
    await expect(
      getAuthorizedProject("proj-999", "user-123"),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Project not found",
    });
  });

  it("throws 403 when project belongs to a different user", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
      id: "proj-1",
      name: "Private Project",
      description: null,
      type: null,
      targetUsers: null,
      goal: null,
      constraints: null,
      tech: [],
      scale: null,
      budget: null,
      userId: "user-owner-456",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      getAuthorizedProject("proj-1", "attacker-user-789"),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: expect.stringContaining("Forbidden"),
    });
  });

  it("returns project when user is the owner", async () => {
    const mockProject = {
      id: "proj-1",
      name: "Owner Project",
      description: "My project",
      type: "Web App",
      targetUsers: "Designers",
      goal: "Ship fast",
      constraints: "None",
      tech: ["Next.js"],
      scale: "MVP",
      budget: "$5,000",
      userId: "user-owner-456",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce(mockProject);

    const project = await getAuthorizedProject("proj-1", "user-owner-456");
    expect(project).toEqual(mockProject);
  });
});
