"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  Brain,
  FileText,
  Users,
  Layers,
  Compass,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  RotateCcw,
  History,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NextBestActionCard } from "@/components/career-readiness/next-best-action-card";
import { PillarReadinessCard } from "@/components/career-readiness/pillar-readiness-card";
import { GapAndAreasMatrix } from "@/components/career-readiness/gap-and-areas-matrix";
import { LearningAndOpportunities } from "@/components/career-readiness/learning-and-opportunities";
import {
  getCareerReadinessProfile,
  CareerReadinessProfile,
} from "@/lib/analytics/career-readiness-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function DedicatedCareerReadinessPage() {
  const [profile, setProfile] = useState<CareerReadinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/career-readiness");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else {
          // Fallback to local deterministic generator
          setProfile(getCareerReadinessProfile());
        }
      } catch (err) {
        console.error("Failed to load career readiness profile:", err);
        setProfile(getCareerReadinessProfile());
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen py-12 bg-slate-950 text-foreground">
        <Container size="xl" className="space-y-8">
          <Skeleton className="h-44 w-full rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-3xl" />
        </Container>
      </div>
    );
  }

  const {
    studentName,
    targetRole,
    targetIndustry,
    lastUpdated,
    overallScore,
    readinessTier,
    readinessStatusBanner,
    pillars,
    nextBestAction,
  } = profile;

  // SVG Circular Gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-10 max-w-7xl">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Back to Dashboard"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Skillora Professional Intelligence
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-cyan-400" />
                <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                  CENTRAL READINESS ENGINE
                </Badge>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                Comprehensive Career Readiness
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono text-muted-foreground hidden md:block">
              <span>Target Role: </span>
              <strong className="text-foreground">{targetRole}</strong>
              <span className="block text-[10px] text-muted-foreground/70">
                Audited: {lastUpdated}
              </span>
            </div>

            <Link href="/opportunities">
              <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                Matching Opportunities →
              </Button>
            </Link>
          </div>
        </div>

        {/* Readiness Status Banner */}
        <SlideUp>
          <div
            className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              readinessStatusBanner.variant === "emerald"
                ? "bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                : readinessStatusBanner.variant === "cyber"
                ? "bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/40 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                : "bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/40"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  readinessStatusBanner.variant === "emerald"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                }`}
              >
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground font-mono">
                    {readinessStatusBanner.title}
                  </h3>
                  <Badge variant="cyber" size="sm">
                    {readinessTier}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5 max-w-2xl">
                  {readinessStatusBanner.description}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Link href="#breakdown">
                <Button variant="glass" size="sm" className="text-xs font-mono">
                  Inspect Multi-Pillars ↓
                </Button>
              </Link>
            </div>
          </div>
        </SlideUp>

        {/* Hero Section: Overall Score Gauge & Transparent Breakdown */}
        <FadeIn>
          <GlassCard
            id="breakdown"
            className="p-6 sm:p-8 border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden space-y-6"
            glow
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column (7 cols): Transparent Formula Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                    TRANSPARENT SCORING RUBRIC
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">5-Pillar Weighted Core</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight font-mono">
                  Deterministic Career Readiness Index
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your overall readiness score is computed through transparent, verified telemetry across skills, GitHub project commits, ATS resume parsing, AI mock interviews, and group discussions.
                </p>

                {/* Weighted Telemetry Formula */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-muted-foreground border-b border-white/5 pb-1.5">
                    <span>Skill Readiness (25%)</span>
                    <strong className="text-cyan-300">{pillars.skillReadiness.score}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground border-b border-white/5 pb-1.5">
                    <span>Project Evidence (20%)</span>
                    <strong className="text-blue-300">{pillars.projectEvidence.score}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground border-b border-white/5 pb-1.5">
                    <span>Resume Readiness (20%)</span>
                    <strong className="text-violet-300">{pillars.resumeReadiness.score}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground border-b border-white/5 pb-1.5">
                    <span>Mock Interview Readiness (20%)</span>
                    <strong className="text-amber-300">{pillars.interviewReadiness.score}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Group Discussion Readiness (15%)</span>
                    <strong className="text-emerald-300">{pillars.gdReadiness.score}%</strong>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Circular SVG Indicator */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/60 border border-white/10 text-center space-y-3">
                <div className="relative h-44 w-44 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className="stroke-slate-800"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className="stroke-cyan-400 transition-all duration-1000"
                      strokeWidth="12"
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
                      CAREER READINESS
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-foreground font-mono">
                    {readinessTier}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Target Enterprise Cutoff: 80%
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* PROMINENT COMPONENT: YOUR NEXT BEST ACTION */}
        <FadeIn>
          <NextBestActionCard actionFlow={nextBestAction} />
        </FadeIn>

        {/* 6 MODULAR PILLARS CARDS GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground font-mono">
                Modular Readiness Pillars
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">6 Dedicated Diagnostic Dimensions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PillarReadinessCard pillarKey="skillReadiness" pillar={pillars.skillReadiness} />
            <PillarReadinessCard pillarKey="resumeReadiness" pillar={pillars.resumeReadiness} />
            <PillarReadinessCard pillarKey="interviewReadiness" pillar={pillars.interviewReadiness} />
            <PillarReadinessCard pillarKey="gdReadiness" pillar={pillars.gdReadiness} />
            <PillarReadinessCard pillarKey="projectEvidence" pillar={pillars.projectEvidence} />
            <PillarReadinessCard pillarKey="careerGoalAlignment" pillar={pillars.careerGoalAlignment} />
          </div>
        </div>

        {/* STRONGEST AREAS, WEAKEST AREAS & SKILL GAPS MATRIX */}
        <GapAndAreasMatrix profile={profile} />

        {/* RECOMMENDED LEARNING LABS & MATCHING OPPORTUNITIES */}
        <LearningAndOpportunities profile={profile} />

        {/* Bottom Footer Actions */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>Skillora Holistic Career Readiness Suite • Verified & Audited Live</p>

          <div className="flex items-center gap-3">
            <Link href="/skills">
              <Button variant="glass" size="sm" className="text-xs font-mono">
                Skill Studio
              </Button>
            </Link>
            <Link href="/resume-analyzer">
              <Button variant="glass" size="sm" className="text-xs font-mono">
                Resume ATS
              </Button>
            </Link>
            <Link href="/mock-interview">
              <Button variant="glass" size="sm" className="text-xs font-mono">
                Mock Interview
              </Button>
            </Link>
            <Link href="/group-discussion">
              <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                GD Studio
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
