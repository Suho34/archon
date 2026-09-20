"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";

import { SerializedProject } from "@/components/dashboard/project-types";
import { SerializedRequirement } from "@/components/requirements/requirement-types";
import { RequirementsView } from "@/components/requirements/requirements-view";
import { ClarificationsPanel } from "@/components/clarifications/clarifications-panel";
import { RequirementFormDialog } from "@/components/requirements/requirement-form-dialog";

interface ProjectWorkspaceViewProps {
  project: SerializedProject;
  initialRequirements: SerializedRequirement[];
}

export function ProjectWorkspaceView({
  project,
  initialRequirements,
}: ProjectWorkspaceViewProps) {
  const [requirements, setRequirements] =
    useState<SerializedRequirement[]>(initialRequirements);
  const [activeTab, setActiveTab] = useState<"specs" | "clarifications">(
    "specs",
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmed and draft metrics
  const confirmedCount = requirements.filter(
    (r) => r.status === "confirmed",
  ).length;
  const draftCount = requirements.filter((r) => r.status === "draft").length;

  function handleRequirementAdded(newReq: SerializedRequirement) {
    setRequirements((prev) => [newReq, ...prev]);
    showToast(`Requirement "${newReq.title}" created from architectural decision`);
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Left: Breadcrumbs & Project Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center size-9 rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/[0.15] transition shrink-0"
              title="Return to Dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="flex items-center gap-2 text-xs text-zinc-400 min-w-0">
              <Link
                href="/dashboard"
                className="hover:text-zinc-200 transition hidden sm:inline"
              >
                Dashboard
              </Link>
              <ChevronRight className="size-3 hidden sm:inline text-zinc-600" />
              <span className="font-bold text-white truncate text-sm">
                {project.name}
              </span>
              {project.type && (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                  {project.type}
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Telemetry & Add Requirement CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400 mr-2 font-mono">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400" />
                {confirmedCount} Confirmed
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
                <span className="size-2 rounded-full bg-amber-400" />
                {draftCount} Draft
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-xs transition"
            >
              <Plus className="size-3.5" />
              Add Spec
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-[#121215] px-4 py-3 text-xs font-semibold text-emerald-300 shadow-2xl shadow-black/80">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-8 pt-8 space-y-8">
        {/* Project Header Summary Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                  Architectural Workspace
                </span>
                {project.scale && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-400 border border-white/[0.08]">
                    Scale: {project.scale}
                  </span>
                )}
                {project.targetUsers && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-400 border border-white/[0.08]">
                    Users: {project.targetUsers}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {project.name}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-300 max-w-3xl leading-relaxed">
                {project.description ||
                  "No project description specified. Use the AI Clarification Engine to run foundational discovery."}
              </p>

              {/* Tech Stack Pills */}
              {project.tech && project.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-500 mr-1">
                    Stack:
                  </span>
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-mono bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Metrics Badge Ledger */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-xl border border-white/[0.08] bg-[#09090B] p-4 text-center min-w-[100px]">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                  Total Specs
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white font-mono">
                  {requirements.length}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-[#09090B] p-4 text-center min-w-[100px]">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                  Confirmed
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-400 font-mono">
                  {confirmedCount}
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-[#09090B] p-4 text-center min-w-[100px]">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                  Draft
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-amber-400 font-mono">
                  {draftCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Tab Switcher */}
        <div className="lg:hidden flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === "specs"
                ? "bg-white text-zinc-950 shadow-xs"
                : "bg-[#121215] text-zinc-400 border border-white/[0.08]"
            }`}
          >
            <Layers className="size-3.5" />
            Specifications ({requirements.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("clarifications")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === "clarifications"
                ? "bg-white text-zinc-950 shadow-xs"
                : "bg-[#121215] text-zinc-400 border border-white/[0.08]"
            }`}
          >
            <Sparkles className="size-3.5" />
            AI Clarifications
          </button>
        </div>

        {/* Dual-Pane Layout: Left = Specifications, Right = AI Clarification */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Pane: Specifications Pool */}
          <section
            className={`lg:col-span-7 xl:col-span-7 ${
              activeTab === "specs" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Architectural Specifications
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Categorized requirements, performance bounds, and security constraints.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/[0.2] transition"
                >
                  <Plus className="size-3 text-zinc-300" />
                  New Spec
                </button>
              </div>

              <RequirementsView
                projectId={project.id}
                projectName={project.name}
                projectDescription={project.description}
                initialRequirements={requirements}
                hideTabs={true}
              />
            </div>
          </section>

          {/* Right Pane: AI Clarification Workbench */}
          <section
            className={`lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 ${
              activeTab === "clarifications" ? "block" : "hidden lg:block"
            }`}
          >
            <ClarificationsPanel
              projectId={project.id}
              projectName={project.name}
              projectDescription={project.description}
              onRequirementAdded={handleRequirementAdded}
            />
          </section>
        </div>
      </main>

      {/* Requirement Creation Form Dialog */}
      <RequirementFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        projectId={project.id}
        onSuccess={handleRequirementAdded}
      />
    </div>
  );
}
