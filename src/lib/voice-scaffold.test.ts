import { describe, expect, it } from "vitest";

import {
  generateFallbackVoiceScaffold,
  scaffoldProjectFromVoice,
  voiceScaffoldResultSchema,
} from "./voice-scaffold";

describe("voice-scaffold", () => {
  describe("generateFallbackVoiceScaffold", () => {
    it("parses Web App and common tech keywords correctly", () => {
      const speech =
        "I want to build a real-time analytics dashboard with Next.js, TypeScript, PostgreSQL, and Tailwind";
      const result = generateFallbackVoiceScaffold(speech);

      expect(result.type).toBe("Web App");
      expect(result.tech).toContain("Next.js");
      expect(result.tech).toContain("TypeScript");
      expect(result.tech).toContain("PostgreSQL");
      expect(result.tech).toContain("Tailwind");
      expect(result.name).toBeDefined();
    });

    it("detects Mobile App keywords correctly", () => {
      const speech =
        "Mobile app for iOS and Android tracking personal fitness habits with React Native and Redis";
      const result = generateFallbackVoiceScaffold(speech);

      expect(result.type).toBe("Mobile App");
      expect(result.tech).toContain("Redis");
    });

    it("detects SaaS and AI keywords correctly", () => {
      const speech =
        "B2B SaaS platform using AI LLM agents for customer support automation with Python and Docker";
      const result = generateFallbackVoiceScaffold(speech);

      // AI keyword takes priority or SaaS
      expect(["SaaS", "AI & ML"]).toContain(result.type);
      expect(result.tech).toContain("Python");
      expect(result.tech).toContain("Docker");
    });

    it("detects CLI tool keywords correctly", () => {
      const speech =
        "Terminal CLI tool for automated database migrations in Go and Rust";
      const result = generateFallbackVoiceScaffold(speech);

      expect(result.type).toBe("CLI Tool");
      expect(result.tech).toContain("Go");
      expect(result.tech).toContain("Rust");
    });
  });

  describe("voiceScaffoldResultSchema", () => {
    it("validates a compliant scaffold object", () => {
      const valid = {
        name: "CloudPulse",
        type: "SaaS",
        description: "A cloud monitoring service",
        targetUsers: "DevOps teams",
        goal: "Reduce mean time to detection",
        constraints: "99.99% SLA",
        tech: ["Go", "Kubernetes", "PostgreSQL"],
        scale: "Growth",
        budget: "$15,000",
      };

      const parsed = voiceScaffoldResultSchema.parse(valid);
      expect(parsed.name).toBe("CloudPulse");
      expect(parsed.tech).toHaveLength(3);
    });

    it("rejects an empty name", () => {
      expect(() =>
        voiceScaffoldResultSchema.parse({
          name: "",
          type: "Web App",
        }),
      ).toThrow();
    });
  });

  describe("scaffoldProjectFromVoice", () => {
    it("throws when transcript is empty", async () => {
      await expect(scaffoldProjectFromVoice("")).rejects.toThrow(
        "Speech transcript cannot be empty",
      );
    });

    it("returns valid scaffolded project for speech input", async () => {
      const speech =
        "We are building a peer-to-peer code review platform with WebSockets and Next.js";
      const result = await scaffoldProjectFromVoice(speech);

      expect(result.name).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.type).toBeDefined();
      expect(Array.isArray(result.tech)).toBe(true);
    });
  });
});
