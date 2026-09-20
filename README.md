<div align="center">

  <img src="./public/archon-logo.svg" alt="ARCHON Logo" width="380">

  <h1>ARCHON</h1>

  <p><strong>Active AI Architectural Reasoning & System Design Studio</strong></p>
  <p><em>IDEAS → ARCHITECTURE → IMPACT</em></p>

  <p>
    <a href="#milestone-1-prototype-1-achievements"><img src="https://img.shields.io/badge/Milestone-1%20(Prototype%201)-white?style=flat-square" alt="Milestone 1 Prototype 1" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js" alt="Next.js 16" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript 5" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS 4" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-7.10-2D3748?style=flat-square&logo=prisma" alt="Prisma 7" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_AI-Gemini_%26_Gemma-8E75B2?style=flat-square&logo=google" alt="Google AI Gemini and Gemma" /></a>
    <a href="#automated-testing--quality-gates"><img src="https://img.shields.io/badge/Tests-102%2F102%20Passed-10b981?style=flat-square" alt="102 Tests Passed" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-zinc?style=flat-square" alt="MIT License" /></a>
  </p>

  <p>
    <a href="#what-is-archon">What is Archon?</a> •
    <a href="#the-distinction-how-archon-is-different">The Distinction</a> •
    <a href="#milestone-1-prototype-1-achievements">Milestone 1 Capabilities</a> •
    <a href="#architecture--tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#roadmap--milestones">Roadmap</a>
  </p>

</div>

---

## What is Archon?

**Archon** is an AI-native engineering studio designed for software developers, system architects, and technical leads who need to architect systems rigorously before and during implementation.

Most software failures do not stem from bad syntax—they stem from **faulty architectural assumptions**: unstated scaling limits, unexamined security boundaries, data model friction, and hidden operational cost cliffs.

Archon moves beyond passive diagramming and static project specifications into **active reasoning support**:

- **Stress-tests system design assumptions** against real-world constraints (scale, latency, budget, stack).
- **Surfaces hidden trade-offs** before a single line of application code is written.
- **Identifies critical ambiguities and security gaps** via automated architectural discovery.
- **Keeps architecture alive and synchronized** with project specifications as constraints shift.

> **The Archon Standard:** _Ship with zero architectural regrets, unassailable structural confidence, and a living record of your system decisions._

---

## The Distinction: How Archon is Different

Where does Archon fit into your engineering toolkit? Here is how it fundamentally differs from existing tooling:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 SYSTEM ARCHITECTURE                    │
                  │   Boundaries • Trade-offs • Constraints • Schemas      │
                  │              ★ ARCHON (Active Reasoning) ★             │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
         ┌───────────────────────────┐               ┌───────────────────────────┐
         │     CODE IMPLEMENTATION   │               │     PROJECT MANAGEMENT    │
         │   Copilot • Cursor • IDEs │               │    Linear • Jira • Notion │
         │    (Function-level code)  │               │    (Ticket/status tracking)│
         └───────────────────────────┘               └───────────────────────────┘
