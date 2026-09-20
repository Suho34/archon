import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    clarification: {
      findUnique: vi.fn(),
    },
  },
}));

import {
  buildClarificationUserPrompt,
  extractJsonFromText,
  generateFallbackClarifications,
} from "./clarification-agent";
import {
  answerClarificationSchema,
  clarificationItemSchema,
  clarificationResponseSchema,
  convertClarificationSchema,
} from "./clarifications";

describe("clarification schemas", () => {
  it("validates a valid clarification item", () => {
    const item = {
      ambiguity: "Database scaling model is unspecified",
      requirementId: null,
      question: "Which database solution should be deployed?",
      options: ["PostgreSQL with Prisma", "Supabase", "MongoDB"],
      category: "Data",
    };

    const parsed = clarificationItemSchema.safeParse(item);
    expect(parsed.success).toBe(true);
  });

  it("rejects clarification item with fewer than 2 options", () => {
    const item = {
      ambiguity: "Missing auth",
      question: "How to authenticate?",
      options: ["Only One Option"],
      category: "Security",
    };

    const parsed = clarificationItemSchema.safeParse(item);
    expect(parsed.success).toBe(false);
  });

  it("validates a complete clarification response", () => {
    const response = {
      summary: "Found 2 architectural ambiguities.",
      clarifications: [
        {
          ambiguity: "Auth not specified",
          requirementId: null,
          question: "How to auth?",
          options: ["Google OAuth", "Email/Password"],
          category: "Security",
        },
      ],
    };

    const parsed = clarificationResponseSchema.safeParse(response);
    expect(parsed.success).toBe(true);
  });

  it("validates answer schema", () => {
    expect(answerClarificationSchema.safeParse({ answer: "  PostgreSQL with Prisma  " }).success).toBe(true);
    expect(answerClarificationSchema.safeParse({ answer: "   " }).success).toBe(false);
    expect(answerClarificationSchema.safeParse({}).success).toBe(false);
  });

  it("validates convert schema", () => {
    expect(convertClarificationSchema.safeParse({ target: "requirement" }).success).toBe(true);
    expect(convertClarificationSchema.safeParse({ target: "constraint" }).success).toBe(true);
    expect(convertClarificationSchema.safeParse({ target: "invalid" }).success).toBe(false);
  });
});

describe("extractJsonFromText", () => {
  it("extracts JSON from markdown code block", () => {
    const text = "Here is the response:\n```json\n{\"summary\":\"OK\",\"clarifications\":[]}\n```";
    const parsed: any = extractJsonFromText(text);
    expect(parsed.summary).toBe("OK");
  });

  it("extracts JSON from plain text", () => {
    const text = "{\"summary\":\"Plain JSON\",\"clarifications\":[]}";
    const parsed: any = extractJsonFromText(text);
    expect(parsed.summary).toBe("Plain JSON");
  });

  it("throws for unparseable text", () => {
    expect(() => extractJsonFromText("Not JSON at all")).toThrow();
  });
});

describe("generateFallbackClarifications & prompt handling", () => {
  it("handles empty/sparse project descriptions with foundational discovery", () => {
    const sparseProject = {
      id: "proj-1",
      name: "Minimal App",
      description: "",
      goal: "",
    };

    const result = generateFallbackClarifications(sparseProject);
    expect(result.clarifications.length).toBeGreaterThan(0);
    expect(result.summary).toContain("Minimal App");

    const prompt = buildClarificationUserPrompt(sparseProject);
    expect(prompt).toContain("NOTICE: The project overview is minimal or empty");
  });

  it("handles detailed project descriptions with targeted trade-offs", () => {
    const detailedProject = {
      id: "proj-2",
      name: "Enterprise Core",
      description: "High volume distributed transaction processing engine with sub-10ms requirements",
      goal: "Process 50,000 TPS",
      constraints: "Zero data loss",
      tech: ["Go", "Kafka", "PostgreSQL"],
    };

    const result = generateFallbackClarifications(detailedProject);
    expect(result.clarifications.length).toBeGreaterThan(0);

    const prompt = buildClarificationUserPrompt(detailedProject);
    expect(prompt).toContain("Enterprise Core");
    expect(prompt).not.toContain("NOTICE: The project overview is minimal");
  });
});
