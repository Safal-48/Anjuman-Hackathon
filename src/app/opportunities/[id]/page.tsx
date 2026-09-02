"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Bookmark,
  Send,
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityEntity } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { ApplicationReadinessModal } from "@/components/marketplace/application-readiness-modal";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [opportunity, setOpportunity] = useState<OpportunityEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showReadinessModal, setShowReadinessModal] = useState(false);

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const res = await fetch(`/api/marketplace/opportunities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOpportunity(data.opportunity);
        }
      } catch (err) {
        console.error("Failed to load opportunity detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOpportunity();
  }, [id]);

  const handleApply = async (coverNote: string) => {
    if (!opportunity || isApplying) return;

    setIsApplying(true);
    try {
      const res = await fetch(`/api/marketplace/opportunities/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverNote: coverNote.trim() }),
      });
      if (res.ok) {
        setHasApplied(true);
        setShowReadinessModal(false);
      }
    } catch (err) {
      console.error("Application failed:", err);
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading || !opportunity) {
    return (
      <Container size="xl" className="py-10 space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  const match = opportunity.matchResult;

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Back Link */}
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Opportunities</span>
        </Link>

        {/* Hero Header */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 mt-4 border-cyan-500/20 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" dot dotColor="cyan" className="uppercase font-mono text-[10px]">
                    {opportunity.opportunityType}
                  </Badge>
                  <Badge variant="glass" className="font-mono text-[10px]">
                    {opportunity.locationType}
                  </Badge>
                  {match && (
                    <Badge variant={match.overallScore >= 80 ? "emerald" : "amber"} className="font-mono text-[10px]">
                      {match.overallScore}% MATCH
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {opportunity.title}
                </h1>

                <p className="text-sm font-semibold text-cyan-300">
                  {opportunity.organizationName}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button variant="glass" size="sm" leftIcon={<Bookmark className="h-4 w-4" />}>
                  Save
                </Button>
                {hasApplied ? (
                  <Button variant="cyber" size="sm" disabled leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                    Applied
                  </Button>
                ) : (
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => setShowReadinessModal(true)}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    Apply with Resume Readiness →
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08] text-xs font-mono">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Location</span>
                <span className="text-foreground font-bold flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  {opportunity.location}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Compensation</span>
                <span className="text-emerald-400 font-bold mt-0.5 block">
                  {opportunity.stipendSalary}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Duration</span>
                <span className="text-foreground font-bold flex items-center gap-1 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {opportunity.duration}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Application Deadline</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {opportunity.deadline}
                </span>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left 2 Cols: Details */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 space-y-4 border-white/10" glow>
              <h3 className="font-bold text-base text-foreground">Role Overview & Description</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {opportunity.description}
              </p>

              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  Eligibility & Requirements
                </h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>• <strong>Academic Criterion:</strong> {opportunity.eligibility}</p>
                  <p>• <strong>Prior Experience:</strong> {opportunity.experienceRequired}</p>
                  {opportunity.minGpa && (
                    <p>• <strong>Minimum GPA Benchmark:</strong> {opportunity.minGpa} / 10.0</p>
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 border-white/10" glow>
              <h3 className="font-bold text-base text-foreground">Required Technical Stack</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredSkills.map((s) => (
                  <Badge key={s} variant="cyber" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>

              {opportunity.preferredSkills.length > 0 && (
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    Preferred & Good-to-Have Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.preferredSkills.map((s) => (
                      <Badge key={s} variant="glass" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Compatibility Telemetry */}
            {match && (
              <GlassCard className="p-6 space-y-4 border-white/10" glow>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-foreground">Candidate Alignment Breakdown</h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{match.overallScore}% MATCH</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills
                    </span>
                    <p className="text-[11px] text-muted-foreground">{match.strongSkills.join(", ") || "None"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Partial Match
                    </span>
                    <p className="text-[11px] text-muted-foreground">{match.partialSkills.join(", ") || "None"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                    <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Missing Skills
                    </span>
                    <p className="text-[11px] text-muted-foreground">{match.gapSkills.join(", ") || "0 Gaps"}</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Column: Application Readiness Gate Action */}
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4 border-cyan-500/30" glow>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-base text-foreground">Application Process</h3>
              </div>

              {hasApplied ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-sm text-foreground">Application Submitted!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your profile, readiness score, and telemetry have been submitted to {opportunity.organizationName}.
                  </p>
                  <Link href="/applications" className="block pt-2">
                    <Button variant="glow" size="sm" className="w-full">
                      Track Application Status
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-muted-foreground">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-cyan-400 font-semibold uppercase font-mono text-[10px] block">
                      Pre-Submission Readiness Check
                    </span>
                    <p className="text-foreground/80 leading-relaxed">
                      Skillora performs an automated resume readiness audit against the recruiter&apos;s <strong>70% threshold benchmark</strong> before submission.
                    </p>
                  </div>

                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Instant Matched & Missing Skills Check</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Role Compatibility Telemetry</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="glow"
                    size="default"
                    onClick={() => setShowReadinessModal(true)}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full font-mono font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    Apply (Verify Readiness) →
                  </Button>

                  <Link href={`/opportunities/${opportunity.id}/apply`} className="block text-center pt-1">
                    <span className="text-[11px] font-mono text-muted-foreground hover:text-cyan-400 transition-colors">
                      Or open dedicated application page →
                    </span>
                  </Link>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Dedicated Application Readiness Modal */}
        {showReadinessModal && (
          <ApplicationReadinessModal
            opportunity={opportunity}
            isOpen={showReadinessModal}
            onClose={() => setShowReadinessModal(false)}
            onSubmitApplication={handleApply}
            isSubmitting={isApplying}
          />
        )}
      </Container>
    </div>
  );
}
