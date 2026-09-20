import { generateText } from "ai";

import {
  FALLBACK_MODEL_ID,
  MAIN_MODEL_ID,
  fallbackModel,
  hasGoogleApiKey,
  mainModel,
} from "@/lib/ai";
import {
  ClarificationResponse,
  clarificationResponseSchema,
} from "@/lib/clarifications";
import { logger } from "@/lib/logger";
import { RequirementCategory } from "@/lib/requirement-types";

export interface ProjectContext {
  id: string;
  name: string;
  description?: string | null;
  type?: string | null;
  targetUsers?: string | null;
  goal?: string | null;
  constraints?: string | null;
  tech?: string[];
  scale?: string | null;
  budget?: string | null;
  existingRequirements?: Array<{
    id: string;
    title: string;
    description?: string | null;
    category: RequirementCategory;
    status: string;
  }>;
}

export const CLARIFICATION_SYSTEM_PROMPT = `You are Archon's Lead Software Architect and Technical Roadmap Consultant.
Your purpose is to assist developers and engineering leaders in eliminating architectural ambiguity, unstated assumptions, and specification gaps.

Guidelines:
1. Analyze the project details (name, description, primary goal, target users, constraints, tech stack, and any existing requirements).
2. Detect 2 to 5 critical ambiguities or high-leverage architectural decisions that require clarification. Focus on:
   - Functional boundaries & core workflows
   - Authentication, authorization, and data privacy
   - Performance benchmarks, latency targets, and scaling limits
   - Infrastructure, database choices, and third-party dependencies
   - Unstated business rules or edge cases
3. For each ambiguity:
   - Clearly state the specific ambiguity or assumption identified.
   - Formulate a succinct, direct question for the project creator.
   - Provide 2 to 4 concrete, actionable choices/options for quick inline selection.
   - Assign the most appropriate category: Functional, Non-functional, Security, Performance, AI, Data, Infrastructure, Business.
4. GRACEFUL HANDLING FOR SPARSE OR EMPTY DESCRIPTIONS:
   - If the project description, goal, or technical details are sparse, ambiguous, or blank, DO NOT reject the request.
   - Instead, act as an empathetic technical discovery advisor and generate foundational scoping questions to help the user establish the core MVP (e.g., target users, primary interface type, data persistence, authentication method).
5. FORMAT REQUIREMENTS:
   - Respond ONLY with a valid, parseable JSON object matching this exact structure:
   {
     "summary": "Brief 1-2 sentence overview of the architecture analysis and identified gaps.",
     "clarifications": [
       {
         "ambiguity": "Specific ambiguity or missing specification",
         "requirementId": null,
         "question": "Clear question for the user",
         "options": ["Option 1", "Option 2", "Option 3"],
         "category": "Functional"
       }
     ]
   }
   - Do NOT wrap with any explanatory text outside the JSON object. You may enclose within a single \`\`\`json markdown block.`;

/**
 * Builds the user prompt describing the project and existing requirements
 */
export function buildClarificationUserPrompt(project: ProjectContext): string {
  const isSparse =
    (!project.description || project.description.trim().length < 20) &&
    (!project.goal || project.goal.trim().length < 15) &&
    (!project.constraints || project.constraints.trim().length < 15);

  let prompt = `Project Name: "${project.name}"\n`;
  prompt += `Project Type: ${project.type || "Unspecified"}\n`;
  prompt += `Description: ${project.description?.trim() || "(None provided)"}\n`;
  prompt += `Target Users: ${project.targetUsers?.trim() || "(None provided)"}\n`;
  prompt += `Primary Goal: ${project.goal?.trim() || "(None provided)"}\n`;
  prompt += `Constraints: ${project.constraints?.trim() || "(None provided)"}\n`;
  prompt += `Scale: ${project.scale || "(Not set)"}\n`;
  prompt += `Budget: ${project.budget || "(Not set)"}\n`;
  prompt += `Tech Stack: ${project.tech && project.tech.length > 0 ? project.tech.join(", ") : "(None specified)"}\n`;

  if (project.existingRequirements && project.existingRequirements.length > 0) {
    prompt += `\nExisting Requirements (${project.existingRequirements.length}):\n`;
    project.existingRequirements.slice(0, 10).forEach((r) => {
      prompt += `- [${r.category}] (ID: ${r.id}) "${r.title}": ${r.description || "No details"} (Status: ${r.status})\n`;
    });
  } else {
    prompt += `\nExisting Requirements: None defined yet.\n`;
  }

  if (isSparse) {
    prompt += `\nNOTICE: The project overview is minimal or empty. Please generate foundational discovery questions to guide the creator in scoping their system.\n`;
  } else {
    prompt += `\nPlease identify high-impact architectural ambiguities, unstated assumptions, and security/performance trade-offs.\n`;
  }

  return prompt;
}

