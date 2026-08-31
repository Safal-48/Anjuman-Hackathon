"use client";

import React from "react";
import { X, Sparkles, CheckCircle2, AlertTriangle, XCircle, Target, Award, BookOpen, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpportunityEntity } from "@/lib/supabase/types";

interface CompatibilityBreakdownProps {
  opportunity: OpportunityEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export function CompatibilityBreakdown({
  opportunity,
  isOpen,
  onClose,
  onApply,
}: CompatibilityBreakdownProps) {
  if (!isOpen || !opportunity || !opportunity.matchResult) return null;

  const match = opportunity.matchResult;
  const f = match.factorBreakdown;

  const factorBars = [
    { label: "Skill Stack Compatibility", weight: "50% Weight", score: f.skillMatch, color: "from-cyan-400 to-blue-500" },
    { label: "Eligibility & Academic Standing", weight: "20% Weight", score: f.eligibilityMatch, color: "from-emerald-400 to-teal-500" },
    { label: "Career Goal & Domain Focus", weight: "15% Weight", score: f.careerMatch, color: "from-violet-400 to-purple-500" },
    { label: "Portfolio Projects & Credentials", weight: "15% Weight", score: f.experienceMatch, color: "from-amber-400 to-orange-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border-cyan-500/40 shadow-2xl relative cyber-scrollbar" glow>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-glow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground">Explainable Compatibility Analysis</h3>
                <Badge variant="cyber" size="sm">
                  {match.overallScore}% MATCH
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {opportunity.title} • {opportunity.organizationName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Explainable Reasoning Summary */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
          <strong className="text-cyan-300 font-semibold block mb-1">Algorithmic Rationale:</strong>
          {match.reasoningSummary}
        </div>

        {/* 4 Multi-Factor Score Bars */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase text-muted-foreground font-mono">
            Compatibility Weighting Factors
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {factorBars.map((fb) => (
              <div key={fb.label} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground/90">{fb.label}</span>
                  <span className="font-mono font-bold text-cyan-400">{fb.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${fb.color} rounded-full transition-all duration-500`}
                    style={{ width: `${fb.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{fb.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Skill Itemization (Strong / Partial / Gaps) */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <span className="text-xs font-semibold uppercase text-muted-foreground font-mono">
            Prerequisite Skill Verification
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Strong Skills */}
            <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Strong Verified ({match.strongSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {match.strongSkills.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">None verified</span>
                ) : (
                  match.strongSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Partial Skills */}
            <div className="p-3.5 rounded-xl bg-amber-950/15 border border-amber-500/20 space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Partial Match ({match.partialSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {match.partialSkills.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">None</span>
                ) : (
                  match.partialSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Gap Skills */}
            <div className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 space-y-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Missing Gap ({match.gapSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {match.gapSkills.length === 0 ? (
                  <span className="text-[11px] text-emerald-400 font-mono">0 Gaps! Full fit.</span>
                ) : (
                  match.gapSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          {onApply && (
            <Button
              variant="glow"
              size="sm"
              onClick={() => {
                onClose();
                onApply();
              }}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Proceed to Application
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
