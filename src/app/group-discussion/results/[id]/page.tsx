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
  Users,
  Flame,
  Lightbulb,
  Check,
  Sliders,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FinalGDReport } from "@/lib/ai/gd-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function DedicatedGDResultsPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const [report, setReport] = useState<FinalGDReport | null>(null);
  const [attempts, setAttempts] = useState<FinalGDReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  useEffect(() => {
    async function loadReportData() {
      if (!reportId) return;
      setIsLoading(true);
      try {
        const [reportRes, attemptsRes] = await Promise.all([
          fetch(`/api/ai/gd/report/${reportId}`),
          fetch(`/api/ai/gd/attempts`),
        ]);

        if (reportRes.ok) {
          const rData = await reportRes.json();
          setReport(rData.report);
        }

        if (attemptsRes.ok) {
          const aData = await attemptsRes.json();
          setAttempts(aData.attempts || []);
        }
      } catch (err) {
        console.error("Failed to load GD report:", err);
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
    readinessState,
    categoryRatings,
    strengths,
    weaknesses,
    strongMoments = [],
    missedOpportunities = [],
    counterArgumentHandlings,
    actionableBehavioralSuggestions,
    recommendedDrills,
    transcript,
    topicTitle,
    topicCategory,
    totalDurationSeconds,
    studentTurnCount,
    totalGroupTurns,
    studentAirtimePercentage,
    timestamp,
  } = report;

  const isPlacementReady = overallScore >= 80;
  const isNeedsImprovement = overallScore < 65;
  const isCompetitive = !isPlacementReady && !isNeedsImprovement;

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
              href="/group-discussion"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>GD Simulation Studio</span>
            </Link>

            <span className="text-muted-foreground text-xs font-mono">/</span>
            <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              Discussion Performance Audit
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

            <Link href="/group-discussion">
              <Button
                variant="glow"
                size="sm"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono font-bold"
              >
                Retry GD
              </Button>
            </Link>
          </div>
        </div>

        {/* Readiness Status Banner */}
        <SlideUp>
          {isPlacementReady && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground font-mono">
                      VERIFIED STATUS: PLACEMENT READY GD CANDIDATE ✅
                    </h3>
                    <Badge variant="emerald" size="sm">TOP TIER</Badge>
                  </div>
                  <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                    Your composite score ({overallScore}%) and airtime balance ({studentAirtimePercentage}%) meet corporate recruitment benchmarks.
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
                    <h3 className="font-extrabold text-base text-rose-300 font-mono">
                      STATUS: NEEDS ASSERTIVENESS & STRUCTURE ⚠️
                    </h3>
                    <Badge variant="destructive" size="sm">BELOW BENCHMARK</Badge>
                  </div>
                  <p className="text-xs text-rose-200/90 font-mono mt-0.5">
                    Your composite score ({overallScore}%) fell below the 65% benchmark. Practice rapid rebuttals and structured frameworks.
                  </p>
                </div>
              </div>
              <Link href="/group-discussion" className="shrink-0">
                <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                  Practice Again →
                </Button>
              </Link>
            </div>
          )}

          {isCompetitive && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-cyan-300 font-mono">
                      STATUS: COMPETITIVE GD PARTICIPANT ⚡
                    </h3>
                    <Badge variant="cyber" size="sm">COMPETENT</Badge>
                  </div>
                  <p className="text-xs text-cyan-200/90 font-mono mt-0.5">
                    Solid participation ({overallScore}%). Anchoring points with concrete case studies will elevate you to placement-ready status.
                  </p>
                </div>
              </div>
              <Link href="/group-discussion" className="shrink-0">
                <Button variant="cyber" size="sm" className="text-xs font-mono font-bold">
                  Practice Next Level →
                </Button>
              </Link>
            </div>
          )}
        </SlideUp>

        {/* Hero Performance Card & Circular Score Dial */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden" glow>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {topicCategory}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {report.config.difficulty.replace(/_/g, " ")} Tier
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                  {topicTitle}
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Evaluated across communication delivery, thematic relevance, airtime balance, argument structure, and counter-argument handling.
                </p>

                {/* Telemetry Badges */}
                <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Duration: <strong className="text-foreground">{formatDuration(totalDurationSeconds)}</strong></span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
                    <span>Your Turns: <strong className="text-foreground">{studentTurnCount} of {totalGroupTurns}</strong></span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Airtime Share: <strong className="text-foreground">{studentAirtimePercentage}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: Circular Score Indicator (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/50 border border-white/10 text-center space-y-3">
                <div className="relative h-40 w-40 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-slate-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className={`transition-all duration-1000 ${
                        isPlacementReady
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

                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black font-mono tracking-tight text-foreground">
                      {overallScore}<span className="text-xl text-cyan-400">%</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                      GD SCORE
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-foreground font-mono">
                    {readinessState}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Benchmark: 80%
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Visual Rating Components: 4 Key Dimensions + Extended Vectors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 font-mono">
              <Target className="h-5 w-5 text-cyan-400" />
              <span>Core Discussion Ratings</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">Visual Competency Metrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Communication Rating */}
            <GlassCard className="p-5 space-y-3 border-cyan-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Communication Rating
                </span>
                <span className="text-sm font-black font-mono text-cyan-400">
                  {categoryRatings.communication}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${categoryRatings.communication}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Vocal cadence, confidence, and professional delivery.
              </p>
            </GlassCard>

            {/* 2. Relevance Rating */}
            <GlassCard className="p-5 space-y-3 border-blue-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Relevance Rating
                </span>
                <span className="text-sm font-black font-mono text-blue-400">
                  {categoryRatings.relevance}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${categoryRatings.relevance}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Direct linkage to core debate angles without wandering.
              </p>
            </GlassCard>

            {/* 3. Participation Rating */}
            <GlassCard className="p-5 space-y-3 border-emerald-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Participation Rating
                </span>
                <span className="text-sm font-black font-mono text-emerald-400">
                  {categoryRatings.participationAndPacing}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${categoryRatings.participationAndPacing}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Airtime share balance ({studentAirtimePercentage}% vs 20-30% ideal).
              </p>
            </GlassCard>

            {/* 4. Argument Quality */}
            <GlassCard className="p-5 space-y-3 border-amber-500/20" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground font-mono uppercase">
                  Argument Quality
                </span>
                <span className="text-sm font-black font-mono text-amber-400">
                  {categoryRatings.argumentQuality}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${categoryRatings.argumentQuality}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Evidence-backed claims and structured first principles.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Strengths & Weaknesses Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <GlassCard className="p-6 space-y-4 border-emerald-500/20 bg-emerald-950/10" glow>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-foreground">Demonstrated GD Strengths</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-foreground/90">{s}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Weaknesses */}
          <GlassCard className="p-6 space-y-4 border-amber-500/20 bg-amber-950/10" glow>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-foreground">Identified Weaknesses & Deficits</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-foreground/90">{w}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Strong Moments & Missed Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strong Moments */}
          <GlassCard className="p-6 space-y-4 border-cyan-500/20 bg-cyan-950/10" glow>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-foreground">Strong Moments</h3>
            </div>

            <div className="space-y-3 text-xs">
              {strongMoments.map((sm, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 font-mono text-[11px]">
                      Turn #{sm.turnIndex}: {sm.competencyDemonstrated}
                    </span>
                    <Badge variant="emerald" size="sm">EFFECTIVE</Badge>
                  </div>
                  <p className="text-foreground/90 font-mono italic text-[11px]">
                    &ldquo;{sm.snippet}&rdquo;
                  </p>
                  <p className="text-[11px] text-muted-foreground">{sm.impactAnalysis}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Missed Opportunities */}
          <GlassCard className="p-6 space-y-4 border-amber-500/20 bg-amber-950/10" glow>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-foreground">Missed Opportunities</h3>
            </div>

            <div className="space-y-3 text-xs">
              {missedOpportunities.map((mo, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 font-mono text-[11px]">
                      {mo.contextPhase}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">{mo.potentialScoreImpact}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{mo.whatOccurred}</p>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 font-mono">
                    💡 <strong>Recommended Intervention:</strong> {mo.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Counter-Argument Handling Diagnostic */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 font-mono">
              <Flame className="h-5 w-5 text-rose-400" />
              <span>Counter-Argument Resilience Analysis</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">Adversarial Defense Breakdown</span>
          </div>

          <div className="space-y-3">
            {counterArgumentHandlings.map((c, i) => (
              <GlassCard key={i} className="p-5 border-white/10 space-y-3" glow>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
                  <span className="text-xs font-bold text-foreground">{c.challengerName}</span>
                  <span className="text-xs font-mono text-cyan-400">
                    Defense Effectiveness: <strong>{c.effectivenessScore}%</strong>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                    Peer Objection Raised:
                  </span>
                  <p className="text-xs text-rose-200/90 italic font-mono">{c.challengeStatement}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                    Your Response Summary:
                  </span>
                  <p className="text-xs text-foreground/90 font-mono">{c.studentResponseSummary}</p>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    Diagnostic Feedback:
                  </span>
                  <p className="text-xs text-cyan-200/90">{c.diagnosticFeedback}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Improvement Recommendations & Recommended Practice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-foreground">Improvement Recommendations</h3>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground">
              {actionableBehavioralSuggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-foreground/90">{sug}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 space-y-4 border-violet-500/20" glow>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-400" />
              <h3 className="text-base font-bold text-foreground">Recommended Practice Drills</h3>
            </div>
            <div className="space-y-3 text-xs">
              {recommendedDrills.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-violet-500/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-violet-300 text-xs">{rec.title}</span>
                    <Badge variant={rec.priority === "High" ? "amber" : "glass"} size="sm">
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{rec.drillDescription}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Discussion Transcript Toggle */}
        <GlassCard className="p-5 border-white/10 space-y-4" glow>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowFullTranscript(!showFullTranscript)}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-foreground">
                Complete Discussion Transcript ({transcript.length} Turns)
              </h3>
            </div>

            <button type="button" className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <span>{showFullTranscript ? "Hide Transcript" : "View Full Transcript"}</span>
              {showFullTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {showFullTranscript && (
            <div className="pt-3 border-t border-white/[0.08] space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                    msg.speakerId === "student"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-100"
                      : "bg-slate-900/80 border-white/5 text-foreground/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-foreground">{msg.speakerName}</span>
                    <span className="text-muted-foreground">{formatDuration(msg.timestampSeconds)}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground font-mono">
            Evaluated by KaushalSetu Multi-Agent GD Intelligence Core.
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
            <Link href="/group-discussion">
              <Button
                variant="glow"
                size="default"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="px-6 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] text-xs font-mono"
              >
                Retry GD
              </Button>
            </Link>
          </div>
        </div>

        {/* Previous Attempts Drawer */}
        {showAttemptsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-6 space-y-5 border-cyan-500/30 max-h-[85vh] overflow-y-auto" glow>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-foreground">GD Session History</h3>
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
                          <span className="text-xs font-bold text-foreground line-clamp-1">
                            {att.topicTitle}
                          </span>
                          {isCurrent && <Badge variant="cyber" size="sm">VIEWING</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {att.topicCategory} • {new Date(att.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <span className="text-lg font-black text-cyan-400">{att.overallScore}%</span>
                          <span className="text-[10px] text-muted-foreground block">{att.readinessState}</span>
                        </div>

                        {!isCurrent && (
                          <Link href={`/group-discussion/results/${att.sessionId}`}>
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
