import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/projects", () => ({
  getAuthorizedProject: vi.fn(),
  ProjectError: class ProjectError extends Error {
    constructor(message: string, public statusCode: number) {
      super(message);
    }
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    requirement: {
      findMany: vi.fn(),
    },
    clarification: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/clarification-agent", () => ({
  runClarificationAgent: vi.fn(),
}));

import { runClarificationAgent } from "@/lib/clarification-agent";
import { prisma } from "@/lib/prisma";
import { getAuthorizedProject } from "@/lib/projects";
import { resetRateLimits } from "@/lib/rate-limiter";
import { getServerSession } from "@/lib/session";

describe("POST /api/projects/[id]/clarify", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.clearAllMocks();
  });

  it("returns 401 if unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const res = await POST(new Request("http://localhost/api/projects/p1/clarify", { method: "POST" }), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(res.status).toBe(401);
  });

  it("runs clarification agent and persists questions", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });
    vi.mocked(getAuthorizedProject).mockResolvedValueOnce({
      id: "p1",
      name: "Project 1",
      description: "A cool app",
      userId: "user-1",
    } as any);
    vi.mocked(prisma.requirement.findMany).mockResolvedValueOnce([]);

    vi.mocked(runClarificationAgent).mockResolvedValueOnce({
      summary: "Identified 1 gap",
      clarifications: [
        {
          ambiguity: "Auth missing",
          requirementId: null,
          question: "How to authenticate?",
          options: ["Google", "GitHub"],
          category: "Security",
        },
      ],
    });

    const now = new Date();
    vi.mocked(prisma.clarification.create).mockResolvedValueOnce({
      id: "c1",
      question: "How to authenticate?",
      ambiguity: "Auth missing",
      options: ["Google", "GitHub"],
      answer: null,
      category: "Security",
      status: "pending",
      requirementId: null,
      projectId: "p1",
      convertedReqId: null,
      createdAt: now,
      updatedAt: now,
    } as any);

    const res = await POST(new Request("http://localhost/api/projects/p1/clarify", { method: "POST" }), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.summary).toBe("Identified 1 gap");
    expect(data.clarifications).toHaveLength(1);
    expect(data.clarifications[0].id).toBe("c1");
  });

  it("enforces rate limit of 10 requests per 60 seconds", async () => {
    for (let i = 0; i < 10; i++) {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "rate-user", email: "rate@example.com", name: "Rate" } as any,
        session: {} as any,
      });
      vi.mocked(getAuthorizedProject).mockResolvedValueOnce({
        id: "p1",
        name: "P1",
        userId: "rate-user",
      } as any);
      vi.mocked(prisma.requirement.findMany).mockResolvedValueOnce([]);
      vi.mocked(runClarificationAgent).mockResolvedValueOnce({ summary: "", clarifications: [] });

      const res = await POST(new Request("http://localhost/api/projects/p1/clarify", { method: "POST" }), {
        params: Promise.resolve({ id: "p1" }),
      });
      expect(res.status).toBe(201);
    }

    // 11th request should hit 429
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "rate-user", email: "rate@example.com", name: "Rate" } as any,
      session: {} as any,
    });

    const blockedRes = await POST(new Request("http://localhost/api/projects/p1/clarify", { method: "POST" }), {
      params: Promise.resolve({ id: "p1" }),
    });

    expect(blockedRes.status).toBe(429);
    const data = await blockedRes.json();
    expect(data.error).toContain("Rate limit exceeded");
  });
});
