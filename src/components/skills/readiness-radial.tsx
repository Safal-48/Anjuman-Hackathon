"use client";

import React from "react";
import { Zap, Sparkles, Brain, Users, Cpu, Target, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillIntelligenceReport } from "@/lib/supabase/types";

interface ReadinessRadialProps {
  report: SkillIntelligenceReport;
}

export function ReadinessRadial({ report }: ReadinessRadialProps) {
  const {
    overallReadinessScore,
    technicalScore,
    softSkillScore,
    aptitudeScore,
    careerAlignmentScore,
  } = report;

  const getTier = (score: number) => {
    if (score >= 85) return { label: "Elite Tier (Top 5%)", badgeVariant: "cyber" as const, color: "text-cyan-400" };
    if (score >= 70) return { label: "Placement Ready", badgeVariant: "emerald" as const, color: "text-emerald-400" };
    if (score >= 50) return { label: "Developing Competence", badgeVariant: "amber" as const, color: "text-amber-400" };
    return { label: "Foundational Phase", badgeVariant: "violet" as const, color: "text-violet-400" };
  };

  const currentTier = getTier(overallReadinessScore);

  const pillars = [
    {
      title: "Technical Engineering",
      score: technicalScore,
      icon: Cpu,
      color: "from-cyan-500 to-blue-500",
      textColor: "text-cyan-400",
      description: "Systems, Next.js, PyTorch & Architecture",
    },
    {
      title: "Soft Skills & Teamwork",
      score: softSkillScore,
      icon: Users,
      color: "from-violet-500 to-purple-500",
      textColor: "text-violet-400",
      description: "Mentorship, Collaboration & Agile Ownership",
    },
    {
      title: "Cognitive Aptitude",
      score: aptitudeScore,
      icon: Brain,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-400",
      description: "Algorithms, Logic & Problem Solving",
    },
    {
      title: "Domain Career Alignment",
      score: careerAlignmentScore,
      icon: Target,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400",
      description: "Target Role Velocity & Focus",
    },
  ];

  return (
    <GlassCard className="p-6 space-y-6 border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20" glow>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-glow-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Multi-Vector Readiness Index</h2>
            <p className="text-xs text-muted-foreground">Deterministic multi-pillar evaluation calibrated to industrial benchmarks</p>
          </div>
        </div>

        <Badge variant={currentTier.badgeVariant} dot dotColor="cyan" className="self-start sm:self-center">
          {currentTier.label.toUpperCase()}
        </Badge>
      </div>

      {/* Main Radial Display & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Animated Radial Gauge */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#00f0ff"
                strokeWidth="12"
                strokeDasharray={376.99}
                strokeDashoffset={376.99 - (376.99 * overallReadinessScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-foreground">{overallReadinessScore}%</span>
              <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">Overall</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-bold text-sm text-foreground">Composite Index</h3>
            <p className="text-[11px] text-muted-foreground">40% Tech • 25% Soft • 25% Apt • 10% Career</p>
          </div>
        </div>

        {/* 4 Pillar Breakdown Bars */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${p.textColor}`} />
                    <span className="text-xs font-semibold text-foreground/90">{p.title}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${p.textColor}`}>{p.score}%</span>
                </div>

                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${p.color} rounded-full transition-all duration-500`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>

                <p className="text-[10px] text-muted-foreground font-mono truncate">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
