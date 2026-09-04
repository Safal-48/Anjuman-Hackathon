"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  AlertTriangle,
  Sparkles,
  Save,
  Send,
  RotateCcw,
  Clock,
  Lock,
  ShieldAlert,
  Eye,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentQuestion, AssessmentSession, QuestionCategory } from "@/lib/supabase/types";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { AttentionMonitor } from "@/components/interview/attention-monitor";
import { audioAlert } from "@/lib/attention/audio-alert";
import { stopAllCameraStreams } from "@/lib/camera/camera-stream-manager";

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

  // 10-Minute Assessment Countdown Timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(600);

  // Head movement attention warning & freeze state
  const [warningCount, setWarningCount] = useState<number>(0);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [activeWarning, setActiveWarning] = useState<{
    warningNum: number;
    title: string;
    message: string;
    subText: string;
  } | null>(null);

  // Cooldown tracker to avoid firing duplicate alerts in rapid succession
  const lastAlertTimeRef = useRef<number>(0);

  // Sync session responses if provided
  useEffect(() => {
    if (initialSession) {
      setResponses(initialSession.responses || {});
      if (typeof initialSession.currentQuestionIndex === "number" && initialSession.currentQuestionIndex < questions.length) {
        setCurrentIndex(initialSession.currentQuestionIndex);
      }
    }
  }, [initialSession, questions.length]);

  // Handle 10-Minute Countdown Timer
  useEffect(() => {
    if (isFrozen || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFrozen, isSubmitting]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const warningCountRef = useRef<number>(warningCount);
  warningCountRef.current = warningCount;

  // Callback when Attention Monitor triggers an alert (Head movement away / left / right / up / down)
  const handleAttentionAlert = useCallback((isAlert: boolean, message: string) => {
    if (!isAlert || isFrozen || warningCountRef.current >= 2) return;

    const now = Date.now();
    // 800ms debounce to prevent frame-level spam while quickly catching repeated or continued head turns
    if (now - lastAlertTimeRef.current < 800) return;
    lastAlertTimeRef.current = now;

    setWarningCount((prevCount) => {
      const nextCount = prevCount + 1;
      warningCountRef.current = nextCount;

      if (nextCount === 1) {
        audioAlert.playWarningSiren();
        setActiveWarning({
          warningNum: 1,
          title: "Warning 1 of 2: Head Movement Detected",
          message: "Please look forward directly at the screen! Do not turn your head left, right, up, or down.",
          subText: "Your camera detected your head moving away from the screen. You have ONLY 1 WARNING REMAINING. If you move your head away again, your assessment will be IMMEDIATELY FROZEN and locked!",
        });
        return 1;
      } else {
        // 2 warnings reached: FREEZE SCREEN IMMEDIATELY
        audioAlert.playLockoutAlert();
        setIsFrozen(true);
        setActiveWarning(null);
        return 2;
      }
    });
  }, [isFrozen]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(responses).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isAssessmentLocked = isFrozen || warningCount >= 2;

  const handleSelectOption = async (optionId: string) => {
    // If screen is frozen or 2 warnings reached or saving, block answering completely
    if (!currentQuestion || isAssessmentLocked || isSaving) return;

    const newResponses = { ...responses, [currentQuestion.id]: optionId };
    setResponses(newResponses);

    setIsSaving(true);
    await onAnswerSaved(currentQuestion.id, optionId, currentIndex);
    setIsSaving(false);
  };

  const handleNext = () => {
    if (isFrozen) return;
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  // Scroll directly to top when AssessmentRunner mounts and shut down camera streams on unmount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    return () => {
      stopAllCameraStreams();
    };
  }, []);

  const handlePrev = () => {
    if (isFrozen) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    stopAllCameraStreams();
    setIsSubmitting(true);
    await onSubmitAssessment();
    setIsSubmitting(false);
    router.push("/skills");
  };

  const handleChangeSubject = () => {
    stopAllCameraStreams();
    onChangeSubject?.();
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
    <div className="space-y-8 relative">
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

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* 10-Minute Countdown Timer Widget */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono transition-all ${
                timeLeft <= 60
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  : timeLeft <= 180
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                  : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
              }`}
            >
              <Clock className={`h-4 w-4 shrink-0 ${timeLeft <= 60 ? "text-rose-400 animate-spin" : "text-cyan-400"}`} />
              <div className="leading-tight">
                <span className="text-[9px] text-muted-foreground block uppercase font-mono tracking-wider">
                  Timer (10m)
                </span>
                <span className="text-sm font-extrabold tracking-wider">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Attention Warning Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                isAssessmentLocked
                  ? "bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse"
                  : warningCount === 0
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/20 border-amber-500/50 text-amber-300"
              }`}
            >
              {isAssessmentLocked ? <Lock className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              <span>{isAssessmentLocked ? "FROZEN 🔒" : `Warnings: ${warningCount}/2`}</span>
            </div>

            {onChangeSubject && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeSubject}
                disabled={isAssessmentLocked}
                className="text-xs font-mono border-white/10 hover:border-cyan-400 text-slate-300 hidden md:inline-flex"
              >
                ← Change Subject
              </Button>
            )}

            <div className="text-right space-y-1 hidden sm:block">
              <span className="text-xs font-mono text-muted-foreground block">
                Progress: <strong className="text-foreground">{answeredCount}</strong> / {totalQuestions}
              </span>
              <div className="h-2 w-28 bg-slate-900 rounded-full overflow-hidden border border-white/10">
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
        {/* Left Sidebar: Attention Monitor at top & Question Navigator below (Sticky at eye-level) */}
        <div className="space-y-4 lg:col-span-1 lg:sticky lg:top-24 self-start">
          {/* Attention & Presence Monitor with Live Camera & Warning Indicator at the TOP */}
          <AttentionMonitor
            compact
            warningCount={warningCount}
            isFrozen={isAssessmentLocked}
            onAlertChange={handleAttentionAlert}
          />

          {/* Question Navigator */}
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
                    disabled={isAssessmentLocked}
                    onClick={() => !isAssessmentLocked && setCurrentIndex(idx)}
                    className={`h-9 w-full rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center border ${
                      isAssessmentLocked
                        ? "opacity-40 cursor-not-allowed border-white/5 text-muted-foreground"
                        : isCurrent
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
        </div>

        {/* Right Active Question Card */}
        <div className="lg:col-span-3 space-y-6 relative">
          <FadeIn key={currentQuestion.id}>
            <GlassCard className={`p-6 sm:p-8 space-y-6 ${isAssessmentLocked ? "opacity-30 pointer-events-none filter blur-[1px]" : ""}`}>
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
              <div className={`space-y-3 ${isAssessmentLocked ? "pointer-events-none" : ""}`}>
                {currentQuestion.options.map((opt, optIndex) => {
                  const isSelected = responses[currentQuestion.id] === opt.id;
                  const optionLetters = ["A", "B", "C", "D", "E"];

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAssessmentLocked || isSaving}
                      onClick={() => !isAssessmentLocked && handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 group ${
                        isAssessmentLocked
                          ? "opacity-40 cursor-not-allowed border-white/5"
                          : isSelected
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
                  disabled={currentIndex === 0 || isAssessmentLocked}
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
                      disabled={isAssessmentLocked}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="cyber"
                      size="sm"
                      onClick={() => setShowConfirmSubmit(true)}
                      disabled={isAssessmentLocked}
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

      {/* Global Inescapable Viewport Freeze Modal (Locks entire screen completely) */}
      {isAssessmentLocked && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
          <GlassCard className="w-full max-w-lg p-8 space-y-6 text-center border-2 border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.5)]" glow>
            <div className="h-20 w-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center mx-auto shadow-glow animate-pulse">
              <Lock className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <Badge variant="glass" className="bg-rose-500/30 text-rose-300 border-rose-500 text-xs font-mono uppercase px-3 py-1">
                🔒 Proctoring Violation • Screen Frozen
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Assessment Screen Frozen
              </h2>
              <p className="text-sm text-rose-200/90 leading-relaxed max-w-md mx-auto">
                You have received 2 warnings for moving your head away from the screen (turning left, right, upward, or downward).
                In accordance with proctoring regulations, answering has been completely locked and frozen.
              </p>
            </div>

            <div className="p-4 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-slate-300 max-w-sm mx-auto space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Answered Questions:</span>
                <strong className="text-cyan-400">{answeredCount} of {totalQuestions}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warnings Status:</span>
                <strong className="text-rose-400 font-bold">2/2 Warnings Exceeded</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screen State:</span>
                <strong className="text-rose-400 font-bold">PERMANENTLY FROZEN</strong>
              </div>
            </div>

            <Button
              variant="cyber"
              size="lg"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3 text-base shadow-glow cursor-pointer"
            >
              Submit Final Assessment
            </Button>
          </GlassCard>
        </div>
      )}

      {/* Attention Warning Modal (Warning 1 & Warning 2) */}
      {activeWarning && !isFrozen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard
            className={`w-full max-w-md p-6 space-y-5 text-center shadow-2xl ${
              activeWarning.warningNum === 1
                ? "border-amber-500/70 shadow-amber-500/20"
                : "border-rose-500/90 shadow-rose-500/30 ring-2 ring-rose-500/40"
            }`}
            glow
          >
            <div
              className={`h-14 w-14 rounded-2xl border flex items-center justify-center mx-auto shadow-glow-sm ${
                activeWarning.warningNum === 1
                  ? "bg-amber-500/20 border-amber-400 text-amber-400"
                  : "bg-rose-500/20 border-rose-500 text-rose-400 animate-bounce"
              }`}
            >
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <Badge
                variant="glass"
                className={`font-mono text-xs uppercase ${
                  activeWarning.warningNum === 1
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                }`}
              >
                {activeWarning.warningNum === 1 ? "Attention Notice 1/2" : "🚨 FINAL WARNING 2/2"}
              </Badge>
              <h3 className="font-extrabold text-xl text-foreground tracking-tight">
                {activeWarning.title}
              </h3>
              <p className="text-sm font-semibold text-rose-200">
                {activeWarning.message}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeWarning.subText}
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-center gap-2">
              <Eye className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Please keep your face centered towards the camera.</span>
            </div>

            <Button
              variant={activeWarning.warningNum === 1 ? "glow" : "cyber"}
              size="default"
              onClick={() => setActiveWarning(null)}
              className="w-full font-bold"
            >
              I Understand & Keep Facing Forward
            </Button>
          </GlassCard>
        </div>
      )}

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
