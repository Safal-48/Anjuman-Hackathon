"use client";

import React from "react";
import { Target, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, BookOpen, Layers } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillGapItem, TargetRoleBenchmark, SkillGapCategory } from "@/lib/supabase/types";

interface SkillGapMatrixProps {
  skillGaps: SkillGapItem[];
  targetRole: TargetRoleBenchmark;
  availableRoles: TargetRoleBenchmark[];
  onSelectRole: (roleId: string) => void;
  isUpdatingRole?: boolean;
}

export function SkillGapMatrix({
  skillGaps = [],
  targetRole,
  availableRoles = [],
  onSelectRole,
  isUpdatingRole = false,
}: SkillGapMatrixProps) {
  const getGapMeta = (category: SkillGapCategory) => {
    switch (category) {
      case "Strong":
        return {
          label: "Strong (Exceeds)",
          badgeVariant: "emerald" as const,
          barColor: "bg-emerald-400",
          textColor: "text-emerald-400",
          icon: CheckCircle2,
        };
      case "Good":
        return {
          label: "Good (Target Met)",
          badgeVariant: "cyber" as const,
          barColor: "bg-cyan-400",
          textColor: "text-cyan-400",
          icon: CheckCircle2,
        };
      case "Needs Improvement":
        return {
          label: "Needs Improvement",
          badgeVariant: "amber" as const,
          barColor: "bg-amber-400",
          textColor: "text-amber-400",
          icon: AlertTriangle,
        };
      case "Critical Gap":
        return {
          label: "Critical Gap",
          badgeVariant: "destructive" as const,
          barColor: "bg-rose-500",
          textColor: "text-rose-400",
          icon: ShieldAlert,
        };
    }
  };

  return (
    <GlassCard className="p-6 space-y-6">
      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Explainable Skill Gap Matrix</h2>
            <p className="text-xs text-muted-foreground">Student verified proficiency vs industry role benchmark</p>
          </div>
        </div>

        {/* Dynamic Target Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground hidden sm:inline">Target Role:</span>
          <select
            className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 py-1 text-xs sm:text-sm font-semibold text-cyan-300 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            value={targetRole.id}
            disabled={isUpdatingRole}
            onChange={(e) => onSelectRole(e.target.value)}
          >
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Role Overview Banner */}
      <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-foreground">{targetRole.title}</h3>
            <Badge variant="cyber" size="sm">
              BENCHMARK: {targetRole.requiredReadinessScore}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{targetRole.description}</p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Evaluated Dimensions</span>
          <span className="text-sm font-mono font-bold text-cyan-400">{skillGaps.length} Core Competencies</span>
        </div>
      </div>

      {/* Gap Analysis Comparative List */}
      <div className="space-y-4">
        {skillGaps.map((gap) => {
          const meta = getGapMeta(gap.gapCategory);
          const Icon = meta.icon;
          const isSurplus = gap.gapDifference <= 0;

          return (
            <div
              key={gap.skillName}
              className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/15 transition-all space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 ${meta.textColor}`} />
                  <h4 className="font-bold text-sm text-foreground group-hover:text-cyan-300 transition-colors">
                    {gap.skillName}
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground/80 px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">
                    {gap.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={meta.badgeVariant} size="sm">
                    {meta.label.toUpperCase()}
                  </Badge>
                  <span className={`text-xs font-mono font-bold ${isSurplus ? "text-emerald-400" : "text-amber-400"}`}>
                    {isSurplus ? `+${Math.abs(gap.gapDifference)} pt surplus` : `-${gap.gapDifference} pt deficit`}
                  </span>
                </div>
              </div>

              {/* Comparative Dual Progress Bars */}
              <div className="space-y-1.5 pt-1">
                {/* Student Score Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Your Assessed Level</span>
                    <span className="font-bold text-foreground">{gap.studentScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${meta.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${gap.studentScore}%` }}
                    />
                  </div>
                </div>

                {/* Target Requirement Bar Marker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Industry Requirement ({targetRole.title})</span>
                    <span className="font-bold text-cyan-400">{gap.requiredScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-cyan-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${gap.requiredScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actionable Remediation Recommendation */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-muted-foreground flex items-start gap-2 pt-2">
                <BookOpen className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-foreground/90 font-medium">Explainable Path: </strong>
                  {gap.recommendation}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
