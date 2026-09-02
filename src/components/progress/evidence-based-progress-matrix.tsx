"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Brain,
  Sparkles,
  RotateCcw,
  BookOpen,
  Code2,
  Filter,
  Dna,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SkillEvidenceItem,
  SAMPLE_SKILL_EVIDENCE_DATA,
  StageState,
} from "@/lib/progress/evidence-types";

interface EvidenceBasedProgressMatrixProps {
  initialItems?: SkillEvidenceItem[];
}

export function EvidenceBasedProgressMatrix({
  initialItems = SAMPLE_SKILL_EVIDENCE_DATA,
}: EvidenceBasedProgressMatrixProps) {
  const [filter, setFilter] = useState<"ALL" | "PROVEN" | "UNPROVEN" | "IN_REMEDIATION">("ALL");

  const filteredItems = initialItems.filter((item) => {
    if (filter === "ALL") return true;
    return item.provenStatus === filter;
  });

  const renderStageIcon = (state: StageState) => {
    switch (state) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case "in_progress":
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                EVIDENCE-BASED COMPETENCY MATRIX
              </span>
              <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                Multi-Stage Proof
              </Badge>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
              Learning ➔ Practicing ➔ Proven Skills
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Course completion never guarantees competency. Skillora requires validated sandbox practice and diagnostic test proof before certifying any skill.
            </p>
          </div>

          {/* Key Formula Pill */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Mastery Axiom</span>
            <span className="text-sm font-black text-cyan-400">Course Completion ≠ Mastery</span>
            <span className="text-xs font-bold text-emerald-400 block mt-0.5">Evidence = Competency</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <span>Filter by Proof State:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "All Skills (5)" },
              { id: "PROVEN", label: "🟢 Skill Proven (3)" },
              { id: "UNPROVEN", label: "🔴 Unproven Gaps (1)" },
              { id: "IN_REMEDIATION", label: "🟡 In Remediation (1)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  filter === tab.id
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-glow-sm"
                    : "bg-slate-950/50 border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 2. Skills Evidence Table & Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isProven = item.provenStatus === "PROVEN";
          const isUnproven = item.provenStatus === "UNPROVEN";
          const isRemediation = item.provenStatus === "IN_REMEDIATION";

          return (
            <GlassCard
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                isProven
                  ? "border-emerald-500/30 bg-slate-900/40 hover:border-emerald-400/50"
                  : isUnproven
                  ? "border-rose-500/40 bg-slate-900/60 hover:border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                  : "border-amber-500/30 bg-slate-900/50 hover:border-amber-400/50"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left Skill Info */}
                <div className="space-y-1 lg:w-64 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-mono">{item.skillName}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 block">{item.category}</span>
                </div>

                {/* 4-Stage Evidence Pipeline Flow (STEP 15 SPEC) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 text-xs font-mono">
                  {/* Stage 1: Learning */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">1. Learning</span>
                      {renderStageIcon(item.learningStage.status)}
                    </div>
                    <span className="text-white text-[11px] font-medium block truncate">
                      {item.learningStage.label}
                    </span>
                  </div>

                  {/* Stage 2: Practice */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">2. Practice</span>
                      {renderStageIcon(item.practiceStage.status)}
                    </div>
                    <span className="text-white text-[11px] font-medium block truncate">
                      {item.practiceStage.label}
                    </span>
                  </div>

                  {/* Stage 3: Assessment */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">3. Assessment</span>
                      {renderStageIcon(item.assessmentStage.status)}
                    </div>
                    <span className="text-white text-[11px] font-medium block truncate">
                      {item.assessmentStage.label}
                    </span>
                  </div>

                  {/* Stage 4: Proven Status */}
                  <div
                    className={`p-2.5 rounded-xl border space-y-1 ${
                      isProven
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : isUnproven
                        ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                        : "bg-amber-950/40 border-amber-500/40 text-amber-300"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block">4. Skill Proven</span>
                    <strong className="text-xs block font-bold">
                      {isProven ? "🟢 PROVEN" : isUnproven ? "🔴 UNPROVEN" : "🟡 RE-TESTING"}
                    </strong>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 flex items-center justify-end">
                  {isProven ? (
                    <Link href="/portfolio">
                      <Button variant="outline" size="sm" className="text-xs font-mono border-white/10 hover:border-emerald-500/30">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 mr-1" />
                        Verified Proof
                      </Button>
                    </Link>
                  ) : (
                    <Link href={item.remedialUrl}>
                      <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                        <span>{isUnproven ? "Prove Skill" : "Retest"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom Evidence Note */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Evidence Ledger: {item.evidenceNotes}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