```

| Dimension                    | AI Code Assistants<br>_(Copilot, Cursor)_                            | Diagramming Tools<br>_(Mermaid, Draw.io, Eraser)_            | Task Trackers<br>_(Linear, Jira)_                     | **ARCHON**<br>_(Architectural Studio)_                                                    |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Primary Focus**            | Code syntax & boilerplate generation                                 | Static box-and-line pictures                                 | Tasks, sprints, and timeline ("What" & "When")        | **System reasoning, trade-offs & constraints ("Why" & "How")**                            |
| **Architectural Awareness**  | **None.** Optimizes locally at the file or function level.           | **Passive.** Shows what you draw; cannot critique or reason. | **None.** Ignores architectural soundness entirely.   | **Active & Global.** Evaluates cross-cutting boundaries, latencies, and security models.  |
| **Impact on Technical Debt** | Often _accelerates_ technical debt by generating flawed code faster. | None. Diagrams rot and go stale within days.                 | Tracks tickets representing tech debt after the fact. | **Eliminates technical debt upstream** by catching bad assumptions before implementation. |
| **Interaction Model**        | Autocomplete prompts in code editors                                 | Drag-and-drop shapes & text labels                           | Form fields, kanban boards, and sprints               | **Voice Studio brain dumps, live AI ambiguity probes, and decision matrices**             |
| **Living State**             | Transient chat context; discarded across sessions                    | Dead PNG exports or unversioned canvas files                 | Closed tickets; detached from design reality          | **Relational, queryable, synchronized decision records linked directly to specs**         |

### Why Existing Tools Fall Short:

1. **AI Code Generators (Cursor / Copilot):** Brilliant at autocompleting functions, but blind to system-level architecture. If you ask an AI assistant to build a feature on a flawed data model or missing auth boundary, it will happily generate 2,000 lines of brittle code.
2. **Diagramming Software (Mermaid / Eraser / Lucidchart):** Static drawings that quickly diverge from reality. They don't warn you that your chosen database cannot support your P99 latency target or that your auth flow lacks multi-tenant isolation.
3. **General LLM Chatbots (ChatGPT / Claude web):** Unstructured, ephemeral conversations that lose context, hallucinate arbitrary schemas, and cannot persist structured entities to an active engineering workflow.

**Archon fills the upstream void:** It is the dedicated thinking space where architectural trade-offs are made explicit, challenged, and recorded.

---

## Milestone 1 (Prototype 1) Achievements

This repository represents the completed **Milestone 1 (Prototype 1)** release of Archon, establishing the end-to-end foundation, design language, and AI reasoning engine:

### 🎙️ 1. Archon Voice Studio (Hands-Free Architectural Scaffolding)

- **Natural Dictation Canvas:** High-density, tactile vision workbench allowing architects to speak their system thoughts freely without typing friction.
- **Web Speech API Engine:** Continuous speech recognition with real-time interim transcription, automatic silence detection, and graceful fallbacks for unsupported environments.
- **Visual Feedback System:** 3-bar sound wave micro-animations (`pulse_0.7s`, `pulse_0.5s`, `pulse_0.8s`), pulsating emerald beacon, and live word counter.
- **AI-Powered Structured Distillation:** Google Gemini AI parses messy natural speech transcripts into comprehensive, typed architectural blueprints (`name`, `description`, `type`, `targetUsers`, `goal`, `tech`, `scale`, `budget`, and categorized `seedRequirements`).
- **Inline Dictation:** Voice dictation buttons integrated directly into project creation forms and clarification decision cards.

### 📐 2. Multi-Dimensional Requirements Matrix

- **8 Architectural Dimensions:** Categorize specifications across `Functional`, `Non-functional`, `Security`, `Performance`, `AI`, `Data`, `Infrastructure`, and `Business`.
- **Strict Priority & Status Lifecycles:** Track items through `Low`, `Medium`, `High`, and `Critical` priorities, and transition states from `Draft` to `Confirmed`.
- **Constraint & Assumption Tracking:** Dedicated specification fields capturing performance limits (e.g. `P99 < 50ms`), compliance rules, and engineering assumptions.
- **Live Search & Filter:** Filter requirements instantly by status counters or architectural category pills.

### ⚡ 3. Dual-Tier AI Ambiguity & Clarification Engine

- **Automated Ambiguity Discovery:** Analyzes project scope and current specifications to identify hidden trade-offs, unstated security boundaries, and architectural risks.
- **Dual-Tier Model Fallback Architecture:**
  1. **Primary Model:** Google `gemma-4-31b-it` for deep, nuanced architectural reasoning.
  2. **Fallback Model:** Google `gemini-3.5-flash-lite` for high-speed secondary inference.
  3. **Deterministic Heuristic Engine:** Offline, rule-based fallback discovery ensuring 100% uptime even if API quotas are exhausted or network is unavailable.
- **Interactive Decision Cards:** Each ambiguity presents a clear problem statement, category badge, and suggested decision pills for 1-click selection.
- **Direct Decision Conversion:** Apply decisions with one click to convert an answer directly into a binding architectural requirement or system constraint.

### 🖤 4. Stark Monochrome & Silver Design System

- **Disciplined Engineer Aesthetic:** Inspired by the craft of Vercel, Linear, and Resend. Pure obsidian `#09090B` canvas, elevated `#121215` card surfaces, and brushed silver `#D4D4D8` accents.
- **Quarantined Semantics:** Chromatic color is strictly banned from decorative chrome and restricted exclusively to status signals:
  - 🟢 **Emerald:** Active voice recording, confirmed specifications, verified health states.
  - 🟡 **Amber:** Architectural trade-offs, pending decisions, foundational discovery mode.
  - 🔴 **Rose:** Critical bottlenecks, deletion dialogs, destructive actions.
