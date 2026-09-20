"use client";

import { useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  Check,
  CheckCircle2,
  Database,
  HelpCircle,
  Layers,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Send,
  Server,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { RequirementCategory } from "@/lib/requirement-types";
import { SerializedRequirement } from "@/components/requirements/requirement-types";
import { SerializedClarification } from "./clarification-types";

interface ClarificationCardProps {
  clarification: SerializedClarification;
  onAnswerSaved: (updated: SerializedClarification) => void;
  onConverted: (
    clarificationId: string,
    result: {
      target: "requirement" | "constraint";
      requirement?: SerializedRequirement;
    },
  ) => void;
  onDeleted: (clarificationId: string) => void;
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

export function ClarificationCard({
  clarification,
  onAnswerSaved,
  onConverted,
  onDeleted,
}: ClarificationCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState(clarification.answer || "");
  const [isEditingAnswer, setIsEditingAnswer] = useState(
    !clarification.answer || clarification.status === "pending",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState<
    "requirement" | "constraint" | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConverted = clarification.status === "converted";
  const isAnswered = clarification.status === "answered" || isConverted;
  const CategoryIcon = clarification.category
    ? (CATEGORY_ICONS[clarification.category] ?? HelpCircle)
    : HelpCircle;

  function handleSelectOption(option: string) {
    setSelectedOption(option);
    setCustomAnswer(option);
    setError(null);
  }

  async function handleSaveAnswer(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!customAnswer.trim()) {
      setError("Please select an option or provide an answer");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/clarifications/${clarification.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: customAnswer.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save answer");
      }

      onAnswerSaved(data.clarification);
      setIsEditingAnswer(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save answer");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConvert(target: "requirement" | "constraint") {
    setIsConverting(target);
    setError(null);

    try {
      const res = await fetch(
        `/api/clarifications/${clarification.id}/convert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target,
            category: clarification.category || "Functional",
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to convert clarification");
      }

      onConverted(clarification.id, {
        target,
        requirement: data.requirement,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to convert");
    } finally {
      setIsConverting(null);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/clarifications/${clarification.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete clarification");
      }

      onDeleted(clarification.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setIsDeleting(false);
    }
  }

  return (
    <div
      data-testid="clarification-card"
      className={`group rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
        isConverted
          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
          : isAnswered
            ? "border-white/[0.08] bg-[#121215]"
            : "border-white/[0.12] bg-[#121215] hover:border-white/[0.2]"
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {clarification.category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#09090B] text-zinc-300 border border-white/[0.08]">
              <CategoryIcon className="size-3 text-zinc-400" />
              {clarification.category}
            </span>
          )}

          {clarification.ambiguity && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <ShieldAlert className="size-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-xs">
                {clarification.ambiguity}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isConverted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="size-3 text-emerald-400" />
              Converted
            </span>
          ) : isAnswered ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/[0.08] text-zinc-200 border border-white/[0.12]">
              <Check className="size-3 text-zinc-300" />
              Answered
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="size-3 text-amber-400" />
              Needs Answer
            </span>
          )}

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
            title="Dismiss question"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* The Question */}
      <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
        {clarification.question}
      </h3>

      {/* Suggested Options Pills */}
      {!isConverted &&
        clarification.options &&
        clarification.options.length > 0 && (
          <div className="mt-3.5">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Suggested Options (Click to select)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {clarification.options.map((option, idx) => {
                const isSelected =
                  selectedOption === option || customAnswer === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    data-testid="option-button"
                    onClick={() => handleSelectOption(option)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium text-left transition ${
                      isSelected
                        ? "bg-white text-zinc-950 border-white font-semibold shadow-xs"
                        : "bg-[#09090B] border-white/[0.08] text-zinc-300 hover:bg-white/[0.04] hover:border-white/[0.15] hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* Error message */}
      {error && (
        <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="size-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Answer Area */}
      {isAnswered && !isEditingAnswer ? (
        /* Display Saved Answer */
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#09090B] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Your Answer / Decision
              </span>
              <p className="text-sm font-semibold text-white whitespace-pre-wrap">
                {clarification.answer}
              </p>
            </div>
            {!isConverted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingAnswer(true)}
                className="text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] gap-1 rounded-lg h-8"
              >
                <Pencil className="size-3" />
                Edit
              </Button>
            )}
          </div>

          {/* Action Row for Answered questions (Convert buttons) */}
          {!isConverted && (
            <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex flex-wrap items-center gap-2.5">
              <span className="text-xs text-zinc-400 font-mono">
                Apply this decision:
              </span>
              <Button
                size="sm"
                onClick={() => handleConvert("requirement")}
                disabled={Boolean(isConverting)}
                className="rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold gap-1.5 h-8 shadow-xs"
              >
                {isConverting === "requirement" ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Plus className="size-3" />
                    Convert to Requirement
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConvert("constraint")}
                disabled={Boolean(isConverting)}
                className="rounded-xl border-white/[0.12] bg-[#121215] text-xs font-semibold text-zinc-200 hover:bg-white/[0.06] hover:text-white gap-1.5 h-8"
              >
                {isConverting === "constraint" ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Shield className="size-3 text-zinc-300" />
                    Add to Project Constraints
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Answer Input Form */
        <form onSubmit={handleSaveAnswer} className="mt-4 space-y-3">
          <div className="relative">
            <Textarea
              rows={2}
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder="Select an option above or speak/type your architectural decision..."
              className="pr-11 text-xs min-h-[60px] resize-none"
            />
            <div className="absolute right-2 top-2.5">
              <VoiceInputButton
                size="sm"
                onTranscript={(text) => {
                  setCustomAnswer((prev) => (prev ? `${prev} ${text}` : text));
                  setError(null);
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            {clarification.answer && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingAnswer(false)}
                className="rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] h-8"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !customAnswer.trim()}
              className="rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold gap-1.5 h-8 shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="size-3" />
                  Save Answer
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
