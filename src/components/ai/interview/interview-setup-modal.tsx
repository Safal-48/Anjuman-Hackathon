"use client";

import React, { useState } from "react";
import {
  Brain,
  Layers,
  Sparkles,
  Award,
  Globe,
  Sliders,
  Users,
  Check,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InterviewConfig,
  AVAILABLE_ROLES,
  INTERVIEWER_PERSONAS,
  ExperienceLevel,
  InterviewType,
  InterviewLanguage,
  InterviewDifficulty,
} from "@/lib/ai/interview-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

interface InterviewSetupModalProps {
  onStartInterview: (config: InterviewConfig) => void;
  isLoading?: boolean;
  defaultRoleId?: string;
}

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; desc: string }[] = [
  { id: "entry", label: "Entry Level / Graduate", desc: "0 - 1 years • Core fundamentals & coursework" },
  { id: "junior", label: "Junior Engineer", desc: "1 - 3 years • Feature engineering & bug triage" },
  { id: "mid", label: "Mid-Level Engineer", desc: "3 - 5 years • System design, trade-offs & scaling" },
  { id: "senior", label: "Senior / Lead Architect", desc: "5+ years • Multi-region reliability & technical leadership" },
];

const INTERVIEW_TYPES: { id: InterviewType; label: string; desc: string; icon: string }[] = [
  { id: "technical", label: "Technical Deep Dive", desc: "System architecture, latency, concurrency, algorithms", icon: "Code" },
  { id: "system_design", label: "System Design & Scale", desc: "High throughput, distributed failovers, data models", icon: "Server" },
  { id: "behavioral", label: "Behavioral & STAR Method", desc: "Team conflict, ownership, problem-solving narrative", icon: "Users" },
  { id: "mixed", label: "Comprehensive (Tech + HR)", desc: "Full simulation covering both architecture & behavioral", icon: "Layers" },
];

const LANGUAGES: { id: InterviewLanguage; label: string; desc: string }[] = [
  { id: "en", label: "English (Global Tech)", desc: "Standard international tech terminology & phrasing" },
  { id: "hi", label: "हिंदी (Hindi Technical)", desc: "Bilingual technical delivery in formal Hindi" },
  { id: "hinglish", label: "Hinglish (Conversational)", desc: "Natural mix of conversational Hindi and tech English" },
];

const DIFFICULTIES: { id: InterviewDifficulty; label: string; desc: string; badge: "cyber" | "emerald" | "amber" | "violet" }[] = [
  { id: "foundational", label: "Foundational", desc: "Core concepts, definitions, and basic trade-offs", badge: "emerald" },
  { id: "intermediate", label: "Standard Industry", desc: "Real-world production challenges and architecture", badge: "cyber" },
  { id: "advanced", label: "FAANG / Frontier Tier", desc: "Intense edge cases, concurrency locks, p99 limits", badge: "amber" },
  { id: "adaptive", label: "Adaptive Dynamic", desc: "AI dynamically tunes difficulty based on your answers", badge: "violet" },
];

