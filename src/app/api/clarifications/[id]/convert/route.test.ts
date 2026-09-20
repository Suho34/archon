import { describe, expect, it, vi } from "vitest";

import { POST } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/clarifications", async () => {
  const actual = await vi.importActual<any>("@/lib/clarifications");
  return {
    ...actual,
    getAuthorizedClarification: vi.fn(),
  };
});

vi.mock("@/lib/projects", () => ({
  ProjectError: class ProjectError extends Error {
    constructor(message: string, public statusCode: number) {
      super(message);
    }
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    requirement: {
      create: vi.fn(),
    },
    project: {
      update: vi.fn(),
    },
    clarification: {
      update: vi.fn(),
    },
  },
}));

import { getAuthorizedClarification } from "@/lib/clarifications";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

describe("POST /api/clarifications/[id]/convert", () => {
  it("converts answered clarification into a requirement", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });

    vi.mocked(getAuthorizedClarification).mockResolvedValueOnce({
      id: "c1",
      question: "Which OAuth providers to support?",
      ambiguity: "Auth missing",
      answer: "Google and GitHub OAuth",
      category: "Security",
      status: "answered",
      projectId: "proj-1",
      project: { id: "proj-1", userId: "user-1", name: "Proj", constraints: "" },
    } as any);

    const mockRequirement = {
      id: "req-converted",
      title: "Which OAuth providers to support?",
      category: "Security",
      priority: "Medium",
      status: "confirmed",
      projectId: "proj-1",
    };
    vi.mocked(prisma.requirement.create).mockResolvedValueOnce(mockRequirement as any);
    vi.mocked(prisma.clarification.update).mockResolvedValueOnce({} as any);

    const res = await POST(
      new Request("http://localhost/api/clarifications/c1/convert", {
        method: "POST",
        body: JSON.stringify({ target: "requirement" }),
      }),
      { params: Promise.resolve({ id: "c1" }) },
    );

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.target).toBe("requirement");
    expect(data.requirement.id).toBe("req-converted");
  });

  it("converts answered clarification into a constraint", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });

    vi.mocked(getAuthorizedClarification).mockResolvedValueOnce({
      id: "c2",
      question: "Hosting environment?",
      ambiguity: "Infra undefined",
      answer: "Vercel Edge Functions only",
      category: "Infrastructure",
      status: "answered",
      projectId: "proj-1",
      project: { id: "proj-1", userId: "user-1", name: "Proj", constraints: "Sub-100ms latency" },
    } as any);

    vi.mocked(prisma.project.update).mockResolvedValueOnce({
      id: "proj-1",
      constraints: "Sub-100ms latency\n• Hosting environment?: Vercel Edge Functions only",
    } as any);
    vi.mocked(prisma.clarification.update).mockResolvedValueOnce({} as any);

    const res = await POST(
      new Request("http://localhost/api/clarifications/c2/convert", {
        method: "POST",
        body: JSON.stringify({ target: "constraint" }),
      }),
      { params: Promise.resolve({ id: "c2" }) },
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.target).toBe("constraint");
  });
});
