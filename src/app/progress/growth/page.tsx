"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Brain,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/motion-wrapper";

interface GrowthTrend {
  skill: string;
  initialScore: number;
  currentScore: number;
  delta: number;
  category: string;
  interventionsCompleted: number;
  status: "Mastered" | "Accelerating" | "Developing";
}

const GROWTH_DATA: GrowthTrend[] = [
  {
    skill: "Distributed Systems & Raft",
    initialScore: 48,
    currentScore: 76,
    delta: +28,
    category: "Architecture",
    interventionsCompleted: 4,
    status: "Accelerating",
  },
  {
    skill: "TensorRT & Model Optimization",
    initialScore: 52,
    currentScore: 78,
    delta: +26,
    category: "AI & ML",
    interventionsCompleted: 3,
    status: "Accelerating",
  },
  {
    skill: "TypeScript Strict Metaprogramming",
    initialScore: 68,
    currentScore: 92,
    delta: +24,
    category: "Software Systems",
    interventionsCompleted: 5,
    status: "Mastered",
  },
  {
    skill: "Algorithmic Complexity & Graph Theory",
    initialScore: 62,
    currentScore: 82,
    delta: +20,
    category: "Core Aptitude",
    interventionsCompleted: 6,
    status: "Mastered",
  },
  {
    skill: "System Design & Caching Patterns",
    initialScore: 55,
    currentScore: 72,
    delta: +17,
    category: "Architecture",
    interventionsCompleted: 2,
    status: "Developing",
  },
];

export default function SkillGrowthPage() {
  return (
    <div className="min-h-screen py-10 bg-slate-950/40">
      <Container size="xl">
        <FadeIn>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
                <TrendingUp className="h-3.5 w-3.5" />
                Empirical Mastery Velocity & Delta Tracking
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Skill Growth & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Mastery Velocity</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Measure tangible, validated improvements across your technical competencies. Every intervention and reassessment directly updates your verified growth trajectory.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/assessment">
                <Button variant="cyber" size="sm" className="gap-2">
                  <Brain className="h-4 w-4" />
                  Launch Skill Reassessment
                </Button>
              </Link>
            </div>
          </div>

          {/* Aggregate Growth Summary Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <GlassCard className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Average Skill Gain</span>
                <Badge variant="cyber" size="sm" className="font-mono text-[10px] text-emerald-400">+23.0%</Badge>
              </div>
              <div className="text-3xl font-black text-white font-mono mt-2 flex items-center gap-2">
                <span>+23.0%</span>
                <ArrowUpRight className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Across 5 tracked competency domains</p>
            </GlassCard>

            <GlassCard className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Interventions Completed</span>
                <Badge variant="default" size="sm" className="font-mono text-[10px]">20 Total</Badge>
              </div>
              <div className="text-3xl font-black text-cyan-400 font-mono mt-2">
                20 Interventions
              </div>
              <p className="text-xs text-slate-400 mt-1">Study sessions, sandboxes & oral drills</p>
            </GlassCard>

            <GlassCard className="p-5 rounded-2xl border border-violet-500/20 bg-slate-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Mastered Competencies</span>
                <Badge variant="amber" size="sm" className="font-mono text-[10px]">Benchmark &gt;80%</Badge>
              </div>
              <div className="text-3xl font-black text-violet-400 font-mono mt-2">
                2 Domains
              </div>
              <p className="text-xs text-slate-400 mt-1">Ready for advanced portfolio challenges</p>
            </GlassCard>
          </div>

          {/* Growth Breakdown List */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Competency Delta Trajectory (Pre vs. Post Intervention)
            </h2>

            <div className="space-y-4">
              {GROWTH_DATA.map((item, idx) => (
                <GlassCard
                  key={idx}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/30 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-white">{item.skill}</h3>
                        <Badge
                          variant={
                            item.status === "Mastered"
                              ? "cyber"
                              : item.status === "Accelerating"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="font-mono text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span>Category: {item.category}</span>
                        <span>•</span>
                        <span>{item.interventionsCompleted} Interventions Logged</span>
                      </div>
                    </div>

                    {/* Progress Comparison */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Baseline</span>
                        <span className="text-sm font-mono text-slate-300 font-bold">{item.initialScore}%</span>
                      </div>

                      <div className="w-32 sm:w-48">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-emerald-400 font-bold">+{item.delta}% Gain</span>
                          <span className="text-white font-bold">{item.currentScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                          {/* Baseline marker */}
                          <div
                            className="absolute top-0 bottom-0 bg-slate-600 rounded-full"
                            style={{ width: `${item.initialScore}%` }}
                          />
                          {/* Current marker */}
                          <div
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                            style={{ width: `${item.currentScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold">Verified Delta</span>
                        <span className="text-base font-mono text-emerald-400 font-black">+{item.delta}%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
