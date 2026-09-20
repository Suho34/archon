import { Check, Compass, Sparkles, X } from "lucide-react";

export function ComparisonSection() {
  const comparisons = [
    {
      factor: "Architectural Intent",
      traditional: "Draws static boxes and arrows that go stale the day after coding starts.",
      archon: "Active reasoning engine that challenges assumptions and tracks constraints dynamically.",
    },
    {
      factor: "Trade-Off Analysis",
      traditional: "Gut-feeling decisions based on hacker news trends or prior project habits.",
      archon: "Quantified trade-off scorecards (P99 latency, compute cost, ops friction, scale ceiling).",
    },
    {
      factor: "Detecting Blind Spots",
      traditional: "Discovered in production at 3 AM when traffic hits connection pool limits.",
      archon: "Surfaced upfront in discovery mode via AI architectural clarification questions.",
    },
    {
      factor: "Requirements Lifecycle",
      traditional: "Disconnected Notion pages or Jira tickets without architectural linkage.",
      archon: "1-Click conversion of architectural decisions into locked, prioritized requirements.",
    },
    {
      factor: "Engineering Regrets",
      traditional: "Painful multi-month rewrites when foundational assumptions break down.",
      archon: "Zero silent architectural regrets — complete confidence from day one.",
    },
  ];

  return (
    <section id="why-archon" className="py-20 md:py-28 relative bg-[#09090B] border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-3">
            <Compass className="size-3.5 text-zinc-400" />
            Why Archon Matters
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
            Reasoning over passive generation
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Diagramming tools draw what you tell them to draw. Archon tells you what you forgot to consider.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] overflow-hidden shadow-2xl shadow-black/60">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/[0.08] bg-[#09090B] p-4 sm:p-5 text-sm font-semibold">
            <div className="md:col-span-3 text-zinc-400 uppercase tracking-wider text-xs font-mono">
              Dimension
            </div>
            <div className="md:col-span-4 text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider text-xs font-mono">
              <X className="size-3.5 text-rose-500" />
              Traditional Static Planning
            </div>
            <div className="md:col-span-5 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-xs font-mono">
              <Sparkles className="size-3.5 text-zinc-300" />
              Archon Engineering Partner
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.06]">
            {comparisons.map((row) => (
              <div
                key={row.factor}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-3 md:gap-4 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div className="md:col-span-3 font-semibold text-foreground text-xs sm:text-sm font-mono">
                  {row.factor}
                </div>
                <div className="md:col-span-4 text-xs sm:text-sm text-zinc-400 flex items-start gap-2">
                  <X className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
                <div className="md:col-span-5 text-xs sm:text-sm text-foreground flex items-start gap-2 font-normal bg-[#09090B] p-3 rounded-xl border border-white/[0.08]">
                  <Check className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{row.archon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
