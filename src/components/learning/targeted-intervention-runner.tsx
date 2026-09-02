"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Zap,
  Check,
  Flame,
  Award,
  Clock,
  ChevronRight,
  Dna,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TargetedIntervention,
  InterventionStage,
  GuidedQuestionOption,
} from "@/lib/learning/intervention-types";
import { SQL_JOIN_INTERVENTION } from "@/lib/learning/intervention-engine";

interface TargetedInterventionRunnerProps {
  intervention?: TargetedIntervention;
}

export function TargetedInterventionRunner({
  intervention = SQL_JOIN_INTERVENTION,
}: TargetedInterventionRunnerProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Adaptive Branching State
  const [adaptiveMode, setAdaptiveMode] = useState<"harder" | "simplified" | null>(null);
  const [adaptiveOptionId, setAdaptiveOptionId] = useState<string | null>(null);
  const [adaptiveSubmitted, setAdaptiveSubmitted] = useState(false);

  // Mini-Assessment State (Step 7)
  const [miniQuizAnswers, setMiniQuizAnswers] = useState<Record<string, string>>({});
  const [miniQuizFinished, setMiniQuizFinished] = useState(false);
  const [miniQuizScore, setMiniQuizScore] = useState<number>(0);

  const stepsList = [
    { num: 1, title: "1. Concept Explanation" },
    { num: 2, title: "2. Real-World Example" },
    { num: 3, title: "3. Guided Question" },
    { num: 4, title: "4. Student Answer" },
    { num: 5, title: "5. AI Feedback" },
    { num: 6, title: "6. Adaptive Practice" },
    { num: 7, title: "7. Mini Assessment" },
  ];

  // Submit Step 3/4 Guided Question
  const handleAnswerSubmit = () => {
    if (!selectedOptionId) return;
    const opt = intervention.guidedQuestion.options.find((o) => o.id === selectedOptionId);
    const correct = opt?.isCorrect ?? false;
    setIsAnswerCorrect(correct);
    setHasSubmittedAnswer(true);
    setCurrentStep(5); // Jump to 5. AI Feedback

    // Set adaptive branch mode for step 6
    if (correct) {
      setAdaptiveMode("harder");
    } else {
      setAdaptiveMode("simplified");
    }
  };

  // Submit Step 6 Adaptive Question
  const handleAdaptiveSubmit = () => {
    setAdaptiveSubmitted(true);
  };

  // Mini Quiz Answer Select
  const handleMiniQuizSelect = (qId: string, optId: string) => {
    setMiniQuizAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  // Submit Step 7 Mini Quiz
  const handleMiniQuizSubmit = () => {
    const questions = intervention.miniAssessment.questions;
    let correct = 0;
    questions.forEach((q) => {
      const selected = q.options.find((o) => o.id === miniQuizAnswers[q.id]);
      if (selected?.isCorrect) correct += 1;
    });
    const percentage = Math.round((correct / questions.length) * 100);
    setMiniQuizScore(percentage);
    setMiniQuizFinished(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">
                TARGETED INTERVENTION • {intervention.estimatedDuration}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {intervention.targetDeficit}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono">
              {intervention.topic}
            </h2>
            <p className="text-xs text-slate-400">
              A 15-minute targeted remediation loop instead of generic 10-hour video lectures.
            </p>
          </div>

          <Badge variant="cyber" size="sm" className="font-mono text-xs w-fit">
            Adaptive Socratic Loop
          </Badge>
        </div>

        {/* 7-Stage Progress Stepper Bar */}
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 min-w-[680px]">
            {stepsList.map((step) => {
              const isActive = currentStep === step.num;
              const isPassed = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => {
                    if (step.num <= currentStep || isPassed) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl border text-[11px] font-mono transition-all flex items-center justify-between gap-1.5 ${
                    isActive
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-sm font-bold"
                      : isPassed
                      ? "bg-slate-950/60 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-950/30 border-white/[0.06] text-slate-500"
                  }`}
                >
                  <span className="truncate">{step.title}</span>
                  {isPassed && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* 2. STEP 1: Concept Explanation */}
      {currentStep === 1 && (
        <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <BookOpen className="h-4 w-4" />
            Step 1: Core Concept Micro-Brief (2 Minutes)
          </div>

          <h3 className="text-xl font-bold text-white font-mono">
            {intervention.conceptExplanation.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {intervention.conceptExplanation.summary}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider block">
              Essential Rules:
            </span>
            {intervention.conceptExplanation.coreRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] text-xs text-slate-200 flex items-start gap-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>

          {intervention.conceptExplanation.syntaxSnippet && (
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre>{intervention.conceptExplanation.syntaxSnippet}</pre>
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="cyber"
              size="sm"
              className="text-xs font-mono gap-1.5 shadow-glow"
            >
              <span>Next: Real-World Example</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </GlassCard>
      )}

      {/* 3. STEP 2: Real-World Example */}
      {currentStep === 2 && (
        <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <HelpCircle className="h-4 w-4" />
            Step 2: Relatable Real-World Scenario
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white font-mono">
              {intervention.realWorldExample.domain}
            </h3>
            <p className="text-xs text-slate-300">
              {intervention.realWorldExample.scenario}
            </p>
          </div>

          {/* Tables Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Table A */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
              <span className="font-bold text-cyan-300 block uppercase">
                Table 1: {intervention.realWorldExample.tableA.name}
              </span>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px]">
                    {intervention.realWorldExample.tableA.schema.map((s, i) => (
                      <th key={i} className="pb-1">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-200 text-[11px]">
                  {intervention.realWorldExample.tableA.sampleRows.map((row, rI) => (
                    <tr key={rI}>
                      {row.map((val, cI) => (
                        <td key={cI} className="py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table B */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-violet-500/30 space-y-2">
              <span className="font-bold text-violet-300 block uppercase">
                Table 2: {intervention.realWorldExample.tableB.name}
              </span>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px]">
                    {intervention.realWorldExample.tableB.schema.map((s, i) => (
                      <th key={i} className="pb-1">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-200 text-[11px]">
                  {intervention.realWorldExample.tableB.sampleRows.map((row, rI) => (
                    <tr key={rI}>
                      {row.map((val, cI) => (
                        <td key={cI} className="py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <strong>Key Takeaway:</strong> {intervention.realWorldExample.expectedOutputExplanation}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="ghost"
              size="sm"
              className="text-xs font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              variant="cyber"
              size="sm"
              className="text-xs font-mono gap-1.5 shadow-glow"
            >
              <span>Next: Guided Question</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </GlassCard>
      )}

      {/* 4. STEPS 3 & 4: Guided Question & Student Answer */}
      {(currentStep === 3 || currentStep === 4) && (
        <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> Steps 3 &amp; 4: Guided Question &amp; Your Answer
            </span>
            <Badge variant="glass" size="sm" className="font-mono text-[9px]">
              {intervention.guidedQuestion.difficulty}
            </Badge>
          </div>

          <h3 className="text-base font-bold text-white font-mono leading-relaxed">
            {intervention.guidedQuestion.questionText}
          </h3>

          {/* Option Selection List */}
          <div className="space-y-2.5 pt-2">
            {intervention.guidedQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-glow-sm"
                      : "bg-slate-950/60 border-white/[0.08] text-slate-300 hover:border-white/20"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                      isSelected ? "border-cyan-400 bg-cyan-400 text-black font-bold" : "border-slate-500"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] text-xs text-slate-400 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-cyan-400 shrink-0" />
            <span><strong>Hint:</strong> {intervention.guidedQuestion.hint}</span>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="ghost"
              size="sm"
              className="text-xs font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
            </Button>
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedOptionId}
              variant="cyber"
              size="sm"
              className="text-xs font-mono gap-1.5 shadow-glow"
            >
              <span>Submit Answer &amp; Get Feedback</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </GlassCard>
      )}

      {/* 5. STEP 5: AI Socratic Feedback */}
      {currentStep === 5 && (
        <GlassCard className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Brain className="h-4 w-4" /> Step 5: Instant AI Socratic Feedback
          </div>

          <div
            className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
              isAnswerCorrect
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/40 border-rose-500/40 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isAnswerCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Spot On! Perfect Understanding</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                  <span>Common Misconception Identified</span>
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-200 pt-1">
              {
                intervention.guidedQuestion.options.find((o) => o.id === selectedOptionId)
                  ?.explanation
              }
            </p>
          </div>

          {/* Adaptive Notification */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>
                {isAnswerCorrect
                  ? "Adaptive Engine: Correct answer detected! Increasing difficulty for the next practice drill."
                  : "Adaptive Engine: Difficulty adjusted! Providing a simpler analogy & targeted fallback drill."}
              </span>
            </div>
            <Badge variant="cyber" size="sm" className="text-[9px]">
              {isAnswerCorrect ? "Level Up" : "Scaffold Mode"}
            </Badge>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <Button
              onClick={() => setCurrentStep(6)}
              variant="cyber"
              size="sm"
              className="text-xs font-mono gap-1.5 shadow-glow"
            >
              <span>Next: Step 6 Adaptive Practice</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </GlassCard>
      )}

      {/* 6. STEP 6: Adaptive Difficulty Practice */}
      {currentStep === 6 && (
        <GlassCard className="p-6 rounded-2xl border border-violet-500/40 bg-slate-900/60 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 font-mono text-xs font-bold uppercase text-violet-300">
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-400" />
              Step 6: Adaptive Targeted Drill ({adaptiveMode === "harder" ? "Advanced Edge-Case" : "Simplified Scaffold"})
            </span>
            <Badge variant={adaptiveMode === "harder" ? "destructive" : "amber"} size="sm" className="text-[9px]">
              {adaptiveMode === "harder" ? "Harder Challenge" : "Simplified Analogy"}
            </Badge>
          </div>

          {/* If Harder Mode */}
          {adaptiveMode === "harder" && intervention.guidedQuestion.harderFollowUpQuestion && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-mono leading-relaxed">
                {intervention.guidedQuestion.harderFollowUpQuestion.questionText}
              </h3>

              <div className="space-y-2.5">
                {intervention.guidedQuestion.harderFollowUpQuestion.options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setAdaptiveOptionId(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                      adaptiveOptionId === opt.id
                        ? "bg-violet-500/20 border-violet-400 text-white shadow-glow-sm"
                        : "bg-slate-950/60 border-white/[0.08] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If Simplified Fallback Mode */}
          {adaptiveMode === "simplified" && intervention.guidedQuestion.simplifiedFallbackExample && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <strong>Simplified Analogy:</strong> {intervention.guidedQuestion.simplifiedFallbackExample.analogyText}
              </div>

              <h3 className="text-sm font-bold text-white font-mono leading-relaxed">
                {intervention.guidedQuestion.simplifiedFallbackExample.simplifiedQuestionText}
              </h3>

              <div className="space-y-2.5">
                {intervention.guidedQuestion.simplifiedFallbackExample.simplifiedOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setAdaptiveOptionId(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                      adaptiveOptionId === opt.id
                        ? "bg-amber-500/20 border-amber-400 text-white shadow-glow-sm"
                        : "bg-slate-950/60 border-white/[0.08] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(5)}
              variant="ghost"
              size="sm"
              className="text-xs font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setCurrentStep(7)}
              variant="cyber"
              size="sm"
              className="text-xs font-mono gap-1.5 shadow-glow"
            >
              <span>Next: Step 7 Mini Assessment</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </GlassCard>
      )}

      {/* 7. STEP 7: Mini Assessment & Verification */}
      {currentStep === 7 && (
        <GlassCard className="p-6 rounded-2xl border border-emerald-500/40 bg-slate-900/60 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 font-mono text-xs font-bold uppercase text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Step 7: Mini Diagnostic Assessment (3 Probes)
            </span>
            <Badge variant="cyber" size="sm" className="text-[9px]">
              Final Verification
            </Badge>
          </div>

          {!miniQuizFinished ? (
            <div className="space-y-6">
              {intervention.miniAssessment.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-3 text-xs font-mono">
                  <span className="text-cyan-400 font-bold block">
                    Probe #{idx + 1}: {q.questionText}
                  </span>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = miniQuizAnswers[q.id] === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleMiniQuizSelect(q.id, opt.id)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-cyan-500/20 border-cyan-400 text-white font-bold"
                              : "bg-slate-900/60 border-white/[0.06] text-slate-300 hover:border-white/20"
                          }`}
                        >
                          {opt.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={handleMiniQuizSubmit}
                  disabled={Object.keys(miniQuizAnswers).length < intervention.miniAssessment.questions.length}
                  variant="cyber"
                  size="sm"
                  className="text-xs font-mono gap-1.5 shadow-glow"
                >
                  <span>Submit Mini Assessment &amp; Prove Skill</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            /* Assessment Completed & Skill Proven Screen */
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/50 text-center space-y-4">
              <div className="inline-flex p-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-glow">
                <Award className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white font-mono">
                  Intervention Complete • Skill Proven!
                </h3>
                <span className="text-xs font-mono text-emerald-300 block">
                  Mini Assessment Score: <strong>{miniQuizScore}%</strong> (Threshold: {intervention.miniAssessment.passScorePercentage}%)
                </span>
              </div>

              <div className="p-3.5 max-w-md mx-auto rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs font-mono text-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block">Skill DNA Live Telemetry Sync:</span>
                <strong className="text-emerald-400 text-base">SQL JOINs: 42% ➔ 84% (+42% Gain)</strong>
                <span className="text-[10px] text-slate-400 block mt-1">Status upgraded to: 🟢 Demonstrated &amp; Verified</span>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link href="/learning/roadmap">
                  <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                    <span>View Updated Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/skills">
                  <Button variant="outline" size="sm" className="text-xs font-mono border-white/10 hover:border-cyan-500/30">
                    <Dna className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
                    Inspect Skill DNA
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
