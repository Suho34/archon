"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Database,
  Layers,
  Lightbulb,
  Lock,
  Pencil,
  Plus,
  Search,
  Server,
  Shield,
  Sliders,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  REQUIREMENT_CATEGORIES,
  RequirementCategory,
  RequirementPriority,
  RequirementStatus,
} from "@/lib/requirement-types";
import { ClarificationsPanel } from "@/components/clarifications/clarifications-panel";
import { DeleteRequirementDialog } from "./delete-requirement-dialog";
import { RequirementFormDialog } from "./requirement-form-dialog";
import {
  CATEGORY_DETAILS,
  SerializedRequirement,
} from "./requirement-types";

interface RequirementsViewProps {
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
  initialRequirements: SerializedRequirement[];
  hideTabs?: boolean;
}

const CATEGORY_ICONS: Record<
  RequirementCategory,
  React.ComponentType<{ className?: string }>
> = {
  Functional: Layers,
  "Non-functional": Sliders,
  Security: Lock,
  Performance: Zap,
  AI: Sparkles,
  Data: Database,
  Infrastructure: Server,
  Business: BrainCircuit,
};

const PRIORITY_BADGES: Record<
  RequirementPriority,
  { label: string; class: string }
> = {
  Critical: {
    label: "Critical",
    class: "bg-rose-500/10 text-rose-400 border-rose-500/20 font-mono",
  },
  High: {
    label: "High",
    class: "bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono",
  },
  Medium: {
    label: "Medium",
    class: "bg-white/[0.04] text-zinc-300 border-white/[0.08] font-mono",
  },
  Low: {
    label: "Low",
    class: "bg-white/[0.02] text-zinc-500 border-white/[0.04] font-mono",
  },
};

