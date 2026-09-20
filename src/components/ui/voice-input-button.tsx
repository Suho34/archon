"use client";

import { useEffect } from "react";
import { AlertCircle, Mic, MicOff } from "lucide-react";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";

export interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "icon" | "pill";
  label?: string;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscript,
  className,
  size = "default",
  variant = "icon",
  label = "Voice",
  disabled = false,
}: VoiceInputButtonProps) {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({
    continuous: true,
    interimResults: true,
    onTranscriptChange: (newText) => {
      if (newText) {
        onTranscript(newText);
      }
    },
  });

  // Clear accumulated transcript on new recording start
  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const isSmall = size === "sm";
  const isLarge = size === "lg";

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || !isSupported}
        title={
          !isSupported
            ? "Voice dictation is supported in Chrome, Edge, and Brave"
            : isListening
              ? "Click to stop listening"
              : "Click to speak with voice"
        }
        className={cn(
          "relative inline-flex items-center justify-center transition-all duration-200 outline-none select-none",
          // Styling
          isListening
            ? "bg-zinc-900 border border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/40"
            : "bg-[#09090B] border border-white/[0.12] text-zinc-400 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.04]",
          disabled || !isSupported ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          // Variant: icon vs pill
          variant === "icon"
            ? isSmall
              ? "size-7 rounded-lg"
              : isLarge
                ? "size-10 rounded-xl"
                : "size-8 rounded-lg"
            : isSmall
              ? "h-7 px-2.5 rounded-lg text-xs gap-1.5"
              : isLarge
                ? "h-10 px-4 rounded-xl text-sm gap-2"
                : "h-8 px-3 rounded-lg text-xs gap-2",
          className,
        )}
      >
        {isListening ? (
          <>
            {/* Active Soundwave Animation (3 bars) */}
            <div className="flex items-center gap-0.5" aria-hidden="true">
              <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
              <span className="w-0.5 h-4 bg-emerald-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
              <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
            </div>
            {variant === "pill" && (
              <span className="font-mono text-[11px] font-semibold tracking-wider text-emerald-300">
                Listening...
              </span>
            )}
            <MicOff className={cn(isSmall ? "size-3" : "size-3.5", "text-emerald-400 shrink-0")} />
          </>
        ) : (
          <>
            <Mic className={cn(isSmall ? "size-3.5" : isLarge ? "size-4.5" : "size-4", "shrink-0")} />
            {variant === "pill" && (
              <span className="font-mono text-[11px] font-medium tracking-wide">
                {label}
              </span>
            )}
          </>
        )}

        {/* Live Recording Dot */}
        {isListening && (
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500 animate-ping" />
        )}
      </button>

      {/* Error Bubble if permission denied or unsupported */}
      {error && (
        <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-2.5 rounded-xl border border-rose-500/30 bg-[#121215] shadow-2xl text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-snug">{error}</span>
        </div>
      )}
    </div>
  );
}
