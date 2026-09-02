"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Target,
  TrendingDown,
  TrendingUp,
  Minus,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertOctagon,
  Layers,
  Sparkles,
  BookOpen,
  Clock,
  HelpCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriorityGapItem, SAMPLE_PRIORITY_GAPS } from "@/lib/skills/priority-gap-engine";

interface PerformancePriorityEngineProps {
  priorityGaps?: PriorityGapItem[];
}

export function PerformancePriorityEngine({
  priorityGaps = SAMPLE_PRIORITY_GAPS,
}: PerformancePriorityEngineProps) {
  const topPriority = priorityGaps[0] || SAMPLE_PRIORITY_GAPS[0];
  const [selectedItem, setSelectedItem] = useState<PriorityGapItem>(topPriority);

  return (
    <div className="space-y-6">
      {/* 1. Header & Proactive Intelligence Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <Zap className="h-3.5 w-3.5" />
            Performance-Based Gap &amp; Priority Engine
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
            Which Weakness Matters <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Most Right Now?</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            You may have multiple weak concepts, but KaushalSetu determines your exact learning sequence based on Deficit Gap, Goal Relevance, Prerequisite Dependencies, and Recent Failure Trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="destructive" size="sm" className="font-mono text-xs px-2.5 py-1 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>#1 Blocker: {topPriority.topicName}</span>
          </Badge>
        </div>
      </div>

      {/* 2. Hero "DO THIS FIRST: NEXT BEST ACTION" Card */}
      <GlassCard className="p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-violet-950/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <AlertOctagon className="h-3 w-3" />
                DO THIS FIRST • RANK #1 PRIORITY
              </span>
              <span className="text-xs font-mono text-slate-400">
                Calculated Priority Score: <strong className="text-cyan-400">{topPriority.calculatedPriorityScore}/100</strong>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {topPriority.topicName}
            </h3>
            <span className="text-xs font-mono text-cyan-300 block">
              Skill Domain: {topPriority.skillDomain}
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block uppercase">Current</span>
              <span className="text-lg font-black text-rose-400">{topPriority.currentScore}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block uppercase">Target</span>
              <span className="text-lg font-black text-emerald-400">{topPriority.targetScore}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 text-xs font-mono text-center min-w-[90px]">
              <span className="text-[10px] text-rose-400 block uppercase font-bold">Deficit Gap</span>
              <span className="text-lg font-black text-rose-400">-{topPriority.gapDifference}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block uppercase">Trend</span>
              <span className="text-sm font-bold text-rose-400 flex items-center justify-center gap-1 mt-1">
                <TrendingDown className="h-3.5 w-3.5" /> ↓ Declining
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Factor Rationale & Prerequisite Unlocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Why This Weakness Matters Most Right Now:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {topPriority.whyThisFirst}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Prerequisites Unlocked Upon Resolution:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topPriority.prerequisiteFor.map((pre, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300"
                >
                  {pre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Next Best Action Execution Box */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                NEXT BEST ACTION RECOMMENDATION
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {topPriority.nextBestAction.title}
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Duration: {topPriority.nextBestAction.estimatedDuration} • Impact: <strong className="text-emerald-400">{topPriority.nextBestAction.projectedReadinessBoost}</strong>
              </span>
            </div>
          </div>

          <Link href={topPriority.nextBestAction.actionUrl}>
            <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow whitespace-nowrap">
              Execute Action Now <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* 3. Multi-Factor Priority Ranking Queue Table */}
      <GlassCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Deterministic Priority Queue (&quot;Do This First&quot;)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            5 Weakness Signals Ranked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Concept / Topic</th>
                <th className="pb-3 font-semibold">Current → Target</th>
                <th className="pb-3 font-semibold">Deficit Gap</th>
                <th className="pb-3 font-semibold">Goal Relevance</th>
                <th className="pb-3 font-semibold">Dependency</th>
                <th className="pb-3 font-semibold">Trend</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {priorityGaps.map((item) => {
                const isCritical = item.priorityLevel === "CRITICAL";
                const isHigh = item.priorityLevel === "HIGH";

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="py-3">
                      <span
                        className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          item.priorityRank === 1
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : item.priorityRank === 2
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        #{item.priorityRank}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-white block">{item.topicName}</span>
                      <span className="text-[10px] text-slate-400">{item.skillDomain}</span>
                    </td>
                    <td className="py-3 text-slate-300">
                      {item.currentScore}% → <strong className="text-white">{item.targetScore}%</strong>
                    </td>
                    <td className="py-3 font-bold text-rose-400">
                      -{item.gapDifference}%
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={item.goalRelevance === "HIGH" ? "cyber" : "glass"}
                        size="sm"
                        className="text-[9px]"
                      >
                        {item.goalRelevance}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={item.dependencyWeight === "HIGH" ? "amber" : "glass"}
                        size="sm"
                        className="text-[9px]"
                      >
                        {item.dependencyWeight}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span
                        className={`flex items-center gap-1 text-[11px] font-bold ${
                          item.recentTrend === "up"
                            ? "text-emerald-400"
                            : item.recentTrend === "down"
                            ? "text-rose-400"
                            : "text-slate-400"
                        }`}
                      >
                        {item.recentTrend === "up" && <TrendingUp className="h-3 w-3" />}
                        {item.recentTrend === "down" && <TrendingDown className="h-3 w-3" />}
                        {item.recentTrend === "stable" && <Minus className="h-3 w-3" />}
                        {item.recentTrend}
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={isCritical ? "destructive" : isHigh ? "amber" : "outline"}
                        size="sm"
                        className="text-[9px]"
                      >
                        {item.priorityLevel}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link href={item.nextBestAction.actionUrl}>
                        <Button variant="cyber" size="sm" className="text-[10px] h-7 px-2.5 gap-1">
                          Fix Now <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
