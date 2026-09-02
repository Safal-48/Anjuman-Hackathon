"use client";

import React from "react";
import Link from "next/link";
import {
  Target,
  Sparkles,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  BookOpen,
  Brain,
  Zap,
  CheckCircle2,
  Clock,
  Dna,
  GitFork,
  Flame,
  Award,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LearningCommandCenterProps {
  goalTitle?: string;
  currentProgress?: number;
  currentGap?: string;
  nextBestActionTitle?: string;
  nextBestActionDuration?: string;
  nextBestActionWhy?: string;
  nextBestActionUrl?: string;
}

export function LearningCommandCenter({
  goalTitle = "Become a Data Analyst",
  currentProgress = 68,
  currentGap = "SQL JOINs",
  nextBestActionTitle = "Practice SQL JOINs",
  nextBestActionDuration = "15 min",
  nextBestActionWhy = "Your recent accuracy is 43%, and JOINs are a high-dependency prerequisite for your selected goal.",
  nextBestActionUrl = "/learning/intervention",
}: LearningCommandCenterProps) {
  return (
    <div className="space-y-8">
      {/* 1. TOP LEARNING COMMAND CENTER HERO BANNER (STEP 13 SPECIFICATION) */}
      <GlassCard
        className="p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-cyan-950/30 shadow-[0_0_40px_rgba(6,182,212,0.18)] relative overflow-hidden"
        glow
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          {/* Goal & Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                LEARNING COMMAND CENTER
              </span>
              <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                Autonomous Guidance
              </Badge>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-semibold">
                YOUR PRIMARY GOAL:
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono tracking-tight mt-0.5">
                {goalTitle}
              </h1>
            </div>
          </div>

          {/* Quick Stats: Current Progress & Current Gap */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono min-w-[130px]">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Current Progress</span>
              <span className="text-2xl font-black text-cyan-400">{currentProgress}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Target: 85% Benchmark</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/40 text-xs font-mono min-w-[130px]">
              <span className="text-[10px] text-rose-300 uppercase block font-semibold">Current Gap</span>
              <span className="text-lg font-black text-rose-400">{currentGap}</span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5">Score: 42% (Critical)</span>
            </div>
          </div>
        </div>

        {/* 2. NEXT BEST ACTION & WHY THIS RATIONALE */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-950/80 to-cyan-950/40 border border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-widest">
                NEXT BEST ACTION • DO THIS FIRST
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
              <span>🔴 {nextBestActionTitle}</span>
              <span className="text-sm font-mono text-slate-400 font-normal">({nextBestActionDuration})</span>
            </h3>

            <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-2xl pt-0.5">
              <strong className="text-cyan-300">WHY? </strong> {nextBestActionWhy}
            </p>
          </div>

          <div className="shrink-0">
            <Link href={nextBestActionUrl}>
              <Button variant="cyber" size="default" className="text-xs font-mono gap-2 shadow-glow px-5 py-3 h-auto">
                <Zap className="h-4 w-4" />
                <span>Execute Next Best Action</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* 3. 6 CRITICAL SUB-SECTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Section 1: Skill DNA */}
        <GlassCard className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Dna className="h-4 w-4" /> 1. Personal Skill DNA
              </span>
              <Badge variant="cyber" size="sm" className="text-[9px]">Continuous</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Live multi-vector competencies (Python 82% ↑, SQL 51% ↓, Power BI 34% ↓). Self-declared claims remain unverified until tested.
            </p>
          </div>
          <Link href="/skills">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 border-white/10 hover:border-cyan-500/30">
              <span>Inspect Skill DNA</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            </Button>
          </Link>
        </GlassCard>

        {/* Section 2: Adaptive Roadmap */}
        <GlassCard className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <GitFork className="h-4 w-4" /> 2. Adaptive Roadmap
              </span>
              <Badge variant="cyber" size="sm" className="text-[9px]">38% Progress</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Dynamic milestone graph connecting Resource ➔ Explanation ➔ Practice ➔ Assessment. Advances when you prove skills.
            </p>
          </div>
          <Link href="/learning/roadmap">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 border-white/10 hover:border-emerald-500/30">
              <span>Open Adaptive Roadmap</span>
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            </Button>
          </Link>
        </GlassCard>

        {/* Section 3: Recent Performance */}
        <GlassCard className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="h-4 w-4" /> 3. Recent Performance
              </span>
              <Badge variant="amber" size="sm" className="text-[9px]">Telemetry</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Diagnostic probes breakdown: Basics 86%, Filtering 78%, Aggregation 71%, JOINs 42% (Critical Deficit).
            </p>
          </div>
          <Link href="/assessment">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 border-white/10 hover:border-amber-500/30">
              <span>View Assessment Audit</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
            </Button>
          </Link>
        </GlassCard>

        {/* Section 4: Learning Progress & Velocity */}
        <GlassCard className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" /> 4. Learning Progress
              </span>
              <Badge variant="emerald" size="sm" className="text-[9px]">+23.0% Velocity</Badge>
            </div>
            <p className="text-xs text-slate-300">
              20 interventions completed across 5 domains. Signature LEARN ➔ PRACTICE ➔ PROVE ➔ REASSESS validation active.
            </p>
          </div>
          <Link href="/progress/growth">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 border-white/10 hover:border-emerald-500/30">
              <span>Track Growth Velocity</span>
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            </Button>
          </Link>
        </GlassCard>

        {/* Section 5: Recommended Resources */}
        <GlassCard className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> 5. Recommended Resources
              </span>
              <Badge variant="glass" size="sm" className="text-[9px]">4 Pillars</Badge>
            </div>
            <p className="text-xs text-slate-300">
              &ldquo;Why This?&rdquo; explainable recommendations with interactive telemetry inspection and remediation sandboxes.
            </p>
          </div>
          <Link href="/learning/resources">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 border-white/10 hover:border-violet-500/30">
              <span>Explore Recommendations</span>
              <ArrowRight className="h-3.5 w-3.5 text-violet-400" />
            </Button>
          </Link>
        </GlassCard>

        {/* Section 6: Reassessment */}
        <GlassCard className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4" /> 6. Reassessment & Proof
              </span>
              <Badge variant="cyber" size="sm" className="text-[9px]">Institutional</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Prove mastery on practiced competencies to earn cryptographic digital portfolio badges and unblock career milestones.
            </p>
          </div>
          <Link href="/assessment">
            <Button variant="cyber" size="sm" className="w-full text-xs font-mono gap-1.5 shadow-glow">
              <span>Launch Reassessment Probe</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
