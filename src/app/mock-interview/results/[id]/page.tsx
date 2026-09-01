"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  ChevronLeft,
  Calendar,
  History,
  X,
  Radio,
  Sliders,
  AlertCircle,
  Code2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FinalInterviewReport } from "@/lib/ai/interview-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function DedicatedInterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const [report, setReport] = useState<FinalInterviewReport | null>(null);
  const [attempts, setAttempts] = useState<FinalInterviewReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Fetch current report and attempt history
  useEffect(() => {
    async function loadReportData() {
      if (!reportId) return;
      setIsLoading(true);
      try {
        const [reportRes, attemptsRes] = await Promise.all([
          fetch(`/api/ai/interview/report/${reportId}`),
          fetch(`/api/ai/interview/attempts`),
        ]);

        if (reportRes.ok) {
          const rData = await reportRes.json();
          setReport(rData.report);
          if (rData.report.weakQuestionsBreakdown?.[0]) {
            setExpandedQuestionId(rData.report.weakQuestionsBreakdown[0].questionId);
          }
        }

        if (attemptsRes.ok) {
          const aData = await attemptsRes.json();
          setAttempts(aData.attempts || []);
        }
      } catch (err) {
        console.error("Failed to load interview report:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReportData();
  }, [reportId]);

  if (isLoading || !report) {
    return (
      <div className="min-h-screen py-12 bg-slate-950 text-foreground">
        <Container size="xl" className="space-y-8">
          <Skeleton className="h-36 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </Container>
      </div>
    );
  }

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
    timestamp,
  } = report;

  const isInterviewReady = overallScore >= 80;
  const isNeedsImprovement = overallScore < 65;
  const isDeveloping = !isInterviewReady && !isNeedsImprovement;

  const formatDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // SVG Circular Gauge calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-8 max-w-6xl">
        {/* Top Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/mock-interview"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Mock Interview Studio</span>
            </Link>

            <span className="text-muted-foreground text-xs font-mono">/</span>
            <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              Diagnostic Audit Report
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={() => setShowAttemptsModal(true)}
              leftIcon={<History className="h-3.5 w-3.5 text-violet-400" />}
              className="text-xs font-mono"
            >
              Previous Attempts ({attempts.length})
            </Button>

            <Link href="/mock-interview">
              <Button
                variant="glow"
                size="sm"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono font-bold"
              >
                Retry Interview
              </Button>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PROMINENT READINESS STATUS BANNER                              */}
        {/* ========================================================================= */}
        <SlideUp>
          {isInterviewReady && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground">
                      VERIFIED STATUS: INTERVIEW READY ✅
                    </h3>
                    <Badge variant="emerald" size="sm">TOP TIER</Badge>
                  </div>
                  <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                    Your responses exceed the target industry benchmark ({overallScore}% vs 80% threshold). You are ready for live recruiter pipelines.
                  </p>
                </div>
              </div>
              <Link href="/opportunities" className="shrink-0">
                <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                  View Matching Jobs →
                </Button>
              </Link>
            </div>
          )}

          {isNeedsImprovement && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-rose-300">
                      DIAGNOSTIC STATUS: NEEDS FOCUSED PREPARATION ⚠️
                    </h3>
                    <Badge variant="destructive" size="sm">BELOW BENCHMARK</Badge>
                  </div>
                  <p className="text-xs text-rose-200/90 font-mono mt-0.5">
                    Your composite score ({overallScore}%) fell below the 65% hiring threshold. Review the weak questions and practice drills below.
                  </p>
                </div>
              </div>
              <Link href="/mock-interview" className="shrink-0">
                <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                  Retake Targeted Drill →
                </Button>
              </Link>
            </div>
          )}

          {isDeveloping && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-cyan-300">
                      STATUS: DEVELOPING CANDIDATE (APPROACHING BENCHMARK) ⚡
                    </h3>
                    <Badge variant="cyber" size="sm">COMPETENT</Badge>
                  </div>
                  <p className="text-xs text-cyan-200/90 font-mono mt-0.5">
                    Strong foundational competencies ({overallScore}%). Closing 1-2 critical architecture gaps will elevate you to placement-ready status.
                  </p>
                </div>
              </div>
              <Link href="/mock-interview" className="shrink-0">
                <Button variant="cyber" size="sm" className="text-xs font-mono font-bold">
                  Practice Next Level →
                </Button>
              </Link>
            </div>
          )}
        </SlideUp>

        {/* ========================================================================= */}
        {/* SECTION 2: HERO AUDIT REPORT & CIRCULAR SCORE INDICATOR                   */}
        {/* ========================================================================= */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden" glow>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Metadata Details (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {config.roleId.replace(/_/g, " ")}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {config.experienceLevel} Tier
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {config.difficulty}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                  Comprehensive Interview Performance Audit
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Evaluated by <strong>{interviewer.name}</strong> ({interviewer.role} at {interviewer.company}) across technical depth, system trade-offs, confidence indicators, and delivery pacing.
                </p>

                {/* Session Telemetry Badges */}
                <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Duration: <strong className="text-foreground">{formatDuration(totalDurationSeconds)}</strong></span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
                    <span>Questions: <strong className="text-foreground">{totalQuestionsAnswered} answered</strong></span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Date: <strong className="text-foreground">{new Date(timestamp).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-End Circular Score Indicator (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/50 border border-white/10 text-center space-y-3">
                <div className="relative h-40 w-40 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
                    {/* Background Ring */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-slate-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Active Progress Ring */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className={`transition-all duration-1000 ${
                        isInterviewReady
                          ? "stroke-emerald-400"
                          : isNeedsImprovement
                          ? "stroke-rose-400"
                          : "stroke-cyan-400"
                      }`}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Inner Score Number */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black font-mono tracking-tight text-foreground">
                      {overallScore}<span className="text-xl text-cyan-400">%</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                      COMPOSITE
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-foreground font-mono">
                    {performanceGrade}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Industry Threshold Benchmark: 80%
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* ========================================================================= */}
        {/* SECTION 3: 7-VECTOR RATING CARDS WITH PROGRESS GAUGES                     */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 font-mono">
              <Target className="h-5 w-5 text-cyan-400" />
              <span>Multi-Vector Performance Breakdown</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">Diagnostic Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Technical Knowledge */}
            <GlassCard className="p-5 space-y-3 border-cyan-500/20" glow>
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
                Architectural depth, domain keywords, and terminology precision.
              </p>
            </GlassCard>

            {/* 2. Communication Clarity */}
            <GlassCard className="p-5 space-y-3 border-blue-500/20" glow>
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
                Logical structuring, transitions, and STAR narrative flow.
              </p>
            </GlassCard>

            {/* 3. Answer Quality & Depth */}
            <GlassCard className="p-5 space-y-3 border-purple-500/20" glow>
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
                Identification of system bottlenecks and resource trade-offs.
              </p>
            </GlassCard>

            {/* 4. Problem Solving & Relevance */}
            <GlassCard className="p-5 space-y-3 border-emerald-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Relevance & Logic
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
                Direct answer to core constraints without diverging off-topic.
              </p>
            </GlassCard>

            {/* 5. Confidence Indicators */}
            <GlassCard className="p-5 space-y-3 border-amber-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Confidence Metric
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
                Assertive verbs, quantifiable telemetry, and low filler words.
              </p>
            </GlassCard>

            {/* 6. Response Pacing */}
            <GlassCard className="p-5 space-y-3 border-teal-500/20" glow>
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
                Optimal deliberation time within the 60s-150s response window.
              </p>
            </GlassCard>

            {/* 7. Completeness & Edge Cases */}
            <GlassCard className="p-5 space-y-3 border-rose-500/20 sm:col-span-2 lg:col-span-2" glow>
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
                Handling memory pressure, network partition faults, and failovers.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: STRENGTHS & WEAKNESSES CARDS                                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths Card */}
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

          {/* Weaknesses Card */}
          <GlassCard className="p-6 space-y-4 border-amber-500/20 bg-amber-950/10" glow>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-foreground">Identified Deficit Areas</h3>
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
        {/* SECTION 5: QUESTIONS ANSWERED POORLY (DEEP DIVE BREAKDOWN)                */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 font-mono">
              <Brain className="h-5 w-5 text-amber-400" />
              <span>Questions Answered Poorly (Diagnostic Deep Dive)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review exactly where points were lost, conceptual omissions, and the exemplary model answer.
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
                          Your Score: <strong className="text-amber-400">{wq.score}%</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs text-cyan-400 font-mono flex items-center gap-1 self-start sm:self-center"
                    >
                      <span>{isExpanded ? "Hide Breakdown" : "View Breakdown"}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <FadeIn>
                      <div className="pt-3 border-t border-white/[0.08] space-y-4 text-xs">
                        {/* What candidate answered */}
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
                            <Sparkles className="h-3 w-3" /> Exemplary Model Answer:
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
        {/* SECTION 6: AI-GENERATED SUGGESTIONS & RECOMMENDED PRACTICE                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Specific Improvement Suggestions */}
          <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-foreground">AI Improvement Suggestions</h3>
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

          {/* Recommended Practice Topics */}
          <GlassCard className="p-6 space-y-4 border-violet-500/20" glow>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-400" />
              <h3 className="text-base font-bold text-foreground">Recommended Practice Drills</h3>
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

        {/* ========================================================================= */}
        {/* FOOTER ACTIONS                                                            */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground font-mono max-w-xl">
            {report.practiceDisclaimer}
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="default"
              onClick={handlePrint}
              leftIcon={<Download className="h-4 w-4" />}
              className="text-xs font-mono"
            >
              Print / Save PDF
            </Button>
            <Link href="/mock-interview">
              <Button
                variant="glow"
                size="default"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="px-6 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                Retry Interview
              </Button>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PREVIOUS ATTEMPTS MODAL / DRAWER                                          */}
        {/* ========================================================================= */}
        {showAttemptsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-6 space-y-5 border-cyan-500/30 max-h-[85vh] overflow-y-auto" glow>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-foreground">Interview Attempt History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAttemptsModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {attempts.map((att) => {
                  const isCurrent = att.sessionId === reportId;
                  return (
                    <div
                      key={att.sessionId}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCurrent
                          ? "bg-cyan-500/15 border-cyan-500/40 shadow-glow-sm"
                          : "bg-slate-900/70 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {att.config.roleId.replace(/_/g, " ").toUpperCase()}
                          </span>
                          {isCurrent && <Badge variant="cyber" size="sm">VIEWING</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Interviewer: {att.interviewer.name} • {new Date(att.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <span className="text-lg font-black text-cyan-400">{att.overallScore}%</span>
                          <span className="text-[10px] text-muted-foreground block">{att.performanceGrade}</span>
                        </div>

                        {!isCurrent && (
                          <Link href={`/mock-interview/results/${att.sessionId}`}>
                            <Button
                              variant="glass"
                              size="sm"
                              className="text-xs font-mono"
                              onClick={() => setShowAttemptsModal(false)}
                            >
                              Open Report
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </Container>
    </div>
  );
}
