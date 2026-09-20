import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE, PATCH } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/requirements", async () => {
  const actual = await vi.importActual<any>("@/lib/requirements");
  return {
    ...actual,
    getAuthorizedRequirement: vi.fn(),
  };
});

vi.mock("@/lib/projects", () => ({
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
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { ProjectError } from "@/lib/projects";
import { getAuthorizedRequirement } from "@/lib/requirements";
import { getServerSession } from "@/lib/session";

describe("PATCH /api/requirements/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await PATCH(
      new Request("http://localhost/api/requirements/r1", {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(401);
  });

  it("returns 404 when requirement is not found", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockRejectedValueOnce(
      new ProjectError("Requirement not found", 404),
    );

    const res = await PATCH(
      new Request("http://localhost/api/requirements/r-none", {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      }),
      { params: Promise.resolve({ id: "r-none" }) },
    );

    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid category or status", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockResolvedValueOnce({
      id: "r1",
      project: { userId: "user-1" },
    } as any);

    const res = await PATCH(
      new Request("http://localhost/api/requirements/r1", {
        method: "PATCH",
        body: JSON.stringify({ status: "invalid_status" }),
      }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(400);
  });

  it("updates requirement status and category with 200", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockResolvedValueOnce({
      id: "r1",
      project: { userId: "user-1" },
    } as any);

    const updated = {
      id: "r1",
      title: "Updated Title",
      category: "Security",
      status: "confirmed",
    };
    vi.mocked(prisma.requirement.update).mockResolvedValueOnce(updated as any);

    const res = await PATCH(
      new Request("http://localhost/api/requirements/r1", {
        method: "PATCH",
        body: JSON.stringify({
          status: "confirmed",
          title: "Updated Title",
          category: "Security",
        }),
      }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.requirement.title).toBe("Updated Title");
    expect(data.requirement.category).toBe("Security");
  });

  it("returns 500 when update fails in database", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockResolvedValueOnce({
      id: "r1",
      project: { userId: "user-1" },
    } as any);
    vi.mocked(prisma.requirement.update).mockRejectedValueOnce(
      new Error("Database write error"),
    );

    const res = await PATCH(
      new Request("http://localhost/api/requirements/r1", {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});

describe("DELETE /api/requirements/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await DELETE(
      new Request("http://localhost/api/requirements/r1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not authorized to delete requirement", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockRejectedValueOnce(
      new ProjectError("Forbidden", 403),
    );

    const res = await DELETE(
      new Request("http://localhost/api/requirements/r1", { method: "DELETE" }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(403);
  });

  it("deletes requirement and returns 200", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockResolvedValueOnce({
      id: "r1",
      project: { userId: "user-1" },
    } as any);
    vi.mocked(prisma.requirement.delete).mockResolvedValueOnce({ id: "r1" } as any);

    const res = await DELETE(
      new Request("http://localhost/api/requirements/r1", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 500 when delete operation throws", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedRequirement).mockResolvedValueOnce({
      id: "r1",
      project: { userId: "user-1" },
    } as any);
    vi.mocked(prisma.requirement.delete).mockRejectedValueOnce(
      new Error("Database failure"),
    );

    const res = await DELETE(
      new Request("http://localhost/api/requirements/r1", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "r1" }) },
    );

    expect(res.status).toBe(500);
  });
});
