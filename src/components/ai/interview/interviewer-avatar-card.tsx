"use client";

import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  UserCheck,
  Building,
  Radio,
  Play,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterviewerPersona } from "@/lib/ai/interview-engine";
import { VoiceWaveVisualizer, VoiceActivityState } from "@/components/ai/voice-wave-visualizer";

interface InterviewerAvatarCardProps {
  persona: InterviewerPersona;
  currentQuestionText: string;
  language: "en" | "hi" | "hinglish";
  status: VoiceActivityState; // "idle" | "speaking" | "listening" | "processing"
  onStatusChange?: (status: VoiceActivityState) => void;
  autoPlaySpeech?: boolean;
}

export function InterviewerAvatarCard({
  persona,
  currentQuestionText,
  language,
  status,
  onStatusChange,
  autoPlaySpeech = true,
}: InterviewerAvatarCardProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false);

  // Play Speech synthesis using Web Speech API with fallback
  const speakText = React.useCallback(
    (text: string) => {
      if (typeof window === "undefined" || isMuted) return;

      // Stop any ongoing speech
      window.speechSynthesis?.cancel();

      if (!("speechSynthesis" in window)) {
        return;
      }

      // Clean text by stripping markdown
      const cleanText = text
        .replace(/[*#_`~[\]()]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = persona.voiceGender === "female" ? 1.1 : 0.95;

      utterance.onstart = () => {
        setIsSpeakingLocal(true);
        onStatusChange?.("speaking");
      };

      utterance.onend = () => {
        setIsSpeakingLocal(false);
        onStatusChange?.("idle");
      };

      utterance.onerror = () => {
        setIsSpeakingLocal(false);
        onStatusChange?.("idle");
      };

      window.speechSynthesis.speak(utterance);
    },
    [isMuted, language, persona.voiceGender, onStatusChange]
  );

  const handleToggleSpeak = () => {
    if (isSpeakingLocal) {
      window.speechSynthesis?.cancel();
      setIsSpeakingLocal(false);
      onStatusChange?.("idle");
    } else {
      speakText(currentQuestionText);
    }
  };

  // Speak new question when it changes
  useEffect(() => {
    if (autoPlaySpeech && currentQuestionText) {
      const timer = setTimeout(() => {
        speakText(currentQuestionText);
      }, 400);
      return () => {
        clearTimeout(timer);
        window.speechSynthesis?.cancel();
      };
    }
  }, [currentQuestionText, autoPlaySpeech, speakText]);

  const isSpeaking = status === "speaking" || isSpeakingLocal;
  const isListening = status === "listening";
  const isProcessing = status === "processing";

  return (
    <GlassCard className="p-5 sm:p-6 border-white/10 space-y-4 relative overflow-hidden" glow>
      {/* Background Ambience Glow */}
      <div
        className={`absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          isSpeaking
            ? "bg-cyan-500/25"
            : isListening
            ? "bg-rose-500/25"
            : isProcessing
            ? "bg-amber-500/25"
            : "bg-violet-500/15"
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        {/* Persona Header Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            {/* Avatar Circle with Dynamic Border */}
            <div
              className={`h-14 w-14 rounded-2xl p-[2px] transition-all duration-300 ${
                isSpeaking
                  ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  : isListening
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                  : isProcessing
                  ? "bg-gradient-to-r from-amber-400 to-violet-500 animate-pulse"
                  : "bg-slate-800 border border-white/15"
              }`}
            >
              <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden font-extrabold text-cyan-400 text-lg">
                {persona.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>

            {/* Live Indicator Dot */}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSpeaking ? "bg-cyan-400" : isListening ? "bg-rose-400" : "bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-4 w-4 border-2 border-slate-950 ${
                  isSpeaking ? "bg-cyan-500" : isListening ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-foreground tracking-tight">
                {persona.name}
              </h4>
              <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                {persona.voiceGender.toUpperCase()} AI
              </Badge>
            </div>
            <p className="text-xs text-cyan-400/90 font-medium">{persona.role}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
              <Building className="h-3 w-3" />
              {persona.company}
            </p>
          </div>
        </div>

        {/* Action Controls: Play/Stop TTS Speech & Mute */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            type="button"
            variant={isSpeaking ? "glow" : "glass"}
            size="sm"
            onClick={handleToggleSpeak}
            leftIcon={
              isSpeaking ? (
                <VolumeX className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
              )
            }
            className="text-xs font-mono"
          >
            {isSpeaking ? "Pause Voice" : "Replay Question"}
          </Button>

          <button
            type="button"
            onClick={() => {
              if (!isMuted) window.speechSynthesis?.cancel();
              setIsMuted(!isMuted);
            }}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isMuted
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
            }`}
            title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Voice Wave Visualizer */}
      <VoiceWaveVisualizer
        state={
          isSpeaking
            ? "speaking"
            : isListening
            ? "listening"
            : isProcessing
            ? "processing"
            : "idle"
        }
        language={language === "hi" ? "hi" : "en"}
      />

      {/* Persona Tone Tip */}
      <div className="text-[11px] text-muted-foreground font-mono bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
        <span>
          <strong>Interviewer Persona:</strong> {persona.tone}
        </span>
        <span className="text-cyan-400 font-semibold uppercase text-[10px]">
          {language.toUpperCase()} MODE
        </span>
      </div>
    </GlassCard>
  );
}
