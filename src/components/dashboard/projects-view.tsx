"use client";

import { useMemo, useState } from "react";
import {
  Code2,
  FolderGit2,
  Layers,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { CreateProjectDialog } from "./create-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";
import { ProjectCard } from "./project-card";
import { ProjectDetailsDialog } from "./project-details-dialog";
import { SerializedProject } from "./project-types";

interface ProjectsViewProps {
  initialProjects: SerializedProject[];
}

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [projects, setProjects] = useState<SerializedProject[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SerializedProject | null>(
    null,
  );
  const [viewingProject, setViewingProject] = useState<SerializedProject | null>(
    null,
  );

  const projectTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach((p) => {
      if (p.type) types.add(p.type);
    });
    return ["All", ...Array.from(types)];
  }, [projects]);

  const uniqueTechCount = useMemo(
    () =>
      new Set(
        projects.flatMap((p) => p.tech ?? []).map((t) => t.toLowerCase()),
      ).size,
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesType =
        selectedType === "All" || project.type === selectedType;

      if (!matchesType) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchName = project.name.toLowerCase().includes(q);
      const matchDesc = project.description?.toLowerCase().includes(q) ?? false;
      const matchGoal = project.goal?.toLowerCase().includes(q) ?? false;
      const matchTech = project.tech?.some((t) => t.toLowerCase().includes(q)) ?? false;

      return matchName || matchDesc || matchGoal || matchTech;
    });
  }, [projects, searchQuery, selectedType]);

  function handleProjectCreated(newProject: SerializedProject) {
    setProjects((prev) => [newProject, ...prev]);
  }

  function handleProjectUpdated(updatedProject: SerializedProject) {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    );
    if (viewingProject?.id === updatedProject.id) {
      setViewingProject(updatedProject);
    }
  }

  async function handleDeleteProject(id: string) {
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setProjects(previous);
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5 shadow-xs flex items-center justify-between transition hover:border-white/[0.16]">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Total Projects
            </p>
            <p className="mt-1 text-3xl font-bold font-mono tracking-tight text-foreground">
              {projects.length}
            </p>
          </div>
          <div className="rounded-lg bg-[#09090B] p-2.5 text-zinc-300 border border-white/[0.08]">
            <FolderGit2 className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5 shadow-xs flex items-center justify-between transition hover:border-white/[0.16]">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Active Technologies
            </p>
            <p className="mt-1 text-3xl font-bold font-mono tracking-tight text-foreground">
              {uniqueTechCount}
            </p>
          </div>
          <div className="rounded-lg bg-[#09090B] p-2.5 text-zinc-300 border border-white/[0.08]">
            <Code2 className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-5 shadow-xs flex items-center justify-between transition hover:border-white/[0.16]">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Project Types
            </p>
            <p className="mt-1 text-3xl font-bold font-mono tracking-tight text-foreground">
              {Math.max(0, projectTypes.length - 1)}
            </p>
          </div>
          <div className="rounded-lg bg-[#09090B] p-2.5 text-zinc-300 border border-white/[0.08]">
            <Layers className="size-5" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, technologies, or goals..."
            className="w-full h-10 pl-10 pr-9 rounded-md border border-white/[0.12] bg-[#09090B] text-sm text-foreground placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-md bg-white text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-xs cursor-pointer font-sans"
        >
          <Plus className="size-4" />
          New Project
        </button>
      </div>

      {/* Filter Chips */}
      {projectTypes.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider mr-1">
            Filter:
          </span>
          {projectTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition shrink-0 cursor-pointer ${
                selectedType === type
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "bg-[#121215] text-zinc-400 border border-white/[0.08] hover:border-white/[0.18] hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div
          data-testid="projects-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={(p) => setViewingProject(p)}
              onEdit={(p) => setEditingProject(p)}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-white/[0.08] bg-[#121215]/50 p-12 text-center">
          <div className="mx-auto size-14 rounded-xl bg-[#09090B] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-xs mb-4">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground font-sans">
            No projects created yet
          </h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Get started by defining your first project specification — architecture,
            goals, tech stack, and budget.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-5 h-10 rounded-md bg-white text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-xs cursor-pointer font-sans"
          >
            <Plus className="size-4" />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-12 text-center">
          <p className="text-sm font-semibold text-zinc-300">
            No projects match &quot;{searchQuery}&quot;
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try adjusting your search terms or filter selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("All");
            }}
            className="mt-4 px-3 py-1.5 rounded-md border border-white/[0.12] text-xs font-mono text-zinc-300 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Dialogs */}
      <CreateProjectDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <EditProjectDialog
        project={editingProject}
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onProjectUpdated={handleProjectUpdated}
      />

      <ProjectDetailsDialog
        project={viewingProject}
        isOpen={Boolean(viewingProject)}
        onClose={() => setViewingProject(null)}
        onEdit={(p) => {
          setViewingProject(null);
          setEditingProject(p);
        }}
      />
    </div>
  );
}
