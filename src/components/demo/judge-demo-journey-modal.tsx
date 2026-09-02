"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Target,
  Brain,
  Zap,
  BookOpen,
  GitFork,
  ShieldCheck,
  Dna,
  Layers,
  X,
  ChevronRight,
  TrendingUp,
  Flame,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DemoStep {
  stepNumber: number;
  title: string;
  stageName: string;
  icon: any;
  badge: string;
  badgeVariant: "cyber" | "emerald" | "amber" | "destructive" | "glass";
  summary: string;
  keyEvidence: string;
  hinglishQuote?: string;
  liveRoute: string;
  routeCta: string;
}

export const CANONICAL_DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: "Student Joins & Sets Goal",
    stageName: "ONBOARDING & PROFILING",
    icon: Target,
    badge: "Self-Declared Badging",
    badgeVariant: "cyber",
    summary: "Student signs up, chooses goal: 'Become a Data Analyst', and self-declares Python and SQL skills. The system explicitly tags self-declarations as 'Unverified (0% Demonstrated)' to prevent inflated scores.",
    keyEvidence: "Goal: Data Analyst • Declared Skills: Python (Intermediate), SQL (Intermediate) [Self-Declared Flagged]",
    liveRoute: "/onboarding",
    routeCta: "Open Onboarding Studio",
  },
  {
    stepNumber: 2,
    title: "Granular AI Diagnostic Assessment",
    stageName: "DIAGNOSTIC TESTING",
    icon: Brain,
    badge: "Topic-Level Matrix",
    badgeVariant: "amber",
    summary: "Instead of producing one vague percentage, the diagnostic engine tests 7 granular sub-skills in SQL. The AI discovers that while Basics (86%) and Filtering (78%) are strong, multi-table JOINs (42%) is a critical failure point.",
    keyEvidence: "Basics: 86% | Filtering: 78% | Aggregation: 71% | GROUP BY: 69% | JOINs: 42% 🚨 | Subqueries: 51%",
    liveRoute: "/assessment",
    routeCta: "Inspect Diagnostic Matrix",
  },
  {
    stepNumber: 3,
    title: "Dynamic Personal Skill DNA Generated",
    stageName: "SKILL DNA SYNCHRONIZATION",
    icon: Dna,
    badge: "Telemetry Grounded",
    badgeVariant: "destructive",
    summary: "Skill DNA automatically updates from live assessment logs. Distinguishes between Self-Declared claims and Demonstrated performance. Flags SQL JOINs as a Recurring Weakness.",
    keyEvidence: "Python: 82% ↑ (Demonstrated) • SQL: 51% ↓ (Confidence: Med) • Recurring Weakness: SQL JOINs",
    liveRoute: "/skills",
    routeCta: "Inspect Personal Skill DNA",
  },
  {
    stepNumber: 4,
    title: "Performance Priority Engine Ranks #1 Blocker",
    stageName: "PRIORITY CALCULATION",
    icon: Zap,
    badge: "Priority Score: 94/100",
    badgeVariant: "destructive",
    summary: "The platform evaluates skill deficits against target goal weights and prerequisite dependencies. Instead of telling the student to fix 5 things at once, it computes that SQL JOINs is the #1 Blocker.",
    keyEvidence: "SQL JOINs: Current 42% ➔ Target 75% | Deficit: -33% | Goal Relevance: High | Priority Score: 94/100 (DO THIS FIRST)",
    liveRoute: "/skills",
    routeCta: "View Priority Queue",
  },
  {
    stepNumber: 5,
    title: "“Why This?” 4-Pillar Explainable Recommendation",
    stageName: "EXPLAINABLE AI",
    icon: BookOpen,
    badge: "4-Pillar Transparency",
    badgeVariant: "glass",
    summary: "Never a black box: Every recommendation explains What is recommended, Why it was selected (accuracy, goal importance, repeated mistakes), What it will improve, and What to do after.",
    keyEvidence: "Why: Current proficiency 42% • Target relevance: High • Recent accuracy: 39% • Repeated mistakes: 3",
    liveRoute: "/learning/resources?highlight=SQL",
    routeCta: "Inspect Explainable Cards",
  },
  {
    stepNumber: 6,
    title: "Next Best Action Command Center",
    stageName: "STUDENT COMMAND CENTER",
    icon: Layers,
    badge: "Next Best Action",
    badgeVariant: "cyber",
    summary: "When the student visits their dashboard, the hero answers 'What do I do next?' in 3 seconds: 🔴 Practice SQL JOINs — 15 min.",
    keyEvidence: "Goal: Data Analyst (68% Progress) • Current Gap: SQL JOINs • Action: Practice SQL JOINs (15 min)",
    liveRoute: "/dashboard",
    routeCta: "Open Command Center",
  },
  {
    stepNumber: 7,
    title: "AI Socratic Tutor in Multilingual Hinglish",
    stageName: "MULTILINGUAL SOCRATIC AI",
    icon: Sparkles,
    badge: "English / Hindi / Hinglish",
    badgeVariant: "emerald",
    summary: "Student asks 'Bhai mujhe SQL JOIN simple example ke saath samjha'. The AI tutor explains using a Zomato Customer & Order table analogy and outputs verified SQL code snippets.",
    keyEvidence: "Prompt: 'Explain JOINs in Hinglish' ➔ AI: 'Zomato analogy: Customers table (users) aur Orders table ko customer_id se connect karna...'",
    hinglishQuote: "Bhai Zomato me 3 customers hain aur 2 orders. Agar Priya ne order nahi diya toh LEFT JOIN Priya ko NULL ke saath show karega, but INNER JOIN use drop kar dega!",
    liveRoute: "/learning/assistant",
    routeCta: "Chat with AI Tutor",
  },
  {
    stepNumber: 8,
    title: "15-Minute Targeted Socratic Intervention",
    stageName: "TARGETED REMEDIATION",
    icon: Zap,
    badge: "15-Min Sprint",
    badgeVariant: "cyber",
    summary: "Instead of a generic 10-hour course, Skillora runs a 7-stage micro-intervention: Concept Brief ➔ Zomato Example ➔ Guided Question ➔ Student Answer ➔ AI Feedback ➔ Adaptive Practice ➔ Mini Assessment.",
    keyEvidence: "Execution Time: 15 mins • Adaptive Difficulty Branching • Socratic Error Corrections",
    liveRoute: "/learning/intervention",
    routeCta: "Launch Targeted Sprint",
  },
  {
    stepNumber: 9,
    title: "Adaptive Difficulty Branching",
    stageName: "REAL-TIME ADAPTIVITY",
    icon: Flame,
    badge: "Scaffold vs Level-Up",
    badgeVariant: "amber",
    summary: "If the student answers correctly, the AI escalates difficulty to an advanced edge-case (COUNT(*) vs COUNT(id)). If the student makes a mistake, it enters Scaffold Mode with an intuitive Attendance Register analogy.",
    keyEvidence: "Correct ➔ Level Up (Grouped Tuples) | Mistake ➔ Simplified Scaffold (Attendance Register Analogy)",
    liveRoute: "/learning/intervention",
    routeCta: "Test Adaptive Branching",
  },
  {
    stepNumber: 10,
    title: "Diagnostic Reassessment Probe",
    stageName: "EMPIRICAL PROBE",
    icon: CheckCircle2,
    badge: "3-Probe Verification",
    badgeVariant: "cyber",
    summary: "Student completes a timed 3-probe diagnostic quiz testing outer join predicate retention and NULL handling with COALESCE.",
    keyEvidence: "Probe #1: INNER vs LEFT | Probe #2: COALESCE Guards | Probe #3: Row Count Guarantees",
    liveRoute: "/learning/intervention",
    routeCta: "Run Reassessment Probe",
  },
  {
    stepNumber: 11,
    title: "Empirical Score Gain: 42% ➔ 82%",
    stageName: "VERIFIABLE GAIN",
    icon: TrendingUp,
    badge: "+40% Verified Gain",
    badgeVariant: "emerald",
    summary: "The system records empirical proof of improvement. Baseline 42% jumps to 82%, crossing the 75% mastery threshold.",
    keyEvidence: "Before: 42% ➔ Learning: Completed ➔ Practice: 68% ➔ Reassessment: 82% ➔ 🟢 SKILL PROVEN",
    liveRoute: "/progress/growth",
    routeCta: "View Growth Velocity",
  },
  {
    stepNumber: 12,
    title: "🟢 SKILL PROVEN Certified",
    stageName: "EVIDENCE-BASED MASTERY",
    icon: ShieldCheck,
    badge: "Demonstrated Proof",
    badgeVariant: "emerald",
    summary: "Skill DNA upgrades SQL from 'Critical Gap' to '🟢 Demonstrated & Verified'. Learning Progress Matrix updates evidence status from Unproven ➔ Proven.",
    keyEvidence: "Course Completion ≠ Mastery | Empirical Evidence = Demonstrated Competency",
    liveRoute: "/progress/performance",
    routeCta: "Inspect Proven Skills Matrix",
  },
  {
    stepNumber: 13,
    title: "Adaptive Roadmap Mutates & Shifts Priority",
    stageName: "DYNAMIC ROADMAP MUTATION",
    icon: GitFork,
    badge: "Roadmap Mutated",
    badgeVariant: "cyber",
    summary: "The learning roadmap graph dynamically updates. SQL JOINs transitions from 🔴 CURRENT PRIORITY to 🟢 Skill Proven. Power BI & Advanced Analytics automatically unlocks as the next priority.",
    keyEvidence: "Track Progress: 38% ➔ 52% | SQL JOINs: 🟢 Proven | Next Priority Unlocked: 🔴 Advanced SQL & Power BI",
    liveRoute: "/learning/roadmap",
    routeCta: "Inspect Mutated Roadmap",
  },
  {
    stepNumber: 14,
    title: "Cryptographic Portfolio Proof Minted",
    stageName: "INSTITUTIONAL CREDENTIAL",
    icon: Award,
    badge: "Cryptographic Hash",
    badgeVariant: "emerald",
    summary: "Institutional proof ledger stamps verifiable hash TITAN-VERIF-9F8A onto the student's public recruiter portfolio, proving genuine competence.",
    keyEvidence: "Hash: TITAN-VERIF-9F8A • Recruiter Auditable • Connected to Resume & Mock Interview Signals",
    liveRoute: "/portfolio",
    routeCta: "View Recruiter Portfolio",
  },
];

