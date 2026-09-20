"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does Archon differ from asking ChatGPT or Claude directly?",
    answer:
      "General-purpose chatbots provide generic suggestions based on loose conversational prompts without structured constraint tracking. Archon is an opinionated engineering system: it forces multi-dimensional analysis (Functional, Security, Performance, Data, AI, Infrastructure), actively probes unstated failure modes, quantifies latency/cost trade-offs, and locks decisions directly into formal specifications stored in your database.",
  },
  {
    question: "Does Archon generate boilerplate code or architectural specifications?",
    answer:
      "Archon focuses on the high-leverage phase before coding: architecture and specifications. It generates living architectural blueprints, boundary constraints, and categorized requirements that guide your implementation in your preferred IDE or AI coding assistants.",
  },
  {
    question: "What AI models power the Archon Clarification Agent?",
    answer:
      "Archon is powered by high-performance models including Gemma-4-31b-it as the primary architectural reasoning model with Gemini 3.5 Flash Lite as high-speed fallback. This dual-layer architecture guarantees deep reasoning for complex trade-offs alongside instant sub-second response times.",
  },
  {
    question: "Can I use Archon with my existing stack and database?",
    answer:
      "Yes! When setting up a project, you can specify your existing technology choices (e.g., PostgreSQL, Prisma, Next.js, Redis, AWS). Archon adapts its analysis to respect your stack boundaries while flagging architectural friction points and scaling ceilings specific to those tools.",
  },
  {
    question: "Is my proprietary architecture and project data secure?",
    answer:
      "Your project data is strictly isolated within your private authenticated workspace. We do not use your proprietary architectural designs or requirements to train public models. Database access is guarded with end-to-end user isolation.",
  },
  {
    question: "Is Archon really free for individual developers?",
    answer:
      "Yes! Archon is built developer-first. Individual software engineers and solo technical founders can create projects, capture requirements across all 8 dimensions, and use the AI clarification agent completely free.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggleFaq(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="py-20 md:py-28 relative bg-[#09090B] border-t border-white/[0.08]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-3">
            <HelpCircle className="size-3.5 text-zinc-400" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight font-sans">
            Everything you need to know
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Have questions about how Archon reasons about your architecture? Here are the answers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border transition-all ${
                  isOpen
                    ? "border-white/25 bg-[#121215]"
                    : "border-white/[0.08] bg-[#121215] hover:border-white/[0.18]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-foreground pr-4 font-sans">
                    {faq.question}
                  </span>
                  <div
                    className={`size-6 rounded-md border border-white/[0.1] flex items-center justify-center text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#09090B] border-white/20 text-white" : ""
                    }`}
                  >
                    <ChevronDown className="size-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.08] pt-4 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
