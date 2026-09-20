import Link from "next/link";
import { ArchonLogo } from "./archon-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090B] py-12 sm:py-16 text-xs text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/[0.08]">
          {/* Brand Info - Full Lockup */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <ArchonLogo variant="full" size={52} />
            </Link>
            <p className="max-w-sm text-zinc-400 mt-2 leading-relaxed">
              The AI engineering partner that helps developers make better architectural decisions before and during implementation.
            </p>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#121215] px-3.5 py-1.5 font-mono text-xs">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">
              Reasoning Engine: <strong className="text-emerald-400 font-semibold">All Systems Operational</strong>
            </span>
          </div>
        </div>

        {/* Links & Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex flex-wrap items-center gap-6">
            <a href="#demo" className="text-zinc-400 hover:text-white transition-colors">
              Simulator
            </a>
            <a href="#workflow" className="text-zinc-400 hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#dimensions" className="text-zinc-400 hover:text-white transition-colors">
              8 Dimensions
            </a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/sign-in" className="text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} Archon. Ideas &rarr; Architecture &rarr; Impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
