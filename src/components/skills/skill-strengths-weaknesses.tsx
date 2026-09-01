"use client";

import React from "react";
import { Sparkles, AlertCircle, ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillScoreBreakdown } from "@/lib/supabase/types";

interface SkillStrengthsWeaknessesProps {
  strongSkills: SkillScoreBreakdown[];
  weakSkills: SkillScoreBreakdown[];
  skillBreakdowns: SkillScoreBreakdown[];
}

export function SkillStrengthsWeaknesses({
  strongSkills = [],
  weakSkills = [],
  skillBreakdowns = [],
}: SkillStrengthsWeaknessesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Superpowers / Strong Skills */}
      <GlassCard className="p-6 space-y-6 border-emerald-500/20">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Verified Superpowers</h2>
              <p className="text-xs text-muted-foreground">High-competence domains (Score ≥ 75%) ready for immediate deployment</p>
            </div>
          </div>

          <Badge variant="emerald" size="sm">
            {strongSkills.length} STRONG
          </Badge>
        </div>

        {strongSkills.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4">No top-tier skills verified yet. Complete more assessment modules.</p>
        ) : (
          <div className="space-y-3">
            {strongSkills.map((s) => (
              <div
                key={s.skillName}
                className="p-4 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/20 border border-emerald-500/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-emerald-300 transition-colors">
                      {s.skillName}
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{s.category}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Badge
                    variant="emerald"
                    size="sm"
                    className="font-mono text-xs px-2.5 py-0.5 uppercase tracking-wider"
                  >
                    {s.level.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Priority Growth Areas / Weak Skills */}
      <GlassCard className="p-6 space-y-6 border-amber-500/20">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Priority Growth Opportunities</h2>
              <p className="text-xs text-muted-foreground">Key areas requiring focused upskilling before industry interviews</p>
            </div>
          </div>

          <Badge variant="amber" size="sm">
            {weakSkills.length > 0 ? `${weakSkills.length} PRIORITY` : "ON TRACK"}
          </Badge>
        </div>

        {weakSkills.length === 0 ? (
          <div className="p-6 rounded-xl bg-black/30 border border-white/5 text-center space-y-2">
            <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto" />
            <h4 className="font-semibold text-sm text-foreground">No Critical Deficits</h4>
            <p className="text-xs text-muted-foreground">All evaluated areas meet baseline industry thresholds.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weakSkills.map((s) => (
              <div
                key={s.skillName}
                className="p-4 rounded-xl bg-amber-950/10 hover:bg-amber-950/20 border border-amber-500/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-amber-300 transition-colors">
                      {s.skillName}
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{s.category}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Badge
                    variant="amber"
                    size="sm"
                    className="font-mono text-xs px-2.5 py-0.5 uppercase tracking-wider"
                  >
                    {s.level.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
