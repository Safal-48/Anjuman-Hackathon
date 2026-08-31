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
  const [activeType, setActiveType] = useState("all");
  const [locationType, setLocationType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minMatch, setMinMatch] = useState<number | undefined>(undefined);

  // Selected Opportunity for Explainable Compatibility Modal
  const [selectedOppForModal, setSelectedOppForModal] = useState<OpportunityEntity | null>(null);

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

  const handleQuickApply = async (opp: OpportunityEntity) => {
    try {
      const res = await fetch(`/api/marketplace/opportunities/${opp.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverNote: "Quick apply via TECH-TITAN Opportunity Marketplace" }),
      });
      if (res.ok) {
        alert(`Application for "${opp.title}" submitted successfully!`);
      }
    } catch (err) {
      console.error("Quick apply failed:", err);
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
                    AI MATCHING CORE
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {opportunities.length} VERIFIED LISTINGS
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Opportunity Marketplace
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Discover internships, high-impact industry projects, apprenticeships, and mentorship tracks matched against your verified skills with explainable compatibility scoring.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/applications">
                  <Button variant="glass" size="sm">
                    My Applications
                  </Button>
                </Link>
                {isRecruiter && (
                  <Link href="/opportunities/manage">
                    <Button variant="glow" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                      Post Opportunity
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Search & Multi-Filters Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, organization, required skill (e.g. PyTorch, Docker)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/90 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Location Filter */}
            <select
              className="h-11 rounded-xl border border-white/10 bg-slate-900 px-4 text-xs font-semibold text-foreground focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>

            {/* Min Match Filter */}
            <select
              className="h-11 rounded-xl border border-white/10 bg-slate-900 px-4 text-xs font-semibold text-cyan-300 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              value={minMatch || ""}
              onChange={(e) => setMinMatch(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Any Match %</option>
              <option value="85">≥ 85% High Match</option>
              <option value="75">≥ 75% Solid Match</option>
              <option value="60">≥ 60% Developing</option>
            </select>
          </div>

          {/* Archetype Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 cyber-scrollbar">
            {TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveType(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-muted-foreground"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Opportunity Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
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
                  onQuickApply={handleQuickApply}
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
            handleQuickApply(selectedOppForModal);
          }
        }}
      />
    </div>
  );
}
