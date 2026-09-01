"use client";

import React from "react";
import {
  Mic,
  Volume2,
  Brain,
  AlertTriangle,
  Sparkles,
  Layers,
  MessageSquare,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GDParticipantPersona } from "@/lib/ai/gd-engine";

interface GDParticipantAvatarProps {
  participant: GDParticipantPersona;
  isSpeaking: boolean;
  isAddressed?: boolean;
  statusText?: string;
}

export function GDParticipantAvatar({
  participant,
  isSpeaking,
  isAddressed = false,
  statusText,
}: GDParticipantAvatarProps) {
  const getBadgeVariant = (color: GDParticipantPersona["styleBadgeColor"]) => {
    switch (color) {
      case "cyan":
        return "cyber";
      case "rose":
        return "destructive";
      case "amber":
        return "amber";
      case "violet":
        return "violet";
      case "emerald":
        return "emerald";
      default:
        return "glass";
    }
  };

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isSpeaking
          ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-[1.02]"
          : isAddressed
          ? "bg-amber-950/30 border-amber-500/50 shadow-glow-sm"
          : "bg-slate-900/70 border-white/10 hover:border-white/20"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Avatar Ring */}
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 transition-all ${
              isSpeaking
                ? "bg-cyan-500 text-black shadow-glow-sm animate-pulse"
                : "bg-white/10 text-foreground border border-white/10"
            }`}
          >
            {participant.name.split(" ").map((n) => n[0]).join("")}
          </div>

          <div className="truncate">
            <h4 className="text-xs font-bold text-foreground truncate">{participant.name}</h4>
            <Badge
              variant={getBadgeVariant(participant.styleBadgeColor) as any}
              size="sm"
              className="text-[9px] font-mono px-1.5 py-0 mt-0.5"
            >
              {participant.styleLabel}
            </Badge>
          </div>
        </div>

        {/* Live Audio / Status Indicator */}
        {isSpeaking ? (
          <div className="flex items-center gap-1 text-cyan-400">
            <Volume2 className="h-4 w-4 animate-bounce" />
            <div className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
              <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75" />
              <span className="w-0.5 h-4 bg-cyan-400 animate-pulse delay-150" />
            </div>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground">
            {statusText || "Listening"}
          </span>
        )}
      </div>

      {/* Style Bio Excerpt */}
      <p className="text-[10px] text-muted-foreground/80 line-clamp-2 mt-2 leading-relaxed font-mono">
        {participant.archetypeBio}
      </p>
    </div>
  );
}
