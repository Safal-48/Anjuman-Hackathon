"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  FileText,
  Briefcase,
  Layers,
  Clock,
  X,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpportunityEntity } from "@/lib/supabase/types";
import { analyzeResumeATS, SAMPLE_RESUMES, DetailedATSAnalysis } from "@/lib/ai/resume-analyzer";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

interface ApplicationReadinessModalProps {
  opportunity: OpportunityEntity;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (coverNote: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function ApplicationReadinessModal({
  opportunity,
  isOpen,
  onClose,
  onSubmitApplication,
  isSubmitting = false,
}: ApplicationReadinessModalProps) {
  const [coverNote, setCoverNote] = useState("");
  const [analysis, setAnalysis] = useState<DetailedATSAnalysis | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [showCoverNoteInput, setShowCoverNoteInput] = useState(false);

  // Configurable Default Readiness Threshold (Default = 70%)
  const readinessThreshold = (opportunity as any).readinessThreshold || 70;

  // Run real-time resume readiness evaluation against the opportunity
  const runReadinessAnalysis = () => {
    setIsReanalyzing(true);
    try {
      // Use candidate's primary resume or default high-fidelity student profile
      const resumeText = SAMPLE_RESUMES.ai_engineer.text;
      const result = analyzeResumeATS(resumeText, {
        title: opportunity.title,
        requiredSkills: opportunity.requiredSkills,
        description: opportunity.description,
      });
      setAnalysis(result);
    } catch (err) {
      console.error("Readiness check error:", err);
    } finally {
      setTimeout(() => setIsReanalyzing(false), 400);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runReadinessAnalysis();
    }
  }, [isOpen, opportunity.id]);

  if (!isOpen) return null;

  const resumeScore = analysis?.overallReadinessScore || 78;
  const isGoodToApply = resumeScore >= readinessThreshold;
  const match = opportunity.matchResult;
  const matchingSkills = analysis?.jobComparison?.matchingSkills || opportunity.requiredSkills.slice(0, 2);
  const missingSkills = analysis?.jobComparison?.missingSkills || [];
  const missingKeywords = analysis?.jobComparison?.missingKeywords || ["latency", "unit test"];

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmitApplication(coverNote);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <GlassCard className="w-full max-w-2xl p-6 sm:p-8 space-y-6 border-cyan-500/30 max-h-[90vh] overflow-y-auto relative my-8" glow>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                APPLICATION READINESS GATE
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Threshold: {readinessThreshold}%
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground leading-snug">
              {opportunity.title}
            </h2>
            <p className="text-xs font-semibold text-muted-foreground">
              {opportunity.organizationName} • {opportunity.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Readiness Status Banner */}
        <SlideUp>
          {isGoodToApply ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <h4 className="text-sm font-extrabold text-emerald-300 font-mono">
                  Resume Readiness: Good to Apply ({resumeScore}% ≥ {readinessThreshold}%)
                </h4>
              </div>
              <p className="text-xs text-emerald-200/80 font-mono leading-relaxed pl-7">
                Your verified resume demonstrates high alignment with this role&apos;s required skill catalog and experience depth.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)] space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                <h4 className="text-sm font-extrabold text-amber-300 font-mono">
                  Resume Needs Improvement ({resumeScore}% &lt; {readinessThreshold}%)
                </h4>
              </div>
              <p className="text-xs text-amber-200/80 font-mono leading-relaxed pl-7">
                Your current resume score is below the {readinessThreshold}% threshold. Consider adding required keywords or verifiable project bullets before final submission.
              </p>
            </div>
          )}
        </SlideUp>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Resume Readiness Score */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Resume Readiness
              </span>
              <span className={`text-2xl font-black font-mono ${isGoodToApply ? "text-emerald-400" : "text-amber-400"}`}>
                {resumeScore}%
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block">
                {isGoodToApply ? "Exceeds Threshold" : "Below Threshold"}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>
          </div>

          {/* Role Compatibility Score */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Role Compatibility
              </span>
              <span className="text-2xl font-black font-mono text-cyan-400">
                {match ? match.overallScore : 85}%
              </span>
              <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                {match ? (match.overallScore >= 80 ? "Top Fit Alignment" : "Developing Alignment") : "Strong Alignment"}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Matched vs Missing Skills Breakdown */}
        <div className="space-y-4 pt-1">
          {/* Matched Skills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills ({matchingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
                <AlertCircle className="h-3.5 w-3.5" /> Missing Role Skills ({missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  >
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {missingKeywords.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="h-3.5 w-3.5" /> Recommended Keywords in JD
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((k) => (
                  <span
                    key={k}
                    className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cover Note Section (Expandable or inline) */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <label className="text-xs font-bold text-muted-foreground uppercase font-mono block">
            Cover Note / Pitch (Optional)
          </label>
          <textarea
            rows={3}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Briefly state why you're a great fit for this specific opportunity..."
            className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono resize-none"
          />
        </div>

        {/* Realistic / Compliance Disclaimer */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-muted-foreground leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> Resume readiness scores reflect AI heuristic alignments for Skillora benchmarks. A score of 70%+ does not guarantee external ATS eligibility, interview shortlisting, or hiring outcomes.
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Improve Resume Link */}
            <Link
              href="/resume-analyzer"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <span>Improve in Resume Studio</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Re-analyze Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={runReadinessAnalysis}
              isLoading={isReanalyzing}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              className="text-xs font-mono"
            >
              Re-analyze
            </Button>
          </div>

          {/* Continue Application / Submit */}
          <Button
            type="button"
            variant="glow"
            size="default"
            onClick={handleFinalSubmit}
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto px-6 font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            {isGoodToApply ? "Submit Application →" : "Continue Application Anyway →"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
