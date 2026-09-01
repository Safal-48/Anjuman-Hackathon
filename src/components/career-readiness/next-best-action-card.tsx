"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NextBestActionFlow } from "@/lib/analytics/career-readiness-engine";

interface NextBestActionCardProps {
  actionFlow: NextBestActionFlow;
}

export function NextBestActionCard({ actionFlow }: NextBestActionCardProps) {
  const { step1, step2, step3, fullFlowString, reasoning, projectedScoreBoost, primaryCtaLabel, primaryCtaHref } =
    actionFlow;

  return (
    <GlassCard
      className="p-6 sm:p-8 border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-violet-950/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] relative overflow-hidden space-y-6"
      glow
    >
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 fill-cyan-300" />
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              PROACTIVE INTELLIGENCE ENGINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Your Next Best Action
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge variant="emerald" size="sm" className="font-mono text-xs px-2.5 py-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+{projectedScoreBoost}% Score Boost</span>
          </Badge>
          <Badge variant="cyber" size="sm" className="font-mono text-xs">
            HIGHEST ROI
          </Badge>
        </div>
      </div>

      {/* 3-Step Connected Roadmap Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
              STEP 1 • {step1.badge}
            </span>
            <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center">
              1
            </span>
          </div>
          <p className="text-xs font-bold text-foreground leading-snug">{step1.action}</p>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-black/40 border border-violet-500/30 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-violet-400 uppercase">
              STEP 2 • {step2.badge}
            </span>
            <span className="h-5 w-5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </div>
          <p className="text-xs font-bold text-foreground leading-snug">{step2.action}</p>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
              STEP 3 • {step3.badge}
            </span>
            <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </div>
          <p className="text-xs font-bold text-foreground leading-snug">{step3.action}</p>
        </div>
      </div>

      {/* Pipeline String Formula & Reasoning */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
          <span>Formula:</span>
          <span className="text-foreground/90 font-mono tracking-tight bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/5">
            {fullFlowString}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{reasoning}</p>
      </div>

      {/* CTA Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <span className="text-xs text-muted-foreground font-mono">
          Estimated Completion Time: <strong>3.5 Hours</strong> • Unlocks 4 Target Jobs
        </span>

        <Link href={primaryCtaHref} className="w-full sm:w-auto">
          <Button
            variant="glow"
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto px-8 py-5 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(6,182,212,0.45)]"
          >
            {primaryCtaLabel}
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
