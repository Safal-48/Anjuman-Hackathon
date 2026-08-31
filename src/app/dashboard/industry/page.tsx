"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Compass,
  Building2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IndustryOverviewCards } from "@/components/analytics/industry-overview-cards";
import { CandidateTalentRadar } from "@/components/analytics/candidate-talent-radar";
import { SkillDemandChart } from "@/components/analytics/skill-demand-chart";
import { IndustryAnalyticsSummary } from "@/lib/analytics/role-analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function IndustryDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<IndustryAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics/industry");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Failed to load industry analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Banner Header */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="violet" dot dotColor="violet">
                    INDUSTRY TALENT INTELLIGENCE
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    RECRUITER COMMAND SUITE
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  Industry Hiring & Skill Demand Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Discover pre-screened student candidates ranked by explainable compatibility, manage hiring pipelines, and analyze live tech ecosystem skill demand.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/opportunities/manage">
                  <Button variant="glow" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Manage Opportunities
                  </Button>
                </Link>
                <Link href="/opportunities">
                  <Button variant="glass" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
                    Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {isLoading || !analytics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Metric Cards */}
            <IndustryOverviewCards analytics={analytics} />

            {/* Main 2-Column Analytics Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Candidate Talent Radar */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-bold text-lg text-foreground">
                      Candidate Talent Radar & AI Recommendations
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    Ranked by Explainable Fit
                  </span>
                </div>

                <CandidateTalentRadar candidates={analytics.rankedCandidateRecommendations} />
              </div>

              {/* Right Col: Skill Demand Chart */}
              <div className="space-y-4">
                <SkillDemandChart demands={analytics.skillDemandDistribution} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
