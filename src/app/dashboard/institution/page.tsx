"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Award,
  Layers,
  TrendingUp,
  Brain,
  Compass,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InstitutionMetricCards } from "@/components/analytics/institution-metric-cards";
import { SkillGapHeatmap } from "@/components/analytics/skill-gap-heatmap";
import { PlacementFunnelChart } from "@/components/analytics/placement-funnel-chart";
import { InstitutionFilterBar } from "@/components/analytics/institution-filter-bar";
import { InstitutionAnalyticsSummary } from "@/lib/analytics/role-analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function InstitutionDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<InstitutionAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [department, setDepartment] = useState("all");
  const [academicYear, setAcademicYear] = useState("all");
  const [dateRange, setDateRange] = useState("current_semester");

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (department !== "all") params.set("department", department);
      if (academicYear !== "all") params.set("academicYear", academicYear);
      if (dateRange) params.set("dateRange", dateRange);

      const res = await fetch(`/api/analytics/institution?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Failed to load institution analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [department, academicYear, dateRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

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
                    INSTITUTIONAL INTELLIGENCE CORE
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    UNIVERSITY COHORT TELEMETRY
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  Institution Skill Readiness & Placement Command
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Real-time analytics on student skill readiness, curriculum gap heatmaps, internship participation rates, and institutional placement funnels.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/opportunities">
                  <Button variant="glow" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
                    Marketplace Feed
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Filter Bar */}
        <InstitutionFilterBar
          department={department}
          academicYear={academicYear}
          dateRange={dateRange}
          onDepartmentChange={setDepartment}
          onAcademicYearChange={setAcademicYear}
          onDateRangeChange={setDateRange}
        />

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
            {/* Top 4 Core Metric Cards (Answers Readiness, Internship & Placement Questions) */}
            <InstitutionMetricCards analytics={analytics} />

            {/* Department Breakdown Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.departmentBreakdowns.map((dept) => (
                <GlassCard key={dept.departmentName} className="p-4 space-y-2 border-white/10" glow>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-foreground leading-snug">{dept.departmentName}</span>
                    <Badge variant="cyber" size="sm">
                      {dept.enrolledStudents} STU
                    </Badge>
                  </div>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skill Readiness:</span>
                      <span className="font-bold text-cyan-400">{dept.averageReadiness}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Internships:</span>
                      <span className="font-bold text-emerald-400">{dept.internshipParticipationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Placement Ready:</span>
                      <span className="font-bold text-violet-400">{dept.placementReadinessRate}%</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Main Interactive Heatmap & Common Skill Gaps */}
            <SkillGapHeatmap
              heatmapCells={analytics.skillGapHeatmap}
              commonSkillGaps={analytics.commonSkillGaps}
            />

            {/* Placement Funnel Conversion Visualization */}
            <PlacementFunnelChart funnelStages={analytics.placementFunnel} />
          </div>
        )}
      </Container>
    </div>
  );
}
