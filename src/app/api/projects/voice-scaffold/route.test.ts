import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/voice-scaffold", async () => {
  const actual = await vi.importActual<any>("@/lib/voice-scaffold");
  return {
    ...actual,
    scaffoldProjectFromVoice: vi.fn(),
  };
});

import { getServerSession } from "@/lib/session";
import { scaffoldProjectFromVoice } from "@/lib/voice-scaffold";

describe("POST /api/projects/voice-scaffold", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when session is not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/projects/voice-scaffold", {
      method: "POST",
      body: JSON.stringify({ transcript: "I want to build an app" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when transcript is missing or blank", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });

    const req = new Request("http://localhost/api/projects/voice-scaffold", {
      method: "POST",
      body: JSON.stringify({ transcript: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("transcript");
  });

  it("returns 200 with scaffolded data on success", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "user@example.com", name: "User" } as any,
      session: {} as any,
    });

    const mockScaffold = {
      name: "TaskPilot",
      type: "SaaS",
      description: "AI-driven task management system",
      targetUsers: "Project managers",
      goal: "Automate sprint planning",
      constraints: "Sub-100ms response time",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      scale: "MVP / Prototype",
      budget: "$10,000",
    };

    vi.mocked(scaffoldProjectFromVoice).mockResolvedValueOnce(mockScaffold);

    const req = new Request("http://localhost/api/projects/voice-scaffold", {
      method: "POST",
      body: JSON.stringify({
        transcript:
          "I want to build an AI-driven task management system called TaskPilot for project managers",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.scaffold.name).toBe("TaskPilot");
    expect(data.scaffold.type).toBe("SaaS");
    expect(data.scaffold.tech).toContain("PostgreSQL");
  });
});
