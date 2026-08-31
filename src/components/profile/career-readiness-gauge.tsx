"use client";

import React from "react";
import { Zap, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, Target, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FullUserProfile } from "@/lib/supabase/types";

interface CareerReadinessGaugeProps {
  profile: FullUserProfile;
}

export function CareerReadinessGauge({ profile }: CareerReadinessGaugeProps) {
  const readinessScore = profile.studentProfile?.readinessScore || 75;

  const getReadinessTier = (score: number) => {
    if (score >= 90) return { label: "Tier 1 Elite Ready", color: "text-cyan-400", badge: "cyber" as const };
    if (score >= 75) return { label: "High Placement Readiness", color: "text-emerald-400", badge: "emerald" as const };
    if (score >= 50) return { label: "Active Growth Standing", color: "text-amber-400", badge: "amber" as const };
    return { label: "Foundational Phase", color: "text-violet-400", badge: "violet" as const };
  };

  const tier = getReadinessTier(readinessScore);

  const breakdownMetrics = [
    {
      label: "Technical Stack Depth",
      value: Math.min((profile.skills?.length || 0) * 15, 95),
      detail: `${profile.skills?.length || 0} Verified Skills`,
    },
    {
      label: "Portfolio Engineering Rigor",
      value: Math.min((profile.projects?.length || 0) * 35, 90),
      detail: `${profile.projects?.length || 0} Published Projects`,
    },
    {
      label: "Accredited Certifications",
      value: Math.min((profile.certifications?.length || 0) * 40, 85),
      detail: `${profile.certifications?.length || 0} Credentials Verified`,
    },
    {
      label: "Honors & Distinctions",
      value: Math.min((profile.achievements?.length || 0) * 50, 90),
      detail: `${profile.achievements?.length || 0} Honors Listed`,
    },
  ];

  return (
    <GlassCard className="p-6 space-y-6 border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/20" glow>
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-glow-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Career Readiness Metric</h2>
            <p className="text-xs text-muted-foreground">Multi-dimensional competence & placement probability index</p>
          </div>
        </div>

        <Badge variant={tier.badge} dot dotColor="cyan">
          {tier.label.toUpperCase()}
        </Badge>
      </div>

      {/* Main Circular / Metric Display */}
      <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center">
            {/* Circular Gauge Graphic */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#00f0ff"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold font-mono text-foreground">{readinessScore}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">Ecosystem Competence Rating</h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Based on code repository depth, verified technical skills, and hackathon distinction records.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Top 5% candidate percentile for AI & Systems Architecture</span>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {breakdownMetrics.map((m) => (
          <div key={m.label} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground/90">{m.label}</span>
              <span className="font-mono text-cyan-400 font-bold">{m.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${m.value}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono block">{m.detail}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
