import {
  Database,
  Layers,
  Lock,
  Server,
  Sliders,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

export function ArchitectureDimensions() {
  const dimensions = [
    {
      title: "Functional",
      icon: Layers,
      description: "Core domain logic, user workflows, state machines, and operational pipelines.",
      questionCaught: "What happens when a tenant cancels mid-billing-cycle?",
      tag: "Domain Logic",
    },
    {
      title: "Non-functional",
      icon: Sliders,
      description: "Availability targets (99.95%), graceful degradation, recovery time objectives (RTO).",
      questionCaught: "If the payment gateway drops for 30s, does background checkout queue gracefully?",
      tag: "Reliability & SLAs",
    },
    {
      title: "Security",
      icon: Lock,
      description: "Zero-trust session lifecycle, cryptographic token rotation, and tenant boundary isolation.",
      questionCaught: "Can leaked JWT tokens be instantly revoked without a full database table sweep?",
      tag: "Zero-Trust",
    },
    {
      title: "Performance",
      icon: Zap,
      description: "P99 latency budgets, cold-start mitigation, edge caching, and concurrency bottlenecks.",
      questionCaught: "Will serverless burst traffic exhaust connection pools under peak read load?",
      tag: "Latency & Scale",
    },
    {
      title: "AI & LLM",
      icon: Sparkles,
      description: "Prompt token budgets, streaming chunk latency, semantic caching, and vector indexing.",
      questionCaught: "What is your fallback strategy when the primary model encounters rate limits or downtime?",
      tag: "Inference & Caching",
    },
    {
      title: "Data Architecture",
      icon: Database,
      description: "Schema normalization, indexing strategies, pooling architectures, and transactional isolation.",
      questionCaught: "How is cross-tenant analytics separated from operational OLTP write performance?",
      tag: "Relational & Vector",
    },
    {
      title: "Infrastructure",
      icon: Server,
      description: "Serverless vs long-running containers, cloud egress limits, and private subnet topology.",
      questionCaught: "Does your micro-service communication introduce unbudgeted inter-region egress fees?",
      tag: "Compute & Network",
    },
    {
      title: "Business & Budget",
      icon: TrendingUp,
      description: "Runway constraints, operational maintenance overhead, and developer velocity trade-offs.",
      questionCaught: "Does this distributed architecture require a full-time DevOps engineer to maintain?",
      tag: "Cost & Complexity",
    },
  ];

  return (
    <section id="dimensions" className="py-20 md:py-28 relative bg-[#09090B] border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-3">
            <Layers className="size-3.5 text-zinc-400" />
            Holistic System Coverage
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
            Reasoning across 8 architectural dimensions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Most software failures don&apos;t happen because of bad syntax — they happen because of overlooked non-functional, security, or data scaling constraints. Archon covers every angle.
          </p>
        </div>

        {/* 8-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.title}
                className="rounded-2xl border border-white/[0.08] bg-[#121215] p-5 flex flex-col justify-between hover:border-white/[0.18] transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-9 rounded-lg border border-white/[0.08] bg-[#09090B] flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-[#09090B] border border-white/[0.08] px-2 py-0.5 rounded">
                      {dim.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground mb-1.5 font-sans">
                    {dim.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {dim.description}
                  </p>
                </div>

                {/* Example Problem Probed */}
                <div className="pt-3 border-t border-white/[0.08]">
                  <span className="text-[10px] uppercase font-mono font-semibold text-zinc-500 block mb-1">
                    Archon Probes:
                  </span>
                  <p className="text-xs text-zinc-300 font-mono bg-[#09090B] p-2.5 rounded-lg border border-white/[0.08] leading-relaxed">
                    &ldquo;{dim.questionCaught}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
