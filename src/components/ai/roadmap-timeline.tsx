"use client";

import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  FolderGit2,
  Laptop,
  Layers,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonalizedRoadmap, RoadmapPhase } from "@/lib/ai/roadmap-generator";

interface RoadmapTimelineProps {
  roadmap: PersonalizedRoadmap;
}

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  const [phases, setPhases] = useState<RoadmapPhase[]>(roadmap.phases);

  const toggleMilestone = (phaseIndex: number, milestoneId: string) => {
    const updated = [...phases];
    const milestone = updated[phaseIndex].milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      milestone.isCompleted = !milestone.isCompleted;
      setPhases(updated);
    }
  };

  const getPhaseBadge = (status: RoadmapPhase["status"]) => {
    switch (status) {
      case "completed":
        return { label: "COMPLETED", variant: "emerald" as const };
      case "in_progress":
        return { label: "IN ACTIVE SPRINT", variant: "cyber" as const };
      case "upcoming":
        return { label: "UPCOMING", variant: "glass" as const };
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">
                4-Phase Personalized Career Roadmap
              </h3>
              <p className="text-xs text-muted-foreground">
                Target Role: <strong className="text-cyan-300">{roadmap.targetRoleTitle}</strong> • Estimated Velocity:{" "}
                <strong className="text-foreground">{roadmap.estimatedTimeToHireWeeks} Weeks</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="cyber" size="sm">
              CURRENT: {roadmap.currentReadinessScore}%
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="emerald" size="sm">
              GOAL: {roadmap.targetReadinessScore}%
            </Badge>
          </div>
        </div>

        {/* Suggested Next Actions */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <span className="text-xs font-semibold uppercase text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> High-Impact Next Actions
          </span>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {roadmap.suggestedNextActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono">0{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* 4 Phased Timeline */}
      <div className="space-y-6">
        {phases.map((phase, pIdx) => {
          const badge = getPhaseBadge(phase.status);
          const completedCount = phase.milestones.filter((m) => m.isCompleted).length;
          const totalMilestones = phase.milestones.length;

          return (
            <GlassCard key={phase.phaseNumber} className="p-6 space-y-5 relative">
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                    0{phase.phaseNumber}
                  </span>
                  <div>
                    <h4 className="font-bold text-base text-foreground">{phase.title}</h4>
                    <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span className="text-xs font-mono text-muted-foreground">{phase.durationWeeks}</span>
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-3">
                {phase.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(pIdx, m.id)}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group ${
                      m.isCompleted
                        ? "bg-emerald-950/10 border-emerald-500/30 text-foreground"
                        : "bg-white/[0.02] hover:bg-white/[0.04] border-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-5 w-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${
                          m.isCompleted
                            ? "bg-emerald-500 border-emerald-400 text-slate-950"
                            : "border-white/20 group-hover:border-cyan-400"
                        }`}
                      >
                        {m.isCompleted && <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-medium leading-relaxed ${m.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                        {m.task}
                      </span>
                    </div>

                    {/* Resources */}
                    {m.resources && m.resources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 shrink-0 pl-8 sm:pl-0">
                        {m.resources.map((r, rIdx) => (
                          <span
                            key={rIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-cyan-300 flex items-center gap-1"
                          >
                            <BookOpen className="h-2.5 w-2.5" />
                            <span>{r.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
