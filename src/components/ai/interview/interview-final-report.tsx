"use client";

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Brain,
  Layers,
  Clock,
  MessageSquare,
  Zap,
  Target,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinalInterviewReport } from "@/lib/ai/interview-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

interface InterviewFinalReportProps {
  report: FinalInterviewReport;
  onRetakeInterview: () => void;
}

export function InterviewFinalReportView({
  report,
  onRetakeInterview,
}: InterviewFinalReportProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    report.weakQuestionsBreakdown[0]?.questionId || null
  );

  const {
    overallScore,
    performanceGrade,
    categoryRatings,
    overallStrengths,
    overallWeaknesses,
    weakQuestionsBreakdown,
    specificImprovementSuggestions,
    recommendedTopicsToPractice,
    interviewer,
    config,
    totalDurationSeconds,
    totalQuestionsAnswered,
  } = report;

  const formatDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-cyan-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (score >= 70) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    if (score >= 50) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-rose-500/20 text-rose-300 border-rose-500/30";
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <FadeIn>
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* ========================================================================= */}
        {/* TOP HERO REPORT HEADER                                                    */}
        {/* ========================================================================= */}
        <GlassCard className="p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-slate-950 to-cyan-950/30 shadow-2xl relative overflow-hidden" glow>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Metadata & Grade */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="emerald" size="sm" className="font-mono text-xs px-3">
                  COMPLETED INTERVIEW AUDIT
                </Badge>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {config.roleId.replace(/_/g, " ")} • {config.experienceLevel.toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Mock Interview Diagnostic Report
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                Evaluated by <strong>{interviewer.name}</strong> ({interviewer.role}) • {totalQuestionsAnswered} Questions • {formatDuration(totalDurationSeconds)}
              </p>
            </div>

            {/* Right: Big Overall Score Dial */}
            <div className="flex items-center gap-5 p-4 rounded-3xl bg-black/60 border border-cyan-500/30 shadow-glow-sm">
              <div className="text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                  OVERALL RATING
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-cyan-400">
                  {overallScore}<span className="text-2xl text-cyan-300/70">%</span>
                </div>
              </div>

              <div className="border-l border-white/10 pl-4 space-y-1">
                <span className="text-[11px] font-mono text-muted-foreground block">STATUS</span>
                <span className="text-xs sm:text-sm font-bold font-mono px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 inline-block">
                  {performanceGrade}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Multi-vector deterministic evaluation • Zero hallucinated scores</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Download className="h-3.5 w-3.5" />}
                className="text-xs font-mono"
              >
                Export / Print
              </Button>
              <Button
                type="button"
                variant="glow"
                size="sm"
                onClick={onRetakeInterview}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono"
              >
                New Interview Session
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* ========================================================================= */}
        {/* 7 CATEGORY RATINGS BREAKDOWN                                              */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              <span>Category-Wise Competency Ratings</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">7 Vectors Assessed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Technical Knowledge */}
            <GlassCard className="p-4 space-y-3 border-cyan-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Technical Knowledge
                </span>
                <span className="text-sm font-black font-mono text-cyan-400">
                  {categoryRatings.technicalKnowledge}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${categoryRatings.technicalKnowledge}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Architectural depth, domain keywords, and engineering terminology accuracy.
              </p>
            </GlassCard>

            {/* 2. Relevance of Answer */}
            <GlassCard className="p-4 space-y-3 border-emerald-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Relevance of Answer
                </span>
                <span className="text-sm font-black font-mono text-emerald-400">
                  {categoryRatings.relevance}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${categoryRatings.relevance}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Direct adherence to question constraints without straying off-topic.
              </p>
            </GlassCard>

            {/* 3. Answer Quality */}
            <GlassCard className="p-4 space-y-3 border-purple-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Answer Quality & Depth
                </span>
                <span className="text-sm font-black font-mono text-purple-400">
                  {categoryRatings.answerQuality}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${categoryRatings.answerQuality}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Articulation of system trade-offs, bottlenecks, and failure recovery.
              </p>
            </GlassCard>

            {/* 4. Communication */}
            <GlassCard className="p-4 space-y-3 border-blue-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Communication Clarity
                </span>
                <span className="text-sm font-black font-mono text-blue-400">
                  {categoryRatings.communication}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${categoryRatings.communication}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Structured delivery, logical transitions, and STAR framework flow.
              </p>
            </GlassCard>

            {/* 5. Confidence Indicators */}
            <GlassCard className="p-4 space-y-3 border-amber-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Confidence Indicators
                </span>
                <span className="text-sm font-black font-mono text-amber-400">
                  {categoryRatings.confidenceIndicators}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${categoryRatings.confidenceIndicators}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Strong action verbs, quantifiable metrics, and absence of filler words.
              </p>
            </GlassCard>

            {/* 6. Response Time & Pacing */}
            <GlassCard className="p-4 space-y-3 border-teal-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Response Pacing
                </span>
                <span className="text-sm font-black font-mono text-teal-400">
                  {categoryRatings.responseTimePacing}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                  style={{ width: `${categoryRatings.responseTimePacing}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Deliberation pacing within the optimal 60s-150s response window.
              </p>
            </GlassCard>

            {/* 7. Completeness */}
            <GlassCard className="p-4 space-y-3 border-rose-500/20 sm:col-span-2 lg:col-span-2" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Completeness & Edge Cases
                </span>
                <span className="text-sm font-black font-mono text-rose-400">
                  {categoryRatings.completeness}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                  style={{ width: `${categoryRatings.completeness}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Handling edge cases, error boundaries, memory pressure, and production fault scenarios.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STRENGTHS & WEAKNESSES GRID                                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <GlassCard className="p-6 space-y-4 border-emerald-500/20 bg-emerald-950/10" glow>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-foreground">Demonstrated Strengths</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {overallStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-foreground/90">{s}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Key Weaknesses */}
          <GlassCard className="p-6 space-y-4 border-amber-500/20 bg-amber-950/10" glow>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-foreground">Identified Skill Deficits</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {overallWeaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-foreground/90">{w}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* ========================================================================= */}
        {/* WEAK QUESTIONS BREAKDOWN (DETAILED DIAGNOSIS)                              */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber-400" />
              <span>Questions Where Performance Was Weak (Deep Dive)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review what was missing, why the score was lower, and how a top-tier candidate answers.
            </p>
          </div>

          <div className="space-y-4">
            {weakQuestionsBreakdown.map((wq, idx) => {
              const isExpanded = expandedQuestionId === wq.questionId;
              return (
                <GlassCard key={wq.questionId} className="p-5 border-white/10 space-y-4" glow>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    onClick={() =>
                      setExpandedQuestionId(isExpanded ? null : wq.questionId)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{wq.questionText}</h4>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          Your Answer Score: <strong className="text-amber-400">{wq.score}%</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs text-cyan-400 font-mono flex items-center gap-1 self-start sm:self-center"
                    >
                      <span>{isExpanded ? "Collapse" : "View Breakdown"}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <FadeIn>
                      <div className="pt-3 border-t border-white/[0.08] space-y-4 text-xs">
                        {/* What candidate said */}
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold">
                            Your Answer Excerpt:
                          </span>
                          <p className="text-foreground/80 italic font-mono leading-relaxed">
                            &ldquo;{wq.candidateAnswerSummary}&rdquo;
                          </p>
                        </div>

                        {/* Why it was weak */}
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                          <span className="font-mono text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Diagnostic Analysis:
                          </span>
                          <p className="text-amber-200/90 leading-relaxed">{wq.whyItWasWeak}</p>
                        </div>

                        {/* Actionable fix */}
                        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                          <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Recommended Technique:
                          </span>
                          <p className="text-cyan-200/90 leading-relaxed">{wq.actionableFix}</p>
                        </div>

                        {/* Exemplary Model Answer */}
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                          <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Exemplary Model Response:
                          </span>
                          <p className="text-emerald-200/90 leading-relaxed">{wq.modelAnswer}</p>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SPECIFIC ACTIONABLE IMPROVEMENTS & RECOMMENDED DRILLS                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actionable Improvement Suggestions */}
          <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-foreground">Specific Improvement Suggestions</h3>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              {specificImprovementSuggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-foreground/90">{sug}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Recommended Topics to Practice */}
          <GlassCard className="p-6 space-y-4 border-violet-500/20" glow>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-400" />
              <h3 className="text-base font-bold text-foreground">Recommended Topics to Practice</h3>
            </div>

            <div className="space-y-3 text-xs">
              {recommendedTopicsToPractice.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-violet-500/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-violet-300 text-xs">{rec.topic}</span>
                    <Badge variant={rec.priority === "High" ? "amber" : "glass"} size="sm">
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{rec.reason}</p>
                  <div className="text-[11px] text-cyan-300 font-mono pt-1">
                    🎯 <strong>Suggested Drill:</strong> {rec.suggestedDrill}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Retake CTA Footer */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground font-mono max-w-xl">
            {report.practiceDisclaimer}
          </p>

          <Button
            type="button"
            variant="glow"
            size="lg"
            onClick={onRetakeInterview}
            leftIcon={<RotateCcw className="h-4 w-4" />}
            className="w-full sm:w-auto px-8 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Start Another Mock Interview
          </Button>
        </div>
      </div>
    </FadeIn>
  );
}
