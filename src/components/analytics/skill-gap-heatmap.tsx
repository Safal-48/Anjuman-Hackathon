"use client";

import React, { useState } from "react";
import { Layers, AlertTriangle, CheckCircle2, XCircle, Info, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillGapHeatmapCell, CommonSkillGapItem } from "@/lib/analytics/role-analytics";

interface SkillGapHeatmapProps {
  heatmapCells: SkillGapHeatmapCell[];
  commonSkillGaps: CommonSkillGapItem[];
}

const DEPARTMENTS = [
  "Computer Science & AI",
  "Electronics & Embedded",
  "Information Science",
];

const DOMAINS: Array<SkillGapHeatmapCell["skillDomain"]> = [
  "Web Systems",
  "Cloud & DevOps",
  "AI & Neural Tech",
  "Distributed Systems",
  "Soft Skills & Aptitude",
];

export function SkillGapHeatmap({
  heatmapCells,
  commonSkillGaps,
}: SkillGapHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<SkillGapHeatmapCell | null>(null);

  const getCellData = (dept: string, domain: SkillGapHeatmapCell["skillDomain"]) => {
    return (
      heatmapCells.find((c) => c.department.includes(dept.split(" ")[0]) && c.skillDomain === domain) ||
      heatmapCells.find((c) => c.skillDomain === domain)
    );
  };

  const getHeatColor = (deficiencyScore: number) => {
    if (deficiencyScore >= 40) return "bg-rose-500/25 border-rose-500/50 text-rose-300 hover:bg-rose-500/40";
    if (deficiencyScore >= 25) return "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/35";
    return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/35";
  };

  return (
    <div className="space-y-6">
      {/* Interactive Matrix Grid */}
      <GlassCard className="p-6 space-y-6 border-white/10" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Department Skill-Gap Heatmap</h3>
              <p className="text-xs text-muted-foreground">Deficiency indices comparing student cohorts vs industry benchmarks</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Optimal Fit (&lt;25%)
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate Gap (25-39%)
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical Gap (≥40%)
            </span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto cyber-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground font-mono text-[11px]">
                <th className="pb-3 pr-4">Department Cohort</th>
                {DOMAINS.map((domain) => (
                  <th key={domain} className="pb-3 px-2 text-center">
                    {domain}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DEPARTMENTS.map((dept) => (
                <tr key={dept} className="group">
                  <td className="py-3.5 pr-4 font-bold text-foreground whitespace-nowrap">
                    {dept}
                  </td>
                  {DOMAINS.map((domain) => {
                    const cell = getCellData(dept, domain);
                    const def = cell?.deficiencyScore || 20;
                    const heatClass = getHeatColor(def);

                    return (
                      <td key={domain} className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => cell && setSelectedCell(cell)}
                          className={`w-full py-2 px-1 rounded-xl border font-mono font-bold transition-all cursor-pointer ${heatClass}`}
                        >
                          <span>{def}% GAP</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Cell Deep-Dive Drawer */}
        {selectedCell && (
          <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">
                {selectedCell.department} • {selectedCell.skillDomain}
              </span>
              <Badge variant={selectedCell.deficiencyScore >= 40 ? "destructive" : "amber"} size="sm">
                {selectedCell.gapStatus.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono pt-1">
              <div>
                <span className="text-muted-foreground block">Cohort Average:</span>
                <span className="font-bold text-foreground">{selectedCell.studentProficiencyAvg}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Industry Requirement:</span>
                <span className="font-bold text-cyan-400">{selectedCell.industryRequiredAvg}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Deficiency Margin:</span>
                <span className="font-bold text-rose-400">-{selectedCell.deficiencyScore} pts</span>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Common Skill Gaps Ranking List */}
      <GlassCard className="p-6 space-y-4 border-white/10" glow>
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h4 className="font-bold text-sm text-foreground">Highest Priority Skill Gaps Across Student Body</h4>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Ranked by Placement Impact</span>
        </div>

        <div className="space-y-3">
          {commonSkillGaps.map((gap, i) => (
            <div key={gap.skillName} className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground font-bold">0{i + 1}.</span>
                  <span className="font-bold text-foreground">{gap.skillName}</span>
                  <Badge variant={gap.industryDemandLevel === "Critical" ? "destructive" : "amber"} size="sm">
                    {gap.industryDemandLevel.toUpperCase()} DEMAND
                  </Badge>
                </div>
                <div className="font-mono text-[11px] text-rose-400 font-bold">
                  {gap.studentsMissingCount} Students Missing ({gap.percentageDeficit}%)
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                {gap.impactOnPlacement}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