/**
 * Extracts and parses JSON from model output text
 */
export function extractJsonFromText(rawText: string): unknown {
  const cleaned = rawText.trim();

  // Try extracting from markdown code block
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : cleaned;

  try {
    return JSON.parse(jsonString);
  } catch {
    // Attempt fallback to find first { and last }
    const firstBrace = jsonString.indexOf("{");
    const lastBrace = jsonString.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(jsonString.substring(firstBrace, lastBrace + 1));
    }
    throw new Error("Failed to parse JSON from AI model response");
  }
}

/**
 * Deterministic fallback generator when AI API key is not present or API call fails
 */
export function generateFallbackClarifications(
  project: ProjectContext,
): ClarificationResponse {
  const type = project.type || "Application";
  const name = project.name;
  const isSparse =
    (!project.description || project.description.trim().length < 20) &&
    (!project.goal || project.goal.trim().length < 15);

  if (isSparse) {
    return {
      summary: `Archon AI identified that "${name}" (${type}) has an early-stage description. Here are foundational questions to establish your core architecture and scope.`,
      clarifications: [
        {
          ambiguity:
            "Primary user authentication & identity management is not defined",
          requirementId: null,
          question: `How should users authenticate and access ${name}?`,
          options: [
            "OAuth 2.0 with Google and GitHub",
            "Email/Password with Magic Link verification",
            "Enterprise SSO (SAML / OIDC)",
            "Public access with optional anonymous guest sessions",
          ],
          category: "Security",
        },
        {
          ambiguity: "Core data storage and database layer is unstated",
          requirementId: null,
          question: `What database strategy best aligns with the data model of ${name}?`,
          options: [
            "Relational PostgreSQL with Prisma ORM",
            "Serverless Supabase / Neon with real-time sync",
            "Document-based MongoDB / DynamoDB",
            "Embedded SQLite / LibSQL for lightweight local-first operation",
          ],
          category: "Data",
        },
        {
          ambiguity: "Target deployment and hosting environment not specified",
          requirementId: null,
          question: `Where will the production deployment of ${name} run?`,
          options: [
            "Vercel Serverless Edge / Node.js",
            "Containerized Docker on AWS ECS / Google Cloud Run",
            "Dedicated VPS (DigitalOcean / Hetzner)",
            "Self-hosted internal on-premise infrastructure",
          ],
          category: "Infrastructure",
        },
        {
          ambiguity: "Primary core user workflow is undefined",
          requirementId: null,
          question: `What is the single most critical action a user will perform in ${name}?`,
          options: [
            "Create, collaborate on, and share rich documents / projects",
            "Ingest, transform, and visualize analytics / data streams",
            "Trigger automated AI workflows and export deliverables",
            "Conduct transactions / checkout with billing integration",
          ],
          category: "Functional",
        },
      ],
    };
  }

  return {
    summary: `Archon AI analyzed "${name}" and detected several architectural decisions regarding scaling, security, and integration that warrant clarification.`,
    clarifications: [
      {
        ambiguity: "Data retention and backup recovery lifecycle not specified",
        requirementId: null,
        question: `What data retention and backup policy is required for ${name}?`,
        options: [
          "Daily automated snapshots with 30-day point-in-time recovery (PITR)",
          "Real-time cross-region replication for high availability",
          "Soft deletion with 90-day archive before permanent purge",
          "Strict ephemeral storage — no long-term persistence required",
        ],
        category: "Data",
      },
      {
        ambiguity: "API rate limiting and DDoS defense posture unstated",
        requirementId: null,
        question: `What rate limiting and request throttling policies should apply to public endpoints?`,
        options: [
          "Token bucket rate limiting: 100 requests per minute per IP",
          "Tiered rate limiting: 1,000 req/hr for free users, 10,000 for authenticated",
          "Cloudflare / WAF edge protection with CAPTCHA challenge on spikes",
          "Internal endpoints only — no public ingress throttling required",
        ],
        category: "Security",
      },
      {
        ambiguity:
          "Peak concurrency and latency SLA targets are not established",
        requirementId: null,
        question: `What are the latency and throughput expectations under peak traffic?`,
        options: [
          "Sub-100ms p95 latency for all read endpoints under 1,000 RPS",
          "Sub-500ms p99 latency with asynchronous background queues for heavy tasks",
          "Best effort latency with horizontal autoscaling on CPU > 70%",
        ],
        category: "Performance",
      },
    ],
  };
}

