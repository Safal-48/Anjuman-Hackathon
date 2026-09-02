"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Flame,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  BookOpen,
  Zap,
  Clock,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicMasteryBreakdown, DiagnosticInsight } from "@/lib/supabase/types";

interface TopicDiagnosticBreakdownProps {
  topicBreakdowns?: TopicMasteryBreakdown[];
  diagnosticInsights?: DiagnosticInsight;
}

const DEFAULT_SAMPLE_TOPICS: TopicMasteryBreakdown[] = [
  { skillName: "SQL & Relational Databases", topicName: "Basics", score: 86, status: "Mastered", questionsCount: 2, correctCount: 2, priority: "Low" },
  { skillName: "SQL & Relational Databases", topicName: "Filtering", score: 78, status: "Proficient", questionsCount: 2, correctCount: 2, priority: "Medium" },
  { skillName: "SQL & Relational Databases", topicName: "Aggregation", score: 71, status: "Proficient", questionsCount: 2, correctCount: 1, priority: "Medium" },
  { skillName: "SQL & Relational Databases", topicName: "GROUP BY", score: 69, status: "Proficient", questionsCount: 2, correctCount: 1, priority: "Medium" },
  { skillName: "SQL & Relational Databases", topicName: "JOINs", score: 42, status: "Critical Gap", questionsCount: 2, correctCount: 0, priority: "High" },
  { skillName: "SQL & Relational Databases", topicName: "Subqueries", score: 51, status: "Needs Attention", questionsCount: 2, correctCount: 1, priority: "Medium" },
  { skillName: "SQL & Relational Databases", topicName: "Advanced SQL", score: 32, status: "Critical Gap", questionsCount: 2, correctCount: 0, priority: "High" },
  { skillName: "Python & Core Programming", topicName: "Data Structures", score: 88, status: "Mastered", questionsCount: 2, correctCount: 2, priority: "Low" },
  { skillName: "Python & Core Programming", topicName: "Async Concurrency", score: 64, status: "Proficient", questionsCount: 2, correctCount: 1, priority: "Medium" },
  { skillName: "Distributed Systems", topicName: "Consensus (Raft)", score: 48, status: "Critical Gap", questionsCount: 2, correctCount: 0, priority: "High" },
];

