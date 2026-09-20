import { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { InteractiveArchitectureWidget } from "@/components/landing/interactive-architecture-widget";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { ArchitectureDimensions } from "@/components/landing/architecture-dimensions";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Archon | AI Engineering Partner for System Architects",
  description:
    "Archon is an AI engineering partner that helps developers make better architectural decisions. Stress-test your design, uncover hidden bottlenecks, and guide your trade-offs with zero regrets.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20 selection:text-white antialiased font-sans">
      {/* Top Sticky Navigation */}
      <LandingNav />

      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Centerpiece: Interactive Architecture Workbench */}
        <InteractiveArchitectureWidget />

        {/* The 3-Step Methodology (Ideas -> Architecture -> Impact) */}
        <WorkflowSection />

        {/* The 8 Architectural Dimensions Grid */}
        <ArchitectureDimensions />

        {/* Why Archon: Passive Diagramming vs Active Reasoning */}
        <ComparisonSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* High-Impact Closing CTA */}
        <CtaSection />
      </main>

      {/* Comprehensive Footer */}
      <LandingFooter />
    </div>
  );
}
