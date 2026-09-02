"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Cpu,
  Users,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Send,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentQuestion, AssessmentSession, QuestionCategory } from "@/lib/supabase/types";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { AttentionMonitor } from "@/components/interview/attention-monitor";

interface AssessmentRunnerProps {
  questions: AssessmentQuestion[];
  initialSession?: AssessmentSession | null;
  subjectTitle?: string;
  onChangeSubject?: () => void;
  onAnswerSaved: (questionId: string, optionId: string, index: number) => Promise<void>;
  onSubmitAssessment: (targetRoleId?: string) => Promise<void>;
}

export function AssessmentRunner({
  questions = [],
  initialSession,
  subjectTitle,
  onChangeSubject,
  onAnswerSaved,
  onSubmitAssessment,
}: AssessmentRunnerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialSession?.currentQuestionIndex || 0);
  const [responses, setResponses] = useState<Record<string, string>>(initialSession?.responses || {});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Sync session responses if provided
  useEffect(() => {
    if (initialSession) {
      setResponses(initialSession.responses || {});
      if (typeof initialSession.currentQuestionIndex === "number" && initialSession.currentQuestionIndex < questions.length) {
        setCurrentIndex(initialSession.currentQuestionIndex);
      }
    }
  }, [initialSession, questions.length]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(responses).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleSelectOption = async (optionId: string) => {
    if (!currentQuestion) return;
    const newResponses = { ...responses, [currentQuestion.id]: optionId };
    setResponses(newResponses);

    setIsSaving(true);
    await onAnswerSaved(currentQuestion.id, optionId, currentIndex);
    setIsSaving(false);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmitAssessment();
    setIsSubmitting(false);
    router.push("/skills");
  };

  const categoryMeta: Record<QuestionCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    technical: { label: "Technical", icon: Cpu, color: "text-cyan-400" },
    soft_skill: { label: "Soft Skills", icon: Users, color: "text-violet-400" },
    aptitude: { label: "Aptitude", icon: Brain, color: "text-emerald-400" },
    career_interest: { label: "Career Focus", icon: Target, color: "text-amber-400" },
  };

  if (!currentQuestion) {
    return (
      <GlassCard className="p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-foreground">No Assessment Questions Available</h3>
        <p className="text-sm text-muted-foreground">The question database is currently initializing. Please refresh.</p>
      </GlassCard>
    );
  }

  const currentMeta = categoryMeta[currentQuestion.category] || categoryMeta.technical;
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="space-y-8">
      {/* Assessment Top Telemetry Bar */}
      <GlassCard className="p-5 border-white/10" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <CurrentIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-foreground text-sm sm:text-base">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                {subjectTitle && (
                  <Badge variant="glass" size="sm" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                    {subjectTitle}
                  </Badge>
                )}
                <Badge variant="cyber" size="sm">
                  {currentMeta.label.toUpperCase()}
                </Badge>
                <Badge variant="glass" size="sm">
                  {currentQuestion.difficulty.toUpperCase()}
                </Badge>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Skill Focus: {currentQuestion.skillTag}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onChangeSubject && (
              <Button
                variant="outline"
                size="sm"
                onClick={onChangeSubject}
                className="text-xs font-mono border-white/10 hover:border-cyan-400 text-slate-300"
              >
                ← Change Subject
              </Button>
            )}

            <div className="text-right space-y-1 hidden sm:block">
              <span className="text-xs font-mono text-muted-foreground block">
                Progress: <strong className="text-foreground">{answeredCount}</strong> / {totalQuestions} answered
              </span>
              <div className="h-2 w-32 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <Button
              variant="cyber"
              size="sm"
              onClick={() => setShowConfirmSubmit(true)}
              leftIcon={<Send className="h-3.5 w-3.5" />}
            >
              Submit
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Main Grid: Navigator Sidebar & Question Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Navigator Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          <GlassCard className="p-4 space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Question Navigator</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(responses[q.id]);
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 w-full rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center border ${
                      isCurrent
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-sm scale-105"
                        : isAnswered
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-white/[0.03] text-muted-foreground border-white/5 hover:border-white/20"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/20" /> Remaining
              </span>
            </div>
          </GlassCard>

          {/* Optional Attention & Presence Monitor */}
          <AttentionMonitor compact />
        </div>

        {/* Right Active Question Card */}
        <div className="lg:col-span-3 space-y-6">
          <FadeIn key={currentQuestion.id}>
            <GlassCard className="p-6 sm:p-8 space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
                  {currentQuestion.category.replace("_", " ")} Assessment
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt, optIndex) => {
                  const isSelected = responses[currentQuestion.id] === opt.id;
                  const optionLetters = ["A", "B", "C", "D", "E"];

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 group ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-400/80 shadow-glow-sm text-foreground"
                          : "bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-cyan-500/30 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`h-7 w-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-cyan-400 text-slate-950 border-cyan-400"
                            : "bg-white/5 border-white/10 text-muted-foreground group-hover:border-cyan-500/50"
                        }`}
                      >
                        {optionLetters[optIndex] || optIndex + 1}
                      </span>
                      <span className="text-sm font-medium leading-relaxed pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentIndex < totalQuestions - 1 ? (
                    <Button
                      variant="glow"
                      size="sm"
                      onClick={handleNext}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="cyber"
                      size="sm"
                      onClick={() => setShowConfirmSubmit(true)}
                      rightIcon={<CheckCircle2 className="h-4 w-4" />}
                    >
                      Review & Submit
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </div>

      {/* Submit Confirmation Dialog Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-md p-6 space-y-5 border-cyan-500/40 shadow-2xl text-center" glow>
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto shadow-glow-sm">
              <Sparkles className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-xl text-foreground">Submit Skill Assessment?</h3>
              <p className="text-xs text-muted-foreground">
                You have answered <strong className="text-cyan-400">{answeredCount}</strong> of{" "}
                <strong>{totalQuestions}</strong> questions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-muted-foreground text-left space-y-1.5">
              <p className="font-semibold text-foreground">What happens next?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Deterministic multi-vector score calculation</li>
                <li>Structuring verified skill levels</li>
                <li>Industrial role benchmark gap analysis</li>
              </ul>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowConfirmSubmit(false)}>
                Continue Assessment
              </Button>
              <Button
                variant="glow"
                size="sm"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Compute & Finalize
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
