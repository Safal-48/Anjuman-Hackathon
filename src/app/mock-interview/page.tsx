"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  RotateCcw,
  Loader2,
  Clock,
  Radio,
  Sliders,
  History,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewSetupModal } from "@/components/ai/interview/interview-setup-modal";
import { CameraPermissionGate } from "@/components/interview/camera-permission-gate";
import { InterviewSessionRoom } from "@/components/ai/interview/interview-session-room";
import { InterviewCompletionPopup } from "@/components/ai/interview/interview-completion-popup";
import {
  InterviewConfig,
  InterviewQuestion,
  InterviewerPersona,
  SingleQuestionEvaluation,
  FinalInterviewReport,
} from "@/lib/ai/interview-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

type InterviewStep = "setup" | "permission" | "active";

export default function DedicatedMockInterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState<InterviewStep>("setup");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCompilingReport, setIsCompilingReport] = useState(false);

  // Active Session State
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeConfig, setActiveConfig] = useState<InterviewConfig | null>(null);
  const [activeInterviewer, setActiveInterviewer] = useState<InterviewerPersona | null>(null);
  const [initialQuestion, setInitialQuestion] = useState<InterviewQuestion | null>(null);

  // Completed Session Modal State
  const [completedReport, setCompletedReport] = useState<FinalInterviewReport | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  // Attempts History State
  const [attempts, setAttempts] = useState<FinalInterviewReport[]>([]);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);

  useEffect(() => {
    async function loadAttempts() {
      try {
        const res = await fetch("/api/ai/interview/attempts");
        if (res.ok) {
          const data = await res.json();
          setAttempts(data.attempts || []);
        }
      } catch (err) {
        console.error("Failed to load past attempts:", err);
      }
    }
    loadAttempts();
  }, []);

  // Handle Launching a New Session (Moves to Camera & Attention Permission Gate)
  const handleStartInterview = async (config: InterviewConfig) => {
    setIsInitializing(true);
    try {
      const res = await fetch("/api/ai/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize interview session");
      }

      const data = await res.json();
      setActiveSessionId(data.sessionId);
      setActiveConfig(data.config);
      setActiveInterviewer(data.interviewer);
      setInitialQuestion(data.initialQuestion);
      setStep("permission");
    } catch (err) {
      console.error("Error starting mock interview:", err);
      alert("Failed to start interview session. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle Interview Completion (Redirect to dedicated results page)
  const handleInterviewComplete = async (
    evaluations: SingleQuestionEvaluation[],
    attentionSummary?: any
  ) => {
    if (!activeConfig || !activeSessionId) return;

    setIsCompilingReport(true);
    try {
      const res = await fetch("/api/ai/interview/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          config: activeConfig,
          evaluations,
          attentionSummary,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to compile final report");
      }

      const data = await res.json();
      setCompletedReport(data.report);
      setShowCompletionPopup(true);
    } catch (err) {
      console.error("Error compiling interview report:", err);
      alert("Failed to compile final performance report.");
    } finally {
      setIsCompilingReport(false);
    }
  };

  const handleRetakeInterview = () => {
    setShowCompletionPopup(false);
    setCompletedReport(null);
    setActiveSessionId("");
    setActiveConfig(null);
    setActiveInterviewer(null);
    setInitialQuestion(null);
    setStep("setup");
  };

  const handleNavigateToResults = () => {
    if (completedReport) {
      router.push(`/mock-interview/results/${completedReport.sessionId}`);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-8">
        {/* Dedicated Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Return to Dashboard"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  KaushalSetu Intelligence Suite
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-cyan-400" />
                <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                  DEDICATED MODULE
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                AI Mock Interview Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={() => setShowAttemptsModal(true)}
              leftIcon={<History className="h-3.5 w-3.5 text-violet-400" />}
              className="text-xs font-mono"
            >
              Past Attempts ({attempts.length})
            </Button>

            {step !== "setup" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRetakeInterview}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono"
              >
                Reset
              </Button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-muted-foreground">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Multi-Turn AI Engine</span>
            </div>
          </div>
        </div>

        {/* Loading State for Report Compilation */}
        {isCompilingReport && (
          <GlassCard className="p-12 text-center space-y-4 max-w-lg mx-auto border-cyan-500/30" glow>
            <div className="h-16 w-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Synthesizing Diagnostic Report...</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Evaluating multi-vector telemetry across Technical Knowledge, Relevance, Answer Quality, Communication, Confidence, and Response Pacing.
            </p>
          </GlassCard>
        )}

        {/* Step 1: Configuration Setup Screen */}
        {!isCompilingReport && step === "setup" && (
          <InterviewSetupModal
            onStartInterview={handleStartInterview}
            isLoading={isInitializing}
          />
        )}

        {/* Step 2: Camera & Attention Permission Gate (Mandatory Pre-Interview Equipment Check) */}
        {!isCompilingReport && step === "permission" && activeConfig && (
          <CameraPermissionGate
            roleTitle={activeConfig.roleId.replace(/_/g, " ").toUpperCase()}
            onPermissionGranted={() => {
              setStep("active");
            }}
            onCancel={() => {
              setStep("setup");
            }}
          />
        )}

        {/* Step 3: Active Interview Session Room (Distraction-Free) */}
        {!isCompilingReport &&
          step === "active" &&
          activeConfig &&
          activeInterviewer &&
          initialQuestion && (
            <InterviewSessionRoom
              config={activeConfig}
              interviewer={activeInterviewer}
              initialQuestion={initialQuestion}
              sessionId={activeSessionId}
              onInterviewComplete={handleInterviewComplete}
              onCancelInterview={handleRetakeInterview}
            />
          )}

        {/* ========================================================================= */}
        {/* INTERVIEW COMPLETION PERFORMANCE POPUP (Quick Summary Modal)              */}
        {/* ========================================================================= */}
        <InterviewCompletionPopup
          isOpen={showCompletionPopup}
          report={completedReport}
          onClose={() => setShowCompletionPopup(false)}
          onViewDetails={(sessionId) => {
            setShowCompletionPopup(false);
            router.push(`/mock-interview/results/${sessionId}`);
          }}
          onRetry={handleRetakeInterview}
        />

        {/* ========================================================================= */}
        {/* PREVIOUS ATTEMPTS MODAL / DRAWER                                          */}
        {/* ========================================================================= */}
        {showAttemptsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-6 space-y-5 border-cyan-500/30 max-h-[85vh] overflow-y-auto" glow>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-foreground">Interview Attempt History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAttemptsModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {attempts.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No past interview attempts recorded yet.
                  </p>
                ) : (
                  attempts.map((att) => (
                    <div
                      key={att.sessionId}
                      className="p-4 rounded-2xl border border-white/10 bg-slate-900/70 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-foreground">
                          {att.config.roleId.replace(/_/g, " ").toUpperCase()}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Interviewer: {att.interviewer.name} • {new Date(att.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <span className="text-lg font-black text-cyan-400">{att.overallScore}%</span>
                          <span className="text-[10px] text-muted-foreground block">{att.performanceGrade}</span>
                        </div>

                        <Link href={`/mock-interview/results/${att.sessionId}`}>
                          <Button
                            variant="glow"
                            size="sm"
                            className="text-xs font-mono"
                            onClick={() => setShowAttemptsModal(false)}
                          >
                            Open Report →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </Container>
    </div>
  );
}
