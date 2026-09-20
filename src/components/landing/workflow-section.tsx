import { BrainCircuit, CheckCircle2, Compass, ShieldCheck } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      number: "01",
      phase: "IDEAS",
      title: "Frame Ideas & Hard Constraints",
      description:
        "Input your vision, target users, budget ceiling, and tech stack preferences. Archon anchors your architecture to real-world operational boundaries.",
      bullets: [
        "Capture scale targets and budget ceilings",
        "Multi-category specification input",
        "Foundational discovery mode for early concepts",
      ],
      icon: Compass,
    },
    {
      number: "02",
      phase: "ARCHITECTURE",
      title: "Active Architectural Reasoning",
      description:
        "Archon acts as your staff engineer partner. It interrogates unstated assumptions, flags connection exhaustion traps, and runs live trade-off simulations.",
      bullets: [
        "Identifies blind spots across 8 dimensions",
        "Clarification Q&A with decision-to-spec conversion",
        "Latency vs cost trade-off scoring",
      ],
      icon: BrainCircuit,
    },
    {
      number: "03",
      phase: "IMPACT",
      title: "High-Confidence Execution",
      description:
        "Ship with complete technical clarity. Architecture stays living and synchronized as features evolve, preventing painful 3-month production rewrites.",
      bullets: [
        "Locked, confirmed specification ledger",
        "Zero silent architectural regrets",
        "Living architecture synchronized with code",
      ],
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="workflow" className="py-20 md:py-28 relative bg-[#09090B] border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-3">
            <Compass className="size-3.5 text-zinc-400" />
            The Archon Operating Model
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight font-sans">
            Ideas <span className="text-zinc-500 font-mono">→</span> Architecture <span className="text-zinc-500 font-mono">→</span> Impact
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            A disciplined engineering methodology that turns fuzzy project visions into robust, production-ready systems before implementation starts.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="rounded-2xl border border-white/[0.08] bg-[#121215] p-7 flex flex-col justify-between hover:border-white/[0.18] transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider border border-white/[0.1] bg-[#09090B] text-zinc-300">
                      Step {step.number} &bull; {step.phase}
                    </span>
                    <div className="size-9 rounded-lg border border-white/[0.08] bg-[#09090B] flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/[0.08] space-y-2.5">
                  {step.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
