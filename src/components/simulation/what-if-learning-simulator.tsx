"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Sliders,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  Brain,
  ShieldAlert,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SkillSimulationItem,
  DEFAULT_SIMULATION_SKILLS,
  calculateSimulatedReadiness,
} from "@/lib/simulation/learning-simulator-engine";

interface WhatIfLearningSimulatorProps {
  initialSkills?: SkillSimulationItem[];
}

export function WhatIfLearningSimulator({
  initialSkills = DEFAULT_SIMULATION_SKILLS,
}: WhatIfLearningSimulatorProps) {
  const [skills, setSkills] = useState<SkillSimulationItem[]>(initialSkills);

  const handleSliderChange = (id: string, value: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, simulatedScore: value } : s))
    );
  };

  const handlePresetSQL = () => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === "sim-sql") return { ...s, simulatedScore: 80 };
        return { ...s, simulatedScore: s.baselineScore };
      })
    );
  };

  const handlePresetPowerBI = () => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === "sim-pbi") return { ...s, simulatedScore: 75 };
        return { ...s, simulatedScore: s.baselineScore };
      })
    );
  };

  const handlePresetAllMastery = () => {
    setSkills((prev) =>
      prev.map((s) => ({ ...s, simulatedScore: Math.max(s.baselineScore, 85) }))
    );
  };

  const handleReset = () => {
    setSkills(initialSkills.map((s) => ({ ...s, simulatedScore: s.baselineScore })));
  };

  const result = calculateSimulatedReadiness(skills);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <Sliders className="h-3 w-3" />
                &ldquo;WHAT IF?&rdquo; IMPACT SIMULATOR
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                PROJECTED / SIMULATED ESTIMATE
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
              What Happens If I Improve This Skill?
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Drag the sliders below to simulate technical improvements. See how your projected readiness score increases and discover which learning intervention delivers the highest ROI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handlePresetSQL}
              variant="cyber"
              size="sm"
              className="text-[11px] font-mono h-8 shadow-glow"
            >
              SQL ➔ 80% (PRD Demo)
            </Button>
            <Button
              onClick={handlePresetPowerBI}
              variant="outline"
              size="sm"
              className="text-[11px] font-mono h-8 border-white/10"
            >
              Power BI ➔ 75%
            </Button>
            <Button
              onClick={handlePresetAllMastery}
              variant="glass"
              size="sm"
              className="text-[11px] font-mono h-8"
            >
              All ➔ 85%+
            </Button>
            <Button
              onClick={handleReset}
              variant="ghost"
              size="sm"
              className="text-[11px] font-mono h-8 text-slate-400"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>Transparency Notice:</strong> All values generated in this studio are <strong>Projected / Simulated Estimates</strong>, not guaranteed outcomes. Actual score increases require verified diagnostic probe passes.
          </span>
        </div>
      </GlassCard>

      {/* 2-Column Layout: Sliders & Live Projected Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4 w-4" />
                Adjust Competency Proficiency Sliders:
              </span>
              <span className="text-xs font-mono text-slate-400">0% – 100% Scale</span>
            </div>

            <div className="space-y-4">
              {skills.map((skill) => {
                const isBoosted = skill.simulatedScore > skill.baselineScore;
                const delta = skill.simulatedScore - skill.baselineScore;

                return (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-white text-sm block">{skill.skillName}</strong>
                        <span className="text-[10px] text-slate-400">{skill.category} • Weight: {skill.weight}x</span>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">
                            Base: {skill.baselineScore}%
                          </span>
                          <ArrowRight className="h-3 w-3 text-slate-500" />
                          <strong
                            className={`text-base font-black ${
                              isBoosted ? "text-cyan-400" : "text-slate-300"
                            }`}
                          >
                            {skill.simulatedScore}%
                          </strong>
                        </div>
                        {isBoosted && (
                          <span className="text-[10px] text-emerald-400 font-bold block">
                            +{delta}% Projected Gain
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Range Slider */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.simulatedScore}
                        onChange={(e) => handleSliderChange(skill.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>0%</span>
                        <span className="text-slate-400">Baseline ({skill.baselineScore}%)</span>
                        <span>100% (Expert)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right: Projected Readiness & Next Priority Forecaster (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Projected Readiness Score Card */}
          <GlassCard className="p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-violet-950/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                PROJECTED READINESS OUTCOME
              </span>
              <Badge variant="cyber" size="sm" className="text-[9px]">
                Live Forecast
              </Badge>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Baseline:</span>
                <span className="text-2xl font-bold text-slate-400">{result.baselineReadinessScore}%</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-cyan-300 block uppercase font-bold">Projected Readiness:</span>
                <span className="text-4xl font-black text-cyan-400">{result.projectedReadinessScore}%</span>
              </div>
            </div>

            {/* Score Delta Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Forecasted Score Boost:</span>
              <Badge variant="emerald" size="sm" className="text-xs font-bold">
                +{result.readinessDelta}% Projected Jump
              </Badge>
            </div>

            {/* Next Shifted Priority Blocker */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">
                SHIFTED NEXT PRIORITY FORECASTER:
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">
                If your skills improve to these target levels, your next #1 priority bottleneck automatically shifts to:
              </p>
              <strong className="text-white text-sm block font-bold pt-0.5">
                👉 {result.projectedNextBottleneck}
              </strong>
            </div>

            {/* Highest ROI Recommendation */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-violet-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-violet-400 block">
                HIGHEST-ROI LEARNING ACTIVITY:
              </span>
              <p className="text-slate-300 text-[11px]">
                Mastering <strong>{result.highestRoiSkill}</strong> yields the greatest readiness boost per hour invested.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/learning/resources?highlight=SQL">
                <Button variant="cyber" size="sm" className="w-full text-xs font-mono gap-1.5 shadow-glow">
                  <span>Start Highest-ROI Intervention</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
