<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Archon Engineering & Agent Guidelines

This document defines core conventions, package protocols, and development rules for agents working within the **Archon** repository.

---

## 1. shadcn/ui Component Protocol (MANDATORY)

Archon uses **shadcn/ui** as its primary component design system.

### Rules:
1. **Check Before Creating**: Whenever a new UI element is required (e.g. `button`, `input`, `textarea`, `dialog`, `card`, `badge`, `dropdown-menu`, `tooltip`, `tabs`, `select`, `popover`, `separator`, `avatar`, `sheet`, etc.), **always check if it exists in shadcn/ui first**.
2. **Install via CLI**: Do not build custom UI primitives from scratch when a shadcn component exists. Install it directly via the terminal:
   ```bash
   npx shadcn@latest add <component-name> -y
   ```
   All installed primitives reside in [`src/components/ui/`](file:///c:/Users/suhai/agent/archon/src/components/ui).
3. **No Raw HTML Primitives**: Do not write raw unstyled HTML elements like `<button>`, `<input>`, or `<textarea>` when corresponding shadcn components (`<Button>`, `<Input>`, `<Textarea>`) are available.
4. **Stark Monochrome & Silver Alignment**: Every installed shadcn component must adhere strictly to Archon's design tokens:
   - **Import utility**: Always import `{ cn } from "@/lib/utils"` (not `"cn"`).
   - **Surfaces**: Obsidian canvas (`#09090B`), card surfaces (`#121215`), popovers (`#18181B`).
   - **Hairline borders**: `border border-white/[0.08]` or `border border-white/[0.12]`.
   - **Focus states**: Brushed silver focus ring (`focus-visible:border-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400/40 focus-visible:outline-hidden`).
   - **Quarantined Status Colors**: Chromatic color is strictly banned from decorative chrome and restricted exclusively to semantic states:
     - **Emerald** (`text-emerald-400`, `bg-emerald-500/10`, `border-emerald-500/30`): Active recording, confirmed requirements, healthy state.
     - **Amber** (`text-amber-400`, `bg-amber-500/10`, `border-amber-500/30`): Pending architectural trade-offs, clarifications needed.
     - **Rose** (`text-rose-400`, `bg-rose-500/10`, `border-rose-500/30`): Destructive actions, bottlenecks, deletion dialogs.

---

## 2. Vercel AI SDK Protocol (`ai` & `@ai-sdk/google`)

Archon is an AI-native engineering studio powered by the **Vercel AI SDK** and **Google Gemini models**.

### Rules:
1. **Unified Generation Architecture (`generateText` & `streamText`)**:
   - Modern Vercel AI SDK (`ai` v6/v7+) unifies generation into **`generateText`** and **`streamText`**.
   - **`generateObject` and `streamObject` are DEPRECATED**. Do NOT use them in new code or documentation.
   - For structured, schema-validated outputs, configure the `output` setting using the `Output` helpers:
     - `Output.object({ schema: zodSchema })` for typed architectural blueprints, scaffolding, and trade-off synthesis.
     - `Output.array({ element: zodSchema })` for lists and repeated domain entities.
     - `Output.choice({ options: [...] })` for enum selection.
     - Default `Output.text()` for narrative reasoning, summaries, and agent explanations.
   - Provider: `@ai-sdk/google` (`google("gemini-2.5-flash")` or `google("gemini-2.5-pro")`, or configured models in [`src/lib/ai.ts`](file:///c:/Users/suhai/agent/archon/src/lib/ai.ts)).
   - Typed output usage:
     ```typescript
     import { generateText, Output } from "ai";
     import { google } from "@/lib/ai";
     import { voiceScaffoldResultSchema } from "@/lib/voice-scaffold";

     const { output } = await generateText({
       model: google("gemini-2.5-flash"),
       output: Output.object({
         schema: voiceScaffoldResultSchema,
         description: "Distilled software architecture blueprint",
       }),
       prompt: `Speech Transcript:\n"${transcript}"`,
     });
     // `output` is strictly typed as VoiceScaffoldResult
     ```
2. **Strict Zod Schemas**: Always define comprehensive Zod schemas (`zod`) to strictly validate and type all AI outputs (e.g. `voiceScaffoldResultSchema`, requirement extraction schemas).
3. **Resilient Heuristic Fallbacks**: AI endpoints must always implement robust offline/fallback heuristics. If the Gemini API key is missing, network times out, or quota is exhausted, the application must fall back gracefully to rule-based or regex extraction without crashing or showing cryptic 500 errors.
4. **Server Route Protection & Rate Limiting**:
   - All AI interactions must run in server route handlers (`src/app/api/...`) authenticated with NextAuth/Better-Auth session verification.
   - Apply rate limiting using [`src/lib/rate-limiter.ts`](file:///c:/Users/suhai/agent/archon/src/lib/rate-limiter.ts).

---

## 3. Voice & Speech Recognition Protocols

Archon features the **Archon Voice Studio** for hands-free project scaffolding and architectural decisions.

### Rules:
1. **Client Hook**: Use [`src/hooks/use-speech-to-text.ts`](file:///c:/Users/suhai/agent/archon/src/hooks/use-speech-to-text.ts) wrapping the browser Web Speech API (`webkitSpeechRecognition`).
2. **Progressive Degradation**: Always check `isSupported`. If running in a browser without Web Speech support, provide a clear, helpful message and allow users to type manually into the `<Textarea>` without disabling or locking controls.
3. **Live Feedback**: Provide tactile visual feedback during recording (3-bar sound wave micro-animations, pulsating emerald beacon, real-time interim transcription).

---

## 4. Verification & Quality Gates

Every code change must satisfy three gates before completion:
1. **Type Safety**:
   ```bash
   npx tsc --noEmit
   ```
   Must pass with **0 errors**.
2. **Automated Unit & Integration Tests**:
   ```bash
   npx vitest run
   ```
   All test suites must pass 100%.
3. **End-to-End Tests**:
   ```bash
   npx playwright test
   ```
   Must verify critical paths (authentication, project creation, voice studio, clarification workflows).
