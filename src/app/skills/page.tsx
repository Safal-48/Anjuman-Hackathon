"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  Sparkles,
  RotateCcw,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Zap,
} from "lucide-react";
import { TopicDiagnosticBreakdown } from "@/components/skills/topic-diagnostic-breakdown";
import { PersonalSkillDNA } from "@/components/skills/personal-skill-dna";
import { PerformancePriorityEngine } from "@/components/skills/performance-priority-engine";
import { Container } from "@/components/layout/container";
import { ReadinessRadial } from "@/components/skills/readiness-radial";
import { SkillStrengthsWeaknesses } from "@/components/skills/skill-strengths-weaknesses";
import { SkillGapMatrix } from "@/components/skills/skill-gap-matrix";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { SkillIntelligenceReport, TargetRoleBenchmark } from "@/lib/supabase/types";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function SkillsIntelligencePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [report, setReport] = useState<SkillIntelligenceReport | null>(null);
  const [availableRoles, setAvailableRoles] = useState<TargetRoleBenchmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const router = useRouter();

  const fetchIntelligence = useCallback(async (roleId?: string) => {
    try {
      const url = roleId ? `/api/skills/intelligence?role=${roleId}` : "/api/skills/intelligence";
      const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
        setAvailableRoles(data.availableRoles || []);
      }
    } catch (err) {
      console.error("Failed to load skill intelligence:", err);
    } finally {
      setIsLoading(false);
      setIsUpdatingRole(false);
    }
  }, []);

  useEffect(() => {
    fetchIntelligence();
  }, [fetchIntelligence]);

  const handleSelectRole = async (roleId: string) => {
    setIsUpdatingRole(true);
    await fetch("/api/skills/intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRoleId: roleId }),
    });
    fetchIntelligence(roleId);
  };

  if (isLoading || authLoading || !report) {
    return (
      <Container size="xl" className="py-10 space-y-8">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </Container>
    );
  }

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Top Header Banner */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[2px] shadow-glow-md">
                  <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center text-cyan-400">
                    <Brain className="h-7 w-7" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                      Skill Intelligence Command Center
                    </h1>
                    <Badge variant="cyber" dot dotColor="cyan">
                      LIVE TELEMETRY
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Deterministic competency profiling, multi-dimensional assessment metrics, and role-gap analysis
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/assessment">
                  <Button variant="glow" size="sm" leftIcon={<RotateCcw className="h-4 w-4" />}>
                    Retake Assessment
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="glass" size="sm" leftIcon={<Award className="h-4 w-4" />}>
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Section 1: Personal Skill DNA (Continuous Mastery & Evidence Model) */}
        <div className="mt-8">
          <SlideUp delay={0.05}>
            <PersonalSkillDNA />
          </SlideUp>
        </div>

        {/* Section 2: Performance-Based Gap & Priority Engine (Do This First) */}
        <div className="mt-8">
          <SlideUp delay={0.08}>
            <PerformancePriorityEngine />
          </SlideUp>
        </div>

        {/* Section 3: Multi-Vector Readiness Radial */}
        <div className="mt-8">
          <SlideUp delay={0.1}>
            <ReadinessRadial report={report} />
          </SlideUp>
        </div>

        {/* Section 2: Topic & Sub-Skill Granular Diagnostic Mastery Matrix */}
        <div className="mt-8">
          <SlideUp delay={0.15}>
            <TopicDiagnosticBreakdown
              topicBreakdowns={report.topicBreakdowns}
              diagnosticInsights={report.diagnosticInsights}
            />
          </SlideUp>
        </div>

        {/* Section 3: Superpowers & Priority Growth Areas */}
        <div className="mt-8">
          <SlideUp delay={0.2}>
            <SkillStrengthsWeaknesses
              strongSkills={report.strongSkills}
              weakSkills={report.weakSkills}
              skillBreakdowns={report.skillBreakdowns}
            />
          </SlideUp>
        </div>

        {/* Section 4: Explainable Skill Gap Matrix vs Target Role */}
        <div className="mt-8">
          <SlideUp delay={0.3}>
            <SkillGapMatrix
              skillGaps={report.skillGaps}
              targetRole={report.targetRole}
              availableRoles={availableRoles}
              onSelectRole={handleSelectRole}
              isUpdatingRole={isUpdatingRole}
            />
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}
