import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/projects", () => ({
  getAuthorizedProject: vi.fn(),
  ProjectError: class ProjectError extends Error {
    constructor(
      message: string,
      public statusCode: number,
    ) {
      super(message);
    }
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    requirement: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { ProjectError, getAuthorizedProject } from "@/lib/projects";
import { getServerSession } from "@/lib/session";

describe("GET /api/projects/[id]/requirements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await GET(
      new Request("http://localhost/api/projects/p1/requirements"),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 404/403 when project authorization fails", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockRejectedValueOnce(
      new ProjectError("Project not found", 404),
    );

    const res = await GET(
      new Request("http://localhost/api/projects/p1/requirements"),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Project not found");
  });

  it("returns requirements for authorized user with category mapping", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);

    const mockRequirements = [
      {
        id: "r1",
        title: "Req 1",
        category: "Functional",
        priority: "Medium",
        status: "draft",
        projectId: "p1",
      },
      {
        id: "r2",
        title: "Req 2",
        category: "Non_functional",
        priority: "Critical",
        status: "confirmed",
        projectId: "p1",
      },
    ];
    vi.mocked(prisma.requirement.findMany).mockResolvedValueOnce(
      mockRequirements as any,
    );

    const res = await GET(
      new Request("http://localhost/api/projects/p1/requirements"),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.requirements).toHaveLength(2);
    expect(data.requirements[0].category).toBe("Functional");
    expect(data.requirements[1].category).toBe("Non-functional");
  });

  it("returns 500 when database throws", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);
    vi.mocked(prisma.requirement.findMany).mockRejectedValueOnce(
      new Error("DB failure"),
    );

    const res = await GET(
      new Request("http://localhost/api/projects/p1/requirements"),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});

describe("POST /api/projects/[id]/requirements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await POST(
      new Request("http://localhost/api/projects/p1/requirements", {
        method: "POST",
        body: JSON.stringify({ title: "Valid Title" }),
      }),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(401);
  });

  it("returns 400 for empty or invalid title", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);

    const res = await POST(
      new Request("http://localhost/api/projects/p1/requirements", {
        method: "POST",
        body: JSON.stringify({ title: "" }),
      }),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 400 for invalid category", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);

    const res = await POST(
      new Request("http://localhost/api/projects/p1/requirements", {
        method: "POST",
        body: JSON.stringify({
          title: "Architecture",
          category: "NonExistentCategory",
        }),
      }),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(400);
  });

  it("creates requirement and returns 201 with default fields", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);

    const newReq = {
      id: "r-new",
      title: "Rate Limiting",
      category: "Security",
      priority: "High",
      status: "draft",
      constraints: null,
      assumptions: null,
      description: null,
      projectId: "p1",
    };
    vi.mocked(prisma.requirement.create).mockResolvedValueOnce(newReq as any);

    const res = await POST(
      new Request("http://localhost/api/projects/p1/requirements", {
        method: "POST",
        body: JSON.stringify({
          title: "Rate Limiting",
          category: "Security",
          priority: "High",
        }),
      }),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.requirement.title).toBe("Rate Limiting");
    expect(data.requirement.category).toBe("Security");
  });

  it("returns 500 when requirement creation fails", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);
    vi.mocked(prisma.requirement.create).mockRejectedValueOnce(
      new Error("Database write lock"),
    );

    const res = await POST(
      new Request("http://localhost/api/projects/p1/requirements", {
        method: "POST",
        body: JSON.stringify({
          title: "Data Backup",
          category: "Data",
        }),
      }),
      {
        params: Promise.resolve({ id: "p1" }),
      },
    );

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});
