"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Users,
  Compass,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Sparkles,
  Send,
  Building2,
  Award,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityEntity } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [opportunity, setOpportunity] = useState<OpportunityEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coverNote, setCoverNote] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <span>Back to Opportunity Marketplace</span>
        </Link>

        {/* Top Header Card */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 space-y-6 border-white/10" glow>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="cyber" size="sm">
                    {opportunity.opportunityType.toUpperCase().replace("_", " ")}
                  </Badge>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-muted-foreground">
                    {opportunity.locationType.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {opportunity.title}
                </h1>
                <p className="text-sm font-semibold text-cyan-400">
                  {opportunity.organizationName}
                </p>
              </div>

              {/* Match Score Card */}
              {match && (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center gap-4 shrink-0 shadow-glow-sm">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                      Explainable Match
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-cyan-300">
                      {match.overallScore}%
                    </span>
                  </div>
                  <Badge variant="emerald" size="sm">
                    {match.overallScore >= 80 ? "HIGH FIT" : "QUALIFIED"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06] text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-muted-foreground block">Stipend / CTC</span>
                <span className="font-bold text-emerald-400 text-sm">{opportunity.stipendSalary}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-muted-foreground block">Location</span>
                <span className="font-bold text-foreground text-sm truncate">{opportunity.location}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-muted-foreground block">Duration</span>
                <span className="font-bold text-foreground text-sm">{opportunity.duration}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-muted-foreground block">Application Deadline</span>
                <span className="font-bold text-amber-400 text-sm">{opportunity.deadline}</span>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Description, Skills, Eligibility */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 space-y-6 border-white/10">
              <div className="space-y-3">
                <h3 className="font-bold text-base text-foreground">Role Description & Scope</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {opportunity.description}
                </p>
              </div>

              {/* Required & Preferred Skills */}
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <h4 className="font-bold text-sm text-foreground">Required Core Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((s) => (
                    <Badge key={s} variant="cyber" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {opportunity.preferredSkills.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-foreground">Preferred Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.preferredSkills.map((s) => (
                      <Badge key={s} variant="glass" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility & Experience */}
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <h4 className="font-bold text-sm text-foreground">Eligibility & Prerequisites</h4>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-muted-foreground">
                  <p><strong>Academic Eligibility:</strong> {opportunity.eligibility}</p>
                  {opportunity.minGpa && <p><strong>Minimum GPA:</strong> {opportunity.minGpa} / 10.0</p>}
                  <p><strong>Experience Level:</strong> {opportunity.experienceRequired}</p>
                  <p><strong>Open Positions:</strong> {opportunity.openingsCount} Candidate Openings</p>
                </div>
              </div>
            </GlassCard>

            {/* Explainable Factor Breakdown (Why this score?) */}
            {match && (
              <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-base text-foreground">Explainable Compatibility Analysis</h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {match.reasoningSummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Strong Match
                    </span>
                    <p className="text-[11px] text-muted-foreground">{match.strongSkills.join(", ") || "None"}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                    <span className="font-semibold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Partial Fit
                    </span>
                    <p className="text-[11px] text-muted-foreground">{match.partialSkills.join(", ") || "None"}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Missing Gap
                    </span>
                    <p className="text-[11px] text-muted-foreground">{match.gapSkills.join(", ") || "0 Gaps"}</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Column: Application Box */}
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4 border-cyan-500/30" glow>
              <h3 className="font-bold text-base text-foreground">Submit Application</h3>

              {hasApplied ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-sm text-foreground">Application Submitted!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your profile and telemetry have been delivered to {opportunity.organizationName}.
                  </p>
                  <Link href="/applications" className="block pt-2">
                    <Button variant="glow" size="sm" className="w-full">
                      Track Application Status
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                      Candidate Statement / Pitch
                    </label>
                    <textarea
                      rows={5}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Highlight relevant project repositories, hackathon distinctions, or why you are a strong fit..."
                      className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] text-muted-foreground">
                    <span className="text-cyan-400 font-semibold block">Attached Credentials:</span>
                    <span>• Verified Student Skills Matrix</span>
                    <br />
                    <span>• Multi-Vector Assessment Diagnostic Scores</span>
                    <br />
                    <span>• Public Portfolio & Github Repositories</span>
                  </div>

                  <Button
                    type="submit"
                    variant="glow"
                    size="sm"
                    className="w-full"
                    isLoading={isApplying}
                    leftIcon={<Send className="h-4 w-4" />}
                  >
                    Submit Application
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
}
