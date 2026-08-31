"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Mic, Globe, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BilingualVoiceToggleProps {
  language: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
  onSpeakText: (text: string, lang: "en" | "hi") => void;
  isSpeaking: boolean;
  sampleGuidanceText?: string;
}

export function BilingualVoiceToggle({
  language,
  onLanguageChange,
  onSpeakText,
  isSpeaking,
  sampleGuidanceText,
}: BilingualVoiceToggleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
      {/* Language Switcher */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-cyan-400" />
        <span className="font-mono text-muted-foreground font-semibold">VOICE LANGUAGE:</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onLanguageChange("en")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              language === "en"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            English (en-IN)
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("hi")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              language === "hi"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            हिन्दी (hi-IN)
          </button>
        </div>
      </div>

      {/* Voice Read-Aloud Action */}
      {sampleGuidanceText && (
        <Button
          variant="glass"
          size="sm"
          onClick={() => onSpeakText(sampleGuidanceText, language)}
          leftIcon={
            isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5 text-rose-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            )
          }
        >
          {isSpeaking ? (language === "hi" ? "आवाज़ रोकें" : "Stop Voice") : (language === "hi" ? "आवाज़ में सुनें" : "Speak Guidance")}
        </Button>
      )}
    </div>
  );
}
