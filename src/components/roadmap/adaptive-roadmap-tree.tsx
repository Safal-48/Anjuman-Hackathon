"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitFork,
  CheckCircle2,
  AlertOctagon,
  CircleDot,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  HelpCircle,
  Zap,
  Play,
  Check,
  RotateCcw,
  Layers,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdaptiveRoadmapNode,
  AdaptiveTrackRoadmap,
} from "@/lib/roadmap/adaptive-roadmap-types";
import {
  DEFAULT_DATA_ANALYST_ROADMAP,
  simulateAdaptiveSkillProof,
} from "@/lib/roadmap/adaptive-roadmap-engine";

interface AdaptiveRoadmapTreeProps {
  initialRoadmap?: AdaptiveTrackRoadmap;
}

export function AdaptiveRoadmapTree({
  initialRoadmap = DEFAULT_DATA_ANALYST_ROADMAP,
}: AdaptiveRoadmapTreeProps) {
  const [roadmap, setRoadmap] = useState<AdaptiveTrackRoadmap>(initialRoadmap);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-3");
  const [isSimulated, setIsSimulated] = useState(false);

  const selectedNode =
    roadmap.nodes.find((n) => n.id === selectedNodeId) || roadmap.nodes[2];

  const handleSimulateMastery = () => {
    if (!isSimulated) {
      const updated = simulateAdaptiveSkillProof(roadmap, "node-3", 84);
      setRoadmap(updated);
      setSelectedNodeId("node-4");
      setIsSimulated(true);
    } else {
      setRoadmap(DEFAULT_DATA_ANALYST_ROADMAP);
      setSelectedNodeId("node-3");
      setIsSimulated(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Track Header */}
      <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/50 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                {roadmap.targetRole}
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                Target Score: <strong className="text-emerald-400">{roadmap.targetReadinessScore}%</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono tracking-tight">
              {roadmap.trackTitle}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              A continuous, adaptive milestone progression. When you prove mastery on a priority topic, the roadmap automatically marks it <strong>🟢 Skill Proven</strong> and unlocks your next milestone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            {/* Simulation Button */}
            <Button
              onClick={handleSimulateMastery}
              variant={isSimulated ? "outline" : "cyber"}
              size="sm"
              className="text-xs font-mono gap-1.5 shadow-glow"
            >
              {isSimulated ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Demo State</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Simulate: SQL JOINs 42% ➔ 84% Proven</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-2 flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Track Mastery Completion:</span>
              <strong className="text-cyan-400 font-bold">{roadmap.currentTrackProgress}% Complete</strong>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${roadmap.currentTrackProgress}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 2-Column Layout: Visual Milestone Node List + 5-Stage Connected Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Dynamic Roadmap Nodes */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block px-1">
            Adaptive Learning Milestones:
          </span>

          <div className="space-y-2.5">
            {roadmap.nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isPriority = node.status === "current_priority";
              const isProven = node.status === "proven" || node.status === "completed";

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-cyan-400 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50"
                      : isPriority
                      ? "border-rose-500/50 bg-slate-900/60 hover:border-rose-400"
                      : isProven
                      ? "border-emerald-500/30 bg-slate-900/40 hover:border-emerald-400/50"
                      : "border-white/[0.08] bg-slate-900/20 hover:border-white/20 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Node Icon Status */}
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        node.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : node.status === "proven"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : node.status === "current_priority"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {node.status === "completed" && <Check className="h-4 w-4" />}
                      {node.status === "proven" && <CheckCircle2 className="h-4 w-4" />}
                      {node.status === "current_priority" && <AlertOctagon className="h-4 w-4" />}
                      {node.status === "upcoming" && <CircleDot className="h-4 w-4" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">
                        {node.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {node.category} • Proficiency: <strong className={isProven ? "text-emerald-400" : isPriority ? "text-rose-400" : "text-slate-400"}>{node.currentProficiency}%</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        node.status === "current_priority"
                          ? "destructive"
                          : isProven
                          ? "cyber"
                          : "outline"
                      }
                      size="sm"
                      className="font-mono text-[9px]"
                    >
                      {node.statusBadge}
                    </Badge>
                    <ChevronRight className={`h-4 w-4 text-slate-500 ${isSelected ? "text-cyan-400" : ""}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-Stage Connected Pipeline Inspector */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-6">
            {/* Pipeline Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  MILESTONE PIPELINE ARCHITECTURE:
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-0.5">
                  {selectedNode.title}
                </h3>
              </div>
              <Badge
                variant={
                  selectedNode.status === "current_priority"
                    ? "destructive"
                    : selectedNode.status === "proven" || selectedNode.status === "completed"
                    ? "cyber"
                    : "outline"
                }
                className="font-mono text-xs w-fit"
              >
                {selectedNode.statusBadge}
              </Badge>
            </div>

            {/* The 5 Connected Pipeline Steps */}
            <div className="space-y-4">
              {/* Step 1: Learning Resource */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
                    <BookOpen className="h-4 w-4" /> 1. Learning Resource
                  </span>
                  <Badge variant="glass" size="sm" className="font-mono text-[9px]">
                    {selectedNode.pipelineFlow.learningResource.type} • {selectedNode.pipelineFlow.learningResource.duration}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">
                  {selectedNode.pipelineFlow.learningResource.title}
                </h4>
                <Link
                  href={selectedNode.pipelineFlow.learningResource.url}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-1"
                >
                  <span>Open Resource</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Step 2: Explanation */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                  <HelpCircle className="h-4 w-4" /> 2. Socratic Explanation &amp; Analogy
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.pipelineFlow.explanation.socraticSummary}
                </p>
                {selectedNode.pipelineFlow.explanation.hinglishAnalogy && (
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
                    <strong>Hinglish Hint:</strong> {selectedNode.pipelineFlow.explanation.hinglishAnalogy}
                  </div>
                )}
              </div>

              {/* Step 3: Practice */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-violet-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400 flex items-center gap-1.5 uppercase">
                    <Zap className="h-4 w-4" /> 3. Interactive Practice Sandbox
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedNode.pipelineFlow.practice.challengeCount} Challenges • {selectedNode.pipelineFlow.practice.estimatedMinutes} Mins
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">
                  {selectedNode.pipelineFlow.practice.sandboxTitle}
                </h4>
                <Link
                  href={selectedNode.pipelineFlow.practice.practiceUrl}
                  className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-mono mt-1"
                >
                  <span>Launch Sandbox Drill</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Step 4: Assessment */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                    <AlertOctagon className="h-4 w-4" /> 4. Diagnostic Assessment Probe
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Pass Threshold: {selectedNode.pipelineFlow.assessment.passThresholdPercentage}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">
                  {selectedNode.pipelineFlow.assessment.probeTitle}
                </h4>
                <Link
                  href={selectedNode.pipelineFlow.assessment.quizUrl}
                  className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-mono mt-1"
                >
                  <span>Take Assessment</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Step 5: Result Telemetry */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="h-4 w-4" /> 5. Result &amp; Verification Telemetry
                  </span>
                  {selectedNode.pipelineFlow.result.isProven && (
                    <Badge variant="cyber" size="sm" className="font-mono text-[9px] text-emerald-300">
                      Skill Proven
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pre-Assessment:</span>
                    <strong className="text-white text-sm">{selectedNode.pipelineFlow.result.preScore}%</strong>
                  </div>

                  {selectedNode.pipelineFlow.result.postScore !== undefined && (
                    <>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Post-Assessment:</span>
                        <strong className="text-emerald-400 text-sm">{selectedNode.pipelineFlow.result.postScore}%</strong>
                      </div>
                      <Badge variant="glass" size="sm" className="text-emerald-400 font-mono text-xs">
                        {selectedNode.pipelineFlow.result.verifiedDelta}
                      </Badge>
                    </>
                  )}
                </div>

                {selectedNode.pipelineFlow.result.provenTimestamp && (
                  <span className="text-[10px] font-mono text-slate-500 block pt-1">
                    Verified: {selectedNode.pipelineFlow.result.provenTimestamp}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
