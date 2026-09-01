"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Brain,
  Sparkles,
  Users,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Clock,
  Eye,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CandidateEvaluationResult } from "@/lib/analytics/candidate-intelligence-engine";

interface CandidateIntelligenceCardProps {
  evaluation: CandidateEvaluationResult;
}

export function CandidateIntelligenceCard({ evaluation }: CandidateIntelligenceCardProps) {
  const {
    candidate,
    explainableMatchScore,
    matchedSkills,
    preferredSkillsMatched,
    skillGaps,
    resumeReadiness,
    assessmentScore,
    interviewReadiness,
    eligibility,
  } = evaluation;

  const isContactMasked = !candidate.privacyConsent.shareContactInfo;

  return (
    <GlassCard
      className="p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 bg-slate-900/80 transition-all duration-300 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between"
      glow
    >
      {/* Top Banner: Name / Alias & Match Score */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground font-mono">
                {isContactMasked ? candidate.candidateAlias : candidate.realName}
              </h3>
              {isContactMasked ? (
                <Badge variant="glass" size="sm" className="font-mono text-[9px] flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 text-amber-400" />
                  <span>Privacy Protected</span>
                </Badge>
              ) : (
                <Badge variant="emerald" size="sm" className="font-mono text-[9px] flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Authorized Profile</span>
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              {candidate.degree} • {candidate.college} ({candidate.graduationYear})
            </p>
          </div>

          {/* Explainable Match Score Ring / Badge */}
          <div className="text-left sm:text-right bg-black/40 px-3.5 py-1.5 rounded-2xl border border-cyan-500/30 shrink-0">
            <span className="text-2xl font-black font-mono text-cyan-400">
              {explainableMatchScore}%
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">
              Match Score
            </span>
          </div>
        </div>

        {/* CLEARLY SEPARATED: Eligibility Criteria vs Match Score */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
              Eligibility Status:
            </span>
            <Badge
              variant={
                eligibility.eligibilityBadge === "Eligible for Technical Review"
                  ? "emerald"
                  : eligibility.eligibilityBadge === "Conditional Review"
                  ? "amber"
                  : "destructive"
              }
              size="sm"
              className="font-mono text-[10px]"
            >
              {eligibility.eligibilityBadge}
            </Badge>
          </div>

          <span className="text-[10px] font-mono text-muted-foreground">
            {eligibility.unmetRequirements.length === 0
              ? "All mandatory prerequisites verified"
              : eligibility.unmetRequirements[0]}
          </span>
        </div>

        {/* Core Metrics Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
          <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Resume ATS</span>
            <strong className="text-xs text-violet-300">{resumeReadiness}%</strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Assessment</span>
            <strong className="text-xs text-cyan-300">{assessmentScore}%</strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Mock Interview</span>
            <strong className="text-xs text-amber-300">
              {interviewReadiness ? `${interviewReadiness}%` : "Not Shared"}
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Verified Repos</span>
            <strong className="text-xs text-emerald-300">{candidate.projects.length} Repos</strong>
          </div>
        </div>

        {/* Matched Skills vs Skill Gaps */}
        <div className="space-y-2 pt-1 font-mono">
          {/* Matched Skills */}
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Matched Skills ({matchedSkills.length}):
            </span>
            <div className="flex flex-wrap gap-1">
              {matchedSkills.map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                  ✓ {s}
                </span>
              ))}
              {preferredSkillsMatched.map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                  ★ {s} (Preferred)
                </span>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          {skillGaps.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Skill Gaps ({skillGaps.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {skillGaps.map((g) => (
                  <span key={g} className="text-[10px] px-2 py-0.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30">
                    ✗ {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Link & Actions */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-muted-foreground">
          Target: <strong className="text-foreground/90">{candidate.targetRole}</strong>
        </span>

        <Link href={`/dashboard/industry/candidate-intelligence/${candidate.id}`}>
          <Button variant="glow" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} className="text-xs font-mono font-bold">
            Full Evaluation Audit
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
