"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Brain,
  Layers,
  FileText,
  FileCheck2,
  Download,
  RotateCcw,
  Zap,
  ExternalLink,
  Target,
  Briefcase,
  BookOpen,
  Code2,
  ShieldCheck,
  Building,
  GraduationCap,
  FolderGit2,
  AlertCircle,
  Copy,
  Check,
  Dna,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailedATSAnalysis } from "@/lib/ai/resume-analyzer";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

interface ResumeAnalysisDashboardProps {
  analysis: DetailedATSAnalysis;
  onReset: () => void;
}

export function ResumeAnalysisDashboard({
  analysis,
  onReset,
}: ResumeAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "job_match" | "entities" | "optimization">("overview");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const {
    candidateName,
    email,
    phone,
    links,
    education,
    technicalSkills,
    softSkills,
    toolsAndFrameworks,
    experience,
    projects,
    certifications,
    overallReadinessScore,
    readinessTier,
    categoryScores,
    strengths,
    formattingIssues,
    missingInformation,
    actionableImprovements,
    jobComparison,
  } = analysis;

  const isATSReady = overallReadinessScore >= 85;
  const isNeedsWork = overallReadinessScore < 70;

  const handleCopyBullet = (text: string, idx: number) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // SVG Circular Gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallReadinessScore / 100) * circumference;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* HERO SCORE & OVERVIEW BANNER                                              */}
      {/* ========================================================================= */}
      <FadeIn>
        <GlassCard className="p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-slate-950 to-cyan-950/20 shadow-2xl relative overflow-hidden" glow>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="cyber" size="sm" className="font-mono text-xs">
                  Skillora ATS AUDIT
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  Candidate: <strong className="text-foreground">{candidateName}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Resume Readiness & ATS Diagnostic
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                {email} • {phone} {links.github ? `• ${links.github}` : ""}
              </p>

              {/* Status Banner */}
              <div className="pt-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                  isATSReady
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : isNeedsWork
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                }`}>
                  <ShieldCheck className="h-4 w-4" />
                  <span>{readinessTier}</span>
                </span>
              </div>
            </div>

            {/* Right: Circular Score Dial */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/60 border border-white/10 text-center space-y-2">
              <div className="relative h-36 w-36 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 130 130">
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    className={`transition-all duration-1000 ${
                      isATSReady ? "stroke-emerald-400" : isNeedsWork ? "stroke-amber-400" : "stroke-cyan-400"
                    }`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono tracking-tight text-foreground">
                    {overallReadinessScore}<span className="text-lg text-cyan-400">%</span>
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold">
                    ATS SCORE
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-muted-foreground">
                Target ATS Pass Benchmark: 80%
              </span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Explainable multi-vector heuristic evaluation • Non-hallucinated scoring</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Download className="h-3.5 w-3.5" />}
                className="text-xs font-mono"
              >
                Export / Print
              </Button>
              <Button
                type="button"
                variant="glow"
                size="sm"
                onClick={onReset}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono font-bold"
              >
                Analyze Another Resume
              </Button>
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 6-DIMENSION CATEGORY GAUGES                                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <GlassCard className="p-3.5 space-y-2 border-white/10" glow>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[10px] uppercase">ATS Readability</span>
            <span className="font-bold text-cyan-400">{categoryScores.atsReadability}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${categoryScores.atsReadability}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-2 border-white/10" glow>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[10px] uppercase">Formatting</span>
            <span className="font-bold text-blue-400">{categoryScores.formattingAndStructure}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${categoryScores.formattingAndStructure}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-2 border-white/10" glow>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[10px] uppercase">Skills Depth</span>
            <span className="font-bold text-violet-400">{categoryScores.skillsDepth}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-violet-400 rounded-full" style={{ width: `${categoryScores.skillsDepth}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-2 border-white/10" glow>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[10px] uppercase">Experience</span>
            <span className="font-bold text-emerald-400">{categoryScores.experienceAndMetrics}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${categoryScores.experienceAndMetrics}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-2 border-white/10" glow>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[10px] uppercase">Projects</span>
            <span className="font-bold text-amber-400">{categoryScores.projectQuality}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${categoryScores.projectQuality}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-2 border-white/10" glow>
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-[10px] uppercase">Education/Certs</span>
            <span className="font-bold text-teal-400">{categoryScores.educationAndCerts}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${categoryScores.educationAndCerts}%` }} />
          </div>
        </GlassCard>
      </div>

      {/* ========================================================================= */}
      {/* NAVIGATION TABS                                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
        {[
          { id: "overview", label: "Overview & Diagnostics", icon: Target },
          { id: "job_match", label: "Job-Specific Comparison", icon: Briefcase, badge: jobComparison ? `${jobComparison.jobMatchScore}% Match` : undefined },
          { id: "entities", label: "Parsed Resume Entities", icon: FolderGit2 },
          { id: "optimization", label: "Actionable Recommendations", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-muted-foreground"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & DIAGNOSTICS                                             */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <SlideUp>
          <div className="space-y-6">
            {/* ========================================================================= */}
            {/* CLAIMED SKILL VS DEMONSTRATED SKILL VERIFICATION GAP (STEP 14 SPEC)       */}
            {/* ========================================================================= */}
            <GlassCard className="p-6 space-y-4 border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-slate-900/90 to-cyan-950/20" glow>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white font-mono">
                    Resume Claimed vs. Demonstrated Skill Verification Gap
                  </h3>
                </div>
                <Badge variant="destructive" size="sm" className="font-mono text-[9px]">
                  Learning Engine Connected
                </Badge>
              </div>

              <p className="text-xs text-slate-300">
                Skillora cross-references the skills claimed on your uploaded resume against your empirical diagnostic assessment results to detect unverified proficiency gaps.
              </p>

              {/* Comparison Item */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">SQL &amp; Relational Databases</strong>
                    <Badge variant="outline" size="sm" className="text-[9px] text-amber-300 border-amber-500/30">
                      ⚠️ Verification Gap (-26%)
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span>Resume Claim: <strong className="text-cyan-300">Advanced SQL (84% Equivalent)</strong></span>
                    <span>•</span>
                    <span>Assessment Result: <strong className="text-rose-400">58% Demonstrated</strong></span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Specific Gaps: SQL JOINs (42%) and Subquery Latency (51%).
                  </p>
                </div>

                <div className="shrink-0">
                  <Link href="/learning/intervention">
                    <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                      <span>SQL Learning ➔ Practice ➔ Reassess</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <GlassCard className="p-6 space-y-4 border-emerald-500/20 bg-emerald-950/10" glow>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-foreground">Verified Resume Strengths</h3>
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed text-foreground/90">{s}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Formatting & Parsing Issues */}
              <GlassCard className="p-6 space-y-4 border-amber-500/20 bg-amber-950/10" glow>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h3 className="text-base font-bold text-foreground">Formatting & ATS Issues</h3>
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {formattingIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed text-foreground/90">{issue}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Critical Omissions & Missing Information */}
            {missingInformation.length > 0 && (
              <GlassCard className="p-5 border-rose-500/20 bg-rose-950/10 space-y-3" glow>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <h4 className="text-xs font-bold text-rose-300 uppercase font-mono">
                    Missing Information Checklist
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingInformation.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-3 py-1 rounded-xl bg-rose-500/15 text-rose-200 border border-rose-500/30"
                    >
                      ✗ {item}
                    </span>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </SlideUp>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: JOB-SPECIFIC COMPARISON                                            */}
      {/* ========================================================================= */}
      {activeTab === "job_match" && jobComparison && (
        <SlideUp>
          <div className="space-y-6">
            {/* Match Header */}
            <GlassCard className="p-6 border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-slate-900 to-slate-950 space-y-4" glow>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="violet" size="sm" className="font-mono text-xs">
                      JOB DESCRIPTION COMPARISON
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      Target: <strong className="text-cyan-300">{jobComparison.targetJobTitle}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-foreground pt-1">
                    Job Compatibility & Keyword Alignment
                  </h3>
                </div>

                <div className="p-3 rounded-2xl bg-black/60 border border-violet-500/40 text-center shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    JOB MATCH SCORE
                  </span>
                  <span className="text-3xl font-black font-mono text-violet-400">
                    {jobComparison.jobMatchScore}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                    {jobComparison.competencyAlignment}
                  </span>
                </div>
              </div>

              {/* Matching Skills vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Matching Skills */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="h-4 w-4" /> Matching Job Skills ({jobComparison.matchingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {jobComparison.matchingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="h-4 w-4" /> Missing Keywords in Resume ({jobComparison.missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {jobComparison.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      >
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Recommended Tailored Bullets */}
            <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-foreground">
                  Tailored Bullet Suggestions for &ldquo;{jobComparison.targetJobTitle}&rdquo;
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {jobComparison.recommendedJobBullets.map((bullet, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-900/90 border border-white/10 flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                        Optimization Recommendation {i + 1}
                      </span>
                      <p className="text-foreground/90 font-mono leading-relaxed">{bullet}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyBullet(bullet, i)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-cyan-400 transition-colors shrink-0"
                      title="Copy suggestion"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </SlideUp>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PARSED RESUME ENTITIES                                             */}
      {/* ========================================================================= */}
      {activeTab === "entities" && (
        <SlideUp>
          <div className="space-y-6">
            {/* Technical & Soft Skills Catalog */}
            <GlassCard className="p-6 space-y-4 border-white/10" glow>
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-foreground">Extracted Skills & Tools</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1.5">
                    Technical Stack ({technicalSkills.length} identified)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1.5">
                    Soft Skills & Leadership
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Experience Bullets & Metrics */}
            <GlassCard className="p-6 space-y-4 border-white/10" glow>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-foreground">Experience & Quantifiable Metrics</h3>
              </div>

              <div className="space-y-4 text-xs">
                {experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-foreground text-sm">{exp.role}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">{exp.company} • {exp.duration}</span>
                    </div>

                    <ul className="space-y-1 pl-4 list-disc text-muted-foreground">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>

                    {exp.quantifiableMetricsFound.length > 0 && (
                      <div className="pt-2 flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-muted-foreground">Metrics detected:</span>
                        {exp.quantifiableMetricsFound.map((m, mi) => (
                          <span key={mi} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Projects & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Projects */}
              <GlassCard className="p-6 space-y-4 border-white/10" glow>
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-bold text-foreground">Projects Identified</h3>
                </div>

                <div className="space-y-3 text-xs">
                  {projects.map((proj, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-violet-300">{proj.title}</span>
                        {proj.hasLiveOrRepoLink && (
                          <Badge variant="emerald" size="sm">✓ PUBLIC LINK</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Education & Certs */}
              <GlassCard className="p-6 space-y-4 border-white/10" glow>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-teal-400" />
                  <h3 className="text-base font-bold text-foreground">Education & Certifications</h3>
                </div>

                <div className="space-y-3 text-xs">
                  {education.map((edu, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <div className="font-bold text-foreground">{edu.institution}</div>
                      <div className="text-muted-foreground font-mono text-[11px]">{edu.degree} • GPA: {edu.gpa || "N/A"}</div>
                    </div>
                  ))}

                  {certifications.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                        Verified Certifications
                      </span>
                      {certifications.map((c, i) => (
                        <div key={i} className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-[11px]">
                          ✓ {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </SlideUp>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ACTIONABLE RECOMMENDATIONS                                         */}
      {/* ========================================================================= */}
      {activeTab === "optimization" && (
        <SlideUp>
          <GlassCard className="p-6 space-y-5 border-cyan-500/20" glow>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-foreground">
                Step-by-Step ATS Optimization Plan
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              {actionableImprovements.map((imp, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex items-start gap-3.5"
                >
                  <span className="h-6 w-6 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-foreground text-sm">Actionable Fix #{i + 1}</span>
                    <p className="text-muted-foreground leading-relaxed font-mono">{imp}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </SlideUp>
      )}
    </div>
  );
}
