"use client";

import React from "react";
import { TrendingUp, Zap, Sparkles, BarChart2 } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillDemandItem } from "@/lib/analytics/role-analytics";

interface SkillDemandChartProps {
  demands: SkillDemandItem[];
}

export function SkillDemandChart({ demands }: SkillDemandChartProps) {
  return (
    <GlassCard className="p-6 space-y-5 border-white/10" glow>
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Real-Time Industry Skill Demand</h3>
            <p className="text-xs text-muted-foreground">Live hiring volume and velocity metrics across industry partners</p>
          </div>
        </div>
        <Badge variant="cyber" size="sm">
          LIVE INDEX
        </Badge>
      </div>

      <div className="space-y-4">
        {demands.map((item) => {
          const isRising = item.trend === "rising";
          return (
            <div key={item.skillName} className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{item.skillName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-muted-foreground">{item.openingsCount} Active Openings</span>
                  <span className={`font-bold ${isRising ? "text-emerald-400" : "text-cyan-400"}`}>
                    {item.growthRate}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.marketIndex >= 90
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "bg-gradient-to-r from-violet-400 to-cyan-500"
                  }`}
                  style={{ width: `${item.marketIndex}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
