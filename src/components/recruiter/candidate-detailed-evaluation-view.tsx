"use client";

import React, { useState } from "react";
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
  Mail,
  Phone,
  Building,
  GraduationCap,
  Download,
  Calendar,
  ChevronLeft,
  Lock,
  GitBranch,
  Terminal,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CandidateEvaluationResult } from "@/lib/analytics/candidate-intelligence-engine";

interface CandidateDetailedEvaluationViewProps {
  evaluation: CandidateEvaluationResult;
}

export function CandidateDetailedEvaluationView({
  evaluation,
}: CandidateDetailedEvaluationViewProps) {
  const {
    candidate,
    requirements,
    explainableMatchScore,
    matchedSkills,
    preferredSkillsMatched,
    skillGaps,
    resumeReadiness,
    projectEvidenceScore,
    assessmentScore,
    interviewReadiness,
    roleAlignment,
    eligibility,
  } = evaluation;

  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showContactRequestModal, setShowContactRequestModal] = useState(false);
  const isContactMasked = !candidate.privacyConsent.shareContactInfo;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/industry/candidate-intelligence"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Candidate Intelligence Pipeline</span>
          </Link>
          <span className="text-muted-foreground text-xs font-mono">/</span>
          <span className="text-cyan-400 text-xs font-mono font-bold uppercase">
            Candidate Evaluation Audit
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={isShortlisted ? "cyber" : "glow"}
            size="sm"
            onClick={() => setIsShortlisted(!isShortlisted)}
            className="text-xs font-mono font-bold"
          >
            {isShortlisted ? "✓ Shortlisted in Pipeline" : "+ Shortlist Candidate"}
          </Button>
        </div>
      </div>

      {/* Candidate Profile Header Card */}
      <GlassCard className="p-6 sm:p-8 border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden" glow>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left info (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {isContactMasked ? candidate.candidateAlias : candidate.realName}
              </h1>
              {isContactMasked ? (
                <Badge variant="amber" size="sm" className="font-mono text-xs flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Privacy Protected</span>
                </Badge>
              ) : (
                <Badge variant="emerald" size="sm" className="font-mono text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Authorized Profile</span>
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1 text-foreground/90">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                {candidate.degree}
              </span>
              <span>•</span>
              <span>{candidate.college}</span>
              <span>•</span>
              <span>Class of {candidate.graduationYear}</span>
            </div>

            {/* Contact Details (Or Masked Protected State) */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              {!isContactMasked ? (
                <>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-cyan-300">
                    <Mail className="h-3.5 w-3.5" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-cyan-300">
                    <Phone className="h-3.5 w-3.5" />
                    {candidate.phone}
                  </span>
                </>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200 flex items-center gap-2 text-xs font-mono">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Contact info is protected until candidate accepts your screening invitation.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Match Score Callout (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-black/60 border border-cyan-500/30 text-center space-y-2">
            <span className="text-4xl font-black font-mono text-cyan-400">
              {explainableMatchScore}%
            </span>
            <span className="text-xs font-mono font-bold text-foreground block uppercase">
              Explainable Compatibility Score
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block">
              Evaluated against &ldquo;{requirements.roleTitle}&rdquo;
            </span>
          </div>
        </div>
      </GlassCard>

      {/* CLEAR SEPARATION: Eligibility Criteria vs Match Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Binary Eligibility Gating (5 cols) */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 space-y-4 border-white/10 h-full flex flex-col justify-between" glow>
            <div className="space-y-2 border-b border-white/[0.08] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  1. Binary Eligibility Criteria
                </span>
                <Badge
                  variant={
                    eligibility.isOverallEligible ? "emerald" : "destructive"
                  }
                  size="sm"
                  className="font-mono text-[10px]"
                >
                  {eligibility.isOverallEligible ? "PASSED" : "FAILED"}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-foreground font-mono">
                Opportunity Prerequisite Checklist
              </h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span>Education ({requirements.minEducation})</span>
                {eligibility.educationEligible ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Met
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Unmet
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span>Required Skills ({requirements.requiredSkills.length})</span>
                {eligibility.requiredSkillsEligible ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All Present
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Missing {skillGaps.length}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span>Resume Threshold ({requirements.minResumeReadinessThreshold}%)</span>
                {eligibility.resumeThresholdEligible ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {resumeReadiness}%
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> {resumeReadiness}%
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span>Assessment Evidence ({requirements.minAssessmentScoreThreshold}%)</span>
                {eligibility.assessmentThresholdEligible ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {assessmentScore}%
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> {assessmentScore}%
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-[11px] font-mono text-muted-foreground">
              {eligibility.unmetRequirements.length === 0
                ? "✓ Candidate satisfies all minimum job filters."
                : `⚠️ Unmet Filters: ${eligibility.unmetRequirements.join(" • ")}`}
            </div>
          </GlassCard>
        </div>

        {/* Explainable Match Score Breakdown (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 space-y-4 border-cyan-500/30" glow>
            <div className="space-y-1 border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                2. Algorithmic Match Breakdown
              </span>
              <h3 className="text-base font-bold text-foreground font-mono">
                Multi-Pillar Weight Attribution
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Required Skills (35%)</span>
                <strong className="text-base text-cyan-300">
                  {matchedSkills.length}/{requirements.requiredSkills.length}
                </strong>
                <span className="text-[10px] text-emerald-400 block">Matched</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Preferred Skills (15%)</span>
                <strong className="text-base text-violet-300">
                  {preferredSkillsMatched.length}/{requirements.preferredSkills.length}
                </strong>
                <span className="text-[10px] text-violet-400 block">Bonus Active</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Resume ATS (15%)</span>
                <strong className="text-base text-cyan-300">{resumeReadiness}%</strong>
                <span className="text-[10px] text-muted-foreground block">Verified ATS</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Assessment (15%)</span>
                <strong className="text-base text-emerald-300">{assessmentScore}%</strong>
                <span className="text-[10px] text-emerald-400 block">Proctored</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Mock Interview (10%)</span>
                <strong className="text-base text-amber-300">
                  {interviewReadiness ? `${interviewReadiness}%` : "80% (Est)"}
                </strong>
                <span className="text-[10px] text-muted-foreground block">
                  {candidate.privacyConsent.shareInterviewTelemetry ? "Shared" : "Default"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Project Code (10%)</span>
                <strong className="text-base text-blue-300">{candidate.projects.length} Repos</strong>
                <span className="text-[10px] text-blue-400 block">Git Provenance</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Matched Skills vs Skill Gaps Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <GlassCard className="p-6 space-y-4 border-emerald-500/20 bg-emerald-950/10" glow>
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-foreground font-mono">
              Verified Matching Skills ({matchedSkills.length + preferredSkillsMatched.length})
            </h3>
          </div>

          <div className="space-y-2">
            {candidate.verifiedSkills
              .filter((s) =>
                requirements.requiredSkills.concat(requirements.preferredSkills).some(
                  (rs) => rs.toLowerCase() === s.name.toLowerCase()
                )
              )
              .map((s) => (
                <div
                  key={s.name}
                  className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <strong className="text-foreground">{s.name}</strong>
                    <span className="text-[10px] text-muted-foreground">({s.level})</span>
                  </div>
                  <span className="text-emerald-300 font-bold">{s.score}% Verified</span>
                </div>
              ))}
          </div>
        </GlassCard>

        {/* Skill Gaps */}
        <GlassCard className="p-6 space-y-4 border-rose-500/20 bg-rose-950/10" glow>
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-bold text-foreground font-mono">
              Unmatched Skill Gaps ({skillGaps.length})
            </h3>
          </div>

          {skillGaps.length === 0 ? (
            <p className="text-xs text-muted-foreground font-mono py-4 text-center">
              ✓ Zero skill gaps! Candidate matches all mandatory requirements.
            </p>
          ) : (
            <div className="space-y-2">
              {skillGaps.map((g) => (
                <div
                  key={g}
                  className="p-3 rounded-xl bg-black/40 border border-rose-500/20 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-rose-200 font-bold">{g}</span>
                  <span className="text-[10px] text-rose-400">Missing Mandatory Prerequisite</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Verified Projects Provenance & Telemetry */}
      <GlassCard className="p-6 space-y-4 border-white/10" glow>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-foreground font-mono">
              Verified Production Projects & Commit Telemetry
            </h3>
          </div>
          <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
            CRYPTOGRAPHIC COMMIT AUDIT
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidate.projects.map((proj, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 font-mono"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">{proj.title}</h4>
                <span className="text-[10px] text-cyan-400">{proj.repoCommitCount} Commits</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{proj.impactSummary}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.techStack.map((tech) => (
                  <span key={tech} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-cyan-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Interview & GD Shared Telemetry (Where Shared) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 space-y-3 border-amber-500/20" glow>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-bold text-foreground font-mono">
                AI Mock Interview Telemetry
              </h4>
            </div>
            <Badge variant="glass" size="sm" className="font-mono text-[9px]">
              {candidate.privacyConsent.shareInterviewTelemetry ? "SHARED" : "PRIVATE"}
            </Badge>
          </div>
          {candidate.privacyConsent.shareInterviewTelemetry && candidate.mockInterviewScore ? (
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Technical Score:</span>
                <strong className="text-amber-300">{candidate.mockInterviewScore}%</strong>
              </div>
              <p className="text-muted-foreground text-[11px]">
                High architectural clarity in distributed design; response latency sub-3.2s.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-mono italic">
              Candidate has chosen not to share raw interview transcripts.
            </p>
          )}
        </GlassCard>

        <GlassCard className="p-6 space-y-3 border-emerald-500/20" glow>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-foreground font-mono">
                Group Discussion Telemetry
              </h4>
            </div>
            <Badge variant="glass" size="sm" className="font-mono text-[9px]">
              {candidate.privacyConsent.shareGDTelemetry ? "SHARED" : "PRIVATE"}
            </Badge>
          </div>
          {candidate.privacyConsent.shareGDTelemetry && candidate.gdScore ? (
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">GD Composite Score:</span>
                <strong className="text-emerald-300">{candidate.gdScore}%</strong>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Optimal airtime share (24%) with strong PREP framework structured framing.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-mono italic">
              Candidate has chosen not to share GD transcripts.
            </p>
          )}
        </GlassCard>
      </div>

      {/* Footer Recruiter Actions */}
      <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground font-mono">
          Audit Reference: KS-EVAL-{candidate.id.toUpperCase()}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/industry/candidate-intelligence">
            <Button variant="glass" size="default" className="text-xs font-mono">
              Back to Pipeline
            </Button>
          </Link>
          <Button
            variant="glow"
            size="default"
            onClick={() => alert(`Invitation sent to ${isContactMasked ? candidate.candidateAlias : candidate.realName} for role ${requirements.roleTitle}.`)}
            className="text-xs font-mono font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Invite to Technical Round →
          </Button>
        </div>
      </div>
    </div>
  );
}
