"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { ArchonLogo } from "./archon-logo";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Simulator", href: "#demo" },
    { label: "Workflow", href: "#workflow" },
    { label: "8 Dimensions", href: "#dimensions" },
    { label: "Why Archon", href: "#why-archon" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.08] bg-[#09090B]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Compact Lockup */}
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <ArchonLogo variant="compact" size={26} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-mono font-medium tracking-wide text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 transition"
          >
            Sign in
          </Link>
          <Link href="/sign-up">
            <Button
              size="sm"
              variant="default"
              className="h-8 rounded-md px-3.5 text-xs font-semibold cursor-pointer"
            >
              Start Free
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#09090B] px-5 py-6 backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono text-zinc-300 hover:text-white py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-mono text-zinc-400 py-2 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full rounded-md text-xs font-semibold h-10">
                  Start Free — No Credit Card
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
