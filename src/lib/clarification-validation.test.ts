import { describe, expect, it } from "vitest";

import {
  extractJsonFromText,
  generateFallbackClarifications,
} from "./clarification-agent";
import {
  clarificationItemSchema,
  clarificationResponseSchema,
} from "./clarifications";
import { REQUIREMENT_CATEGORIES } from "./requirements";

describe("Clarification Output Validation", () => {
  describe("clarificationResponseSchema", () => {
    it("validates a complete, multi-category clarification response", () => {
      const validPayload = {
        summary:
          "Analysis detected 3 critical architectural trade-offs across storage and security.",
        clarifications: [
          {
            ambiguity: "Database replication and multi-region failover unstated",
            requirementId: null,
            question: "What replication topology is required for PostgreSQL?",
            options: [
              "Single primary with read replicas",
              "Multi-region active-active cluster",
            ],
            category: "Data",
          },
          {
            ambiguity: "Session invalidation upon password reset not defined",
            requirementId: "req-123",
            question: "Should all active sessions terminate on credential rotation?",
            options: [
              "Invalidate all sessions immediately",
              "Keep current session alive, invalidate others",
            ],
            category: "Security",
          },
        ],
      };

      const result = clarificationResponseSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clarifications).toHaveLength(2);
        expect(result.data.clarifications[0].category).toBe("Data");
        expect(result.data.clarifications[1].requirementId).toBe("req-123");
      }
    });

    it("accepts all 8 requirement categories", () => {
      REQUIREMENT_CATEGORIES.forEach((cat) => {
        const payload = {
          summary: `Summary for category ${cat}`,
          clarifications: [
            {
              ambiguity: `Ambiguity in ${cat}`,
              question: `Question for ${cat}?`,
              options: ["Choice A", "Choice B"],
              category: cat,
            },
          ],
        };

        const result = clarificationResponseSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.clarifications[0].category).toBe(cat);
        }
      });
    });

    it("rejects response with empty summary", () => {
      const payload = {
        summary: "   ",
        clarifications: [
          {
            ambiguity: "Ambiguity",
            question: "Question?",
            options: ["A", "B"],
            category: "Functional",
          },
        ],
      };

      const result = clarificationResponseSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("rejects response with empty clarifications list", () => {
      const payload = {
        summary: "Valid summary",
        clarifications: [],
      };

      const result = clarificationResponseSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("clarificationItemSchema", () => {
    it("validates boundary conditions for suggested options (2 to 5 options)", () => {
      // 2 options: valid minimum
      const minOptions = {
        ambiguity: "Cache strategy missing",
        question: "Redis or Memcached?",
        options: ["Redis", "Memcached"],
      };
      expect(clarificationItemSchema.safeParse(minOptions).success).toBe(true);

      // 5 options: valid maximum
      const maxOptions = {
        ambiguity: "Cloud provider",
        question: "Where to deploy?",
        options: ["AWS", "GCP", "Azure", "Vercel", "Fly.io"],
      };
      expect(clarificationItemSchema.safeParse(maxOptions).success).toBe(true);

      // 1 option: invalid
      const tooFew = {
        ambiguity: "Cloud provider",
        question: "Where to deploy?",
        options: ["AWS"],
      };
      expect(clarificationItemSchema.safeParse(tooFew).success).toBe(false);

      // 6 options: invalid (> 5)
      const tooMany = {
        ambiguity: "Cloud provider",
        question: "Where to deploy?",
        options: ["AWS", "GCP", "Azure", "Vercel", "Fly.io", "Railway"],
      };
      expect(clarificationItemSchema.safeParse(tooMany).success).toBe(false);
    });

    it("rejects empty or whitespace-only options", () => {
      const itemWithBlankOption = {
        ambiguity: "Auth ambiguity",
        question: "Which auth provider?",
        options: ["NextAuth", "   "],
        category: "Security",
      };

      const result = clarificationItemSchema.safeParse(itemWithBlankOption);
      expect(result.success).toBe(false);
    });

    it("applies Functional as default category when omitted", () => {
      const item = {
        ambiguity: "Export format missing",
        question: "Should reports export as PDF or CSV?",
        options: ["PDF only", "Both PDF and CSV"],
      };

      const parsed = clarificationItemSchema.parse(item);
      expect(parsed.category).toBe("Functional");
    });

    it("rejects invalid category enum value", () => {
      const item = {
        ambiguity: "Export format missing",
        question: "Should reports export as PDF or CSV?",
        options: ["PDF only", "CSV only"],
        category: "HardwareArchitecture",
      };

      expect(clarificationItemSchema.safeParse(item).success).toBe(false);
    });
  });

  describe("LLM JSON Extraction & Sanitization", () => {
    it("extracts and validates JSON from markdown code fences with trailing text", () => {
      const llmOutput = `Here is the architectural review:\n\`\`\`json\n{\n  "summary": "Detected 1 critical item.",\n  "clarifications": [\n    {\n      "ambiguity": "Missing telemetry",\n      "question": "Which monitoring stack?",\n      "options": ["Prometheus/Grafana", "Datadog"],\n      "category": "Infrastructure"\n    }\n  ]\n}\n\`\`\`\nHope this is helpful!`;

      const parsedJson = extractJsonFromText(llmOutput);
      const validated = clarificationResponseSchema.parse(parsedJson);

      expect(validated.summary).toBe("Detected 1 critical item.");
      expect(validated.clarifications[0].category).toBe("Infrastructure");
    });

    it("extracts plain JSON without markdown blocks", () => {
      const rawJson = `{"summary":"Direct JSON","clarifications":[{"ambiguity":"A","question":"Q?","options":["1","2"],"category":"Data"}]}`;

      const parsedJson = extractJsonFromText(rawJson);
      const validated = clarificationResponseSchema.parse(parsedJson);

      expect(validated.summary).toBe("Direct JSON");
      expect(validated.clarifications[0].category).toBe("Data");
    });

    it("throws a descriptive error when LLM output contains no valid JSON", () => {
      const malformed = "I am sorry, but I cannot answer this prompt.";
      expect(() => extractJsonFromText(malformed)).toThrow(
        /Failed to parse JSON/i,
      );
    });
  });

  describe("Heuristic Fallback Schema Conformity", () => {
    it("guarantees generateFallbackClarifications produces strictly conforming output for standard projects", () => {
      const project = {
        id: "proj-1",
        name: "Enterprise Analytics",
        description:
          "High throughput financial analytics platform with sub-second queries",
        type: "SaaS",
        tech: ["Next.js", "PostgreSQL", "Kafka"],
      };

      const fallback = generateFallbackClarifications(project);
      const validated = clarificationResponseSchema.safeParse(fallback);

      expect(validated.success).toBe(true);
      expect(fallback.clarifications.length).toBeGreaterThanOrEqual(1);
      fallback.clarifications.forEach((c) => {
        expect(c.options.length).toBeGreaterThanOrEqual(2);
        expect(c.options.length).toBeLessThanOrEqual(5);
        expect(REQUIREMENT_CATEGORIES).toContain(c.category);
      });
    });

    it("guarantees generateFallbackClarifications produces strictly conforming output for sparse/blank projects", () => {
      const sparseProject = {
        id: "proj-2",
        name: "Blank Idea",
        description: "",
      };

      const fallback = generateFallbackClarifications(sparseProject);
      const validated = clarificationResponseSchema.safeParse(fallback);

      expect(validated.success).toBe(true);
      expect(fallback.clarifications.length).toBeGreaterThanOrEqual(2);
    });
  });
});
