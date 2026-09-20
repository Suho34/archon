import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 relative bg-[#09090B] border-t border-white/[0.08]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-8 sm:p-14 text-center shadow-2xl shadow-black/80 relative">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#09090B] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-6">
            <Sparkles className="size-3.5 text-zinc-300" />
            Ready to Architect?
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight font-sans">
            Your best architecture starts <br className="hidden sm:inline" />
            with a single prompt.
          </h2>

          <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            Join software developers and technical leads using Archon to stress-test their designs, eliminate blind spots, and ship with total confidence.
          </p>

          {/* Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="default"
                className="w-full sm:w-auto h-11 px-8 rounded-md text-sm font-semibold cursor-pointer"
              >
                Launch Your First Project Free
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Micro Assurances */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              Setup in under 60 seconds
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              Free forever for solo developers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
