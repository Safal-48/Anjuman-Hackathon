"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Zap,
  BookOpen,
  Award,
  Clock,
  ShieldCheck,
  Check,
  AlertOctagon,
  Dna,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProvenLoopSession } from "@/lib/learning/proven-loop-types";
import { SAMPLE_PROVEN_SESSIONS } from "@/lib/learning/proven-loop-engine";

interface LearnPracticeProveReassessProps {
  sessions?: ProvenLoopSession[];
}

export function LearnPracticeProveReassess({
  sessions = SAMPLE_PROVEN_SESSIONS,
}: LearnPracticeProveReassessProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("loop-sql-join");
  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  return (
    <div className="space-y-6">
      {/* 1. Header & Signature Mechanism Banner */}
      <GlassCard className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                SIGNATURE MASTERY LOOP
              </span>
              <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                Empirical Proof Model
              </Badge>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
              LEARN ➔ PRACTICE ➔ PROVE ➔ REASSESS
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Completing video content never automatically grants &ldquo;Skill Mastered.&rdquo; KaushalSetu requires verified practice, diagnostic testing, and score reassessment before certifying competency.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs font-mono text-center shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Target</span>
            <span className="text-xl font-black text-emerald-400">&ge; 75% Mastery</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Required for Verification</span>
          </div>
        </div>

        {/* 4-Step Connected Visual Flow */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/30 space-y-1">
            <span className="text-cyan-400 font-bold block text-[10px] uppercase">STAGE 1</span>
            <strong className="text-white block">1. LEARN</strong>
            <span className="text-[11px] text-slate-400">Targeted Micro-Lesson</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-violet-500/30 space-y-1">
            <span className="text-violet-400 font-bold block text-[10px] uppercase">STAGE 2</span>
            <strong className="text-white block">2. PRACTICE</strong>
            <span className="text-[11px] text-slate-400">Interactive Sandboxes</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 space-y-1">
            <span className="text-rose-400 font-bold block text-[10px] uppercase">STAGE 3</span>
            <strong className="text-white block">3. PROVE</strong>
            <span className="text-[11px] text-slate-400">Timed Diagnostic Probe</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 font-bold block text-[10px] uppercase">STAGE 4</span>
            <strong className="text-white block">4. REASSESS</strong>
            <span className="text-[11px] text-slate-400">Score Delta Verification</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. Interactive Session Switcher & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Session Picker */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block px-1">
            Select Empirical Verification Case:
          </span>

          <div className="space-y-2.5">
            {sessions.map((sess) => {
              const isSelected = sess.id === selectedSessionId;
              const isProven = sess.reassess.isSkillProven;

              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-cyan-400 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50"
                      : isProven
                      ? "border-emerald-500/30 bg-slate-900/40 hover:border-emerald-400/50"
                      : "border-amber-500/30 bg-slate-900/30 hover:border-amber-400/50"
                  }`}
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white font-mono">{sess.skillName}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Before: <strong className="text-rose-400">{sess.beforeScore}%</strong> ➔ Reassessed: <strong className={isProven ? "text-emerald-400" : "text-amber-400"}>{sess.reassess.finalScore}%</strong>
                    </span>
                  </div>

                  <Badge
                    variant={isProven ? "cyber" : "amber"}
                    size="sm"
                    className="font-mono text-[9px] shrink-0"
                  >
                    {isProven ? "🟢 Skill Proven" : "⚠️ Retest Required"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 4-Stage Telemetry Inspector */}
        <div className="lg:col-span-8">
          <GlassCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  EMPIRICAL TELEMETRY TRAJECTORY:
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-0.5">
                  {selectedSession.skillName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  Initial Baseline: <strong className="text-rose-400">{selectedSession.beforeScore}%</strong>
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-mono">
                  Final Verified: <strong className={selectedSession.reassess.isSkillProven ? "text-emerald-400" : "text-amber-400"}>{selectedSession.reassess.finalScore}%</strong>
                </span>
              </div>
            </div>

            {/* Stage-by-Stage Breakdown */}
            <div className="space-y-3.5 text-xs font-mono">
              {/* 1. LEARN */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-white block">LEARN: {selectedSession.learn.resourceTitle}</span>
                    <span className="text-[10px] text-slate-400">{selectedSession.learn.completedAt} • {selectedSession.learn.duration}</span>
                  </div>
                </div>
                <Badge variant="cyber" size="sm" className="text-[9px]">Completed</Badge>
              </div>

              {/* 2. PRACTICE */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-violet-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-[10px]">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-white block">PRACTICE: {selectedSession.practice.questionsCount} Hands-on Sandbox Questions</span>
                    <span className="text-[10px] text-slate-400">{selectedSession.practice.completedAt} • Intermediate Accuracy: <strong className="text-violet-300">{selectedSession.practice.intermediateScore}%</strong></span>
                  </div>
                </div>
                <Badge variant="glass" size="sm" className="text-[9px] text-violet-300">Score: {selectedSession.practice.intermediateScore}%</Badge>
              </div>

              {/* 3. PROVE */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px]">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-white block">PROVE: {selectedSession.prove.probeTitle}</span>
                    <span className="text-[10px] text-slate-400">{selectedSession.prove.completedAt} • {selectedSession.prove.questionCount} Questions</span>
                  </div>
                </div>
                <Badge variant="destructive" size="sm" className="text-[9px]">Probe Passed</Badge>
              </div>

              {/* 4. REASSESS */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                    4
                  </div>
                  <div>
                    <span className="font-bold text-white block">REASSESS: Official Telemetry Score Update</span>
                    <span className="text-[10px] text-slate-400">{selectedSession.reassess.completedAt} • Verified Delta: <strong className="text-emerald-400">{selectedSession.reassess.verifiedDelta}</strong></span>
                  </div>
                </div>
                <Badge
                  variant={selectedSession.reassess.isSkillProven ? "cyber" : "amber"}
                  size="sm"
                  className="text-[9px]"
                >
                  {selectedSession.reassess.isSkillProven ? "🟢 SKILL PROVEN" : "⚠️ Below Threshold"}
                </Badge>
              </div>
            </div>

            {/* Outcome Result Box */}
            {selectedSession.reassess.isSkillProven ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>VERIFIED MASTERY PROOF RECORDED</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Learning directly resulted in measurable improvement: <strong>{selectedSession.beforeScore}% ➔ {selectedSession.reassess.finalScore}%</strong>. Skill DNA upgraded to <em>Demonstrated</em>.
                  </p>
                </div>
                <Link href="/skills">
                  <Button variant="cyber" size="sm" className="text-xs font-mono shrink-0 shadow-glow">
                    View Skill DNA
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>SKILL NOT YET PROVEN • AUTOMATIC REMEDIATION SPAWNED</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The student improved from {selectedSession.beforeScore}% to {selectedSession.reassess.finalScore}%, but remains below the 75% target threshold. KaushalSetu automatically generated a secondary targeted intervention:
                </p>
                {selectedSession.adaptiveInterventionSpawned && (
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div>
                      <strong className="text-white block">{selectedSession.adaptiveInterventionSpawned.title}</strong>
                      <span className="text-[10px] text-slate-400">{selectedSession.adaptiveInterventionSpawned.reason}</span>
                    </div>
                    <Link href="/learning/intervention">
                      <Button variant="cyber" size="sm" className="text-[10px] h-7 px-2.5 gap-1 shrink-0">
                        Start Sprint #2 <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