export function TopicDiagnosticBreakdown({
  topicBreakdowns = DEFAULT_SAMPLE_TOPICS,
  diagnosticInsights,
}: TopicDiagnosticBreakdownProps) {
  const topics = topicBreakdowns.length > 0 ? topicBreakdowns : DEFAULT_SAMPLE_TOPICS;

  return (
    <div className="space-y-6">
      {/* 1. Sub-Skill Granular Mastery Matrix Table */}
      <GlassCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white font-mono">
                Topic & Sub-Skill Granular Mastery
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Diagnostic performance evaluated at individual topic resolution rather than a single aggregated percentage.
            </p>
          </div>

          <Badge variant="cyber" size="sm" className="font-mono text-xs w-fit">
            Diagnostic Evidence
          </Badge>
        </div>

        {/* Granular Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Skill Domain</th>
                <th className="pb-3 font-semibold">Sub-Topic</th>
                <th className="pb-3 font-semibold">Mastery (%)</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {topics.map((t, idx) => {
                const isCritical = t.status === "Critical Gap";
                const isWarning = t.status === "Needs Attention";
                const isMastered = t.status === "Mastered";

                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-slate-300 font-semibold">{t.skillName}</td>
                    <td className="py-3 text-white font-bold">{t.topicName}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black ${
                            isCritical
                              ? "text-rose-400"
                              : isWarning
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {t.score}%
                        </span>
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritical
                                ? "bg-rose-500"
                                : isWarning
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                            }`}
                            style={{ width: `${t.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          isCritical
                            ? "destructive"
                            : isWarning
                            ? "amber"
                            : isMastered
                            ? "cyber"
                            : "outline"
                        }
                        size="sm"
                        className="text-[9px]"
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[11px] font-bold ${
                          t.priority === "High"
                            ? "text-rose-400"
                            : t.priority === "Medium"
                            ? "text-amber-300"
                            : "text-slate-400"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/learning/resources?highlight=${encodeURIComponent(t.topicName)}`}
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>Study Topic</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* 2. Diagnostic Analysis Breakdown (Strong, Weak, Critical, Recurring, Immediate) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Strong Areas */}
        <GlassCard className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            Strong Areas (Mastered)
          </div>
          <div className="space-y-2">
            {diagnosticInsights?.strongAreas && diagnosticInsights.strongAreas.length > 0 ? (
              diagnosticInsights.strongAreas.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.topic}</span>
                    <span className="text-emerald-400 font-mono font-bold">{item.score}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.rationale}</p>
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs">
                <span className="font-bold text-white">SQL → Basics & Filtering</span>
                <p className="text-[11px] text-slate-400 mt-1">Strong grasp of SELECT predicates and distinct operations.</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Weak Areas & Friction */}
        <GlassCard className="p-5 rounded-2xl border border-amber-500/20 bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" />
            Weak Areas (Needs Attention)
          </div>
          <div className="space-y-2">
            {diagnosticInsights?.weakAreas && diagnosticInsights.weakAreas.length > 0 ? (
              diagnosticInsights.weakAreas.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.topic}</span>
                    <span className="text-amber-400 font-mono font-bold">{item.score}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.rationale}</p>
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs">
                <span className="font-bold text-white">SQL → Aggregation & GROUP BY</span>
                <p className="text-[11px] text-slate-400 mt-1">Friction with HAVING vs WHERE semantic filtering.</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Critical Gaps */}
        <GlassCard className="p-5 rounded-2xl border border-rose-500/20 bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="h-4 w-4" />
            Critical Gaps (High Deficit)
          </div>
          <div className="space-y-2">
            {diagnosticInsights?.criticalGaps && diagnosticInsights.criticalGaps.length > 0 ? (
              diagnosticInsights.criticalGaps.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.topic}</span>
                    <span className="text-rose-400 font-mono font-bold">{item.score}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.immediateAction}</p>
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/20 text-xs">
                <span className="font-bold text-white">SQL → Relational JOINs (42%)</span>
                <p className="text-[11px] text-slate-400 mt-1">Critical blocker for relational queries.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* 3. Recurring Mistakes & Immediate Attention Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recurring Mistake Patterns */}
        <GlassCard className="p-5 rounded-2xl border border-violet-500/20 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-mono font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-400" />
              Detected Recurring Mistake Pattern
            </span>
            <Badge variant="glass" size="sm" className="font-mono text-[9px]">AI Pattern Engine</Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-violet-500/30">
              <h4 className="font-bold text-white">Relational Set Coupling vs. Correlated Subquery Optimization</h4>
              <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                You frequently selected nested subqueries where indexed <code className="text-cyan-400">INNER/LEFT JOINs</code> yield O(N) rather than O(N²) execution plan latency.
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400">Affected: SQL JOINs & Subqueries</span>
                <Link href="/career-coach">
                  <Button variant="cyber" size="sm" className="text-[10px] h-6 px-2.5 gap-1">
                    Ask AI Tutor <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Immediate Attention & Remedial Actions */}
        <GlassCard className="p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-slate-900/50 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              Topics Requiring Immediate Attention
            </span>
            <Badge variant="cyber" size="sm" className="font-mono text-[9px]">Top Priority</Badge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The adaptive engine has generated 2 high-priority remedial learning interventions to close your <strong>SQL JOINs (-38% Gap)</strong> and <strong>Distributed Consensus (-32% Gap)</strong> before your next reassessment.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/learning/resources?highlight=JOINs">
              <Button variant="cyber" size="sm" className="text-xs gap-1.5 shadow-glow">
                <BookOpen className="h-3.5 w-3.5" />
                Launch Remedial Study Queue
              </Button>
            </Link>

            <Link href="/assessment">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 border-white/10 hover:border-cyan-500/30">
                <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
                Take Targeted Re-test
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
