"use client";

import React, { useState } from "react";
import {
  Globe,
  BrainCircuit,
  Database,
  Binary,
  Server,
  ShieldAlert,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
  HelpCircle,
  Layers,
  Award,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ASSESSMENT_SUBJECTS, AssessmentSubject } from "@/lib/skills/assessment-repository";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

interface AssessmentSubjectSelectorProps {
  onSelectSubject: (subject: AssessmentSubject, experienceLevel: string) => void;
  initialSubjectId?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  BrainCircuit,
  Database,
  Binary,
  Server,
  ShieldAlert,
  BarChart3,
};

export function AssessmentSubjectSelector({
  onSelectSubject,
  initialSubjectId,
}: AssessmentSubjectSelectorProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || ASSESSMENT_SUBJECTS[0].id
  );
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  const activeSubject =
    ASSESSMENT_SUBJECTS.find((s) => s.id === selectedSubjectId) || ASSESSMENT_SUBJECTS[0];

  const handleStart = () => {
    onSelectSubject(activeSubject, experienceLevel);
  };

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Skillora Adaptive Diagnostic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Choose Your Subject & Course Diagnostic
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Select the exact technical subject or domain you want to test. Our AI evaluates your conceptual mastery, identifies granular sub-topic gaps, and builds your custom learning roadmap.
        </p>
      </div>

      {/* Subject Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>Select Domain / Subject</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400">
            {ASSESSMENT_SUBJECTS.length} Specialized Tracks Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSESSMENT_SUBJECTS.map((subject) => {
            const Icon = ICON_MAP[subject.iconName] || BookOpen;
            const isSelected = subject.id === selectedSubjectId;

            return (
              <GlassCard
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all relative overflow-hidden border ${
                  isSelected
                    ? "bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 border-cyan-400 shadow-glow-sm scale-[1.02]"
                    : "bg-white/[0.02] hover:bg-white/[0.05] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${subject.accentColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-cyan-300">
                        {subject.title}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {subject.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {subject.tagline}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {subject.skillsCovered.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-mono text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                    {subject.skillsCovered.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-white/[0.02] text-[10px] font-mono text-slate-500">
                        +{subject.skillsCovered.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Meta footer */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-cyan-400" /> ~{subject.estimatedMinutes} Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3 text-emerald-400" /> {subject.questionCount} Questions
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Experience Level & Confirmation Bar */}
      <GlassCard className="p-6 sm:p-8 rounded-2xl border-white/10 bg-slate-900/80 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Experience Level Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>Target Experience Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "beginner", label: "Beginner", desc: "0-1 yrs" },
                { id: "intermediate", label: "Intermediate", desc: "1-3 yrs" },
                { id: "advanced", label: "Advanced", desc: "3+ yrs" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExperienceLevel(lvl.id as "beginner" | "intermediate" | "advanced")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    experienceLevel === lvl.id
                      ? "bg-cyan-500/15 border-cyan-400 text-foreground shadow-glow-sm"
                      : "bg-white/[0.02] border-white/5 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Track Summary */}
          <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="text-xs font-mono text-muted-foreground uppercase">Selected Assessment:</div>
            <div className="font-bold text-base text-cyan-300">{activeSubject.title}</div>
            <div className="text-xs text-slate-300 leading-snug">{activeSubject.tagline}</div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Real-time presence monitor and instant gap diagnostic included.</span>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-8 shadow-glow-sm hover:shadow-glow-md transition-all gap-2"
          >
            <span>Start {activeSubject.title} Test</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