export function RequirementsView({
  projectId,
  projectName,
  projectDescription,
  initialRequirements,
  hideTabs = false,
}: RequirementsViewProps) {
  const [requirements, setRequirements] =
    useState<SerializedRequirement[]>(initialRequirements);

  useEffect(() => {
    setRequirements(initialRequirements);
  }, [initialRequirements]);

  const [viewTab, setViewTab] = useState<"requirements" | "clarifications">(
    "requirements",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RequirementStatus>(
    "all",
  );
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | RequirementCategory
  >("all");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] =
    useState<SerializedRequirement | null>(null);
  const [prefilledCategory, setPrefilledCategory] =
    useState<RequirementCategory | null>(null);

  const [deletingRequirement, setDeletingRequirement] =
    useState<SerializedRequirement | null>(null);

  // Expanded items for constraints / assumptions / description
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Optimistic toggling tracker
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Metrics
  const totalCount = requirements.length;
  const confirmedCount = requirements.filter(
    (r) => r.status === "confirmed",
  ).length;
  const draftCount = requirements.filter((r) => r.status === "draft").length;
  const percentConfirmed =
    totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0;

  // Filtered requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      if (statusFilter !== "all" && req.status !== statusFilter) return false;
      if (selectedCategory !== "all" && req.category !== selectedCategory)
        return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = req.title.toLowerCase().includes(q);
      const matchDesc = req.description?.toLowerCase().includes(q) ?? false;
      const matchConstraints =
        req.constraints?.toLowerCase().includes(q) ?? false;
      const matchAssumptions =
        req.assumptions?.toLowerCase().includes(q) ?? false;

      return matchTitle || matchDesc || matchConstraints || matchAssumptions;
    });
  }, [requirements, statusFilter, selectedCategory, searchQuery]);

  // Group filtered requirements by Category
  const groupedByCategory = useMemo(() => {
    const groups: {
      category: RequirementCategory;
      items: SerializedRequirement[];
    }[] = [];

    for (const cat of REQUIREMENT_CATEGORIES) {
      const items = filteredRequirements.filter((r) => r.category === cat);
      if (items.length > 0 || (selectedCategory === cat && items.length === 0)) {
        groups.push({ category: cat, items });
      }
    }

    return groups;
  }, [filteredRequirements, selectedCategory]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // 1-Click Status Toggle
  async function handleToggleStatus(req: SerializedRequirement) {
    const nextStatus: RequirementStatus =
      req.status === "draft" ? "confirmed" : "draft";

    setTogglingId(req.id);

    // Optimistic update
    setRequirements((prev) =>
      prev.map((item) =>
        item.id === req.id ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      const res = await fetch(`/api/requirements/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();
      setRequirements((prev) =>
        prev.map((item) => (item.id === req.id ? data.requirement : item)),
      );
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setRequirements((prev) =>
        prev.map((item) =>
          item.id === req.id ? { ...item, status: req.status } : item,
        ),
      );
    } finally {
      setTogglingId(null);
    }
  }

  function handleSaveSuccess(saved: SerializedRequirement) {
    setRequirements((prev) => {
      const exists = prev.some((r) => r.id === saved.id);
      if (exists) {
        return prev.map((r) => (r.id === saved.id ? saved : r));
      }
      return [saved, ...prev];
    });
  }

  function handleDeleteSuccess(deletedId: string) {
    setRequirements((prev) => prev.filter((r) => r.id !== deletedId));
  }

  function openCreateDialog(category?: RequirementCategory) {
    setEditingRequirement(null);
    setPrefilledCategory(category ?? null);
    setIsFormOpen(true);
  }

  function openEditDialog(req: SerializedRequirement) {
    setEditingRequirement(req);
    setPrefilledCategory(null);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6 text-foreground">
      {/* Top Tab Switcher */}
      {!hideTabs && (
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="inline-flex rounded-xl bg-[#09090B] p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewTab("requirements")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewTab === "requirements"
                  ? "bg-white/[0.08] text-white shadow-xs font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="size-3.5 text-zinc-300" />
              <span>Specifications</span>
              <span className="rounded-md bg-white/[0.06] px-1.5 py-0.2 text-[10px] font-mono text-zinc-300 border border-white/[0.08]">
                {totalCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab("clarifications")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewTab === "clarifications"
                  ? "bg-white/[0.08] text-white shadow-xs font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="size-3.5 text-zinc-300" />
              <span>AI Clarifications</span>
              <span className="rounded-md bg-white/[0.06] text-zinc-300 border border-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono">
                Agent
              </span>
            </button>
          </div>

          {viewTab === "requirements" && (
            <Button
              onClick={() => openCreateDialog()}
              className="rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-9 px-4 gap-1.5 transition shadow-xs"
            >
              <Plus className="size-3.5" />
              Add Requirement
            </Button>
          )}
        </div>
      )}

      {!hideTabs && viewTab === "clarifications" ? (
        <ClarificationsPanel
          projectId={projectId}
          projectName={projectName}
          projectDescription={projectDescription}
          onRequirementAdded={handleSaveSuccess}
        />
      ) : (
        <>
          {/* Top Header & Progress Metric (Only in modal/standalone view) */}
          {!hideTabs && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#121215] p-5 sm:p-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Requirements Specification
                  </span>
                  <span className="rounded-md bg-[#09090B] border border-white/[0.08] px-2 py-0.5 text-[11px] font-mono text-zinc-300">
                    {totalCount} Total
                  </span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {projectName}
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Categorized technical, non-functional, and business specifications.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress meter */}
                {totalCount > 0 && (
                  <div className="flex items-center gap-3 bg-[#09090B] border border-white/[0.08] rounded-xl px-3.5 py-2">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-white font-mono">
                        {percentConfirmed}% Confirmed
                      </span>
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        {confirmedCount} of {totalCount} specs
                      </span>
                    </div>
                    <div className="w-16 h-2 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentConfirmed}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => openCreateDialog()}
                  className="rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-10 px-4 gap-1.5 transition shadow-xs"
                >
                  <Plus className="size-4" />
                  Add Requirement
                </Button>
              </div>
            </div>
          )}

          {/* Filter and Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requirements, constraints, assumptions..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/[0.08] bg-[#09090B] text-xs text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-[#09090B] p-1 border border-white/[0.08] text-xs font-mono">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === "all"
                    ? "bg-white/[0.08] text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("confirmed")}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  statusFilter === "confirmed"
                    ? "bg-white/[0.08] text-emerald-400 shadow-xs font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="size-3 text-emerald-400" />
                Confirmed ({confirmedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  statusFilter === "draft"
                    ? "bg-white/[0.08] text-amber-400 shadow-xs font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <CircleDot className="size-3 text-amber-400" />
                Draft ({draftCount})
              </button>
            </div>
          </div>

          {/* Category Pills Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-lg border whitespace-nowrap transition font-mono ${
                selectedCategory === "all"
                  ? "border-white bg-white text-zinc-950 font-semibold"
                  : "border-white/[0.08] bg-[#09090B] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              All Categories
            </button>
            {REQUIREMENT_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const count = requirements.filter(
                (r) => r.category === cat,
              ).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border whitespace-nowrap transition font-mono ${
                    isSelected
                      ? "border-white bg-white/[0.08] text-white font-semibold"
                      : "border-white/[0.08] bg-[#09090B] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{cat}</span>
                  <span
                    className={`ml-0.5 rounded px-1.5 py-0.2 text-[10px] font-mono ${
                      isSelected
                        ? "bg-white/[0.15] text-white"
                        : "bg-white/[0.04] text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Requirements List Grouped by Category */}
          {groupedByCategory.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#121215] p-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#09090B] border border-white/[0.08] text-zinc-400 mb-3">
                <Layers className="size-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {totalCount === 0
                  ? "No requirements defined yet"
                  : "No matching requirements found"}
              </h3>
              <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                {totalCount === 0
                  ? "Add your first requirement to define functional scope, constraints, and architecture."
                  : "Try adjusting your search keywords or clear your active category/status filters."}
              </p>
              <div className="mt-5">
                {totalCount === 0 ? (
                  <Button
                    onClick={() => openCreateDialog()}
                    className="rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-9 px-4 gap-1.5 transition"
                  >
                    <Plus className="size-4" />
                    Add Your First Requirement
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setSelectedCategory("all");
                    }}
                    className="rounded-lg text-xs h-9 border-white/[0.08] bg-[#09090B] text-zinc-300 hover:text-white"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedByCategory.map(({ category, items }) => {
                const Icon = CATEGORY_ICONS[category];
                const details = CATEGORY_DETAILS[category];

                return (
                  <section
                    key={category}
                    className="rounded-2xl border border-white/[0.08] bg-[#121215] overflow-hidden shadow-xs"
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#09090B]/50">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#09090B] border border-white/[0.08] text-zinc-300">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">
                              {details.label}
                            </h3>
                            <span className="rounded bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono text-zinc-300">
                              {items.length}{" "}
                              {items.length === 1 ? "spec" : "specs"}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            {details.description}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCreateDialog(category)}
                        className="rounded-lg text-xs gap-1 text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                      >
                        <Plus className="size-3.5" />
                        <span className="hidden sm:inline">Add to</span>{" "}
                        {category}
                      </Button>
                    </div>

                    {/* Items in this Category */}
                    <div className="divide-y divide-white/[0.08]">
                      {items.map((req) => {
                        const isExpanded = expandedIds.has(req.id);
                        const isConfirmed = req.status === "confirmed";
                        const isToggling = togglingId === req.id;
                        const priorityConfig =
                          PRIORITY_BADGES[req.priority] ??
                          PRIORITY_BADGES.Medium;

                        const hasExtraDetails =
                          req.description || req.constraints || req.assumptions;

                        return (
                          <div
                            key={req.id}
                            className="group p-4 sm:px-5 hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              {/* Left: Status Toggle + Title + Badges */}
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                {/* Requirement Status Toggle Button */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(req)}
                                  disabled={isToggling}
                                  title={
                                    isConfirmed
                                      ? "Confirmed! Click to revert to draft"
                                      : "Draft! Click to confirm requirement"
                                  }
                                  className={`mt-0.5 shrink-0 flex items-center justify-center size-5 rounded-md border transition-all ${
                                    isConfirmed
                                      ? "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700 shadow-xs"
                                      : "bg-[#09090B] border-white/[0.15] text-transparent hover:border-emerald-500 hover:text-emerald-500"
                                  } ${isToggling ? "opacity-50 animate-pulse" : ""}`}
                                >
                                  <Check className="size-3 stroke-3" />
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4
                                      className={`text-sm font-semibold tracking-tight transition ${
                                        isConfirmed
                                          ? "text-white font-bold"
                                          : "text-zinc-300"
                                      }`}
                                    >
                                      {req.title}
                                    </h4>

                                    {/* Priority Badge */}
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${priorityConfig.class}`}
                                    >
                                      {req.priority}
                                    </span>

                                    {/* Status Badge */}
                                    <span
                                      onClick={() => handleToggleStatus(req)}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border cursor-pointer select-none transition ${
                                        isConfirmed
                                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                                      }`}
                                    >
                                      <span
                                        className={`size-1.5 rounded-full ${
                                          isConfirmed
                                            ? "bg-emerald-400"
                                            : "bg-amber-400"
                                        }`}
                                      />
                                      {isConfirmed ? "Confirmed" : "Draft"}
                                    </span>
                                  </div>

                                  {/* Preview Description */}
                                  {req.description && !isExpanded && (
                                    <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
                                      {req.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                {hasExtraDetails && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(req.id)}
                                    className="rounded-md p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white transition"
                                    title={isExpanded ? "Collapse" : "Expand details"}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="size-4" />
                                    ) : (
                                      <ChevronDown className="size-4" />
                                    )}
                                  </button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => openEditDialog(req)}
                                  className="rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                                  title="Edit Requirement"
                                >
                                  <Pencil className="size-3.5" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => setDeletingRequirement(req)}
                                  className="rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                                  title="Delete Requirement"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Expanded Details Drawer */}
                            {isExpanded && (
                              <div className="mt-3.5 pt-3.5 border-t border-white/[0.08] text-xs space-y-3 animate-in fade-in duration-150 pl-8">
                                {req.description && (
                                  <div>
                                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                      Specification Description
                                    </span>
                                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                      {req.description}
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  {req.constraints && (
                                    <div className="rounded-xl bg-[#09090B] border border-amber-500/20 p-3">
                                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
                                        <Shield className="size-3 text-amber-400" />
                                        Constraints
                                      </span>
                                      <p className="text-amber-300/90 font-medium font-mono text-[11px]">
                                        {req.constraints}
                                      </p>
                                    </div>
                                  )}

                                  {req.assumptions && (
                                    <div className="rounded-xl bg-[#09090B] border border-white/[0.08] p-3">
                                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1">
                                        <Lightbulb className="size-3 text-zinc-400" />
                                        Assumptions
                                      </span>
                                      <p className="text-zinc-300 font-medium font-mono text-[11px]">
                                        {req.assumptions}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Form Modal */}
      <RequirementFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRequirement(null);
          setPrefilledCategory(null);
        }}
        projectId={projectId}
        requirement={
          editingRequirement ??
          (prefilledCategory
            ? ({
                id: "",
                title: "",
                description: null,
                category: prefilledCategory,
                priority: "Medium",
                constraints: null,
                assumptions: null,
                status: "draft",
                projectId,
                createdAt: "",
                updatedAt: "",
              } as SerializedRequirement)
            : null)
        }
        onSuccess={handleSaveSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteRequirementDialog
        isOpen={!!deletingRequirement}
        onClose={() => setDeletingRequirement(null)}
        requirement={deletingRequirement}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
