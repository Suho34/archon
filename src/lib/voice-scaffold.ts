import { generateText } from "ai";
import { z } from "zod";

import { fallbackModel, hasGoogleApiKey, mainModel } from "@/lib/ai";
import { extractJsonFromText } from "@/lib/clarification-agent";

export const voiceScaffoldResultSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().default("Web App"),
  description: z.string().default(""),
  targetUsers: z.string().default(""),
  goal: z.string().default(""),
  constraints: z.string().default(""),
  tech: z.array(z.string()).default([]),
  scale: z.string().default("MVP / Prototype"),
  budget: z.string().default("Flexible / Not set"),
});

export type VoiceScaffoldResult = z.infer<typeof voiceScaffoldResultSchema>;

export const voiceScaffoldRequestSchema = z.object({
  transcript: z
    .string({ message: "A valid speech transcript string is required." })
    .trim()
    .min(1, "A valid speech transcript string is required."),
});

export type VoiceScaffoldRequest = z.infer<typeof voiceScaffoldRequestSchema>;

export const VOICE_SCAFFOLD_SYSTEM_PROMPT = `You are Archon's Voice Architecture Scaffolding Agent.
Your purpose is to listen to a developer's spoken "brain dump" pitch or project concept and distill it into a structured software architecture blueprint.

Guidelines:
1. Analyze the spoken words carefully. The transcript may be conversational, informal, and stream-of-consciousness.
2. Deduce and extract:
   - name: A professional, punchy software project name (if not explicitly named, generate an evocative technical name).
   - type: Choose the most accurate from: "Web App", "SaaS", "Mobile App", "API Service", "AI & ML", "CLI Tool", "Full Stack".
   - description: A well-written, concise 2-3 sentence overview explaining what the system does.
   - targetUsers: Target audience, personas, or customer segments.
   - goal: Primary engineering/product goal.
   - constraints: Key technical guardrails mentioned (e.g. latency bounds, security, compliance, data storage, uptime).
   - tech: Array of technologies, frameworks, and libraries mentioned or logically required (e.g. ["Next.js", "PostgreSQL", "Tailwind", "WebSockets"]).
   - scale: Best match from: "MVP / Prototype", "Early Stage", "Growth", "Enterprise".
   - budget: Any budget constraints mentioned, or "Flexible / Not set".
3. Respond ONLY with valid JSON matching this schema:
{
  "name": "Project Name",
  "type": "Web App",
  "description": "...",
  "targetUsers": "...",
  "goal": "...",
  "constraints": "...",
  "tech": ["Next.js", "PostgreSQL"],
  "scale": "MVP / Prototype",
  "budget": "Flexible / Not set"
}
Do NOT include any markdown or text outside the JSON object.`;

/**
 * Heuristic fallback parser when AI is unavailable or fails
 */
export function generateFallbackVoiceScaffold(transcript: string): VoiceScaffoldResult {
  const trimmed = transcript.trim();
  const words = trimmed.split(/\s+/);
  
  // Extract a sensible name from first few words or generate one
  let name = "New Archon Project";
  if (words.length > 0) {
    const firstFew = words.slice(0, 3).join(" ").replace(/[^\w\s]/g, "");
    if (firstFew.length > 2) {
      name = firstFew
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  // Detect type keywords with word boundaries
  let type = "Web App";
  if (/\b(mobile|ios|android)\b/i.test(trimmed)) {
    type = "Mobile App";
  } else if (/\b(saas|b2b)\b/i.test(trimmed)) {
    type = "SaaS";
  } else if (/\b(api|microservice|microservices|backend)\b/i.test(trimmed)) {
    type = "API Service";
  } else if (/\b(ai|llm|llms|agent|agents|machine learning|artificial intelligence)\b/i.test(trimmed)) {
    type = "AI & ML";
  } else if (/\b(cli|terminal|command line)\b/i.test(trimmed)) {
    type = "CLI Tool";
  } else if (/\b(full\s*stack|fullstack)\b/i.test(trimmed)) {
    type = "Full Stack";
  }

  // Detect common tech stack keywords
  const techCandidates = [
    "React",
    "Next.js",
    "Vue",
    "TypeScript",
    "Node.js",
    "Python",
    "Go",
    "Rust",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "GraphQL",
    "WebSockets",
    "Tailwind",
    "Prisma",
  ];

  const detectedTech = techCandidates.filter((tech) => {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(trimmed);
  });

  return {
    name,
    type,
    description: trimmed || "Project generated from voice brain dump.",
    targetUsers: "Developers and end users",
    goal: "Build and deploy scalable core functionality",
    constraints: "Ensure reliability, security, and low latency",
    tech: detectedTech.length > 0 ? detectedTech : ["TypeScript", "Next.js"],
    scale: "MVP / Prototype",
    budget: "Flexible / Not set",
  };
}

/**
 * Scaffolds project details from a raw speech transcript
 */
export async function scaffoldProjectFromVoice(transcript: string): Promise<VoiceScaffoldResult> {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error("Speech transcript cannot be empty");
  }

  // If no API key configured, use intelligent heuristic fallback
  if (!hasGoogleApiKey()) {
    return generateFallbackVoiceScaffold(transcript);
  }

  try {
    // Attempt with primary model
    const response = await generateText({
      model: mainModel,
      system: VOICE_SCAFFOLD_SYSTEM_PROMPT,
      prompt: `Speech Transcript:\n"${transcript.trim()}"`,
      temperature: 0.2,
    });

    const parsedJson = extractJsonFromText(response.text);
    return voiceScaffoldResultSchema.parse(parsedJson);
  } catch (primaryError) {
    console.warn("Primary model failed for voice scaffold, attempting fallback model:", primaryError);

    try {
      // Fallback model attempt
      const fallbackResponse = await generateText({
        model: fallbackModel,
        system: VOICE_SCAFFOLD_SYSTEM_PROMPT,
        prompt: `Speech Transcript:\n"${transcript.trim()}"`,
        temperature: 0.2,
      });

      const parsedJson = extractJsonFromText(fallbackResponse.text);
      return voiceScaffoldResultSchema.parse(parsedJson);
    } catch (fallbackError) {
      console.error("All AI models failed for voice scaffold, using heuristic fallback:", fallbackError);
      return generateFallbackVoiceScaffold(transcript);
    }
  }
}
