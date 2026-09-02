"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  Brain,
  Sparkles,
  Compass,
  Clock,
  ShieldCheck,
  Bot,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  FlaskConical,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard, MetricCard } from "@/components/ui/card";
import { GlowBorder } from "@/components/ui/glow-border";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { UserRole } from "@/lib/auth/types";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import {
  IndustryAnalyticsSummary,
  InstitutionAnalyticsSummary,
  AcademicianCollaborationEntity,
} from "@/lib/analytics/role-analytics";

// Import subcomponents for other role perspectives
import { IndustryOverviewCards } from "@/components/analytics/industry-overview-cards";
import { CandidateTalentRadar } from "@/components/analytics/candidate-talent-radar";
import { SkillDemandChart } from "@/components/analytics/skill-demand-chart";
import { InstitutionMetricCards } from "@/components/analytics/institution-metric-cards";
import { SkillGapHeatmap } from "@/components/analytics/skill-gap-heatmap";
import { PlacementFunnelChart } from "@/components/analytics/placement-funnel-chart";
import { InstitutionFilterBar } from "@/components/analytics/institution-filter-bar";
import { AcademicianCollaborationCard } from "@/components/analytics/academician-collaboration-card";
import { LearningCommandCenter } from "@/components/dashboard/learning-command-center";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Role Perspective Switcher
  const [activeRoleView, setActiveRoleView] = useState<UserRole>("student");

  // Telemetry States
  const [industryAnalytics, setIndustryAnalytics] = useState<IndustryAnalyticsSummary | null>(null);
  const [institutionAnalytics, setInstitutionAnalytics] = useState<InstitutionAnalyticsSummary | null>(null);
  const [academicianCollaborations, setAcademicianCollaborations] = useState<AcademicianCollaborationEntity[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Institution Filters
  const [deptFilter, setDeptFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("current_semester");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=/dashboard");
    } else if (user) {
      setActiveRoleView(user.role);
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Load telemetry when active view changes
  useEffect(() => {
    async function loadRoleTelemetry() {
      if (!isAuthenticated) return;
      setAnalyticsLoading(true);
      try {
        if (activeRoleView === "industry") {
          const res = await fetch("/api/analytics/industry");
          if (res.ok) {
            const data = await res.json();
            setIndustryAnalytics(data.analytics);
          }
        } else if (activeRoleView === "institution") {
          const params = new URLSearchParams();
          if (deptFilter !== "all") params.set("department", deptFilter);
          if (yearFilter !== "all") params.set("academicYear", yearFilter);
          if (dateFilter) params.set("dateRange", dateFilter);

          const res = await fetch(`/api/analytics/institution?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            setInstitutionAnalytics(data.analytics);
          }
        } else if (activeRoleView === "academician") {
          const res = await fetch("/api/academician/collaborations");
          if (res.ok) {
            const data = await res.json();
            setAcademicianCollaborations(data.collaborations || []);
          }
        }
      } catch (err) {
        console.error("Failed to load role telemetry:", err);
      } finally {
        setAnalyticsLoading(false);
      }
    }
    loadRoleTelemetry();
  }, [activeRoleView, deptFilter, yearFilter, dateFilter, isAuthenticated]);

  if (isLoading || !user) {
    return (
      <Container size="xl" className="py-12 space-y-8">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  const roleMeta: Record<
    UserRole,
    { label: string; badgeVariant: "cyber" | "violet" | "emerald" | "amber" | "destructive"; icon: React.ComponentType<{ className?: string }> }
  > = {
    student: { label: "Student Learner", badgeVariant: "cyber", icon: GraduationCap },
    industry: { label: "Industry Recruiter", badgeVariant: "violet", icon: Briefcase },
    academician: { label: "Academician / Faculty", badgeVariant: "emerald", icon: BookOpen },
    institution: { label: "Institutional Portal", badgeVariant: "amber", icon: Building2 },
    admin: { label: "System Administrator", badgeVariant: "destructive", icon: ShieldCheck },
  };

  const currentRoleMeta = roleMeta[user.role] || roleMeta.student;
  const RoleIcon = currentRoleMeta.icon;

  return (
    <div className="py-8 md:py-12 space-y-8">
      <Container size="xl">
        {/* Top Profile & Welcome Banner (Clean & Spacious) */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-cyan-500/20 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/20" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Profile Info */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-glow-md shrink-0">
                  <div className="h-full w-full rounded-[15px] bg-slate-950 flex items-center justify-center">
                    <RoleIcon className="h-8 w-8 text-cyan-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {user.fullName}
                    </h1>
                    <Badge variant={currentRoleMeta.badgeVariant} dot dotColor="cyan" className="font-mono text-[10px]">
                      {currentRoleMeta.label.toUpperCase()}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Profile
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                    {user.email} • {user.studentProfile?.institution || "Indian Institute of Technology"}
                  </p>
                </div>
              </div>

              {/* Right Key Primary Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/portfolio">
                  <Button variant="glow" size="sm" leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}>
                    Verified Portfolio
                  </Button>
                </Link>
                <Link href="/ai-career">
                  <Button variant="cyber" size="sm" leftIcon={<Bot className="h-4 w-4 text-cyan-400" />}>
                    AI Career Studio
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Role Perspective Switcher Bar (Segmented Control) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-xs shadow-md mt-6">
          <div className="flex items-center gap-2 font-mono text-muted-foreground pl-1">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-foreground/90">Ecosystem Perspective:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "student", label: "Student Learner", icon: GraduationCap },
              { id: "industry", label: "Industry Recruiter", icon: Briefcase },
              { id: "institution", label: "Institution & University", icon: Building2 },
              { id: "academician", label: "Academician & Faculty", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRoleView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveRoleView(tab.id as UserRole)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-muted-foreground"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Role Dashboard Content */}
        <div className="mt-8">
          {analyticsLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          ) : (
            <div>
              {/* 1. STUDENT VIEW */}
              {activeRoleView === "student" && (
                <SlideUp>
                  <div className="space-y-14">
                    {/* ========================================================================= */}
                    {/* SECTION 0: NEXT BEST ACTION LEARNING COMMAND CENTER (STEP 13 SPEC)        */}
                    {/* ========================================================================= */}
                    <LearningCommandCenter
                      goalTitle="Become a Data Analyst"
                      currentProgress={68}
                      currentGap="SQL JOINs"
                      nextBestActionTitle="Practice SQL JOINs"
                      nextBestActionDuration="15 min"
                      nextBestActionWhy="Your recent accuracy is 43%, and JOINs are highly relevant to your selected goal."
                      nextBestActionUrl="/learning/intervention"
                    />

                    {/* ========================================================================= */}
                    {/* SECTION 1: TELEMETRY METRICS GRID (HIGH-END GLOW CARDS)                   */}
                    {/* ========================================================================= */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-glow-sm" />
                          <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Real-Time Career Intelligence Telemetry
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                            ● LIVE BENCHMARK ACTIVE
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">Updated 2m ago</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* 1. Career Readiness */}
                        <GlowBorder color={["#06b6d4", "#10b981", "#06b6d4"]} duration={4} borderRadius={20}>
                          <div className="p-6 flex flex-col justify-between h-full space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                Career Readiness
                              </span>
                              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                <Brain className="h-4 w-4" />
                              </div>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
                                88<span className="text-cyan-400 text-2xl">%</span>
                              </div>
                              {/* Mini SVG Ring Gauge */}
                              <div className="relative h-10 w-10">
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                  <path
                                    className="text-slate-800"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  <path
                                    className="text-cyan-400"
                                    strokeDasharray="88, 100"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-xs font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                                Placement Ready ✅
                              </span>
                              <span className="text-muted-foreground text-[11px]">Target: 85%</span>
                            </div>
                          </div>
                        </GlowBorder>

                        {/* 2. Verified Skills */}
                        <GlowBorder color={["#06b6d4", "#a855f7", "#3b82f6"]} duration={4} borderRadius={20}>
                          <div className="p-6 flex flex-col justify-between h-full space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                Verified Skills
                              </span>
                              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                <Sparkles className="h-4 w-4" />
                              </div>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
                                7 <span className="text-purple-400 text-lg font-sans">Verified</span>
                              </div>
                              <span className="text-xs font-mono text-emerald-400 font-bold">+2 New</span>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-xs font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 truncate max-w-[140px]">
                                Next.js & PyTorch
                              </span>
                              <span className="text-muted-foreground text-[11px]">100% Valid</span>
                            </div>
                          </div>
                        </GlowBorder>

                        {/* 3. Matched Opportunities */}
                        <GlowBorder color={["#10b981", "#06b6d4", "#10b981"]} duration={4} borderRadius={20}>
                          <div className="p-6 flex flex-col justify-between h-full space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                Matched Roles
                              </span>
                              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <Compass className="h-4 w-4" />
                              </div>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
                                7 <span className="text-emerald-400 text-lg font-sans">Active</span>
                              </div>
                              <span className="text-xs font-mono text-cyan-400 font-bold">92% Peak</span>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-xs font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                                Highest: 92% Match
                              </span>
                              <span className="text-muted-foreground text-[11px]">AI Systems</span>
                            </div>
                          </div>
                        </GlowBorder>

                        {/* 4. Active Applications */}
                        <GlowBorder color={["#f59e0b", "#a855f7", "#06b6d4"]} duration={4} borderRadius={20}>
                          <div className="p-6 flex flex-col justify-between h-full space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                Application Status
                              </span>
                              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <Clock className="h-4 w-4" />
                              </div>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
                                1 <span className="text-amber-400 text-lg font-sans">Shortlisted</span>
                              </div>
                              <span className="text-xs font-mono text-amber-400 font-bold">Interview</span>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-xs font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold truncate max-w-[140px]">
                                Titan AI Labs
                              </span>
                              <span className="text-muted-foreground text-[11px]">Stage 2</span>
                            </div>
                          </div>
                        </GlowBorder>
                      </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* SECTION 2: MULTI-VECTOR ASSESSMENT & GAP DIAGNOSTICS (HIGH VISUALIZATION) */}
                    {/* ========================================================================= */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Target className="h-5 w-5 text-cyan-400" />
                            <span>Multi-Vector Diagnostic & Benchmark Radar</span>
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            AI-evaluated against Fortune-500 role profile:{" "}
                            <strong className="text-cyan-400 font-semibold">Lead AI Systems Architect</strong>
                          </p>
                        </div>
                        <Link href="/skills">
                          <Button variant="glass" size="sm" className="text-xs font-mono border-cyan-500/30 text-cyan-300">
                            Full Diagnostic Report →
                          </Button>
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: 3 Multi-Vector Radial Gauge Cards */}
                        <div className="lg:col-span-2 space-y-4">
                          <GlassCard className="p-6 sm:p-7 border-white/10 space-y-6" glow>
                            {/* 3 Pillars Visual Gauges Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* 1. Technical Engineering */}
                              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/20 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-muted-foreground uppercase font-mono">
                                    Technical
                                  </span>
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                                    92%
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-base font-bold text-foreground">
                                    Engineering & Arch
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-tight">
                                    Exceeds tier-1 hiring benchmark (+12 pts)
                                  </p>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: "92%" }} />
                                </div>
                              </div>

                              {/* 2. Soft Skills & Leadership */}
                              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-muted-foreground uppercase font-mono">
                                    Soft Skills
                                  </span>
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                    88%
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-base font-bold text-foreground">
                                    Cross-Team Lead
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-tight">
                                    Executive communication & RFC authoring
                                  </p>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: "88%" }} />
                                </div>
                              </div>

                              {/* 3. Cognitive Problem Solving */}
                              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900/60 border border-purple-500/20 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-muted-foreground uppercase font-mono">
                                    Cognitive
                                  </span>
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                    84%
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-base font-bold text-foreground">
                                    Aptitude & Logic
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-tight">
                                    Algorithmic reasoning & trade-off analysis
                                  </p>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: "84%" }} />
                                </div>
                              </div>
                            </div>

                            {/* Verified Skill Matrix Pills */}
                            <div className="pt-2 border-t border-white/[0.08] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                                  Verified Evidence Badges
                                </span>
                                <span className="text-xs font-mono text-cyan-400">
                                  6 of 6 Verified by Faculty Ledger
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {[
                                  { name: "Next.js 14", score: 94, category: "Frontend" },
                                  { name: "PyTorch", score: 92, category: "AI/ML" },
                                  { name: "TypeScript", score: 95, category: "Languages" },
                                  { name: "PostgreSQL", score: 88, category: "Databases" },
                                  { name: "Docker & K8s", score: 86, category: "DevOps" },
                                  { name: "Distributed Systems", score: 89, category: "Architecture" },
                                ].map((skill) => (
                                  <div
                                    key={skill.name}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition-all text-xs font-mono group"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    <span className="text-foreground font-semibold group-hover:text-cyan-300">
                                      {skill.name}
                                    </span>
                                    <span className="text-[10px] text-cyan-400/80 pl-1 border-l border-white/10">
                                      {skill.score}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </GlassCard>
                        </div>

                        {/* Right: Active Priority Gap Card */}
                        <div>
                          <GlassCard className="p-6 sm:p-7 border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 flex flex-col justify-between h-full space-y-5" glow>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  CRITICAL SKILL GAP
                                </span>
                                <span className="text-xs font-mono text-rose-400 font-bold">-12 pts deficit</span>
                              </div>

                              <h3 className="text-lg font-bold text-foreground leading-snug">
                                Distributed Cache & Edge Inference
                              </h3>

                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Top-tier AI roles require verified low-latency caching (Redis Streams) and TensorRT edge serving. Closing this deficit raises your candidate match to <strong className="text-emerald-400">96%</strong>.
                              </p>

                              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono space-y-1">
                                <div className="text-muted-foreground">Target Learning Unit:</div>
                                <div className="text-cyan-300 font-semibold">
                                  • Redis Streams Async Event Pipeline
                                </div>
                                <div className="text-cyan-300 font-semibold">
                                  • TensorRT 8-bit Integer Quantization
                                </div>
                              </div>
                            </div>

                            <div className="pt-2">
                              <Button
                                variant="glow"
                                size="sm"
                                className="w-full justify-center text-xs font-mono"
                                onClick={() => {
                                  if (typeof window !== "undefined") {
                                    window.dispatchEvent(
                                      new CustomEvent("open-nexora-chat", {
                                        detail: { prompt: "Provide a 2-week learning roadmap to master Distributed Cache & Edge Inference to close my skill gap." },
                                      })
                                    );
                                  }
                                }}
                              >
                                Bridge Gap with Nexora.ai →
                              </Button>
                            </div>
                          </GlassCard>
                        </div>
                      </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* SECTION 3: TOP MATCHED OPPORTUNITIES (SPACIOUS & LUXURIOUS CARDS)         */}
                    {/* ========================================================================= */}
                    <div className="space-y-6 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Compass className="h-5 w-5 text-emerald-400" />
                            <span>Top Matched Opportunities (Explainable AI)</span>
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Ranked using multi-vector capability scoring against active industry postings
                          </p>
                        </div>
                        <Link href="/opportunities">
                          <Button variant="glass" size="sm" className="text-xs font-mono text-cyan-300 border-cyan-500/30">
                            View All 7 Opportunities →
                          </Button>
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1: AI Systems Research Intern */}
                        <GlassCard className="p-6 sm:p-7 space-y-5 border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-emerald-950/10 flex flex-col justify-between" glow>
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                                  Titan Frontier AI Labs
                                </span>
                                <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                                  AI Systems Research Intern
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                  Bengaluru, India (Hybrid) • ₹45,000 / month
                                </p>
                              </div>

                              <div className="shrink-0 text-center p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                                <div className="text-lg font-extrabold text-emerald-400 font-mono leading-none">
                                  92%
                                </div>
                                <div className="text-[9px] font-mono text-emerald-300 uppercase mt-0.5">
                                  Match
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Research high-throughput transformer pipelines, kernel fusion, and sub-15ms inference serving architectures on GPU clusters.
                            </p>

                            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px]">Matched:</span>
                                {["Python 3.11", "PyTorch", "Docker", "FastAPI"].map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px]">
                                    ✓ {s}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px]">Missing Gap:</span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px]">
                                  ⚠ Edge Inference
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                            <Link href="/opportunities" className="w-full sm:flex-1">
                              <Button variant="cyber" size="sm" className="w-full text-xs font-mono justify-center">
                                1-Click Apply
                              </Button>
                            </Link>
                            <Link href="/opportunities" className="w-full sm:w-auto">
                              <Button variant="glass" size="sm" className="w-full text-xs font-mono">
                                Match Reasoning →
                              </Button>
                            </Link>
                          </div>
                        </GlassCard>

                        {/* Card 2: Full Stack Cloud Engineer */}
                        <GlassCard className="p-6 sm:p-7 space-y-5 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-cyan-950/10 flex flex-col justify-between" glow>
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                                  CloudMatrix Inc
                                </span>
                                <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                                  Full Stack Cloud Engineer
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                  Remote • ₹38,000 / month + Equity
                                </p>
                              </div>

                              <div className="shrink-0 text-center p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30">
                                <div className="text-lg font-extrabold text-cyan-400 font-mono leading-none">
                                  88%
                                </div>
                                <div className="text-[9px] font-mono text-cyan-300 uppercase mt-0.5">
                                  Match
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Build scalable enterprise Next.js and PostgreSQL web systems with real-time analytics, eBPF telemetry, and GraphQL APIs.
                            </p>

                            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px]">Matched:</span>
                                {["Next.js 14", "TypeScript", "PostgreSQL", "Tailwind"].map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px]">
                                    ✓ {s}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px]">Missing Gap:</span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px]">
                                  ⚠ Kubernetes SRE
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                            <Link href="/opportunities" className="w-full sm:flex-1">
                              <Button variant="glow" size="sm" className="w-full text-xs font-mono justify-center">
                                1-Click Apply
                              </Button>
                            </Link>
                            <Link href="/opportunities" className="w-full sm:w-auto">
                              <Button variant="glass" size="sm" className="w-full text-xs font-mono">
                                Match Reasoning →
                              </Button>
                            </Link>
                          </div>
                        </GlassCard>
                      </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* SECTION 4: ECOSYSTEM LAUNCHPADS (SPACIOUS LUXURY PILLARS)                 */}
                    {/* ========================================================================= */}
                    <div className="space-y-6 pt-6">
                      <div className="border-b border-white/[0.08] pb-4">
                        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-cyan-400" />
                          <span>Ecosystem Command Launchpads</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Direct access to AI diagnostics, career studio, verified opportunities, and mentorship
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Launchpad 1 */}
                        <GlassCard className="p-6 flex flex-col justify-between space-y-4 border-cyan-500/20 hover:border-cyan-500/50 transition-all group" glow>
                          <div className="space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                              <Brain className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-base text-foreground group-hover:text-cyan-300 transition-colors">
                              Skill Intelligence Center
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Take multi-vector assessments across technical, cognitive, and soft skills to benchmark your strengths.
                            </p>
                          </div>
                          <Link href="/skills" className="pt-2 block">
                            <Button variant="glow" size="sm" className="w-full text-xs font-mono justify-center">
                              Open Skill Center →
                            </Button>
                          </Link>
                        </GlassCard>

                        {/* Launchpad 2 */}
                        <GlassCard className="p-6 flex flex-col justify-between space-y-4 border-purple-500/20 hover:border-purple-500/50 transition-all group" glow>
                          <div className="space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                              <Bot className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-base text-foreground group-hover:text-purple-300 transition-colors">
                              Nexora.ai Copilot Studio
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Interactive RAG chat, automated resume entity extraction, and personalized milestone roadmaps.
                            </p>
                          </div>
                          <div className="pt-2 flex items-center gap-2">
                            <Button
                              variant="cyber"
                              size="sm"
                              className="flex-1 text-xs font-mono"
                              onClick={() => {
                                if (typeof window !== "undefined") {
                                  window.dispatchEvent(new CustomEvent("open-nexora-chat"));
                                }
                              }}
                            >
                              Chat AI
                            </Button>
                            <Link href="/ai-career">
                              <Button variant="glass" size="sm" className="text-xs font-mono">
                                Studio
                              </Button>
                            </Link>
                          </div>
                        </GlassCard>

                        {/* Launchpad 3 */}
                        <GlassCard className="p-6 flex flex-col justify-between space-y-4 border-emerald-500/20 hover:border-emerald-500/50 transition-all group" glow>
                          <div className="space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                              <Compass className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-base text-foreground group-hover:text-emerald-300 transition-colors">
                              Opportunity Marketplace
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Verified internships, live industry projects, and hackathons with explainable compatibility scoring.
                            </p>
                          </div>
                          <Link href="/opportunities" className="pt-2 block">
                            <Button variant="glass" size="sm" className="w-full text-xs font-mono justify-center">
                              Explore Jobs →
                            </Button>
                          </Link>
                        </GlassCard>

                        {/* Launchpad 4 */}
                        <GlassCard className="p-6 flex flex-col justify-between space-y-4 border-amber-500/20 hover:border-amber-500/50 transition-all group" glow>
                          <div className="space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                              <Users className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-base text-foreground group-hover:text-amber-300 transition-colors">
                              1-on-1 Mentorship
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Book 1-on-1 guidance sessions with industry engineers and top academicians to fast-track your career.
                            </p>
                          </div>
                          <Link href="/mentorship" className="pt-2 block">
                            <Button variant="glass" size="sm" className="w-full text-xs font-mono justify-center">
                              Find Mentors →
                            </Button>
                          </Link>
                        </GlassCard>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              )}

              {/* 2. INDUSTRY RECRUITER VIEW */}
              {activeRoleView === "industry" && industryAnalytics && (
                <SlideUp>
                  <div className="space-y-8">
                    <IndustryOverviewCards analytics={industryAnalytics} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-cyan-400" />
                            Ranked Candidate Recommendations
                          </h3>
                          <Link href="/opportunities/manage" className="text-xs font-mono text-cyan-400 hover:underline">
                            Manage Pipeline →
                          </Link>
                        </div>
                        <CandidateTalentRadar candidates={industryAnalytics.rankedCandidateRecommendations} />
                      </div>

                      <div className="space-y-4">
                        <SkillDemandChart demands={industryAnalytics.skillDemandDistribution} />
                      </div>
                    </div>
                  </div>
                </SlideUp>
              )}

              {/* 3. INSTITUTION & UNIVERSITY VIEW */}
              {activeRoleView === "institution" && institutionAnalytics && (
                <SlideUp>
                  <div className="space-y-8">
                    <InstitutionFilterBar
                      department={deptFilter}
                      academicYear={yearFilter}
                      dateRange={dateFilter}
                      onDepartmentChange={setDeptFilter}
                      onAcademicYearChange={setYearFilter}
                      onDateRangeChange={setDateFilter}
                    />

                    <InstitutionMetricCards analytics={institutionAnalytics} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {institutionAnalytics.departmentBreakdowns.map((dept) => (
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

                    <SkillGapHeatmap
                      heatmapCells={institutionAnalytics.skillGapHeatmap}
                      commonSkillGaps={institutionAnalytics.commonSkillGaps}
                    />

                    <PlacementFunnelChart funnelStages={institutionAnalytics.placementFunnel} />
                  </div>
                </SlideUp>
              )}

              {/* 4. ACADEMICIAN & FACULTY VIEW */}
              {activeRoleView === "academician" && (
                <SlideUp>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-violet-400" />
                          Faculty & Academician Collaboration Tracks
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Funded faculty internships, research grants, FDPs, and consultancy retainers
                        </p>
                      </div>
                      <Link href="/dashboard/academician">
                        <Button variant="glow" size="sm">
                          Full Academician Portal
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {academicianCollaborations.map((collab) => (
                        <AcademicianCollaborationCard
                          key={collab.id}
                          collaboration={collab}
                          onPropose={() => {
                            alert("Faculty proposal submitted successfully!");
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </SlideUp>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