- **Official shadcn/ui Component Suite:** Built on Radix and Base UI primitives (`Textarea`, `Input`, `Button`, `Card`, `Badge`, `Dialog`, `Popover`, `Select`).

### 🛡️ 5. Enterprise Validation & Observability

- **Zod Request Validation Middleware:** Uniform `validateRequestBody` utility validating every API payload with detailed issue paths and formatted 400 bad-request responses.
- **Structured JSON Logging:** Zero-dependency, machine-readable JSON logger tracking every HTTP route, status code, latency (`durationMs`), user ID, and contextual metadata.
- **AI Clarification Telemetry:** Tracks high-resolution inference latency via `performance.now()`, token consumption (`inputTokens`, `outputTokens`, `totalTokens`), model ID, ambiguity counts, and fallback triggers.

---

## Automated Testing & Quality Gates

Archon enforces strict quality gates across every commit and build:

```
                  ┌──────────────────────────────────────────────┐
                  │            ARCHON QUALITY GATES              │
                  └──────┬────────────────┬──────────────┬───────┘
                         │                │              │
                         ▼                ▼              ▼
                 ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
                 │  TypeScript   │ │ Vitest Suite │ │  Playwright  │
                 │  Type Safety  │ │  Unit & Int  │ │  E2E Journey │
                 │   (0 Errors)  │ │ (102 Tests)  │ │   (Passed)   │
                 └───────────────┘ └──────────────┘ └──────────────┘
```

### 1. TypeScript Strict Type Checking

```bash
npx tsc --noEmit
# Exit code: 0 (Zero errors)
```

### 2. Vitest Unit & Integration Suites (100% Pass Rate)

```bash
npx vitest run
# Test Files  14 passed (14)
# Tests       102 passed (102)
# Duration    6.53s
```

