"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Mic,
  MicOff,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  Sliders,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InterviewConfig,
  InterviewQuestion,
  InterviewerPersona,
  SingleQuestionEvaluation,
} from "@/lib/ai/interview-engine";
import { AttentionSummary } from "@/lib/attention/attention-config";
import { AttentionMonitor } from "@/components/interview/attention-monitor";
import { InterviewerAvatarCard } from "@/components/ai/interview/interviewer-avatar-card";
import { VoiceActivityState } from "@/components/ai/voice-wave-visualizer";
import { SlideUp, FadeIn } from "@/components/animations/motion-wrapper";

interface InterviewSessionRoomProps {
  config: InterviewConfig;
  interviewer: InterviewerPersona;
  initialQuestion: InterviewQuestion;
  sessionId: string;
  onInterviewComplete: (evaluations: SingleQuestionEvaluation[], attentionSummary?: AttentionSummary) => void;
  onCancelInterview: () => void;
}

export function InterviewSessionRoom({
  config,
  interviewer,
  initialQuestion,
  sessionId,
  onInterviewComplete,
  onCancelInterview,
}: InterviewSessionRoomProps) {
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion>(initialQuestion);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [evaluations, setEvaluations] = useState<SingleQuestionEvaluation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Attention Monitoring State
  const [isAttentionAlert, setIsAttentionAlert] = useState(false);
  const [attentionAlertMsg, setAttentionAlertMsg] = useState("");
  const [attentionSummary, setAttentionSummary] = useState<AttentionSummary | undefined>(undefined);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceActivityState>("idle");
  const recognitionRef = useRef<any>(null);

  const totalQuestions = config.totalQuestions || 4;

  // Timer logic
  useEffect(() => {
    setSecondsElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion.id]);

  // Speech Recognition setup (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type directly in the response box.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceState("idle");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = config.language === "hi" ? "hi-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceState("listening");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setAnswerText(transcript.trim());
      };

      recognition.onerror = (err: any) => {
        console.error("Speech Recognition Error:", err);
        setIsListening(false);
        setVoiceState("idle");
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceState("idle");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setVoiceState("idle");
    }
  };

  const handleLoadSampleAnswer = () => {
    if (config.roleId === "ai_systems_engineer") {
      setAnswerText(
        "To achieve sub-40ms p99 latency for 70B parameter models, I would engineer a distributed TensorRT-LLM serving cluster with vLLM PagedAttention to eliminate memory fragmentation. Specifically, I would employ Tensor Parallelism across 4 Hopper GPUs connected via high-bandwidth NVLink to minimize all-reduce latency, combined with dynamic request batching. For GPU memory protection, I would configure chunked prefill to prevent Out-Of-Memory spikes and maintain a dedicated swap space for KV cache offloading."
      );
    } else if (config.roleId === "cloud_sre_architect") {
      setAnswerText(
        "In our multi-region active-active Kubernetes infrastructure, we implement synchronous Raft state replication across two regions with Anycast DNS routing. To prevent cascading failures during network partitions, we utilize Istio circuit breakers, exponential backoff with jitter, and dead letter queues for failed transactions, guaranteeing RPO=0 and zero data loss."
      );
    } else {
      setAnswerText(
        "React Server Components fundamentally move data fetching to the server, resulting in zero client JavaScript bundle overhead for non-interactive subtrees. In Next.js App Router, we stream HTML progressively with Suspense boundaries and selectively hydrate only interactive client components, optimizing First Contentful Paint (FCP) and Interaction to Next Paint (INP)."
      );
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || isSubmitting) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    setVoiceState("processing");

    try {
      const res = await fetch("/api/ai/interview/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          currentQuestion,
          answerText,
          responseTimeSeconds: secondsElapsed,
          currentQuestionIndex,
          previousEvaluations: evaluations,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process question evaluation");
      }

      const data = await res.json();
      const updatedEvaluations = [...evaluations, data.evaluation];
      setEvaluations(updatedEvaluations);

      if (data.isComplete || !data.nextQuestion) {
        // Interview complete! Trigger final report compilation with attention telemetry
        onInterviewComplete(updatedEvaluations, attentionSummary);
      } else {
        // Move smoothly to next contextual follow-up question
        setCurrentQuestion(data.nextQuestion);
        setCurrentQuestionIndex(data.currentQuestionIndex);
        setAnswerText("");
        setShowHint(false);
        setVoiceState("idle");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Failed to submit response. Please try again.");
      setVoiceState("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConcludeEarly = () => {
    if (evaluations.length === 0 && !answerText.trim()) {
      if (confirm("You have not answered any questions yet. Do you want to exit to configuration?")) {
        onCancelInterview();
      }
      return;
    }

    if (confirm("Conclude interview now and generate your performance report based on completed answers?")) {
      if (answerText.trim()) {
        handleSubmitAnswer();
      } else {
        onInterviewComplete(evaluations, attentionSummary);
      }
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const wordCount = answerText.split(/\s+/).filter(Boolean).length;

  return (
    <div
      className={`space-y-6 p-4 sm:p-6 rounded-3xl transition-all duration-500 border ${
        isAttentionAlert
          ? "border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.3)] bg-rose-950/[0.12]"
          : "border-white/5 bg-transparent"
      }`}
    >
      {/* Real-time Attention Deviation Alert Banner */}
      {isAttentionAlert && (
        <div className="p-3 px-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wide">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>⚠ {attentionAlertMsg || "PLEASE LOOK TOWARDS THE SCREEN"}</span>
          </div>
          <span className="text-[10px] font-mono text-rose-300/80 hidden sm:inline">
            Visual Presence Feedback
          </span>
        </div>
      )}

      {/* Top Session Progress Bar */}
      <GlassCard className="p-4 border-white/10" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="cyber" size="sm" className="font-mono text-xs">
              QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono uppercase">
              {config.roleId.replace(/_/g, " ")} • {config.difficulty}
            </span>
          </div>

          {/* Question Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const isDone = i < currentQuestionIndex;
              const isCurrent = i === currentQuestionIndex;
              return (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      : isDone
                      ? "w-4 bg-emerald-400"
                      : "w-2 bg-white/20"
                  }`}
                  title={`Question ${i + 1}`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleConcludeEarly}
              className="text-xs font-mono text-muted-foreground hover:text-rose-400"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
            >
              End Session Early
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Main Grid: Left Column (Interviewer + Live Question + Attention Monitor), Right Column (Candidate Workbench) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interviewer Avatar, Attention Monitor & Question Box (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interviewer Persona Card */}
          <InterviewerAvatarCard
            persona={interviewer}
            currentQuestionText={
              config.language === "hi" && currentQuestion.questionTextHi
                ? currentQuestion.questionTextHi
                : config.language === "hinglish" && currentQuestion.questionTextHinglish
                ? currentQuestion.questionTextHinglish
                : currentQuestion.questionText
            }
            language={config.language}
            status={voiceState}
            onStatusChange={setVoiceState}
          />

          {/* Real-time AI Attention & Presence Monitor */}
          <AttentionMonitor
            onAlertChange={(alertActive, msg) => {
              setIsAttentionAlert(alertActive);
              setAttentionAlertMsg(msg);
            }}
            onSummaryReady={(summary) => {
              setAttentionSummary(summary);
            }}
          />

          {/* Active Question Prompt Card */}
          <SlideUp key={currentQuestion.id}>
            <GlassCard className="p-6 space-y-4 border-cyan-500/20 shadow-xl" glow>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  {currentQuestion.category.replace(/_/g, " ")}
                </span>
                {currentQuestion.isFollowUp && (
                  <Badge variant="violet" size="sm" className="font-mono text-[10px]">
                    ✨ CONTEXTUAL FOLLOW-UP
                  </Badge>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                {config.language === "hi" && currentQuestion.questionTextHi
                  ? currentQuestion.questionTextHi
                  : config.language === "hinglish" && currentQuestion.questionTextHinglish
                  ? currentQuestion.questionTextHinglish
                  : currentQuestion.questionText}
              </h3>

              {/* Context Hint Accordion */}
              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-muted-foreground hover:text-cyan-300 flex items-center gap-1.5 font-mono transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{showHint ? "Hide Architectural Hint" : "Need an Architectural Hint?"}</span>
                </button>

                {showHint && (
                  <FadeIn>
                    <p className="text-xs text-cyan-200/90 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/20 mt-2 italic leading-relaxed">
                      💡 {currentQuestion.contextHint}
                    </p>
                  </FadeIn>
                )}
              </div>
            </GlassCard>
          </SlideUp>
        </div>

        {/* Right Column: Candidate Response Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard className="p-6 space-y-4 border-white/10 flex flex-col justify-between min-h-[460px]" glow>
            <div className="space-y-4">
              {/* Terminal Header: Title + Timer + Exemplar loader */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground uppercase">
                  <span>Candidate Response Terminal</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Live Response Timer */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-foreground font-bold">{formatTimer(secondsElapsed)}</span>
                    <span className="text-[10px] text-muted-foreground">/ ~2m</span>
                  </div>

                  {/* Exemplar loader */}
                  <button
                    type="button"
                    onClick={handleLoadSampleAnswer}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Load Exemplar Answer
                  </button>
                </div>
              </div>

              {/* Textarea Input Box */}
              <textarea
                rows={9}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Structure your answer with: Analysis → Architectural Strategy → Trade-offs → Concurrency & Failure Recovery..."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none leading-relaxed resize-none font-mono"
              />

              {/* Word & Metrics Counter */}
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>
                  Word count: <strong className="text-cyan-300">{wordCount}</strong> words
                </span>
                <span>
                  {wordCount < 40 ? (
                    <span className="text-amber-400 text-[11px]">Tip: Aim for 60+ words for full depth</span>
                  ) : (
                    <span className="text-emerald-400 text-[11px]">✓ Good technical elaboration</span>
                  )}
                </span>
              </div>
            </div>

            {/* Bottom Actions Bar: Voice Dictate + Submit */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              {/* Voice Dictation Button */}
              <Button
                type="button"
                variant={isListening ? "glow" : "glass"}
                size="sm"
                onClick={toggleSpeechRecognition}
                leftIcon={
                  isListening ? (
                    <MicOff className="h-4 w-4 text-rose-400 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4 text-cyan-400" />
                  )
                }
                className="text-xs font-mono"
              >
                {isListening ? "Stop Voice Recording" : "Voice Dictation"}
              </Button>

              {/* Submit / Proceed CTA */}
              <Button
                type="button"
                variant="glow"
                size="default"
                onClick={handleSubmitAnswer}
                isLoading={isSubmitting}
                disabled={!answerText.trim() || isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="px-6 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)]"
              >
                {currentQuestionIndex + 1 >= totalQuestions
                  ? "Submit Final Answer & Finish →"
                  : "Submit Answer & Next Question →"}
              </Button>
            </div>
          </GlassCard>

          {/* Privacy & High-Stakes Simulation Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Contextual Multi-Turn Interview:</strong> Your answer will be evaluated across technical accuracy, communication, confidence, and pacing. Scores remain hidden until your final performance report is synthesized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
