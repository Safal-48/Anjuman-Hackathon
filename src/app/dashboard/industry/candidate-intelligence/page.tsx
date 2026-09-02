"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  Search,
  Filter,
  ArrowUpDown,
  Building,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateIntelligenceCard } from "@/components/recruiter/candidate-intelligence-card";
import { OpportunityRequirementsDrawer } from "@/components/recruiter/opportunity-requirements-drawer";
import {
  CandidateEvaluationResult,
  OpportunityRequirementConfig,
  DEFAULT_OPPORTUNITY_REQUIREMENTS,
} from "@/lib/analytics/candidate-intelligence-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function CandidateIntelligencePipelinePage() {
  const [requirements, setRequirements] = useState<OpportunityRequirementConfig>(
    DEFAULT_OPPORTUNITY_REQUIREMENTS[0]
  );
  const [allRequirements, setAllRequirements] = useState<OpportunityRequirementConfig[]>(
    DEFAULT_OPPORTUNITY_REQUIREMENTS
  );
  const [evaluations, setEvaluations] = useState<CandidateEvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState<"all" | "eligible" | "conditional">("all");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/recruiter/candidate-intelligence?reqId=${requirements.id}`);
        if (res.ok) {
          const data = await res.json();
          setRequirements(data.requirements);
          setAllRequirements(data.allRequirements || DEFAULT_OPPORTUNITY_REQUIREMENTS);
          setEvaluations(data.evaluations || []);
        }
      } catch (err) {
        console.error("Failed to load candidate evaluations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [requirements.id]);

  const handleSelectPreset = (presetId: string) => {
    const found = allRequirements.find((r) => r.id === presetId);
    if (found) {
      setRequirements(found);
    }
  };

  const handleApplyCustomConfig = async (config: OpportunityRequirementConfig) => {
    setIsLoading(true);
    setRequirements(config);
    try {
      const res = await fetch("/api/recruiter/candidate-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluations(data.evaluations || []);
      }
    } catch (err) {
      console.error("Custom requirement error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvaluations = evaluations.filter((ev) => {
    const matchesSearch =
      ev.candidate.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.candidate.candidateAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.candidate.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (eligibilityFilter === "eligible") return ev.eligibility.isOverallEligible;
    if (eligibilityFilter === "conditional") return ev.eligibility.eligibilityBadge === "Conditional Review";
    return true;
  });

  const eligibleCount = evaluations.filter((e) => e.eligibility.isOverallEligible).length;

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-8 max-w-7xl">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/industry"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Return to Industry Dashboard"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">
                  Skillora Recruiter Command Suite
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-violet-400" />
                <Badge variant="violet" size="sm" className="font-mono text-[9px]">
                  CANDIDATE INTELLIGENCE EXTENSION
                </Badge>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                Explainable Candidate Intelligence
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glow"
              size="sm"
              onClick={() => setShowConfigDrawer(true)}
              leftIcon={<Sliders className="h-3.5 w-3.5" />}
              className="text-xs font-mono font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Configure Opportunity Criteria
            </Button>
          </div>
        </div>

        {/* Opportunity Criteria Banner */}
        <SlideUp>
          <GlassCard className="p-6 border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-violet-950/30 shadow-xl relative overflow-hidden" glow>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                    ACTIVE ROLE REQUIREMENTS
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">{requirements.department}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
                  {requirements.roleTitle}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground pt-1">
                  <span>Required: </span>
                  {requirements.requiredSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30 font-bold">
                      {s}
                    </span>
                  ))}
                  <span className="ml-2">Preferred: </span>
                  {requirements.preferredSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thresholds Telemetry Summary */}
              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
                  <span className="text-[10px] text-muted-foreground block">Resume Threshold</span>
                  <strong className="text-sm text-cyan-300">{requirements.minResumeReadinessThreshold}%</strong>
                </div>
                <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
                  <span className="text-[10px] text-muted-foreground block">Assessment Threshold</span>
                  <strong className="text-sm text-violet-300">{requirements.minAssessmentScoreThreshold}%</strong>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="text-[10px] text-emerald-400 block">Eligible Talent</span>
                  <strong className="text-sm text-emerald-300">{eligibleCount} / {evaluations.length}</strong>
                </div>
              </div>
            </div>
          </GlassCard>
        </SlideUp>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, skill, or university..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-cyan-500 outline-none font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: `All Candidates (${evaluations.length})` },
              { id: "eligible", label: `Fully Eligible (${eligibleCount})` },
              { id: "conditional", label: "Conditional Review" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEligibilityFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  eligibilityFilter === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                    : "bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3 border-white/10" glow>
            <p className="text-sm font-mono text-muted-foreground">
              No candidates found matching the selected filters.
            </p>
          </GlassCard>
        ) : (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvaluations.map((evaluation) => (
                <CandidateIntelligenceCard
                  key={evaluation.candidate.id}
                  evaluation={evaluation}
                />
              ))}
            </div>
          </FadeIn>
        )}

        {/* Requirements Configuration Drawer Modal */}
        {showConfigDrawer && (
          <OpportunityRequirementsDrawer
            currentConfig={requirements}
            allPresetConfigs={allRequirements}
            onSelectPreset={handleSelectPreset}
            onApplyCustomConfig={handleApplyCustomConfig}
            onClose={() => setShowConfigDrawer(false)}
          />
        )}
      </Container>
    </div>
  );
}