interface JudgeDemoJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgeDemoJourneyModal({ isOpen, onClose }: JudgeDemoJourneyModalProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = CANONICAL_DEMO_STEPS[activeStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % CANONICAL_DEMO_STEPS.length);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    setActiveStepIndex((prev) => Math.min(CANONICAL_DEMO_STEPS.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setActiveStepIndex((prev) => Math.max(0, prev - 1));
  };

  const Icon = currentStep.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <GlassCard
        className="w-full max-w-3xl p-6 sm:p-8 space-y-6 border-cyan-500/50 bg-slate-900/95 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden max-h-[95vh] overflow-y-auto"
        glow
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                HACKATHON JUDGE &amp; RECRUITER PRESENTATION MODE
              </span>
              <h2 className="text-xl font-black text-white font-mono">
                The Canonical Skillora Student Journey
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Pills Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1 pb-1">
          {CANONICAL_DEMO_STEPS.map((s, idx) => {
            const isSelected = activeStepIndex === idx;
            const isPassed = idx < activeStepIndex;

            return (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  isSelected
                    ? "bg-cyan-400 shadow-glow"
                    : isPassed
                    ? "bg-emerald-500/80"
                    : "bg-slate-800"
                }`}
                title={`Step ${s.stepNumber}: ${s.title}`}
              />
            );
          })}
        </div>

        {/* Active Step Content Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">
                  STEP {currentStep.stepNumber} OF 14 • {currentStep.stageName}
                </span>
                <h3 className="text-xl font-black text-white font-mono">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <Badge variant={currentStep.badgeVariant} size="sm" className="font-mono text-xs w-fit">
              {currentStep.badge}
            </Badge>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {currentStep.summary}
          </p>

          {/* Key Evidence Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-cyan-300">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Empirical Telemetry Proof:</span>
            <strong className="text-white text-xs block mt-0.5">{currentStep.keyEvidence}</strong>
          </div>

          {/* Hinglish Quote if present */}
          {currentStep.hinglishQuote && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs text-emerald-200 space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Multilingual AI Tutor Explanation:</span>
              <p className="italic leading-relaxed">&ldquo;{currentStep.hinglishQuote}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Play / Pause / Reset */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              size="sm"
              className="text-xs font-mono border-white/10"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1 text-amber-400" /> Pause Tour
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1 text-cyan-400" /> Auto-Play Tour
                </>
              )}
            </Button>
            <Button
              onClick={() => setActiveStepIndex(0)}
              variant="ghost"
              size="sm"
              className="text-xs font-mono text-slate-400"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          </div>

          {/* Next / Prev & Direct Jump */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              onClick={handlePrev}
              disabled={activeStepIndex === 0}
              variant="ghost"
              size="sm"
              className="text-xs font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Prev
            </Button>

            <Link href={currentStep.liveRoute} onClick={onClose}>
              <Button
                variant="glow"
                size="sm"
                className="text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>{currentStep.routeCta}</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>

            <Button
              onClick={handleNext}
              disabled={activeStepIndex === CANONICAL_DEMO_STEPS.length - 1}
              variant="cyber"
              size="sm"
              className="text-xs font-mono gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
