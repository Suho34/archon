"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  Check,
  Database,
  Layers,
  Loader2,
  Lock,
  Plus,
  Save,
  Server,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  REQUIREMENT_CATEGORIES,
  REQUIREMENT_PRIORITIES,
  RequirementCategory,
  RequirementPriority,
  RequirementStatus,
} from "@/lib/requirement-types";
import { SerializedRequirement } from "./requirement-types";

interface RequirementFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  requirement?: SerializedRequirement | null;
  onSuccess: (requirement: SerializedRequirement) => void;
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

export function RequirementFormDialog({
  isOpen,
  onClose,
  projectId,
  requirement,
  onSuccess,
}: RequirementFormDialogProps) {
  const isEditing = !!requirement;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RequirementCategory>("Functional");
  const [priority, setPriority] = useState<RequirementPriority>("Medium");
  const [status, setStatus] = useState<RequirementStatus>("draft");
  const [constraints, setConstraints] = useState("");
  const [assumptions, setAssumptions] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (requirement) {
      setTitle(requirement.title);
      setDescription(requirement.description ?? "");
      setCategory(requirement.category);
      setPriority(requirement.priority);
      setStatus(requirement.status);
      setConstraints(requirement.constraints ?? "");
      setAssumptions(requirement.assumptions ?? "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Functional");
      setPriority("Medium");
      setStatus("draft");
      setConstraints("");
      setAssumptions("");
    }
    setError(null);
  }, [requirement, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a requirement title");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        category,
        priority,
        status,
        constraints: constraints.trim() ? constraints.trim() : null,
        assumptions: assumptions.trim() ? assumptions.trim() : null,
      };

      const url = isEditing
        ? `/api/requirements/${requirement.id}`
        : `/api/projects/${projectId}/requirements`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save requirement");
      }

      onSuccess(data.requirement);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-[#121215] border border-white/[0.08]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditing ? "Edit Requirement" : "Add New Requirement"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {isEditing
                ? "Update the details, category, or status of this specification."
                : "Specify clear architectural and functional requirements for this project."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Requirement Title <span className="text-zinc-200">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rate-limit public API endpoints to 100 req/min"
              className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#09090B] text-white placeholder:text-zinc-500 text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REQUIREMENT_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                      isSelected
                        ? "border-white bg-white/[0.08] text-white shadow-xs font-semibold"
                        : "border-white/[0.08] bg-[#09090B] text-zinc-400 hover:bg-white/[0.04] hover:border-white/[0.15] hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`size-3.5 shrink-0 ${
                        isSelected ? "text-white" : "text-zinc-500"
                      }`}
                    />
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#09090B] p-1 border border-white/[0.08]">
                {REQUIREMENT_PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition text-center font-mono ${
                      priority === p
                        ? "bg-white text-zinc-950 shadow-xs font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#09090B] p-1 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 font-mono ${
                    status === "draft"
                      ? "bg-white/[0.08] text-amber-300 border border-amber-500/30 shadow-xs font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="size-2 rounded-full bg-amber-400" />
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("confirmed")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 font-mono ${
                    status === "confirmed"
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Check className="size-3" />
                  Confirmed
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Description & Details
            </label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Elaborate on the requirement, acceptance criteria, or behavior..."
              className="min-h-[85px] resize-none"
            />
          </div>

          {/* Constraints & Assumptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Constraints
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Max 50ms latency, PII encrypted"
                className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#09090B] text-white placeholder:text-zinc-500 text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Assumptions
              </label>
              <input
                type="text"
                value={assumptions}
                onChange={(e) => setAssumptions(e.target.value)}
                placeholder="e.g. Users operate modern evergreen browsers"
                className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#09090B] text-white placeholder:text-zinc-500 text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border-white/[0.08] bg-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold transition gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Requirement
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