- **Project API Routes:** GET, POST, PATCH, DELETE, authorization checks, query filtering, and 500 error cascades ([`src/app/api/projects/route.test.ts`](file:///c:/Users/suhai/agent/archon/src/app/api/projects/route.test.ts) & [`[id]/route.test.ts`](file:///c:/Users/suhai/agent/archon/src/app/api/projects/[id]/route.test.ts)).
- **Requirement API Routes:** Listing, category enum conversions, Zod schema validation, default assignments, and deletion ([`src/app/api/projects/[id]/requirements/route.test.ts`](file:///c:/Users/suhai/agent/archon/src/app/api/projects/[id]/requirements/route.test.ts) & [`src/app/api/requirements/[id]/route.test.ts`](file:///c:/Users/suhai/agent/archon/src/app/api/requirements/[id]/route.test.ts)).
- **Voice Scaffolding Engine:** Web Speech prompt builders, fallback scaffolding heuristics, and API route security ([`src/lib/voice-scaffold.test.ts`](file:///c:/Users/suhai/agent/archon/src/lib/voice-scaffold.test.ts) & [`route.test.ts`](file:///c:/Users/suhai/agent/archon/src/app/api/projects/voice-scaffold/route.test.ts)).
- **AI Clarification Validation:** Zod response schema parsing, category normalizations, markdown JSON fence extraction, and malformed input resilience ([`src/lib/clarification-validation.test.ts`](file:///c:/Users/suhai/agent/archon/src/lib/clarification-validation.test.ts)).
- **Decision Conversion & Rate Limiting:** Verification of conversion into requirements/constraints and sliding-window rate limiting ([`convert/route.test.ts`](file:///c:/Users/suhai/agent/archon/src/app/api/clarifications/[id]/convert/route.test.ts) & [`rate-limiter.test.ts`](file:///c:/Users/suhai/agent/archon/src/lib/rate-limiter.test.ts)).

### 3. Playwright End-to-End Workflow Verification

```bash
npx playwright test e2e/project-workflow.spec.ts
# ok 1 [chromium] › complete workflow: create project → add requirement → clarify
# 1 passed (2.1m)
```

Validates the complete real-world user path against live PostgreSQL and remote Gemini AI models:

1. User registration with session establishment (`/sign-up`).
2. Dashboard load and project initialization (`Create New Project`).
3. Navigation into the project workspace (`/projects/[id]`).
4. Specification creation under the `Security` category.
5. AI ambiguity discovery execution (`Discover Ambiguities`).
6. Live model inference (`gemma-4-31b-it`) and clarification card rendering.
7. Suggested option selection and decision saving (`Save Answer`).
8. Verification of recorded decision state and requirement conversion action rows.

---

## Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION                           │
│     Next.js 16.3 (App Router) • React 19 • Tailwind CSS v4 • shadcn    │
│            Web Speech API • Lucide Icons • tw-animate-css              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                         APPLICATION LAYER                              │
│       Zod Request Middleware • Structured JSON Logger • Rate Limiter   │
│             Better-Auth (Session & Credential Security)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
   ┌─────────────────────────────┐     ┌─────────────────────────────┐
   │     PERSISTENCE LAYER       │     │       AI INFERENCE          │
   │  PostgreSQL (Neon pooled)   │     │    Vercel AI SDK v7         │
   │  Prisma ORM 7 + Adapter-PG  │     │ Google Gemma-4-31b / Gemini │
   └─────────────────────────────┘     └─────────────────────────────┘
```

| Layer                      | Technologies                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**              | [Next.js 16.3.5](https://nextjs.org/) (App Router, Server Components, Route Handlers)                                                       |
| **Language & Runtime**     | [TypeScript 5](https://www.typescriptlang.org/), [React 19](https://react.dev/), Node.js 20+                                                |
| **Design & UI Primitives** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix / Base UI), Lucide Icons                            |
| **AI Architecture**        | [Vercel AI SDK v7](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/google`), Google Gemma-4-31b & Gemini 3.5 Flash                                  |
| **Voice Processing**       | Browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (`webkitSpeechRecognition`), Web Audio API |
| **Database & ORM**         | [PostgreSQL](https://www.postgresql.org/) (Neon Serverless), [Prisma ORM 7.10](https://www.prisma.io/) with `@prisma/adapter-pg`            |
| **Authentication**         | [Better-Auth 1.7](https://www.better-auth.com/) (Email/Password + Google OAuth) with Prisma Adapter                                         |
| **Validation**             | [Zod 4](https://zod.dev/) request body middleware and response schemas                                                                      |
| **Testing**                | [Vitest 4](https://vitest.dev/), React Testing Library, [Playwright 1.52](https://playwright.dev/)                                          |

---

## Repository Structure

```
archon/
├── public/
│   ├── archon-logo.svg            # Authoritative vector brand logo (Black/Silver)
│   └── archon-logo-white.svg      # Dark-mode optimized vector brand logo (White/Silver)
├── src/
│   ├── app/
│   │   ├── (auth)/                # Authentication routes (sign-in, sign-up)
│   │   ├── api/                   # Server API route handlers
│   │   │   ├── auth/              # Better-Auth route handler ([...all])
│   │   │   ├── clarifications/    # Clarification PATCH, DELETE, and /convert POST
│   │   │   ├── projects/          # Projects CRUD, /requirements, /clarify, /voice-scaffold
│   │   │   └── requirements/      # Individual requirement GET, PATCH, DELETE
│   │   ├── dashboard/             # Projects dashboard grid & project creation
│   │   ├── projects/[id]/         # Dedicated architectural project workbench
│   │   ├── globals.css            # Stark Monochrome design tokens & CSS variables
│   │   └── layout.tsx             # Root layout with fonts, theme, and providers
│   ├── components/
│   │   ├── auth/                  # High-contrast authentication forms
│   │   ├── clarifications/        # Ambiguity panels, decision cards & option buttons
│   │   ├── landing/               # Marketing navigation, hero, and footer
│   │   ├── projects/              # Create project modal & Voice Studio workbench
│   │   ├── requirements/          # Specifications table, filter bar & creation dialog
│   │   └── ui/                    # Installed shadcn/ui components (Textarea, Input, etc.)
│   ├── hooks/
│   │   └── use-speech-to-text.ts  # Web Speech API hook for Archon Voice Studio
│   └── lib/
│       ├── ai.ts                  # Google AI SDK provider & model tier declarations
│       ├── api-validation.ts      # Zod validation middleware for request bodies
│       ├── auth.ts                # Better-Auth server configuration & Prisma adapter
│       ├── clarification-agent.ts # Dual-tier AI clarification & telemetry engine
│       ├── clarifications.ts      # Clarifications domain logic & Zod schemas
│       ├── logger.ts              # Structured JSON API & AI telemetry logger
│       ├── prisma.ts              # Singleton PrismaClient with PostgreSQL connection pool
│       ├── projects.ts            # Projects domain logic & Zod schemas
│       ├── rate-limiter.ts        # Sliding-window in-memory rate limiter
│       ├── requirements.ts        # Requirements domain logic & Zod schemas
│       └── voice-scaffold.ts      # Voice transcript analysis & scaffolding schemas
├── e2e/                           # Playwright end-to-end test suites
│   └── project-workflow.spec.ts   # Complete registration → project → spec → clarify flow
├── prisma/
│   └── schema.prisma              # Database schema (User, Project, Requirement, Clarification)
├── DESIGN.md                      # Authoritative design specifications & token system
├── PRODUCT.md                     # Authoritative product purpose, users & brand identity
└── vitest.config.ts               # Vitest configuration & test runner settings
```

---

## Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL database instance (local or [Neon Serverless Postgres](https://neon.tech/))
- **Google AI API Key**: Optional for live Gemini reasoning; fallback heuristics take over automatically if omitted.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/archon.git
cd archon
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-cool-pool.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Better-Auth
BETTER_AUTH_SECRET="your-32-character-random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Google AI (Gemini & Gemma)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-studio-api-key"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Synchronize Database Schema

Push the Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using Archon Studio.

### 5. Execute Verification Suites

Run unit and integration tests:

```bash
npm test
```

Run end-to-end workflow verification with Playwright:

```bash
# Install Playwright browser binaries (first time only)
npx playwright install chromium

# Run the project workflow test
npx playwright test e2e/project-workflow.spec.ts
```

---

## Roadmap & Milestones

Archon's progression follows a 4-milestone roadmap:

```
┌────────────────────────────────┐     ┌────────────────────────────────┐
│   MILESTONE 1 (Current Release)│     │          MILESTONE 2           │
│   • Archon Voice Studio        │ ──► │   • Interactive C4 Visualizer  │
│   • Multi-Dimensional Specs    │     │   • Real-Time Graph Workbench  │
│   • AI Ambiguity Engine        │     │   • Dependency Drag-and-Drop   │
└────────────────────────────────┘     └────────────────────────────────┘
                                                       │
                                                       ▼
┌────────────────────────────────┐     ┌────────────────────────────────┐
│          MILESTONE 4           │     │          MILESTONE 3           │
│   • Collaborative Workbench    │ ◄── │   • Git ADR Exporter           │
│   • Multi-Architect Conflict   │     │   • Architecture CI/CD Linter  │
│   • Versioned System Branches  │     │   • Automated PR Architecture  │
└────────────────────────────────┘     └────────────────────────────────┘
```

- **✅ Milestone 1: The Reasoning Foundation (Prototype 1 - Current)**
  - Archon Voice Studio with live microphone transcription and structured schema scaffolding.
  - Multi-dimensional specifications matrix across 8 architectural categories.
  - Dual-tier AI ambiguity discovery (`gemma-4-31b-it` / `gemini-3.5-flash-lite`) with inline decision capture.
  - Stark Monochrome & Silver design system and 100% automated test coverage.
- **⏳ Milestone 2: Interactive System Visualizer (C4 Model)**
  - Dynamic C4 Context and Container diagram rendering synchronized in real-time with confirmed specifications.
  - Interactive canvas for exploring service boundaries, data flows, and external integrations.
  - Latency and cost-cliff visualizers directly on service nodes.
- **⏳ Milestone 3: Executable Architecture & Git ADR Export**
  - Automated export to Markdown Architectural Decision Records (ADRs) committed directly to GitHub repositories.
  - Architecture CI/CD GitHub Action: lint incoming pull requests to verify that code changes adhere to confirmed architectural constraints.
- **⏳ Milestone 4: Collaborative Multi-Architect Review**
  - Multi-user real-time co-authoring for technical design reviews.
  - Structural change diffing and merge conflict resolution for competing architecture proposals.

---

## Brand & Design Credits

- **Identity**: Archon Studio — _IDEAS → ARCHITECTURE → IMPACT_
- **Design Language**: Stark Monochrome with Brushed Silver Core (`#D4D4D8`)
- **Iconography**: [Lucide Icons](https://lucide.dev/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
