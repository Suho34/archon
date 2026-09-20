"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  Plus,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
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

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: SerializedProject) => void;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("Web App");
  const [description, setDescription] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [techInput, setTechInput] = useState("");
  const [scale, setScale] = useState("MVP / Prototype");
  const [budget, setBudget] = useState("");

  // Voice Studio State
  const [isScaffolding, setIsScaffolding] = useState(false);
  const [voiceSuccessMessage, setVoiceSuccessMessage] = useState<string | null>(null);
  const [voiceVisionText, setVoiceVisionText] = useState("");

  const {
    isListening,
    transcript: voiceTranscript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isVoiceSupported,
  } = useSpeechToText({
    continuous: true,
    interimResults: true,
    onTranscriptChange: (latestTranscript) => {
      setVoiceVisionText(latestTranscript);
    },
  });

  // Calculate the active speech content displayed in the textarea
  const activeVisionContent =
    isListening && interimTranscript
      ? (voiceVisionText ? `${voiceVisionText} ${interimTranscript}` : interimTranscript)
      : voiceVisionText;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const techTags = techInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  function resetForm() {
    setName("");
    setType("Web App");
    setDescription("");
    setTargetUsers("");
    setGoal("");
    setConstraints("");
    setTechInput("");
    setScale("MVP / Prototype");
    setBudget("");
    setError(null);
    setVoiceSuccessMessage(null);
    setVoiceVisionText("");
    resetTranscript();
  }

  function toggleListening() {
    if (!isVoiceSupported) {
      setError(
        "Speech recognition is not natively supported in this browser. Please use Chrome, Edge, or Brave, or type your concept directly into the text area below."
      );
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      setError(null);
      startListening();
    }
  }

  function handleClearVoiceVision() {
    setVoiceVisionText("");
    resetTranscript();
  }

  async function handleVoiceScaffold() {
    const fullSpeech = (activeVisionContent || voiceTranscript || "").trim();
    if (!fullSpeech) {
      setError("Please speak or type your project vision first before auto-filling.");
      return;
    }

    if (isListening) {
      stopListening();
    }

    setIsScaffolding(true);
    setError(null);
    setVoiceSuccessMessage(null);

    try {
      const res = await fetch("/api/projects/voice-scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: fullSpeech }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse voice transcript.");
      }

      const { scaffold } = data;
      if (scaffold) {
        if (scaffold.name) setName(scaffold.name);
        if (scaffold.type && TYPE_PRESETS.includes(scaffold.type)) setType(scaffold.type);
        if (scaffold.description) setDescription(scaffold.description);
        if (scaffold.targetUsers) setTargetUsers(scaffold.targetUsers);
        if (scaffold.goal) setGoal(scaffold.goal);
        if (scaffold.constraints) setConstraints(scaffold.constraints);
        if (Array.isArray(scaffold.tech) && scaffold.tech.length > 0) {
          setTechInput(scaffold.tech.join(", "));
        }
        if (scaffold.scale && SCALE_PRESETS.includes(scaffold.scale)) setScale(scaffold.scale);
        if (scaffold.budget) setBudget(scaffold.budget);

        setVoiceSuccessMessage(`Project "${scaffold.name}" distilled from your vision!`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to scaffold from voice.");
    } finally {
      setIsScaffolding(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create project");
      }

      onProjectCreated({
        ...data.project,
        createdAt: new Date(data.project.createdAt).toISOString(),
        updatedAt: new Date(data.project.updatedAt).toISOString(),
      });
      resetForm();
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
      aria-labelledby="create-project-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={() => !isPending && onClose()}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div
        ref={scrollRef}
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-white/[0.12] bg-[#121215] p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#09090B] text-zinc-300 border border-white/[0.1] mb-2">
              <Sparkles className="size-3 text-zinc-400" />
              New Workspace
            </div>
            <h2
              id="create-project-heading"
              className="text-2xl font-bold tracking-tight text-foreground font-sans"
            >
              Create New Project
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Define the architecture, target users, and constraints for your project.
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

        {/* Archon Voice Studio: Brain Dump Scaffolder */}
        <div className="mt-6 rounded-2xl border border-white/[0.12] bg-[#09090B] p-5 sm:p-7 relative overflow-hidden shadow-xl shadow-black/40 shrink-0">
          {/* Ambient Radial Accent */}
          <div
            className="absolute -top-16 -right-16 size-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="size-6 rounded-md bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-zinc-200">
                  <Mic className="size-3.5 text-zinc-300" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Archon Voice Studio
                </span>
                <span className="rounded bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                  Voice Brain Dump
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white font-sans">
                Speak Your Vision
              </h3>
              <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed max-w-lg">
                Speak freely for 30–60 seconds about your project, target audience, and architecture. Archon AI will distill it into a complete project blueprint.
              </p>
            </div>

            {/* Primary Speak Your Vision Action Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={isScaffolding}
              className={`inline-flex items-center justify-center gap-2.5 h-11 px-5 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all duration-200 shrink-0 cursor-pointer select-none ${
                isListening
                  ? "bg-zinc-900 border border-emerald-500/70 text-emerald-300 ring-2 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.16] text-white hover:border-white/[0.24] shadow-sm hover:shadow-md"
              }`}
            >
              {isListening ? (
                <>
                  <div className="flex items-center gap-1" aria-hidden="true">
                    <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
                    <span className="w-1 h-5 bg-emerald-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
                  </div>
                  <span>Stop Dictation</span>
                  <MicOff className="size-3.5 text-emerald-400 ml-0.5" />
                </>
              ) : (
                <>
                  <Mic className="size-4 text-zinc-300" />
                  <span>Speak Your Vision</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Speech & Vision Text Area Workbench */}
          <div className="mt-4 rounded-xl border border-white/[0.1] bg-[#121215] p-4 flex flex-col gap-3">
            {/* Top status bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider font-semibold text-zinc-300">
                  {isListening ? "Listening Live..." : "Vision Prompt & Speech Canvas"}
                </span>
                {isListening && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Recording
                  </span>
                )}
              </div>
              <span className="text-zinc-500 text-[10px]">
                {activeVisionContent.trim()
                  ? `${activeVisionContent.trim().split(/\s+/).length} words`
                  : "Speak or type below"}
              </span>
            </div>

            {/* The Dedicated Textarea from shadcn/ui */}
            <div className="relative">
              <Textarea
                rows={5}
                value={activeVisionContent}
                onChange={(e) => setVoiceVisionText(e.target.value)}
                placeholder="Click 'Speak Your Vision' and describe your project, or type your concept here... E.g. 'Build a high-throughput event ingestion API with Go, Kafka, and ClickHouse for 50k req/sec with strict 99.99% uptime...'"
                className="min-h-[140px] sm:min-h-[160px]"
              />

              {/* Live sound wave overlay badge while listening */}
              {isListening && (
                <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono shadow-xs backdrop-blur-xs">
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-4 bg-emerald-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                    <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
                  </div>
                  <span>Mic Active</span>
                </div>
              )}
            </div>

            {/* Bottom action controls */}
            <div className="flex items-center justify-between pt-1">
              <div>
                {activeVisionContent.trim() && (
                  <button
                    type="button"
                    onClick={handleClearVoiceVision}
                    disabled={isScaffolding}
                    className="text-xs font-mono text-zinc-400 hover:text-white transition cursor-pointer px-2.5 py-1 rounded-md hover:bg-white/[0.06]"
                  >
                    Clear Text
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVoiceScaffold}
                disabled={isScaffolding || !activeVisionContent.trim()}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs sm:text-sm font-semibold font-sans transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isScaffolding ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-zinc-950" />
                    <span>Distilling Architecture with AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4 text-zinc-950" />
                    <span>Auto-Fill Form with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {voiceSuccessMessage && (
            <div className="mt-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-xs">{voiceSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Minimalist Divider */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative bg-[#121215] px-3.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Or Configure Project Manually
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
                  Project Name <span className="text-zinc-400">*</span>
                </label>
                <VoiceInputButton
                  size="sm"
                  onTranscript={(t) => setName((prev) => (prev ? `${prev} ${t}` : t))}
                />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NextGen Analytics"
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
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

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
                Description
              </label>
              <VoiceInputButton
                size="sm"
                onTranscript={(t) => setDescription((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the problem this project solves..."
              className="min-h-[70px] resize-none"
            />
          </div>

          {/* Target Users & Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
                  Target Users
                </label>
                <VoiceInputButton
                  size="sm"
                  onTranscript={(t) => setTargetUsers((prev) => (prev ? `${prev} ${t}` : t))}
                />
              </div>
              <input
                type="text"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                placeholder="e.g. Independent creators, engineering teams"
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
                  Primary Goal
                </label>
                <VoiceInputButton
                  size="sm"
                  onTranscript={(t) => setGoal((prev) => (prev ? `${prev} ${t}` : t))}
                />
              </div>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. 10x developer productivity"
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
                Constraints & Guidelines
              </label>
              <VoiceInputButton
                size="sm"
                onTranscript={(t) => setConstraints((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. Serverless only, 99.9% uptime, strict privacy"
              className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
                Tech Stack{" "}
                <span className="text-zinc-500 font-normal lowercase">
                  (separated by commas)
                </span>
              </label>
              <VoiceInputButton
                size="sm"
                onTranscript={(t) => setTechInput((prev) => (prev ? `${prev}, ${t}` : t))}
              />
            </div>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="e.g. Next.js, TypeScript, PostgreSQL, Tailwind"
              className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
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

          {/* Scale & Budget */}
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
                placeholder="e.g. $5,000 or $10k - $20k"
                className="w-full h-10 px-3.5 rounded-md border border-white/[0.12] bg-[#09090B] text-foreground text-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/40 outline-hidden transition font-sans"
              />
            </div>
          </div>

          {/* Actions */}
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
                  Creating Project...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
