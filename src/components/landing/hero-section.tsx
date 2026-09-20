import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background Architectural Canvas (Obsidian Carbon) */}
      <div className="absolute inset-0 -z-10 bg-[#09090B]">
        {/* Subtle Radial Monochrome Illumination */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        {/* Subtle Precision Grid System */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#D4D4D8 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Label: IDEAS -> ARCHITECTURE -> IMPACT */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-4 py-1.5 shadow-xs mb-8">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-zinc-300">
            IDEAS → ARCHITECTURE → IMPACT
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08]">
          Build with conviction. <br />
          <span className="text-zinc-400">
            Ship with zero architectural regrets.
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed">
          Stop second-guessing your tech stack, database scale, or security boundaries. Describe your project and let Archon stress-test your design, uncover hidden bottlenecks, and guide critical trade-offs — free in under 60 seconds.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="default"
              className="w-full sm:w-auto h-11 px-7 rounded-md text-sm font-semibold cursor-pointer"
            >
              Launch Your First Project Free
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
          <a href="#demo" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 px-6 rounded-md text-sm font-medium cursor-pointer"
            >
              Explore Simulator
              <ChevronDown className="size-4 ml-1.5 text-zinc-400" />
            </Button>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            100% Free for solo builders
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-zinc-400" />
            Active Architectural Reasoning
          </span>
        </div>

        {/* Telemetry Strip (Hairline Grid) */}
        <div className="mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-4 transition-all duration-200 hover:border-white/[0.18]">
            <div className="flex items-center gap-2 text-zinc-300 mb-1.5">
              <Cpu className="size-4 text-zinc-400" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Analysis Engine</span>
            </div>
            <div className="text-lg font-bold text-foreground font-mono">8 Dimensions</div>
            <p className="text-xs text-zinc-400 mt-0.5">Functional, security, scale & cost</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-4 transition-all duration-200 hover:border-white/[0.18]">
            <div className="flex items-center gap-2 text-zinc-300 mb-1.5">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Confidence</span>
            </div>
            <div className="text-lg font-bold text-foreground font-mono">Zero Regrets</div>
            <p className="text-xs text-zinc-400 mt-0.5">Assumptions vetted before coding</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-4 transition-all duration-200 hover:border-white/[0.18]">
            <div className="flex items-center gap-2 text-zinc-300 mb-1.5">
              <Zap className="size-4 text-amber-400" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Discovery Speed</span>
            </div>
            <div className="text-lg font-bold text-foreground font-mono">&lt; 60 Seconds</div>
            <p className="text-xs text-zinc-400 mt-0.5">From brief idea to full diagnosis</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-4 transition-all duration-200 hover:border-white/[0.18]">
            <div className="flex items-center gap-2 text-zinc-300 mb-1.5">
              <Layers className="size-4 text-zinc-400" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Execution</span>
            </div>
            <div className="text-lg font-bold text-foreground font-mono">Living Sync</div>
            <p className="text-xs text-zinc-400 mt-0.5">Decisions locked into specs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
