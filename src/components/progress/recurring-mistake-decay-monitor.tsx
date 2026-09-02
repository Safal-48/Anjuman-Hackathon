"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingDown,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Layers,
  History,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RecurringMistakeItem,
  SkillDecayItem,
  SAMPLE_RECURRING_MISTAKES,
  SAMPLE_SKILL_DECAY_DATA,
} from "@/lib/memory/learning-memory-engine";

interface RecurringMistakeDecayMonitorProps {
  recurringMistakes?: RecurringMistakeItem[];
  decayItems?: SkillDecayItem[];
}

export function RecurringMistakeDecayMonitor({
  recurringMistakes = SAMPLE_RECURRING_MISTAKES,
  decayItems = SAMPLE_SKILL_DECAY_DATA,
}: RecurringMistakeDecayMonitorProps) {
  const [selectedMistake, setSelectedMistake] = useState<RecurringMistakeItem>(
    recurringMistakes[0]
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <GlassCard className="p-6 rounded-2xl border border-amber-500/30 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <Brain className="h-3 w-3" />
                LIGHTWEIGHT LEARNING MEMORY ENGINE
              </span>
              <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                Spaced Retention
              </Badge>
            </div>
            <h2 className="text-2xl font-black text-white font-mono tracking-tight">
              Recurring Mistake Memory &amp; Skill Decay Radar
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              KaushalSetu tracks repeated failure patterns across multiple assessment attempts and models knowledge decay over time, ensuring you retain long-term mastery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/learning/intervention">
              <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                <span>Start Remediation Sprint</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 2 Educational Principles */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1">
            <strong className="text-amber-400 block text-[11px] uppercase">1. RECURRING MISTAKE MEMORY</strong>
            <p className="text-[11px] text-slate-300">
              When the same concept fails across Assessment 1 ➔ Practice ➔ Assessment 2, the system flags a <strong>⚠️ Recurring Weakness</strong> and generates targeted micro-drills.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1">
            <strong className="text-rose-400 block text-[11px] uppercase">2. SKILL DECAY MONITORING</strong>
            <p className="text-[11px] text-slate-300">
              Compares historical peak performance with current telemetry (e.g. 84% ➔ 63%, &darr; 21%) and prompts spaced-repetition reinforcement before interviews.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 2-Column Layout: Recurring Mistake Timeline + Skill Decay Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recurring Mistake Memory Log (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 rounded-2xl border border-amber-500/30 bg-slate-900/60 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-mono">
                  Detected Recurring Weakness Memory
                </h3>
              </div>
              <Badge variant="destructive" size="sm" className="font-mono text-[9px]">
                {selectedMistake.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white font-mono">
                {selectedMistake.conceptName}
              </h4>
              <span className="text-xs font-mono text-slate-400 block">
                Domain: {selectedMistake.skillDomain} • <strong>{selectedMistake.consecutiveFailuresCount} Consecutive Logged Failures</strong>
              </span>
            </div>

            {/* The 3-Step Failure Trail (Assessment 1 ➔ Practice ➔ Assessment 2) */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Failure Telemetry Log:
              </span>

              {selectedMistake.history.map((occ, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 flex items-start justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        {occ.stage} (Failed ❌)
                      </span>
                      <span className="text-[10px] text-slate-500">• {occ.date}</span>
                    </div>
                    <p className="text-white text-[11px] font-medium">{occ.questionSnippet}</p>
                    <span className="text-[10px] text-amber-300 block">
                      Misconception: {occ.identifiedMisconception}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Auto-Generated Targeted Intervention CTA */}
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase block">
                  SYSTEM-GENERATED INTERVENTION:
                </span>
                <strong className="text-white block mt-0.5">
                  {selectedMistake.suggestedAction}
                </strong>
              </div>

              <Link href={selectedMistake.targetedInterventionUrl}>
                <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow shrink-0">
                  <span>Start Intervention</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Right: Skill Decay & Retention Radar (5 cols) */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 rounded-2xl border border-rose-500/30 bg-slate-900/60 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-rose-400" />
                <h3 className="text-lg font-bold text-white font-mono">
                  Skill Decay Tracker
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Ebbinghaus Curve</span>
            </div>

            <div className="space-y-3.5">
              {decayItems.map((item) => {
                const isHighRisk = item.decayRisk === "HIGH";
                const isModerate = item.decayRisk === "MODERATE";

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border space-y-2.5 text-xs font-mono ${
                      isHighRisk
                        ? "bg-slate-950/80 border-rose-500/40"
                        : isModerate
                        ? "bg-slate-950/60 border-amber-500/30"
                        : "bg-slate-950/40 border-emerald-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.skillName}</h4>
                        <span className="text-[10px] text-slate-400">{item.category} • Last practiced {item.lastPracticedDaysAgo} days ago</span>
                      </div>

                      <Badge
                        variant={isHighRisk ? "destructive" : isModerate ? "amber" : "cyber"}
                        size="sm"
                        className="text-[9px]"
                      >
                        {item.decayRisk} DECAY
                      </Badge>
                    </div>

                    {/* Historical vs Current Comparison */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/[0.06]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Peak Historical:</span>
                        <strong className="text-white text-sm">{item.peakScore}%</strong>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Current Telemetry:</span>
                        <strong className={isHighRisk ? "text-rose-400 text-sm" : "text-amber-400 text-sm"}>
                          {item.currentScore}% ({item.decayDelta}%)
                        </strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {item.reinforcementRecommendation}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <Link href={item.remedialUrl}>
                        <Button
                          variant={isHighRisk ? "cyber" : "outline"}
                          size="sm"
                          className="text-[10px] h-7 px-2.5 gap-1 font-mono"
                        >
                          <span>Reinforce Skill</span>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
