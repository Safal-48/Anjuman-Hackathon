"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  User,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Tag,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoachMessage, CoachActionRecommendation } from "@/lib/ai/career-coach-engine";

interface CoachMessageBubbleProps {
  message: CoachMessage;
  onSelectFollowUp?: (prompt: string) => void;
}

export function CoachMessageBubble({
  message,
  onSelectFollowUp,
}: CoachMessageBubbleProps) {
  const isCoach = message.sender === "coach";
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for clear speech synthesis
      const cleanText = message.text
        .replace(/###/g, "")
        .replace(/\*\*/g, "")
        .replace(/\|/g, " ")
        .replace(/---/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);

      setIsPlayingSpeech(true);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Error:", e);
      setIsPlayingSpeech(false);
    }
  };

  const getModuleBadgeVariant = (module: CoachActionRecommendation["module"]) => {
    switch (module) {
      case "Skills":
        return "cyber";
      case "Resume":
        return "violet";
      case "Interview":
        return "amber";
      case "GD":
        return "emerald";
      case "Opportunities":
        return "cyber";
      default:
        return "glass";
    }
  };

  // Simple markdown block parser for clean rendering
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm sm:text-base font-extrabold text-cyan-300 font-mono mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 my-1 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatBoldAndCode(line.replace("- ", "")) }} />
          </div>
        );
      }
      if (line.startsWith("|")) {
        // Table row
        return (
          <div key={idx} className="text-[11px] sm:text-xs font-mono text-cyan-200/90 py-0.5 overflow-x-auto whitespace-pre">
            {line}
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-mono my-1"
          dangerouslySetInnerHTML={{ __html: formatBoldAndCode(line) }}
        />
      );
    });
  };

  const formatBoldAndCode = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-cyan-300 font-bold'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='text-muted-foreground'>$1</em>")
      .replace(/`(.*?)`/g, "<code class='px-1.5 py-0.5 rounded bg-black/50 text-cyan-200 border border-white/10 font-mono text-xs'>$1</code>");
  };

  return (
    <div className={`flex gap-3.5 ${isCoach ? "items-start" : "items-start flex-row-reverse"}`}>
      {/* Avatar */}
      <div
        className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 border ${
          isCoach
            ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "bg-violet-500/20 border-violet-500/40 text-violet-400"
        }`}
      >
        {isCoach ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>

      {/* Message Card */}
      <div className={`space-y-3 max-w-[88%] sm:max-w-[82%]`}>
        <div
          className={`p-4 sm:p-5 rounded-3xl border transition-all text-foreground ${
            isCoach
              ? "bg-slate-900/90 border-cyan-500/30 rounded-tl-sm shadow-xl"
              : "bg-cyan-500/15 border-cyan-500/40 rounded-tr-sm text-cyan-100"
          }`}
        >
          {/* Header info */}
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold ${isCoach ? "text-cyan-400" : "text-foreground"}`}>
                {isCoach ? "Skillora AI Career Coach" : "You (Candidate)"}
              </span>
              {isCoach && (
                <Badge variant="cyber" size="sm" className="font-mono text-[9px] px-1.5 py-0">
                  GROUNDED DATA
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">{message.timestamp}</span>
              {isCoach && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-cyan-300 transition-colors"
                  title={isPlayingSpeech ? "Stop speech" : "Read aloud"}
                >
                  {isPlayingSpeech ? (
                    <VolumeX className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Formatted Text Content */}
          <div className="space-y-1">{renderFormattedText(message.text)}</div>

          {/* Grounded Context Data Tags */}
          {message.groundedContextTags && message.groundedContextTags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-1.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">
                Telemetry Sources Grounded:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.groundedContextTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-black/50 text-cyan-300 border border-cyan-500/20"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action Buttons */}
          {message.recommendedActions && message.recommendedActions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">
                Recommended Next Steps & Module Links:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.recommendedActions.map((action, idx) => (
                  <Link key={idx} href={action.href} className="block">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all flex items-center justify-between group">
                      <div className="truncate pr-2">
                        <span className="text-xs font-bold font-mono text-foreground group-hover:text-cyan-300 block truncate">
                          {action.label}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {action.badgeText}
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested Follow-up Prompts */}
        {isCoach && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="space-y-1.5 pl-2">
            <span className="text-[10px] font-mono text-muted-foreground">
              Suggested Next Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((fu, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowUp?.(fu)}
                  className="text-[11px] font-mono px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-muted-foreground hover:text-cyan-200 transition-all text-left"
                >
                  &ldquo;{fu}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
