"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClarificationStatus } from "@/lib/clarifications";
import { SerializedRequirement } from "@/components/requirements/requirement-types";
import { ClarificationCard } from "./clarification-card";
import { SerializedClarification } from "./clarification-types";

interface ClarificationsPanelProps {
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
  onRequirementAdded?: (requirement: SerializedRequirement) => void;
}

export function ClarificationsPanel({
  projectId,
  projectName,
  projectDescription,
  onRequirementAdded,
}: ClarificationsPanelProps) {
  const [clarifications, setClarifications] = useState<SerializedClarification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | ClarificationStatus>("all");
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);

  const isSparseDescription =
    !projectDescription || projectDescription.trim().length < 25;

  // Countdown timer for rate limiting
  useEffect(() => {
    if (rateLimitSeconds === null || rateLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      setRateLimitSeconds((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitSeconds]);

  // Load existing clarifications on mount
  useEffect(() => {
    let isMounted = true;
    async function loadClarifications() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}/clarifications`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load clarifications");
        }
        if (isMounted) {
          setClarifications(data.clarifications ?? []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error loading clarifications");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadClarifications();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  async function handleTriggerClarify() {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/clarify`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
        setRateLimitSeconds(seconds);
        throw new Error(data.error ?? "Rate limit reached. Please wait before running again.");
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate clarifications");
      }

      setSummary(data.summary);
      // Prepend newly generated clarifications
      const newItems: SerializedClarification[] = data.clarifications ?? [];
      setClarifications((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const filteredNew = newItems.filter((c) => !existingIds.has(c.id));
        return [...filteredNew, ...prev];
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleAnswerSaved(updated: SerializedClarification) {
    setClarifications((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }

  function handleConverted(
    clarificationId: string,
    result: { target: "requirement" | "constraint"; requirement?: SerializedRequirement },
  ) {
    setClarifications((prev) =>
      prev.map((c) =>
        c.id === clarificationId
          ? {
              ...c,
              status: "converted",
              convertedReqId: result.requirement?.id ?? null,
            }
          : c,
      ),
    );

    if (result.requirement && onRequirementAdded) {
      onRequirementAdded(result.requirement);
    }
  }

  function handleDeleted(id: string) {
    setClarifications((prev) => prev.filter((c) => c.id !== id));
  }

  // Filtered list
  const filteredClarifications = useMemo(() => {
    if (statusFilter === "all") return clarifications;
    return clarifications.filter((c) => c.status === statusFilter);
  }, [clarifications, statusFilter]);

  const totalCount = clarifications.length;
  const pendingCount = clarifications.filter((c) => c.status === "pending").length;
  const answeredCount = clarifications.filter((c) => c.status === "answered").length;
  const convertedCount = clarifications.filter((c) => c.status === "converted").length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Callout */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-5 shadow-xs flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-zinc-300" />
              Architectural Engine
            </span>
            <span className="whitespace-nowrap rounded-full bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-300">
              Gemma & Gemini Dual-Tier
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Resolve Ambiguities{projectName ? ` · ${projectName}` : ""}
          </h2>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            Detect hidden assumptions, missing non-functional specs, and technical trade-offs. Answer questions inline and convert decisions directly into confirmed requirements.
          </p>
        </div>

        <div className="flex items-center justify-start">
          <Button
            onClick={handleTriggerClarify}
            disabled={isGenerating || (rateLimitSeconds !== null && rateLimitSeconds > 0)}
            className="rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-10 px-5 gap-2 transition shadow-xs w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing Architecture...
              </>
            ) : rateLimitSeconds !== null && rateLimitSeconds > 0 ? (
              <>
                <Clock className="size-4" />
                Wait {rateLimitSeconds}s
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                {totalCount === 0 ? "Discover Ambiguities" : "Clarify Again"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sparse / Empty Project Description Banner */}
      {isSparseDescription && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 flex items-start gap-3">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-amber-400 shrink-0 mt-0.5">
            <Lightbulb className="size-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-amber-300">
              Foundational Discovery Mode
            </h4>
            <p className="mt-0.5 text-amber-200/80 leading-relaxed">
              Your project description is brief or empty. Archon AI will guide you through foundational discovery questions to help define your MVP scope, authentication method, database strategy, and primary user workflow.
            </p>
          </div>
        </div>
      )}

      {/* Rate Limit Warning */}
      {rateLimitSeconds !== null && rateLimitSeconds > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex items-center justify-between text-xs text-zinc-300 font-mono">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-zinc-400 shrink-0" />
            <span>
              Rate limit active (10 requests/min). You can make your next AI clarification call in{" "}
              <strong className="font-bold text-white">{rateLimitSeconds} seconds</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertCircle className="size-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Summary Banner */}
      {summary && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-4 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-zinc-300" />
            Architect Summary
          </span>
          <p className="text-zinc-300 font-medium leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Filter Tabs & Metrics */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded-xl text-xs border border-white/[0.08] font-mono">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === "all"
                  ? "bg-white/[0.08] text-white font-bold shadow-xs border border-white/[0.1]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                statusFilter === "pending"
                  ? "bg-white/[0.08] text-amber-300 font-bold shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="size-2 rounded-full bg-amber-400" />
              Needs Answer ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("answered")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                statusFilter === "answered"
                  ? "bg-white/[0.08] text-zinc-200 font-bold shadow-xs border border-white/[0.15]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="size-2 rounded-full bg-zinc-300" />
              Answered ({answeredCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("converted")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                statusFilter === "converted"
                  ? "bg-white/[0.08] text-emerald-400 font-bold shadow-xs border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="size-3 text-emerald-400" />
              Converted ({convertedCount})
            </button>
          </div>
        </div>
      )}

      {/* Clarification Cards List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="size-8 animate-spin text-zinc-400 mb-2" />
          <p className="text-xs text-zinc-500 font-mono">Loading clarification questions...</p>
        </div>
      ) : filteredClarifications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-white/[0.08] bg-[#121215]/50 p-12 text-center">
          <div className="mx-auto size-12 rounded-2xl bg-white/[0.04] text-zinc-300 border border-white/[0.08] flex items-center justify-center mb-3">
            <HelpCircle className="size-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            {totalCount === 0
              ? "No clarification questions generated yet"
              : "No questions match the selected filter"}
          </h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {totalCount === 0
              ? "Click 'Discover Ambiguities' to let Archon AI analyze your project and flag architectural gaps."
              : "Try switching to another tab or click Discover Ambiguities to generate more."}
          </p>
          {totalCount === 0 && (
            <div className="mt-5">
              <Button
                onClick={handleTriggerClarify}
                disabled={isGenerating}
                className="rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold gap-1.5 h-9 px-4 shadow-sm"
              >
                <Sparkles className="size-4" />
                Discover Ambiguities
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClarifications.map((item) => (
            <ClarificationCard
              key={item.id}
              clarification={item}
              onAnswerSaved={handleAnswerSaved}
              onConverted={handleConverted}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
