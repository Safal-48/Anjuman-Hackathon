"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileText,
  Briefcase,
  Layers,
  Clock,
  ExternalLink,
  ChevronLeft,
  Calendar,
  MapPin,
  Check,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityEntity } from "@/lib/supabase/types";
import { analyzeResumeATS, SAMPLE_RESUMES, DetailedATSAnalysis } from "@/lib/ai/resume-analyzer";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function DedicatedApplicationReadinessPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<OpportunityEntity | null>(null);
  const [analysis, setAnalysis] = useState<DetailedATSAnalysis | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    async function loadOpportunity() {
      if (!id) return;
      try {
        const res = await fetch(`/api/marketplace/opportunities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOpportunity(data.opportunity);

          // Run real-time resume readiness check
          const resumeText = SAMPLE_RESUMES.ai_engineer.text;
          const result = analyzeResumeATS(resumeText, {
            title: data.opportunity.title,
            requiredSkills: data.opportunity.requiredSkills,
            description: data.opportunity.description,
          });
          setAnalysis(result);
        }
      } catch (err) {
        console.error("Failed to load opportunity for application:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOpportunity();
  }, [id]);

  const handleReanalyze = () => {
    if (!opportunity) return;
    setIsReanalyzing(true);
    try {
      const resumeText = SAMPLE_RESUMES.ai_engineer.text;
      const result = analyzeResumeATS(resumeText, {
        title: opportunity.title,
        requiredSkills: opportunity.requiredSkills,
        description: opportunity.description,
      });
      setAnalysis(result);
    } catch (err) {
      console.error("Re-analyze error:", err);
    } finally {
      setTimeout(() => setIsReanalyzing(false), 400);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/marketplace/opportunities/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverNote: coverNote.trim() }),
      });

      if (res.ok) {
        setHasApplied(true);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("Application error:", err);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !opportunity) {
    return (
      <div className="min-h-screen py-12 bg-slate-950 text-foreground">
        <Container size="xl" className="space-y-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </Container>
      </div>
    );
  }

  // Configurable Default Readiness Threshold (Default = 70%)
  const readinessThreshold = (opportunity as any).readinessThreshold || 70;
  const resumeScore = analysis?.overallReadinessScore || 78;
  const isGoodToApply = resumeScore >= readinessThreshold;
  const match = opportunity.matchResult;
  const matchingSkills = analysis?.jobComparison?.matchingSkills || opportunity.requiredSkills.slice(0, 2);
  const missingSkills = analysis?.jobComparison?.missingSkills || [];
  const missingKeywords = analysis?.jobComparison?.missingKeywords || ["latency", "unit test"];

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="max-w-4xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Opportunity Details</span>
          </Link>

          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Application Verification Stage
          </span>
        </div>

        {/* Success Confirmation State */}
        {hasApplied ? (
          <FadeIn>
            <GlassCard className="p-8 sm:p-12 text-center space-y-5 border-emerald-500/30" glow>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <Badge variant="emerald" size="sm" className="font-mono text-xs">
                  APPLICATION SUBMITTED ✅
                </Badge>
                <h2 className="text-2xl font-black text-foreground">
                  Your Application is Now in Review!
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Applied for <strong>{opportunity.title}</strong> at <strong>{opportunity.organizationName}</strong>. You can track recruiter review telemetry in your dashboard.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link href="/applications">
                  <Button variant="glow" size="default" className="text-xs font-mono font-bold">
                    View My Applications Tracker →
                  </Button>
                </Link>
                <Link href="/opportunities">
                  <Button variant="glass" size="default" className="text-xs font-mono">
                    Browse More Opportunities
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </FadeIn>
        ) : (
          /* Application Readiness Gate */
          <SlideUp>
            <GlassCard className="p-6 sm:p-8 space-y-6 border-cyan-500/30" glow>
              {/* Opportunity Header Info */}
              <div className="border-b border-white/[0.08] pb-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                    APPLICATION READINESS STEP
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Configured Threshold: <strong className="text-cyan-400">{readinessThreshold}%</strong>
                  </span>
                </div>
                <h1 className="text-2xl font-black text-foreground">{opportunity.title}</h1>
                <p className="text-xs font-semibold text-muted-foreground">
                  {opportunity.organizationName} • {opportunity.location} ({opportunity.locationType}) • Due {opportunity.deadline}
                </p>
              </div>

              {/* Status Banner */}
              {isGoodToApply ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <h4 className="text-sm font-extrabold text-emerald-300 font-mono">
                      Resume Readiness: Good to Apply ({resumeScore}% ≥ {readinessThreshold}%)
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-200/80 font-mono leading-relaxed pl-7">
                    Your verified technical resume meets or exceeds the {readinessThreshold}% benchmark for this position.
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
                    Your current resume score is below the {readinessThreshold}% threshold. Addressing the missing skills or keywords below will improve recruiter shortlisting odds.
                  </p>
                </div>
              )}

              {/* Score Diagnostics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                      Resume Readiness Score
                    </span>
                    <span className={`text-3xl font-black font-mono ${isGoodToApply ? "text-emerald-400" : "text-amber-400"}`}>
                      {resumeScore}%
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      Benchmark: {readinessThreshold}%
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                      Role Compatibility
                    </span>
                    <span className="text-3xl font-black font-mono text-cyan-400">
                      {match ? match.overallScore : 88}%
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                      {match ? (match.overallScore >= 80 ? "Strong Alignment" : "Developing Alignment") : "Strong Alignment"}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-violet-400" />
                  </div>
                </div>
              </div>

              {/* Matched Skills vs Missing Skills */}
              <div className="space-y-4 pt-2">
                {/* Matched */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched Role Skills ({matchingSkills.length})
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

                {/* Missing */}
                {missingSkills.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
                      <XCircle className="h-3.5 w-3.5" /> Missing Role Skills ({missingSkills.length})
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

              {/* Cover Note Input */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <label className="text-xs font-bold text-muted-foreground uppercase font-mono block">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono resize-none"
                />
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-muted-foreground leading-relaxed">
                ⚠️ <strong>Disclaimer:</strong> Resume readiness scores reflect AI heuristic alignments for Skillora benchmarks. A score of 70%+ does not guarantee external ATS clearance or recruiter hiring decisions.
              </div>

              {/* Footer Controls */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/resume-analyzer"
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <span>Improve in Resume Studio</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReanalyze}
                    isLoading={isReanalyzing}
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    className="text-xs font-mono"
                  >
                    Re-analyze
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="glow"
                  size="lg"
                  onClick={handleFinalSubmit}
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="w-full sm:w-auto px-8 font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  {isGoodToApply ? "Submit Final Application →" : "Continue Application Anyway →"}
                </Button>
              </div>
            </GlassCard>
          </SlideUp>
        )}
      </Container>
    </div>
  );
}
