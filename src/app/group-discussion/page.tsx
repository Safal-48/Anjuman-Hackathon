"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
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
  MessageSquare,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GDSetupStepper } from "@/components/ai/gd/gd-setup-stepper";
import { GDVirtualRoom } from "@/components/ai/gd/gd-virtual-room";
import {
  GDConfig,
  GDTopic,
  GDParticipantPersona,
  GDMessage,
  GDTurnEvaluation,
  FinalGDReport,
} from "@/lib/ai/gd-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

type GDStep = "setup" | "active";

export default function DedicatedGroupDiscussionPage() {
  const router = useRouter();
  const [step, setStep] = useState<GDStep>("setup");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCompilingReport, setIsCompilingReport] = useState(false);

  // Active Session State
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeConfig, setActiveConfig] = useState<GDConfig | null>(null);
  const [activeTopic, setActiveTopic] = useState<GDTopic | null>(null);
  const [activeParticipants, setActiveParticipants] = useState<GDParticipantPersona[]>([]);
  const [initialMessages, setInitialMessages] = useState<GDMessage[]>([]);

  // Completed Session Modal State
  const [completedReport, setCompletedReport] = useState<FinalGDReport | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  // Attempts History State
  const [attempts, setAttempts] = useState<FinalGDReport[]>([]);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);

  useEffect(() => {
    async function loadAttempts() {
      try {
        const res = await fetch("/api/ai/gd/attempts");
        if (res.ok) {
          const data = await res.json();
          setAttempts(data.attempts || []);
        }
      } catch (err) {
        console.error("Failed to load past GD attempts:", err);
      }
    }
    loadAttempts();
  }, []);

  const handleStartSession = async (config: GDConfig) => {
    setIsInitializing(true);
    try {
      const res = await fetch("/api/ai/gd/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize GD session");
      }

      const data = await res.json();
      setActiveSessionId(data.sessionId);
      setActiveConfig(data.config);
      setActiveTopic(data.topic);
      setActiveParticipants(data.participants);
      setInitialMessages(data.initialMessages);
      setStep("active");
    } catch (err) {
      console.error("Error starting GD session:", err);
      alert("Failed to start GD session. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCompleteGD = async (
    allMessages: GDMessage[],
    studentEvaluations: GDTurnEvaluation[]
  ) => {
    if (!activeConfig || !activeTopic || !activeSessionId) return;

    setIsCompilingReport(true);
    try {
      const res = await fetch("/api/ai/gd/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          config: activeConfig,
          topic: activeTopic,
          allMessages,
          studentEvaluations,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to compile GD final report");
      }

      const data = await res.json();
      setCompletedReport(data.report);
      setShowCompletionPopup(true);
    } catch (err) {
      console.error("Error compiling GD report:", err);
      alert("Failed to compile final GD performance report.");
    } finally {
      setIsCompilingReport(false);
    }
  };

  const handleResetSession = () => {
    setShowCompletionPopup(false);
    setCompletedReport(null);
    setActiveSessionId("");
    setActiveConfig(null);
    setActiveTopic(null);
    setActiveParticipants([]);
    setInitialMessages([]);
    setStep("setup");
  };

  const handleNavigateToResults = () => {
    if (completedReport) {
      router.push(`/group-discussion/results/${completedReport.sessionId}`);
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
                AI Group Discussion Simulator
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
              Past Sessions ({attempts.length})
            </Button>

            {step !== "setup" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetSession}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono"
              >
                Reset
              </Button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-muted-foreground">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Multi-Agent Roundtable</span>
            </div>
          </div>
        </div>

        {/* Loading State for Report Compilation */}
        {isCompilingReport && (
          <GlassCard className="p-12 text-center space-y-4 max-w-lg mx-auto border-cyan-500/30" glow>
            <div className="h-16 w-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Synthesizing GD Diagnostic Audit...</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Evaluating multi-agent transcript across communication, relevance, airtime balance, argument structure, and counter-argument handling.
            </p>
          </GlassCard>
        )}

        {/* Step 1: Configuration Setup Screen */}
        {!isCompilingReport && step === "setup" && (
          <GDSetupStepper
            onStartSession={handleStartSession}
            isLoading={isInitializing}
          />
        )}

        {/* Step 2: Active Discussion Virtual Room */}
        {!isCompilingReport &&
          step === "active" &&
          activeConfig &&
          activeTopic && (
            <GDVirtualRoom
              config={activeConfig}
              topic={activeTopic}
              participants={activeParticipants}
              initialMessages={initialMessages}
              sessionId={activeSessionId}
              onCompleteGD={handleCompleteGD}
              onCancelGD={handleResetSession}
            />
          )}

        {/* Completion Summary Popup (Direct CTA to Dedicated Results Page) */}
        {showCompletionPopup && completedReport && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-lg p-6 sm:p-8 space-y-6 border-cyan-500/40 shadow-2xl text-center relative" glow>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Award className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <Badge variant="emerald" size="sm" className="font-mono text-xs">
                  GD ROUND CONCLUDED
                </Badge>
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  Performance Synthesized!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Evaluated across {completedReport.totalGroupTurns} contributions and {completedReport.studentTurnCount} candidate turns.
                </p>
              </div>

              {/* Score Snapshot */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-around">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Composite GD Score
                  </span>
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {completedReport.overallScore}%
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Airtime Share
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {completedReport.studentAirtimePercentage}%
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Placement Status
                  </span>
                  <span className="text-xs font-bold font-mono text-cyan-300">
                    {completedReport.readinessState.split(" ")[0]} Ready
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Your full 7-vector radar, counter-argument diagnostic, turn-by-turn transcript annotations, and personalized drills are ready on the dedicated results page.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="glass"
                  size="default"
                  onClick={handleResetSession}
                  className="w-full sm:flex-1 text-xs font-mono"
                >
                  Back to Setup
                </Button>
                <Button
                  type="button"
                  variant="glow"
                  size="default"
                  onClick={handleNavigateToResults}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="w-full sm:flex-1 text-xs font-mono font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  View Full Report →
                </Button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Previous Attempts Drawer */}
        {showAttemptsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-6 space-y-5 border-cyan-500/30 max-h-[85vh] overflow-y-auto" glow>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-foreground">GD Simulation History</h3>
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
                    No past GD attempts recorded yet.
                  </p>
                ) : (
                  attempts.map((att) => (
                    <div
                      key={att.sessionId}
                      className="p-4 rounded-2xl border border-white/10 bg-slate-900/70 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-foreground line-clamp-1">
                          {att.topicTitle}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {att.topicCategory} • {new Date(att.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <span className="text-lg font-black text-cyan-400">{att.overallScore}%</span>
                          <span className="text-[10px] text-muted-foreground block">{att.readinessState}</span>
                        </div>

                        <Link href={`/group-discussion/results/${att.sessionId}`}>
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