/**
 * Executes the clarification agent using Vercel AI SDK generateText with telemetry
 */
export async function runClarificationAgent(
  project: ProjectContext,
): Promise<ClarificationResponse> {
  const userPrompt = buildClarificationUserPrompt(project);
  const overallStart = performance.now();

  if (!hasGoogleApiKey()) {
    logger.aiClarification({
      projectId: project.id,
      model: "heuristic-discovery",
      latencyMs: Math.round(performance.now() - overallStart),
      status: "fallback",
      fallbackUsed: true,
      error: "No Google API key configured in environment",
    });
    return generateFallbackClarifications(project);
  }

  // 1. Try primary model: MAIN_MODEL_ID (gemma-4-31b-it)
  const primaryStart = performance.now();
  try {
    const response = await generateText({
      model: mainModel,
      system: CLARIFICATION_SYSTEM_PROMPT,
      prompt: userPrompt,
    });

    const parsedJson = extractJsonFromText(response.text);
    const result = clarificationResponseSchema.parse(parsedJson);
    const latencyMs = Math.round(performance.now() - primaryStart);

    logger.aiClarification({
      projectId: project.id,
      model: MAIN_MODEL_ID,
      latencyMs,
      inputTokens: response.usage?.inputTokens,
      outputTokens: response.usage?.outputTokens,
      totalTokens: response.usage?.totalTokens,
      ambiguitiesCount: result.clarifications.length,
      status: "success",
      fallbackUsed: false,
    });

    return result;
  } catch (primaryError) {
    const primaryLatency = Math.round(performance.now() - primaryStart);
    const primaryErrorMsg =
      primaryError instanceof Error ? primaryError.message : String(primaryError);

    logger.aiClarification({
      projectId: project.id,
      model: MAIN_MODEL_ID,
      latencyMs: primaryLatency,
      status: "failure",
      fallbackUsed: true,
      error: primaryErrorMsg,
    });

    // 2. Fallback model: FALLBACK_MODEL_ID (gemini-3.5-flash-lite)
    const fallbackStart = performance.now();
    try {
      const fallbackResponse = await generateText({
        model: fallbackModel,
        system: CLARIFICATION_SYSTEM_PROMPT,
        prompt: userPrompt,
      });

      const parsedJson = extractJsonFromText(fallbackResponse.text);
      const result = clarificationResponseSchema.parse(parsedJson);
      const fallbackLatency = Math.round(performance.now() - fallbackStart);

      logger.aiClarification({
        projectId: project.id,
        model: FALLBACK_MODEL_ID,
        latencyMs: fallbackLatency,
        inputTokens: fallbackResponse.usage?.inputTokens,
        outputTokens: fallbackResponse.usage?.outputTokens,
        totalTokens: fallbackResponse.usage?.totalTokens,
        ambiguitiesCount: result.clarifications.length,
        status: "fallback",
        fallbackUsed: true,
      });

      return result;
    } catch (fallbackError) {
      const fallbackLatency = Math.round(performance.now() - fallbackStart);
      const fallbackErrorMsg =
        fallbackError instanceof Error
          ? fallbackError.message
          : String(fallbackError);

      logger.aiClarification({
        projectId: project.id,
        model: FALLBACK_MODEL_ID,
        latencyMs: fallbackLatency,
        status: "failure",
        fallbackUsed: true,
        error: fallbackErrorMsg,
      });

      // 3. Deterministic heuristic discovery
      const heuristicStart = performance.now();
      const result = generateFallbackClarifications(project);
      const heuristicLatency = Math.round(performance.now() - heuristicStart);

      logger.aiClarification({
        projectId: project.id,
        model: "heuristic-discovery",
        latencyMs: heuristicLatency,
        ambiguitiesCount: result.clarifications.length,
        status: "fallback",
        fallbackUsed: true,
        error: "All AI models failed, used heuristic discovery",
      });

      return result;
    }
  }
}
