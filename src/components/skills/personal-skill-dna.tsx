"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Dna,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  Brain,
  Clock,
  ArrowRight,
  Flame,
  History,
  Layers,
  Zap,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillDNAItem } from "@/lib/skills/skill-dna-types";
import { DEFAULT_SKILL_DNA } from "@/lib/skills/skill-dna-repository";

interface PersonalSkillDNAProps {
  skills?: SkillDNAItem[];
}

export function PersonalSkillDNA({ skills = DEFAULT_SKILL_DNA }: PersonalSkillDNAProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillDNAItem | null>(null);

  const demonstratedCount = skills.filter((s) => s.status === "Demonstrated").length;
  const selfDeclaredCount = skills.filter((s) => s.status === "Self-Declared").length;

  return (
    <div className="space-y-6">
      {/* 1. Skill DNA Overview Header */}
      <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-400 shrink-0 shadow-glow-sm">
              <Dna className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black text-white font-mono tracking-tight">
                  Personal Skill DNA
                </h2>
                <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                  Continuous Mastery Model
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                A live, evolving profile of your actual technical competencies. Self-declared claims remain unverified until validated through diagnostic performance and practice evidence.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 text-xs font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Demonstrated</span>
              <span className="text-lg font-black text-emerald-400">{demonstratedCount} Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 text-xs font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Self-Declared</span>
              <span className="text-lg font-black text-amber-400">{selfDeclaredCount} Unverified</span>
            </div>
          </div>
        </div>

        {/* 2. Educational Rule Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-mono">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Rule:</strong> Saying <em>&quot;I know Advanced SQL&quot;</em> does not grant proficiency points. Actual assessment &amp; practice telemetry determine your score.
            </span>
          </div>
          <Link href="/assessment">
            <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 h-7 px-3 shrink-0">
              Verify Self-Declared Skills <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* 3. Skill DNA Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((item) => {
          const isDemonstrated = item.status === "Demonstrated";
          const isLowConfidence = item.confidence === "Low";

          return (
            <GlassCard
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                isDemonstrated
                  ? "border-cyan-500/20 bg-slate-900/40 hover:border-cyan-400/50"
                  : "border-amber-500/30 bg-slate-900/30 hover:border-amber-400/60"
              }`}
            >
              <div>
                {/* Header: Name + Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                      {item.skillName}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {item.category}
                    </span>
                  </div>

                  <Badge
                    variant={isDemonstrated ? "cyber" : "amber"}
                    size="sm"
                    className="font-mono text-[9px]"
                  >
                    {item.status}
                  </Badge>
                </div>

                {/* Big Score + Trend + Confidence */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-black font-mono ${
                        isDemonstrated
                          ? item.proficiencyScore >= 75
                            ? "text-emerald-400"
                            : item.proficiencyScore >= 50
                            ? "text-cyan-400"
                            : "text-amber-400"
                          : "text-amber-400"
                      }`}
                    >
                      {item.proficiencyScore}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Proficiency</span>
                  </div>

                  {/* Trend & Confidence Indicator */}
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        item.trend === "up"
                          ? "text-emerald-400"
                          : item.trend === "down"
                          ? "text-rose-400"
                          : "text-slate-400"
                      }`}
                    >
                      {item.trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
                      {item.trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
                      {item.trend === "stable" && <Minus className="h-3.5 w-3.5" />}
                      {item.trend === "up" ? "↑ Rising" : item.trend === "down" ? "↓ Declining" : "→ Stable"}
                    </span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Confidence:</span>
                  <span
                    className={`font-bold ${
                      item.confidence === "High"
                        ? "text-emerald-400"
                        : item.confidence === "Medium"
                        ? "text-cyan-400"
                        : "text-amber-400"
                    }`}
                  >
                    {item.confidence}
                  </span>
                </div>

                {/* Recurring Weakness Flag if present */}
                {item.recurringWeakness && (
                  <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-mono flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">
                      <strong>Weakness:</strong> {item.recurringWeakness}
                    </span>
                  </div>
                )}

                {/* Top Evidence Item */}
                <div className="mt-3.5 pt-3 border-t border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                    Empirical Evidence:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {item.evidence[0] || "No evidence recorded yet."}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSkill(item)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <History className="h-3.5 w-3.5" />
                  <span>View Timeline &amp; Logs</span>
                </button>

                {!isDemonstrated ? (
                  <Link href="/assessment">
                    <Button variant="cyber" size="sm" className="text-[10px] h-7 px-2.5 gap-1">
                      Prove Now <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/practice">
                    <Button variant="outline" size="sm" className="text-[10px] h-7 px-2.5 gap-1 border-white/10 hover:border-cyan-500/30">
                      Practice Drill <Zap className="h-3 w-3 text-cyan-400" />
                    </Button>
                  </Link>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 4. Timeline & Practice History Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Dna className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">
                    {selectedSkill.skillName} — Mastery Timeline
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Current Score: <strong className="text-cyan-400">{selectedSkill.proficiencyScore}%</strong> • Confidence: {selectedSkill.confidence}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                Logged Telemetry Evidence
              </span>
              <div className="space-y-1.5">
                {selectedSkill.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.06] text-xs text-slate-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassessment History */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                Reassessment Trajectory (Pre vs. Post Score)
              </span>
              {selectedSkill.reassessmentHistory.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedSkill.reassessmentHistory.map((rh) => (
                    <div
                      key={rh.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs font-mono flex items-center justify-between"
                    >
                      <span className="text-slate-300">{rh.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{rh.previousScore}% → <strong className="text-white">{rh.newScore}%</strong></span>
                        <Badge variant="cyber" size="sm" className="text-[10px] text-emerald-300">
                          {rh.delta}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono">No reassessment attempts recorded yet.</p>
              )}
            </div>

            {/* Practice History */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-bold">
                Practice &amp; Drill History
              </span>
              {selectedSkill.practiceHistory.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedSkill.practiceHistory.map((ph) => (
                    <div
                      key={ph.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-violet-500/20 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white block">{ph.description}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ph.date} • {ph.activityType}</span>
                      </div>
                      <Badge variant="glass" size="sm" className="font-mono text-[10px] text-emerald-400">
                        {ph.scoreDelta}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono">No practice sessions logged yet.</p>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSkill(null)}
                className="text-xs font-mono"
              >
                Close
              </Button>
              <Link href="/practice">
                <Button variant="cyber" size="sm" className="text-xs font-mono">
                  Launch Practice Drill
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
