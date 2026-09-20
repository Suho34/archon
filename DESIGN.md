# Design

## Visual World

**Stark Monochrome & Silver (Minimalist Engineer SaaS)**

Archon embodies the disciplined, high-density aesthetic of modern technical software (inspired by the craft of Vercel, Resend, and Linear). The interface recedes into an immaculate dark-first obsidian canvas, allowing technical reasoning, system schemas, and architectural trade-offs to command primary focus.

Key characteristics:
- **Zero Decorative Noise:** No superfluous gradients, purple glow washes, or playful embellishments.
- **Hairline Precision:** Crisp 1px borders (`rgba(255, 255, 255, 0.08)`) and high-density information grids.
- **Monochrome with Silver Core:** Pure blacks, rich carbons, and brushed silver accents (`#D4D4D8`).
- **Quarantined Semantics:** Chromatic color is strictly banned from decorative chrome and quarantined exclusively to architectural state indicators (verified, warning, critical bottleneck).

---

## Brand Asset & Logo System

The visual identity is anchored by the authoritative vector asset located at [`public/archon-logo.svg`](file:///c:/Users/suhai/agent/archon/public/archon-logo.svg).

### Logo Anatomy
1. **The Ascending Triad (Mark):** Three upward-pointing architectural chevrons arranged in a triangular apex. They symbolize the structural progression of engineering: *Foundation → Structure → Scalable System*.
2. **The "ARCHON" Wordmark:** Clean, geometric sans-serif lettering featuring an internal 4-point architectural diamond star seated inside the "O".
3. **The Methodology Tagline:** `IDEAS → ARCHITECTURE → IMPACT`, separated by clean horizontal direction arrows.

### Color Treatment: Monochrome + Silver Core
- **Dark Mode (Default):** The chevrons and wordmark render in crisp white (`#FAFAFA` / `#FFFFFF`), while the central diamond star core inside the "O" (and subtle highlights) shines in brushed metallic silver (`#D4D4D8` / `linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)`).
- **Light Mode:** The chevrons and wordmark render in deep carbon (`#09090B`), with the central diamond star rendered in dark steel silver (`#52525B`).

### The 3 Official Lockups

| Lockup | Composition | Primary Use Cases | Minimum Size |
|---|---|---|---|
| **Full Lockup** | Chevrons + "ARCHON" + Tagline | Hero section, documentation headers, marketing footer | 48px height |
| **Compact Lockup** | Chevrons + "ARCHON" (with diamond star) | Top navigation bar, application header, dialog title bars | 28px height |
| **Mark Only** | 3 Ascending Chevrons triad | Favicon, browser tab, mobile nav, collapsed sidebar rail, status spinner | 18px height |

### Clear Space Rule
Maintain clear space around the logo equal to at least half the height of the Chevrons triad (`0.5H`). Never warp, compress, or add drop shadows to the vector mark.

---

## Color System

Archon operates as a **Dark-First design system** with a meticulously paired **Light mode** token architecture.

### Dark Theme (Primary Canvas)

| Token | Value | Semantic Role |
|---|---|---|
| `--background` | `#09090B` | Deep obsidian canvas (pure carbon, high-contrast) |
| `--foreground` | `#FAFAFA` | Primary reading text (near-white, 14:1 contrast) |
| `--card` | `#121215` | Elevated card & workbench panel surface |
| `--card-foreground` | `#FAFAFA` | Primary card typography |
| `--popover` | `#18181B` | Floating dialogs, menus, and command palettes |
| `--popover-foreground` | `#FAFAFA` | Menu & popover text |
| `--primary` | `#FFFFFF` | Primary stark CTA (pure white button on dark) |
| `--primary-foreground` | `#09090B` | Contrast label on primary CTA |
| `--secondary` | `#1C1C20` | Secondary button surface & muted panels |
| `--secondary-foreground` | `#E4E4E7` | Secondary button label |
| `--muted` | `#18181B` | Muted containers, table header strips |
| `--muted-foreground` | `#A1A1AA` | Secondary metadata, labels, and helper copy |
| `--accent` | `#27272A` | Hover fill on list rows, active nav items |
| `--accent-foreground` | `#FAFAFA` | Active item typography |
| `--destructive` | `#E11D48` | Destructive action / delete confirmations |
| `--destructive-foreground` | `#FFFFFF` | White label on destructive buttons |
| `--border` | `rgba(255, 255, 255, 0.08)` | Hairline dividers, card outlines, table borders |
| `--input` | `rgba(255, 255, 255, 0.12)` | Form control and input borders |
| `--ring` | `#D4D4D8` | Crisp silver keyboard focus ring |
| `--sidebar` | `#09090B` | Sidebar navigation canvas |
| `--sidebar-foreground` | `#FAFAFA` | Navigation item text |
| `--sidebar-border` | `rgba(255, 255, 255, 0.08)` | Sidebar separator line |

### Light Theme (Secondary Canvas)

| Token | Value | Semantic Role |
|---|---|---|
| `--background` | `#FFFFFF` | Pure white canvas |
| `--foreground` | `#09090B` | Pitch-black typography |
| `--card` | `#F8F9FA` | Soft off-white surface |
| `--card-foreground` | `#09090B` | Card typography |
| `--popover` | `#FFFFFF` | Floating dialogs and menus |
| `--popover-foreground` | `#09090B` | Menu typography |
| `--primary` | `#09090B` | Stark black primary CTA |
| `--primary-foreground` | `#FFFFFF` | White text on primary CTA |
| `--secondary` | `#F4F4F5` | Light secondary button surface |
| `--secondary-foreground` | `#18181B` | Secondary label |
| `--muted` | `#F4F4F5` | Muted background strips |
| `--muted-foreground` | `#71717A` | Secondary metadata and captions |
| `--accent` | `#E4E4E7` | Hover fill on rows |
| `--accent-foreground` | `#09090B` | Hover text |
| `--destructive` | `#DC2626` | Destructive button surface |
| `--destructive-foreground` | `#FFFFFF` | Text on destructive |
| `--border` | `rgba(0, 0, 0, 0.08)` | 1px hairline light divider |
| `--input` | `rgba(0, 0, 0, 0.14)` | Light input border |
| `--ring` | `#71717A` | Slate keyboard focus indicator |

### Architectural Status Semantics (Quarantined Color)

Color is reserved strictly for architectural decisions, system states, and validation telemetry:

| Semantic State | Token / Hex | Use Case |
|---|---|---|
| **Verified / Confirmed** | `#10B981` (Emerald 500) | Requirement confirmed, test passing, constraint satisfied |
| **Trade-Off / Risk Warning** | `#F59E0B` (Amber 500) | Architectural trade-off, ambiguity detected, latency warning |
| **Critical / Bottleneck** | `#F43F5E` (Rose 500) | Single point of failure, security vulnerability, budget breach |
| **Reasoning / Active Sync** | `#38BDF8` (Sky 400) / Silver | AI architectural reasoning in progress, live synchronization |

### Monochrome & Silver Scale

| Token Name | Hex Code | Purpose in UI |
|---|---|---|
| **Obsidian 950** | `#000000` | Deepest ground, OLED black surfaces |
| **Carbon 900** | `#09090B` | Main application canvas (`--background`) |
| **Zinc 850** | `#121215` | Elevated cards, workbench panels (`--card`) |
| **Zinc 800** | `#18181B` | Popovers, dropdown menus, table headers |
| **Zinc 700** | `#27272A` | Control borders, active button states |
| **Silver 500** | `#71717A` | Placeholder text, tertiary metadata |
| **Silver 400** | `#A1A1AA` | Secondary labels, subtitle text (`--muted-foreground`) |
| **Silver 300** | `#D4D4D8` | Logo star core, focus rings, active tab indicators |
| **Silver 100** | `#F4F4F5` | High-emphasis secondary badges |
| **Pure White** | `#FFFFFF` | Primary headers, primary buttons, logo vectors |

---

## Typography

The type system prioritizes technical readability, information density, and instant scannability.

- **Primary Interface Font:** `Geist Sans` (fallback: `Inter`, system `-apple-system`, `sans-serif`)
- **Code, Schema & Metadata Font:** `Geist Mono` (fallback: `JetBrains Mono`, `monospace`)

### Type Scale Hierarchy

| Level | Size | Weight | Tracking | Line Height | Usage |
|---|---|---|---|---|---|
| **Display** | `3.25rem` (52px) | 700 Bold | `-0.03em` | `1.1` | Landing page headline |
| **H1** | `2.25rem` (36px) | 700 Bold | `-0.025em` | `1.2` | Workspace title, main view header |
| **H2** | `1.5rem` (24px) | 600 Semibold | `-0.02em` | `1.3` | Section headings, panel titles |
| **H3** | `1.125rem` (18px) | 600 Semibold | `-0.015em` | `1.4` | Card titles, modal headers |
| **Body** | `0.9375rem` (15px) | 400 Regular | `-0.005em` | `1.5` | Architectural descriptions, requirements body |
| **Body Medium** | `0.875rem` (14px) | 500 Medium | `0` | `1.4` | Table rows, button labels, form labels |
| **Caption** | `0.8125rem` (13px) | 400 Regular | `+0.005em` | `1.4` | Secondary metadata, helper text |
| **Tech Badge** | `0.6875rem` (11px) | 600 Mono | `+0.06em` | `1` | Architecture category pills, priority flags, IDs |

### Micro-Typography for SaaS Controls
- **Monospace Metadata Badges:** `font-mono text-[11px] uppercase tracking-wider font-semibold`
- **Requirement IDs:** `font-mono text-[12px] text-zinc-400 font-medium` (e.g., `REQ-042`, `SEC-009`)
- **Tabular Numerics:** Enable `tabular-nums` on all metric cards, latency values, and currency displays.

---

## Spacing & Grid System

Built on a strict **4px modular grid** with disciplined scale:

| Token | Value | Typical Usage |
|---|---|---|
| `space-1` | `4px` | Micro-gap between badge icon and label |
| `space-2` | `8px` | Gap between button icon and text, compact grid gaps |
| `space-3` | `12px` | Internal padding for compact inputs and list items |
| `space-4` | `16px` | Standard input padding, card inner margins |
| `space-6` | `24px` | Standard card internal padding, panel spacing |
| `space-8` | `32px` | Section gap inside workspace panels |
| `space-12` | `48px` | Major dashboard grid divisions |
| `space-16` | `64px` | Page section padding |

---

## Border Radius

Sharp, modern geometry that reinforces the architectural metaphor:

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.25rem` (4px) | Badges, code chips, tooltips |
| `--radius-md` | `0.375rem` (6px) | Form inputs, buttons, menu items |
| `--radius-lg` | `0.5rem` (8px) | Cards, workbench panels, dropdown sheets |
| `--radius-xl` | `0.75rem` (12px) | Large modals, dialog windows, interactive canvas |

---

## Surfaces, Elevation & Hairline Borders

Modern minimalist SaaS eliminates muddy multi-layer drop shadows in favor of **structural light and hairline borders**:

1. **Hairline Outlines:** All cards and interactive regions utilize a `1px solid rgba(255, 255, 255, 0.08)` border.
2. **Subtle Interactive Lift:** On hover, borders transition from `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.20)` with a subtle, tight silver shadow:
   `box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.4);`
3. **Backdrop Blur:** Floating navigation and sticky action headers use `bg-[#09090B]/85 backdrop-blur-md` with a clean hairline bottom border.

---

## Component Specifications

### 1. Buttons
- **Primary Stark:**
  - Background: `#FFFFFF`
  - Text: `#09090B` (font-medium, 14px)
  - Radius: `0.375rem` (6px)
  - Hover: Brightness shift `#F4F4F5`, subtle 1px silver border
  - Height: `2.5rem` (40px)
- **Secondary Outline:**
  - Background: `transparent` (or `#121215`)
  - Border: `1px solid rgba(255, 255, 255, 0.12)`
  - Text: `#FAFAFA`
  - Hover: `bg-white/[0.06] border-white/25`
- **Ghost Action:**
  - Background: `transparent`
  - Text: `#A1A1AA` (hover: `#FAFAFA`, `bg-white/[0.04]`)

### 2. Cards & Workbench Panels
- **Background:** `#121215`
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`
- **Header:** Integrated hairline separator (`border-b border-white/[0.08]`), padding `16px 20px`
- **Hover:** Border brightens to `rgba(255, 255, 255, 0.18)`

### 3. Inputs & Filters
- **Background:** `#09090B` (inset depth, darker than card surface)
- **Border:** `1px solid rgba(255, 255, 255, 0.12)`
- **Focus:** `1px solid #D4D4D8` with `ring-1 ring-[#D4D4D8]/30`
- **Placeholder:** `#71717A`
- **Height:** `2.5rem` (40px)

### 4. Technical Category & Priority Badges
- **Style:** Compact pill, monospace font, subtle tinted background.
- **Confirmed / Verified:** `bg-emerald-500/10 text-emerald-400 border border-emerald-500/25`
- **Draft / In-Discussion:** `bg-amber-500/10 text-amber-400 border border-amber-500/25`
- **Critical Priority:** `bg-rose-500/10 text-rose-400 border border-rose-500/25`
- **Category Tag:** `bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-mono text-[11px]`

### 5. Dialogs & Command Modals
- **Backdrop:** `rgba(0, 0, 0, 0.75)` with `backdrop-blur-sm`
- **Surface:** `#121215` with `1px solid rgba(255, 255, 255, 0.14)`
- **Shadow:** `0 16px 48px -12px rgba(0, 0, 0, 0.8)`

---

## Strict Anti-Patterns to Avoid

- **No Rainbow Chrome:** Do not apply arbitrary blue/purple/pink gradient backgrounds to cards or headers.
- **No Heavy Drop Shadows:** No muddy `shadow-2xl` or colored glow bubbles underneath normal cards.
- **No Low-Contrast Text:** Muted text must never fall below `#71717A` on dark backgrounds (maintaining a minimum 4.5:1 ratio).
- **No Emoji Icons:** Technical architecture concepts must use sharp SVG or Lucide vector icons (`size={14}` or `size={16}`), never casual emojis.
- **No Sluggish Transitions:** Micro-interactions must complete in `100ms - 150ms`. Never use animations longer than `250ms` for standard UI states.
- **No Pure White Cards on Dark:** Do not put blinding white containers inside a dark theme. Keep elevated surfaces within the `#121215` – `#18181B` range.
