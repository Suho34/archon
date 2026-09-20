"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import { SerializedProject } from "./project-types";

const TYPE_PRESETS = [
  "Web App",
  "SaaS",
  "Mobile App",
  "API Service",
  "AI & ML",
  "CLI Tool",
  "Full Stack",
];

const SCALE_PRESETS = ["MVP / Prototype", "Early Stage", "Growth", "Enterprise"];

interface EditProjectDialogProps {
  project: SerializedProject | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: (project: SerializedProject) => void;
}

export function EditProjectDialog({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Web App");
  const [description, setDescription] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [techInput, setTechInput] = useState("");
  const [scale, setScale] = useState("MVP / Prototype");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setType(project.type || "Web App");
      setDescription(project.description || "");
      setTargetUsers(project.targetUsers || "");
      setGoal(project.goal || "");
      setConstraints(project.constraints || "");
      setTechInput((project.tech || []).join(", "));
      setScale(project.scale || "MVP / Prototype");
      setBudget(project.budget || "");
      setError(null);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const techTags = techInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${project?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type: type.trim() || null,
          description: description.trim() || null,
          targetUsers: targetUsers.trim() || null,
          goal: goal.trim() || null,
          constraints: constraints.trim() || null,
          tech: techTags,
          scale: scale.trim() || null,
          budget: budget.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update project");
      }

      onProjectUpdated({
        ...data.project,
        createdAt: new Date(data.project.createdAt).toISOString(),
        updatedAt: new Date(data.project.updatedAt).toISOString(),
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={() => !isPending && onClose()}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#121215] p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-300 border border-white/[0.1] mb-2">
              <Pencil className="size-3 text-zinc-400" />
              Edit Specification
            </div>
            <h2
              id="edit-project-heading"
              className="text-2xl font-bold tracking-tight text-foreground font-sans"
            >
              Edit {project.name}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Update project goals, tech stack, constraints, or metadata.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-rose-500/10 border border-rose-500/25 p-3 text-xs font-mono text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Project Name <span className="text-zinc-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              >
                {TYPE_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
              Description
            </label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[70px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Target Users
              </label>
              <input
                type="text"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Primary Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
              Constraints & Guidelines
            </label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
              Tech Stack{" "}
              <span className="text-zinc-500 font-normal lowercase">
                (separated by commas)
              </span>
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
            />
            {techTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {techTags.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-[#09090B] text-zinc-300 border border-white/[0.08]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Scale
              </label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              >
                {SCALE_PRESETS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 h-10 rounded-md border border-white/[0.12] text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md bg-white text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-60 cursor-pointer shadow-xs font-sans"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
