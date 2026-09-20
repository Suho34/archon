"use client";

import Link from "next/link";
import {
  Calendar,
  Code2,
  Coins,
  Compass,
  Gauge,
  Layers,
  ListChecks,
  Pencil,
  ShieldAlert,
  Target,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SerializedProject } from "./project-types";

interface ProjectDetailsDialogProps {
  project: SerializedProject | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: SerializedProject) => void;
}

export function ProjectDetailsDialog({
  project,
  isOpen,
  onClose,
  onEdit,
}: ProjectDetailsDialogProps) {
  if (!isOpen || !project) return null;

  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 shadow-2xl shadow-black/90 overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                <Layers className="size-3 text-zinc-400" />
                {project.type || "General Project"}
              </span>
              {project.scale && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-white/[0.02] text-zinc-400 border border-white/[0.04]">
                  <Gauge className="size-3 text-zinc-500" />
                  {project.scale}
                </span>
              )}
            </div>
            <h2
              id="details-heading"
              className="text-2xl font-bold tracking-tight text-white"
            >
              {project.name}
            </h2>
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" /> Updated {formattedDate}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Description */}
          {project.description ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <Compass className="size-3.5 text-zinc-400" /> Overview
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No description provided.</p>
          )}

          {/* Goal & Target Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-white/[0.08] bg-[#09090B] p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <Target className="size-3.5 text-zinc-400" /> Primary Goal
              </h4>
              <p className="text-sm text-zinc-200 font-medium">
                {project.goal || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#09090B] p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <Users className="size-3.5 text-zinc-400" /> Target Users
              </h4>
              <p className="text-sm text-zinc-200 font-medium">
                {project.targetUsers || "—"}
              </p>
            </div>
          </div>

          {/* Constraints */}
          {project.constraints && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="size-3.5" /> Constraints & Guardrails
              </h4>
              <p className="text-sm text-amber-300/90 font-medium">
                {project.constraints}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
              <Code2 className="size-3.5 text-zinc-400" /> Technologies & Frameworks
            </h4>
            {project.tech && project.tech.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">No technologies specified</p>
            )}
          </div>

          {/* Budget & Scale */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
            <div>
              <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Coins className="size-3.5 text-zinc-400" /> Allocated Budget
              </span>
              <p className="mt-1 text-base font-semibold text-white font-mono">
                {project.budget || "Flexible / Not set"}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Gauge className="size-3.5 text-zinc-400" /> Project Scale
              </span>
              <p className="mt-1 text-base font-semibold text-white font-mono">
                {project.scale || "Not set"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="rounded-lg text-xs gap-1.5 h-10 px-4 border-white/[0.12] text-zinc-300 hover:text-white"
            >
              <Pencil className="size-3.5" /> Edit Project
            </Button>
            <Link
              href={`/projects/${project.id}`}
              onClick={onClose}
              className="inline-flex items-center rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold gap-1.5 h-10 px-4 transition shadow-xs"
            >
              <ListChecks className="size-3.5" /> Open Workspace
            </Link>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.06] h-10 px-5"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
