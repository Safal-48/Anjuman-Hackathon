"use client";

import React from "react";
import { Mic, Volume2, Sparkles, Loader2 } from "lucide-react";

export type VoiceActivityState = "idle" | "listening" | "processing" | "speaking";

interface VoiceWaveVisualizerProps {
  state: VoiceActivityState;
  language?: "en" | "hi";
}

export function VoiceWaveVisualizer({ state, language = "en" }: VoiceWaveVisualizerProps) {
  const isListening = state === "listening";
  const isSpeaking = state === "speaking";
  const isProcessing = state === "processing";

  const stateLabels: Record<VoiceActivityState, { label: string; color: string; bg: string }> = {
    idle: { label: "Voice Copilot Ready", color: "text-muted-foreground", bg: "bg-white/5" },
    listening: { label: language === "hi" ? "सुन रहा हूँ..." : "Listening...", color: "text-rose-400", bg: "bg-rose-500/10" },
    processing: { label: language === "hi" ? "विश्लेषण कर रहा हूँ..." : "Synthesizing AI...", color: "text-amber-400", bg: "bg-amber-500/10" },
    speaking: { label: language === "hi" ? "मार्गदर्शन बोल रहा हूँ..." : "Speaking Guidance...", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  };

  const current = stateLabels[state];

  return (
    <div className={`p-3 rounded-2xl border border-white/10 ${current.bg} transition-all duration-300 flex items-center justify-between gap-3`}>
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-black/40 border border-white/10">
          {isProcessing ? (
            <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
          ) : isSpeaking ? (
            <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
          ) : isListening ? (
            <Mic className="h-4 w-4 text-rose-400 animate-bounce" />
          ) : (
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div>
          <span className={`text-xs font-bold font-mono ${current.color}`}>
            {current.label}
          </span>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {language === "hi" ? "हिन्दी (hi-IN) AI Voice" : "English (en-IN) AI Voice"}
          </span>
        </div>
      </div>

      {/* Reactive Animated Audio Wave Bars */}
      <div className="flex items-center gap-1 h-6 px-2">
        {[40, 75, 95, 60, 85, 50, 90, 65, 80, 45].map((height, i) => {
          const activeHeight = isListening || isSpeaking ? `${height}%` : "20%";
          const barColor = isListening
            ? "bg-rose-400"
            : isSpeaking
            ? "bg-cyan-400 shadow-glow-sm"
            : isProcessing
            ? "bg-amber-400"
            : "bg-white/20";

          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${barColor}`}
              style={{
                height: activeHeight,
                transitionDelay: `${i * 30}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
