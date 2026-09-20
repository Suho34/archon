# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individual software developers, system architects, and technical leads who need to architect projects thoughtfully before and during implementation. They are the primary decision-makers who own the full stack of architectural choices and trade-offs.

## Product Purpose

Archon is an AI engineering partner that helps developers make better architectural decisions. It moves beyond passive diagramming and static project specifications into active reasoning support: understanding the technical context, stress-testing design assumptions, challenging decisions, identifying security and performance risks, explaining trade-offs, and keeping architecture synchronized as requirements evolve.

Success means the developer ships with zero architectural regrets, unassailable confidence in their structural design choices, and a living record of their system decisions.

## Positioning

The core differentiator is not generating passive diagrams or boilerplate code — it is active architectural reasoning: helping developers rigorously explore and validate **why** the architecture should look the way it does. Archon acts as a rigorous technical sounding board that exposes hidden bottlenecks, cost cliffs, and maintainability pitfalls before code is written.

## Operating Context

- **Workflow:** Define project scope, capture multi-dimensional requirements, stress-test system architecture, resolve structural clarifications, and iterate as constraints shift.
- **Cadence:** Multi-day and ongoing development sessions spanning from initial ideation to production scaling.
- **Decision Dimensions:** Rigorous evaluation across performance, scalability, security, cost efficiency, complexity, reliability, maintainability, and developer velocity.
- **Synchronized State:** The architecture remains alive and synchronized with project specifications, never frozen as an outdated artifact.

## Capabilities and Constraints

- **Project Workspace:** Comprehensive project creation and management (scope, target users, core goals, technical constraints, stack definition, scale targets, budget parameters).
- **Multi-Dimensional Requirements:** Captures requirements categorized across Functional, Non-Functional, Security, Performance, AI/ML, Data, Infrastructure, and Business with strict priority hierarchies.
- **Architectural Clarifications & Reasoning:** Interactive decision workbench to detect ambiguities, challenge assumptions, and convert clarifications directly into binding architectural requirements.
- **Authentication & Security:** Robust user authentication with email/password and Google OAuth.
- **Data Layer:** PostgreSQL database modeled via Prisma ORM with relational integrity.
- **Single-User Focus:** Tailored for individual engineers and tech leads with zero team coordination overhead.

## Brand Commitments

- **Name:** Archon
- **Tagline:** `IDEAS → ARCHITECTURE → IMPACT`
- **Logo Asset:** Official vector asset at [`public/archon-logo.svg`](file:///c:/Users/suhai/agent/archon/public/archon-logo.svg).
  - **Visual Anatomy:** Three architectural chevrons forming an ascending apex triad, a precision geometric "ARCHON" logotype featuring an internal 4-point diamond star inside the "O", and the directional progression tagline with clean arrows.
  - **Brand Styling:** Stark Monochrome with a Brushed Silver Core (`#D4D4D8` / metallic silver highlight).
  - **Lockups:**
    - *Full Lockup:* Apex Chevrons + "ARCHON" + Tagline (`IDEAS → ARCHITECTURE → IMPACT`) for heroes, documentation, and major brand moments.
    - *Compact Lockup:* Apex Chevrons + "ARCHON" with diamond star core for application navigation, headers, and modal bars.
    - *Mark Only:* Ascending Chevrons triad for favicons, mobile headers, collapsed sidebars, and status badges.
- **Voice:** Minimalist, analytical, calm, authoritative, and developer-first. No marketing fluff, playful emojis, or hyperbole. Speaks with the precision of a principal systems architect.
- **Color Commitment:** Stark Monochrome & Silver. Dark-first OLED canvas (`#000000` / `#0A0A0A`), pure white high-contrast text, brushed silver accents, and hairline borders. Chromatic color is strictly banned from decorative chrome and reserved exclusively for architectural status signals (emerald for verified, amber for trade-off risk, rose for critical bottleneck).

## Evidence on Hand

- **Authoritative Vector Logo:** Vector SVG asset located at [`public/archon-logo.svg`](file:///c:/Users/suhai/agent/archon/public/archon-logo.svg).
- **Production Next.js Application:** Complete App Router architecture with auth routes, projects dashboard, project workspace, and requirements management.
- **Prisma Schema:** Production database schema defining `User`, `Project`, `Requirement`, and `Clarification` models.
- **Embedded Tagline:** Definitive progression methodology embedded directly into the vector mark: `IDEAS → ARCHITECTURE → IMPACT`.

## Product Principles

1. **Reasoning over generation.** The product exists to help engineers think critically through architectural trade-offs, not merely vomit boilerplate code or superficial diagrams.
2. **Constraint-aware precision.** Every recommendation, warning, and architecture pattern is calibrated to the engineer's exact budget, scale, latency, and team constraints.
3. **Architecture is alive.** Specifications and system decisions adapt synchronously as requirements shift; architecture is treated as executable design truth.
4. **Developer-first minimalism.** High information density, zero cognitive noise, immediate keyboard responsiveness, and distraction-free visual clarity.
5. **Calm, unassailable confidence.** The experience systematically eliminates architectural doubt, providing mathematical clarity on system design choices.

## Accessibility & Inclusion

- Adherence to WCAG 2.1 AA accessibility standards across the entire application.
- Strict 7:1 contrast ratio for primary content text against dark/light canvases, and 4.5:1 minimum for secondary labels.
- Full keyboard navigation support with visible focus rings for all interactive workbench controls, tabs, and requirement cards.
- Screen reader-accessible semantic structures for requirement matrices and trade-off comparison tables.
