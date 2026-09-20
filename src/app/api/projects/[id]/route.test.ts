import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE, GET, PATCH } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/projects", async () => {
  const actual = await vi.importActual<any>("@/lib/projects");
  return {
    ...actual,
    getAuthorizedProject: vi.fn(),
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { ProjectError, getAuthorizedProject } from "@/lib/projects";
import { getServerSession } from "@/lib/session";

describe("GET /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await GET(new Request("http://localhost/api/projects/p1"), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockRejectedValueOnce(
      new ProjectError("Project not found", 404),
    );

    const res = await GET(new Request("http://localhost/api/projects/p-none"), {
      params: Promise.resolve({ id: "p-none" }),
    });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Project not found");
  });

  it("returns 200 with authorized project data", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    const mockProject = {
      id: "p1",
      name: "Archon Project",
      type: "SaaS",
      userId: "user-1",
    };
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce(mockProject as any);

    const res = await GET(new Request("http://localhost/api/projects/p1"), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.project).toEqual(mockProject);
  });
});

describe("PATCH /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await PATCH(
      new Request("http://localhost/api/projects/p1", {
        method: "PATCH",
        body: JSON.stringify({ name: "Updated" }),
      }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(res.status).toBe(401);
  });

  it("returns 400 when name is provided as empty string", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);

    const res = await PATCH(
      new Request("http://localhost/api/projects/p1", {
        method: "PATCH",
        body: JSON.stringify({ name: "   " }),
      }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Project name cannot be empty");
  });

  it("updates project and returns 200", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);

    const updated = {
      id: "p1",
      name: "Archon Modern",
      goal: "New architectural goals",
    };
    vi.mocked(prisma.project.update).mockResolvedValueOnce(updated as any);

    const res = await PATCH(
      new Request("http://localhost/api/projects/p1", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Archon Modern",
          goal: "New architectural goals",
        }),
      }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.project).toEqual(updated);
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: expect.objectContaining({
        name: "Archon Modern",
        goal: "New architectural goals",
      }),
    });
  });
});

describe("DELETE /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await DELETE(
      new Request("http://localhost/api/projects/p1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not authorized to delete project", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockRejectedValueOnce(
      new ProjectError("Forbidden", 403),
    );

    const res = await DELETE(
      new Request("http://localhost/api/projects/p1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(res.status).toBe(403);
  });

  it("deletes project and returns 200", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({ id: "p1" } as any);
    vi.mocked(prisma.project.delete).mockResolvedValueOnce({ id: "p1" } as any);

    const res = await DELETE(
      new Request("http://localhost/api/projects/p1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "p1" }) },
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: "p1" } });
  });
});
