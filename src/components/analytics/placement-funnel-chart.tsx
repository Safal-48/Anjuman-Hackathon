"use client";

import React from "react";
import { Award, TrendingUp, Users, ArrowDown } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlacementFunnelStage } from "@/lib/analytics/role-analytics";

interface PlacementFunnelChartProps {
  funnelStages: PlacementFunnelStage[];
}

export function PlacementFunnelChart({ funnelStages }: PlacementFunnelChartProps) {
  return (
    <GlassCard className="p-6 space-y-5 border-white/10" glow>
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Application & Placement Funnel</h3>
            <p className="text-xs text-muted-foreground">Cohort conversion telemetry through assessment to job offer extension</p>
          </div>
        </div>
        <Badge variant="emerald" size="sm">
          ANNUAL CONVERSION
        </Badge>
      </div>

      <div className="space-y-3">
        {funnelStages.map((stage, idx) => {
          const widthPercent = Math.max(stage.conversionRate, 20);

          return (
            <div key={stage.stage} className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold">0{idx + 1}.</span>
                  <span className="font-bold text-foreground">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-muted-foreground">{stage.count.toLocaleString()} Students</span>
                  <span className="font-bold text-emerald-400">{stage.conversionRate}% Rate</span>
                </div>
              </div>

              {/* Multi-gradient funnel bar */}
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
