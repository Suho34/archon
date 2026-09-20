"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  Coins,
  ExternalLink,
  Layers,
  ListChecks,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SerializedProject } from "./project-types";

interface ProjectCardProps {
  project: SerializedProject;
  onView: (project: SerializedProject) => void;
  onEdit: (project: SerializedProject) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({
  project,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const displayedTech = (project.tech || []).slice(0, 3);
  const extraTechCount = (project.tech || []).length - displayedTech.length;

  return (
    <div
      data-testid="project-card"
      className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121215] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.20] hover:shadow-xl hover:shadow-black/40"
    >
      <div>
        {/* Card Header: Type Badge & Action Menu */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-300 border border-white/[0.1]">
              <Layers className="size-3 text-zinc-400" />
              {project.type || "Project"}
            </span>
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-400 hover:text-white hover:border-white/20 border border-white/[0.08] transition"
            >
              <ListChecks className="size-3 text-zinc-400" />
              Workspace
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Project actions"
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 z-30 rounded-lg border border-white/[0.12] bg-[#18181B] p-1.5 shadow-2xl shadow-black/80 text-xs font-mono font-medium">
                  <Link
                    href={`/projects/${project.id}`}
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition"
                  >
                    <ListChecks className="size-3.5 text-zinc-400" />
                    Open Workspace
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onView(project);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                  >
                    <ExternalLink className="size-3.5 text-zinc-400" />
                    Quick Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(project);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                  >
                    <Pencil className="size-3.5 text-zinc-400" />
                    Edit Project
                  </button>
                  <div className="my-1 border-t border-white/[0.08]" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setConfirmDelete(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Project Title & Description */}
        <div className="mt-4">
          <Link
            href={`/projects/${project.id}`}
            className="block text-base font-bold tracking-tight text-foreground hover:text-zinc-300 transition font-sans"
          >
            {project.name}
          </Link>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed min-h-[2.5rem] font-normal">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {displayedTech.map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-300 border border-white/[0.08]"
            >
              {tech}
            </span>
          ))}
          {extraTechCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-mono font-medium text-zinc-500">
              +{extraTechCount} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata & Date */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          {project.budget && (
            <span
              title="Budget"
              className="inline-flex items-center gap-1 text-zinc-300 font-medium"
            >
              <Coins className="size-3 text-emerald-400" />
              {project.budget}
            </span>
          )}
          {project.targetUsers && (
            <span
              title={project.targetUsers}
              className="inline-flex items-center gap-1 text-zinc-400 truncate max-w-[120px]"
            >
              <Users className="size-3 text-zinc-400 shrink-0" />
              <span className="truncate">{project.targetUsers}</span>
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1 shrink-0 text-zinc-500">
          <Calendar className="size-3" />
          {formattedDate}
        </span>
      </div>

      {/* Delete Confirmation Overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 z-30 rounded-xl bg-[#121215]/95 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-150 border border-rose-500/20">
          <div className="rounded-full bg-rose-500/10 p-2.5 text-rose-400 mb-2">
            <Trash2 className="size-5" />
          </div>
          <h4 className="text-sm font-bold text-foreground font-sans">
            Delete {project.name}?
          </h4>
          <p className="mt-1 text-xs text-zinc-400 max-w-[200px] font-mono">
            This action cannot be undone. All project specs will be deleted.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(false)}
              className="rounded-md text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setConfirmDelete(false);
                onDelete(project.id);
              }}
              className="rounded-md text-xs font-mono font-semibold"
            >
              Delete Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
