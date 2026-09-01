"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  FileText,
  Sparkles,
  Users,
  Layers,
  Compass,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PillarScore } from "@/lib/analytics/career-readiness-engine";

interface PillarReadinessCardProps {
  pillarKey: string;
  pillar: PillarScore;
}

export function PillarReadinessCard({ pillarKey, pillar }: PillarReadinessCardProps) {
  const getIcon = () => {
    switch (pillarKey) {
      case "skillReadiness":
        return <Brain className="h-5 w-5 text-cyan-400" />;
      case "resumeReadiness":
        return <FileText className="h-5 w-5 text-violet-400" />;
      case "interviewReadiness":
        return <Sparkles className="h-5 w-5 text-amber-400" />;
      case "gdReadiness":
        return <Users className="h-5 w-5 text-emerald-400" />;
      case "projectEvidence":
        return <Layers className="h-5 w-5 text-blue-400" />;
      case "careerGoalAlignment":
        return <Compass className="h-5 w-5 text-teal-400" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getBorderGlow = () => {
    switch (pillarKey) {
      case "skillReadiness":
        return "border-cyan-500/30 hover:border-cyan-500/60";
      case "resumeReadiness":
        return "border-violet-500/30 hover:border-violet-500/60";
      case "interviewReadiness":
        return "border-amber-500/30 hover:border-amber-500/60";
      case "gdReadiness":
        return "border-emerald-500/30 hover:border-emerald-500/60";
      case "projectEvidence":
        return "border-blue-500/30 hover:border-blue-500/60";
      case "careerGoalAlignment":
        return "border-teal-500/30 hover:border-teal-500/60";
      default:
        return "border-white/10";
    }
  };

  const getBarGradient = () => {
    switch (pillarKey) {
      case "skillReadiness":
        return "bg-gradient-to-r from-cyan-500 to-blue-500";
      case "resumeReadiness":
        return "bg-gradient-to-r from-violet-500 to-purple-500";
      case "interviewReadiness":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "gdReadiness":
        return "bg-gradient-to-r from-emerald-500 to-teal-500";
      case "projectEvidence":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "careerGoalAlignment":
        return "bg-gradient-to-r from-teal-500 to-emerald-500";
      default:
        return "bg-cyan-500";
    }
  };

  return (
    <GlassCard
      className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${getBorderGlow()} bg-slate-900/80`}
      glow
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black/40 border border-white/10">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-mono">{pillar.label}</h3>
              {pillar.weightPercentage > 0 ? (
                <span className="text-[10px] font-mono text-muted-foreground">
                  Weight: {pillar.weightPercentage}%
                </span>
              ) : (
                <span className="text-[10px] font-mono text-cyan-400">Target Benchmark</span>
              )}
            </div>
          </div>

          {/* Score Badge */}
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-foreground">
              {pillar.score}<span className="text-sm text-muted-foreground">%</span>
            </span>
            <Badge
              variant={pillar.status === "Exemplary" ? "emerald" : "cyber"}
              size="sm"
              className="text-[9px] font-mono px-1.5 py-0 block"
            >
              {pillar.status}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${getBarGradient()}`}
              style={{ width: `${pillar.score}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>{pillar.headlineMetric}</span>
            <span>Target: 80%+</span>
          </div>
        </div>

        {/* Details Text */}
        <p className="text-xs text-muted-foreground leading-relaxed font-mono line-clamp-3">
          {pillar.details}
        </p>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-white/[0.08]">
        <Link
          href={pillar.actionHref}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between group font-bold"
        >
          <span>{pillar.actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </GlassCard>
  );
}
