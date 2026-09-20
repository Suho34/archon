import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

describe("GET /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await GET();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns user projects ordered by updatedAt desc", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "test@example.com", name: "Tester" } as any,
      session: {} as any,
    });

    const mockProjects = [
      {
        id: "p1",
        name: "Archon Core",
        type: "SaaS",
        userId: "user-1",
        updatedAt: new Date(),
      },
      {
        id: "p2",
        name: "Archon CLI",
        type: "CLI Tool",
        userId: "user-1",
        updatedAt: new Date(),
      },
    ];

    vi.mocked(prisma.project.findMany).mockResolvedValueOnce(mockProjects as any);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.projects).toHaveLength(2);
    expect(data.projects[0].name).toBe("Archon Core");
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { updatedAt: "desc" },
    });
  });

  it("returns 500 when database throws an error", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "test@example.com", name: "Tester" } as any,
      session: {} as any,
    });

    vi.mocked(prisma.project.findMany).mockRejectedValueOnce(
      new Error("Database connection timeout"),
    );

    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});

describe("POST /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Project Alpha" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when name is missing or empty", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "test@example.com", name: "Tester" } as any,
      session: {} as any,
    });

    const req = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Project name is required");
  });

  it("returns 400 when name exceeds 100 characters", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "test@example.com", name: "Tester" } as any,
      session: {} as any,
    });

    const req = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "A".repeat(101) }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("cannot exceed 100 characters");
  });

  it("creates project with valid payload and returns 201", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "test@example.com", name: "Tester" } as any,
      session: {} as any,
    });

    const createdProject = {
      id: "new-p1",
      name: "Archon Studio",
      description: "AI software studio",
      type: "SaaS",
      targetUsers: "Engineers",
      goal: "Automate architecture",
      constraints: "Low latency",
      tech: ["Next.js", "TypeScript"],
      scale: "MVP",
      budget: "$5,000",
      userId: "user-1",
    };

    vi.mocked(prisma.project.create).mockResolvedValueOnce(createdProject as any);

    const req = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "  Archon Studio  ",
        description: "AI software studio",
        type: "SaaS",
        targetUsers: "Engineers",
        goal: "Automate architecture",
        constraints: "Low latency",
        tech: "Next.js, TypeScript",
        scale: "MVP",
        budget: "$5,000",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.project).toEqual(createdProject);
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Archon Studio",
        type: "SaaS",
        userId: "user-1",
        tech: ["Next.js", "TypeScript"],
      }),
    });
  });

  it("returns 500 when creation database call fails", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "test@example.com", name: "Tester" } as any,
      session: {} as any,
    });

    vi.mocked(prisma.project.create).mockRejectedValueOnce(
      new Error("Prisma connection failure"),
    );

    const req = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Valid Project" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});
