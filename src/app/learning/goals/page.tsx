"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Flame,
  Calendar,
  Layers,
  Award,
  Plus,
  BookOpen,
  Brain,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/motion-wrapper";

interface Goal {
  id: string;
  title: string;
  targetRole: string;
  targetDate: string;
  progress: number;
  currentScore: number;
  targetScore: number;
  weeklyPace: string;
  status: "Active" | "Completed" | "Behind Schedule";
  milestones: { name: string; completed: boolean; dueDate: string }[];
}

const SAMPLE_GOALS: Goal[] = [
  {
    id: "goal-1",
    title: "Crack AI Systems Engineer Role",
    targetRole: "AI Systems & LLM Platform Engineer",
    targetDate: "Nov 30, 2026 (60 Days Remaining)",
    progress: 72,
    currentScore: 72,
    targetScore: 90,
    weeklyPace: "4 Interventions / Week",
    status: "Active",
    milestones: [
      { name: "Pass Distributed Systems Diagnostic Probe (>85%)", completed: true, dueDate: "Sep 15" },
      { name: "Complete TensorRT Optimization Sandbox Project", completed: true, dueDate: "Sep 28" },
      { name: "Pass AI Oral Interview Simulation (Technical Relevance >80%)", completed: false, dueDate: "Oct 15" },
      { name: "Earn Cryptographic Hash Proof for Production Project", completed: false, dueDate: "Nov 10" },
    ],
  },
  {
    id: "goal-2",
    title: "Master High-Throughput Cloud DevOps & SRE",
    targetRole: "Cloud DevOps & Reliability Engineer",
    targetDate: "Dec 15, 2026",
    progress: 45,
    currentScore: 58,
    targetScore: 85,
    weeklyPace: "3 Interventions / Week",
    status: "Active",
    milestones: [
      { name: "Kubernetes Mesh Architecture Fundamentals", completed: true, dueDate: "Oct 01" },
      { name: "CI/CD Automated Failover Pipeline Setup", completed: false, dueDate: "Oct 20" },
      { name: "Telemetry & SRE Error Budgeting Drill", completed: false, dueDate: "Nov 05" },
    ],
  },
];

export default function GoalBasedLearningPage() {
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTargetRole, setNewTargetRole] = useState("AI Systems & LLM Platform Engineer");
  const [newTargetScore, setNewTargetScore] = useState(85);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newTitle,
      targetRole: newTargetRole,
      targetDate: "90 Days Target",
      progress: 25,
      currentScore: 50,
      targetScore: Number(newTargetScore),
      weeklyPace: "3 Interventions / Week",
      status: "Active",
      milestones: [
        { name: "Complete Baseline Diagnostic Assessment", completed: false, dueDate: "Next 7 Days" },
        { name: "Resolve Core Skill Deficits via Adaptive Resources", completed: false, dueDate: "Next 30 Days" },
        { name: "Pass Reassessment with >80% Score", completed: false, dueDate: "Next 60 Days" },
      ],
    };
    setGoals([newGoal, ...goals]);
    setNewTitle("");
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen py-10 bg-slate-950/40">
      <Container size="xl">
        <FadeIn>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
                <Target className="h-3.5 w-3.5" />
                Adaptive Goal & Target Velocity Tracker
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Goal-Based <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Learning Paths</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Set outcome-driven learning objectives. KaushalSetu automatically structures weekly study plans, practice drills, and milestone proofs to ensure you reach your target benchmark.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="cyber"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Goal
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <GlassCard className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/40 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Goals</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">2 In Progress</div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/40 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Target Velocity</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">+4.2% / Week</div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/40 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
                <Flame className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Learning Streak</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">14 Days Active</div>
              </div>
            </GlassCard>
          </div>

          {/* Goals List */}
          <div className="mt-8 space-y-6">
            {goals.map((goal) => (
              <GlassCard
                key={goal.id}
                className="p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/30 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                      <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-slate-400">
                      <span className="text-cyan-400 font-semibold">{goal.targetRole}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {goal.targetDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Clock className="h-3 w-3" />
                        {goal.weeklyPace}
                      </span>
                    </div>
                  </div>

                  {/* Progress Radial / Bar */}
                  <div className="w-full lg:w-72">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Readiness Score</span>
                      <span className="text-cyan-400 font-bold">{goal.currentScore}% / {goal.targetScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${(goal.currentScore / goal.targetScore) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="mt-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Milestone Action Checklist</span>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goal.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                          m.completed
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-slate-950/60 border-white/[0.06] text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              m.completed ? "text-emerald-400" : "text-slate-600"
                            }`}
                          />
                          <span className={m.completed ? "line-through opacity-80" : "font-medium"}>{m.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{m.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                  <Link href="/learning/resources">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 border-white/10 hover:border-cyan-500/30">
                      <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                      View Tailored Study Resources
                    </Button>
                  </Link>

                  <Link href="/assessment">
                    <Button variant="cyber" size="sm" className="text-xs gap-1.5">
                      Take Reassessment Probe <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Add Goal Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Create New Learning Goal</h3>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white text-sm font-mono"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Goal Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Distributed Systems Architecture"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Target Role / Benchmark</label>
                    <select
                      value={newTargetRole}
                      onChange={(e) => setNewTargetRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="AI Systems & LLM Platform Engineer">AI Systems & LLM Platform Engineer</option>
                      <option value="Full-Stack Cloud Architect">Full-Stack Cloud Architect</option>
                      <option value="Cloud DevOps & Reliability Engineer">Cloud DevOps & Reliability Engineer</option>
                      <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Target Readiness Benchmark (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={newTargetScore}
                      onChange={(e) => setNewTargetScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="cyber" size="sm">
                      Initialize Goal & Adaptive Roadmap
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </FadeIn>
      </Container>
    </div>
  );
}
