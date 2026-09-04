"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Users,
  Zap,
  Plus,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityCard } from "@/components/marketplace/opportunity-card";
import { CompatibilityBreakdown } from "@/components/marketplace/compatibility-breakdown";
import { ApplicationReadinessModal } from "@/components/marketplace/application-readiness-modal";
import { ApplicationSuccessModal } from "@/components/marketplace/application-success-modal";
import { OpportunityEntity, OpportunityType } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrapper";

const TYPE_TABS: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "all", label: "All Formats", icon: Compass },
  { id: "internship", label: "Internships", icon: GraduationCap },
  { id: "job", label: "Full-Time Jobs", icon: Briefcase },
  { id: "industry_project", label: "Industry Projects", icon: FolderGit2 },
  { id: "apprenticeship", label: "Apprenticeships", icon: Compass },
  { id: "training_program", label: "Training Cohorts", icon: BookOpen },
  { id: "workshop", label: "Workshops", icon: Zap },
  { id: "mentorship", label: "Mentorship", icon: Users },
];

export default function OpportunityMarketplacePage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("all");
  const [locationType, setLocationType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minMatch, setMinMatch] = useState<number | undefined>(undefined);

  // Modal State
  const [selectedOppForModal, setSelectedOppForModal] = useState<OpportunityEntity | null>(null);
  const [selectedOppForReadiness, setSelectedOppForReadiness] = useState<OpportunityEntity | null>(null);
  const [submittedOppForSuccess, setSubmittedOppForSuccess] = useState<OpportunityEntity | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeType !== "all") params.set("type", activeType);
      if (locationType !== "all") params.set("locationType", locationType);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (minMatch) params.set("minMatch", String(minMatch));

      const res = await fetch(`/api/marketplace/opportunities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (err) {
      console.error("Failed to load opportunities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeType, locationType, searchQuery, minMatch]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleOpenReadiness = (opp: OpportunityEntity) => {
    setSelectedOppForReadiness(opp);
  };

  const handleFinalSubmitApplication = async (coverNote: string) => {
    if (!selectedOppForReadiness) return;
    setIsSubmittingApp(true);
    try {
      const res = await fetch(`/api/marketplace/opportunities/${selectedOppForReadiness.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverNote: coverNote.trim() || "Applied with verified Skillora Profile" }),
      });
      if (res.ok) {
        const submitted = selectedOppForReadiness;
        setSelectedOppForReadiness(null);
        setSubmittedOppForSuccess(submitted);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("Application error:", err);
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const isRecruiter = user?.role === "industry" || user?.role === "institution" || user?.role === "admin";

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Banner Header */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" dot dotColor="cyan">
                    OPPORTUNITIES MARKETPLACE
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">
                    {opportunities.length} Active Positions
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Discover AI-Matched Career Opportunities
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Transparent, explainable matching connects candidates directly with industrial internships, verified hiring pipelines, and funded projects.
                </p>
              </div>

              {isRecruiter && (
                <Link href="/opportunities/manage">
                  <Button variant="glow" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Post New Opportunity
                  </Button>
                </Link>
              )}
            </div>
          </GlassCard>
        </FadeIn>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, required skills, technology, or company name..."
                className="pl-10 text-xs bg-slate-900/60 border-white/10"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-foreground outline-none font-mono"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
              </select>

              <select
                value={minMatch || ""}
                onChange={(e) => setMinMatch(e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-foreground outline-none font-mono"
              >
                <option value="">Any Match %</option>
                <option value="80">≥ 80% Top Fit</option>
                <option value="60">≥ 60% Good Fit</option>
              </select>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveType(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                      : "bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Opportunity Cards Listing */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3 border-white/10" glow>
            <Compass className="h-10 w-10 text-cyan-400 mx-auto" />
            <h3 className="font-bold text-lg text-foreground">No matching opportunities found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search keywords, location filters, or minimum compatibility threshold.
            </p>
          </GlassCard>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <StaggerItem key={opp.id}>
                <OpportunityCard
                  opportunity={opp}
                  onOpenCompatibility={(o) => setSelectedOppForModal(o)}
                  onQuickApply={handleOpenReadiness}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>

      {/* Explainable Compatibility Modal */}
      <CompatibilityBreakdown
        opportunity={selectedOppForModal}
        isOpen={Boolean(selectedOppForModal)}
        onClose={() => setSelectedOppForModal(null)}
        onApply={() => {
          if (selectedOppForModal) {
            const opp = selectedOppForModal;
            setSelectedOppForModal(null);
            handleOpenReadiness(opp);
          }
        }}
      />

      {/* Dedicated Application Readiness Pre-Submission Modal */}
      {selectedOppForReadiness && (
        <ApplicationReadinessModal
          opportunity={selectedOppForReadiness}
          isOpen={Boolean(selectedOppForReadiness)}
          onClose={() => setSelectedOppForReadiness(null)}
          onSubmitApplication={handleFinalSubmitApplication}
          isSubmitting={isSubmittingApp}
        />
      )}

      {/* High-End Cyberpunk Application Success Modal */}
      <ApplicationSuccessModal
        isOpen={Boolean(submittedOppForSuccess)}
        opportunity={submittedOppForSuccess}
        onClose={() => setSubmittedOppForSuccess(null)}
      />
    </div>
  );
}