export function InterviewSetupModal({
  onStartInterview,
  isLoading = false,
  defaultRoleId = "ai_systems_engineer",
}: InterviewSetupModalProps) {
  const [roleId, setRoleId] = useState(defaultRoleId);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("junior");
  const [interviewType, setInterviewType] = useState<InterviewType>("technical");
  const [language, setLanguage] = useState<InterviewLanguage>("en");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("intermediate");
  const [interviewerId, setInterviewerId] = useState("aditi_sharma");
  const [totalQuestions, setTotalQuestions] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInterview({
      roleId,
      experienceLevel,
      interviewType,
      language,
      difficulty,
      interviewerId,
      totalQuestions,
    });
  };

  const selectedRoleObj = AVAILABLE_ROLES.find((r) => r.id === roleId) || AVAILABLE_ROLES[0];
  const selectedPersonaObj = INTERVIEWER_PERSONAS[interviewerId] || INTERVIEWER_PERSONAS.aditi_sharma;

  return (
    <FadeIn>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Hero Banner */}
        <GlassCard className="p-6 sm:p-8 border-cyan-500/20 bg-gradient-to-br from-slate-900/95 via-slate-950 to-cyan-950/20 relative overflow-hidden" glow>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-glow-md shrink-0">
                <div className="h-full w-full rounded-[15px] bg-slate-950 flex items-center justify-center text-cyan-400">
                  <Brain className="h-7 w-7" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Configure AI Mock Interview Session
                  </h2>
                  <Badge variant="cyber" dot dotColor="cyan" className="font-mono text-[10px]">
                    REALISTIC INTERVIEWER ENGINE
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select your target role, difficulty, experience tier, and interviewer persona for a contextual simulation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="glass" className="font-mono text-xs px-3 py-1.5 border-white/10">
                ⏱️ ~15-20 Mins Session
              </Badge>
            </div>
          </div>
        </GlassCard>

        {/* Step 1: Target Job Role Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Target Job Role</span>
            </label>
            <span className="text-xs text-muted-foreground font-mono">
              Selected: <strong className="text-cyan-300">{selectedRoleObj.label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_ROLES.map((role) => {
              const isSelected = roleId === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setRoleId(role.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-foreground font-bold"
                      : "bg-slate-900/60 border-white/10 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                >
                  <span className="text-xs leading-snug">{role.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Experience Level & Interview Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Experience Level */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">2</span>
              <span>Experience Tier</span>
            </label>

            <div className="space-y-2.5">
              {EXPERIENCE_LEVELS.map((exp) => {
                const isSelected = experienceLevel === exp.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperienceLevel(exp.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500/40 shadow-glow-sm"
                        : "bg-slate-900/60 border-white/10 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? "text-cyan-300" : "text-foreground"}`}>
                        {exp.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{exp.desc}</div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">3</span>
              <span>Interview Round Type</span>
            </label>

            <div className="space-y-2.5">
              {INTERVIEW_TYPES.map((type) => {
                const isSelected = interviewType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInterviewType(type.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-violet-500/15 border-violet-500/40 shadow-glow-sm"
                        : "bg-slate-900/60 border-white/10 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? "text-violet-300" : "text-foreground"}`}>
                        {type.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{type.desc}</div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-violet-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Preferred Language & Difficulty Level */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">4</span>
              <span>Preferred Language</span>
            </label>

            <div className="space-y-2.5">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-500/40 shadow-glow-sm"
                        : "bg-slate-900/60 border-white/10 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? "text-emerald-300" : "text-foreground"}`}>
                        {lang.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{lang.desc}</div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">5</span>
              <span>Interview Difficulty</span>
            </label>

            <div className="space-y-2.5">
              {DIFFICULTIES.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/40 shadow-glow-sm"
                        : "bg-slate-900/60 border-white/10 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isSelected ? "text-amber-300" : "text-foreground"}`}>
                          {diff.label}
                        </span>
                        <Badge variant={diff.badge} size="sm" className="text-[9px] uppercase font-mono">
                          {diff.id}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{diff.desc}</div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 4: Choose Realistic Interviewer Persona */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">6</span>
              <span>Choose Interviewer Persona</span>
            </label>
            <span className="text-xs text-muted-foreground font-mono">
              Lead: <strong className="text-cyan-300">{selectedPersonaObj.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(INTERVIEWER_PERSONAS).map((persona) => {
              const isSelected = interviewerId === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setInterviewerId(persona.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-2.5 flex flex-col justify-between ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-slate-900/60 border-white/10 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/15 flex items-center justify-center font-extrabold text-cyan-400 text-sm">
                        {persona.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {isSelected ? (
                        <Badge variant="cyber" size="sm">SELECTED</Badge>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{persona.voiceGender}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">{persona.name}</div>
                      <div className="text-[10px] text-cyan-400 font-medium">{persona.role}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{persona.company}</div>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight italic pt-1 border-t border-white/5">
                    &ldquo;{persona.tone}&rdquo;
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08]">
          <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Scores remain unrevealed until final performance report to maintain realism.</span>
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            isLoading={isLoading}
            className="w-full sm:w-auto px-8 py-6 text-sm font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Launch Interview Session →
          </Button>
        </div>
      </form>
    </FadeIn>
  );
}
