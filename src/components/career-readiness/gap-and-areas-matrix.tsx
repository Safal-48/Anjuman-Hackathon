"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Target,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CareerReadinessProfile } from "@/lib/analytics/career-readiness-engine";

interface GapAndAreasMatrixProps {
  profile: CareerReadinessProfile;
}

export function GapAndAreasMatrix({ profile }: GapAndAreasMatrixProps) {
  const { strongestAreas, weakestAreas, currentSkillGaps } = profile;

  return (
    <div className="space-y-8">
      {/* 2-Column: Strongest Areas vs Weakest Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strongest Areas */}
        <GlassCard className="p-6 space-y-4 border-emerald-500/30 bg-emerald-950/10" glow>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-foreground font-mono">
                Verified Strongest Competencies
              </h3>
            </div>
            <Badge variant="emerald" size="sm" className="font-mono text-[10px]">
              TIER 1 PROVEN
            </Badge>
          </div>

          <div className="space-y-3">
            {strongestAreas.map((area, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground font-mono">{area.title}</span>
                  <span className="text-xs font-black font-mono text-emerald-400">
                    {area.score}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {area.category}
                  </span>
                  <span className="text-muted-foreground text-[10px]">•</span>
                  <p className="text-[11px] text-emerald-200/80 font-mono">{area.proofMetric}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Weakest Areas */}
        <GlassCard className="p-6 space-y-4 border-amber-500/30 bg-amber-950/10" glow>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-foreground font-mono">
                Critical Growth Areas
              </h3>
            </div>
            <Badge variant="amber" size="sm" className="font-mono text-[10px]">
              ACTION REQUIRED
            </Badge>
          </div>

          <div className="space-y-3">
            {weakestAreas.map((area, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground font-mono">{area.title}</span>
                  <span className="text-xs font-black font-mono text-amber-400">
                    {area.score}%
                  </span>
                </div>
                <p className="text-[11px] text-rose-300/90 font-mono">
                  Impact: {area.deficiencyImpact}
                </p>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 font-mono">
                  💡 <strong>Suggested Remedy:</strong> {area.suggestedRemedy}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Current Skill Gaps Table / Matrix */}
      <GlassCard className="p-6 sm:p-8 space-y-6 border-white/10" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-foreground font-mono">
                Current Skill Gaps & Deficit Telemetry
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Skills required for your target role of &ldquo;{profile.targetRole}&rdquo; that need verified assessment.
            </p>
          </div>

          <Link href="/skills">
            <Button variant="glass" size="sm" className="text-xs font-mono">
              View All Skills ({currentSkillGaps.length} Gaps)
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentSkillGaps.map((gap, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    {gap.category}
                  </span>
                  <Badge
                    variant={gap.priority === "Critical" ? "destructive" : "amber"}
                    size="sm"
                    className="font-mono text-[9px]"
                  >
                    {gap.priority} Priority
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-foreground font-mono">{gap.skill}</h4>

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Current Status:</span>
                    <strong className="text-foreground">{gap.currentLevel}</strong>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Target Level:</span>
                    <strong className="text-cyan-300">{gap.requiredLevel}</strong>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Time to Close:</span>
                    <strong className="text-violet-300">{gap.timeToCloseHours} Hours</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                  {gap.impactOnReadiness}
                </div>
              </div>

              <Link href={gap.learningActionUrl}>
                <Button variant="glow" size="sm" className="w-full text-xs font-mono font-bold">
                  Start Practice Lab →
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
