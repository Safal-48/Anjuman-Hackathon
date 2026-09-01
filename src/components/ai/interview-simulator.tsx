"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Loader2,
  HelpCircle,
  Code2,
  FileCheck2,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VoiceWaveVisualizer, VoiceActivityState } from "@/components/ai/voice-wave-visualizer";
import {
  InterviewQuestion,
  SingleQuestionEvaluation,
  AVAILABLE_ROLES,
} from "@/lib/ai/interview-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export function InterviewSimulator() {
  const [selectedRoleId, setSelectedRoleId] = useState("ai_systems_engineer");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SingleQuestionEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Voice Dictation State
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceActivityState>("idle");

  const loadQuestions = useCallback(async (roleId: string) => {
    setIsGenerating(true);
    setEvaluation(null);
    setAnswerText("");
    try {
      const res = await fetch("/api/ai/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, totalQuestions: 3 }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.initialQuestion ? [data.initialQuestion] : []);
        setActiveQuestionIndex(0);
      }
    } catch (err) {
      console.error("Failed to load interview questions:", err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions(selectedRoleId);
  }, [selectedRoleId, loadQuestions]);

  const activeQuestion = questions[activeQuestionIndex];

  // Speech Recognition Hook (Clean Browser Fallback)
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your answer directly into the editor.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      setVoiceState("idle");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceState("listening");
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setAnswerText(currentTranscript.trim());
      };

      recognition.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
        setVoiceState("idle");
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceState("idle");
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setVoiceState("idle");
    }
  };

  const handleEvaluateAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeQuestion || !answerText.trim()) return;

    setIsEvaluating(true);
    setVoiceState("processing");
    try {
      const res = await fetch("/api/ai/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          answerText,
          responseTimeSeconds: 60,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluation(data.evaluation);
        setVoiceState("idle");
      }
    } catch (err) {
      console.error("Failed to evaluate answer:", err);
      setVoiceState("idle");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleLoadSampleAnswer = () => {
    if (selectedRoleId === "ai_systems_engineer") {
      setAnswerText(
        "To achieve sub-40ms p99 latency for 70B parameter models, I would engineer a distributed TensorRT-LLM serving cluster with vLLM PagedAttention to eliminate memory fragmentation. Specifically, I would employ Tensor Parallelism across 4 Hopper GPUs connected via high-bandwidth NVLink to minimize all-reduce latency, combined with dynamic request batching. For GPU memory protection, I would configure chunked prefill to prevent Out-Of-Memory spikes and maintain a dedicated swap space for KV cache offloading."
      );
    } else {
      setAnswerText(
        "In our production architecture, we implemented active-active Kubernetes clusters across two geographical regions with synchronous Raft state replication. We mitigated cascading failures using exponential backoff with jitter and automated Istio circuit breakers, ensuring zero data loss (RPO=0) during region isolation."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner with Dedicated Module CTA */}
      <GlassCard className="p-6 space-y-4 border-cyan-500/20" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground">AI Mock Interview Mini Simulator</h3>
                <Badge variant="cyber" size="sm">QUICK DRILL</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Practice single question response evaluations or launch the full-featured multi-turn studio.
              </p>
            </div>
          </div>

          <Link href="/mock-interview">
            <Button
              variant="glow"
              size="sm"
              className="text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Open Full Interview Studio →
            </Button>
          </Link>
        </div>

        {/* Role Selector & Practice Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">Role:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="h-8 rounded-xl border border-white/10 bg-slate-900 px-3 text-xs font-semibold text-cyan-300 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {AVAILABLE_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>Practice mode • Deterministic multi-vector telemetry evaluation</span>
          </div>
        </div>
      </GlassCard>

      {/* Main Question & Answer Workbench */}
      {isGenerating || !activeQuestion ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Question & Answer Input */}
          <div className="space-y-5">
            {/* Question Card */}
            <GlassCard className="p-6 space-y-4 border-white/10" glow>
              <div className="flex items-center justify-between">
                <Badge variant="cyber" size="sm">
                  SAMPLE PROMPT
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  {activeQuestion.category.replace(/_/g, " ")}
                </span>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-foreground leading-snug">
                {activeQuestion.questionText}
              </h3>

              {/* Context Hint Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-muted-foreground hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{showHint ? "Hide Architectural Hint" : "Need an Architectural Hint?"}</span>
                </button>
                {showHint && (
                  <p className="text-xs text-muted-foreground bg-black/40 p-3 rounded-xl border border-white/5 mt-2 italic leading-relaxed">
                    💡 {activeQuestion.contextHint}
                  </p>
                )}
              </div>
            </GlassCard>

            {/* Answer Input & Voice Recorder */}
            <GlassCard className="p-6 space-y-4 border-white/10" glow>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                  Your Response
                </span>
                <button
                  type="button"
                  onClick={handleLoadSampleAnswer}
                  className="text-[11px] font-mono text-cyan-400 hover:underline"
                >
                  Load Exemplar Answer
                </button>
              </div>

              <textarea
                rows={6}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Structure your answer with: Analysis → Architecture → Trade-offs → Quantifiable Impact..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-cyan-500 outline-none leading-relaxed"
              />

              <div className="space-y-3">
                <VoiceWaveVisualizer state={voiceState} />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={isListening ? "glow" : "glass"}
                      size="sm"
                      onClick={toggleSpeechRecognition}
                      leftIcon={
                        isListening ? (
                          <MicOff className="h-4 w-4 text-rose-400" />
                        ) : (
                          <Mic className="h-4 w-4 text-cyan-400" />
                        )
                      }
                    >
                      {isListening ? "Stop Dictation" : "Voice Dictate"}
                    </Button>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {answerText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => handleEvaluateAnswer()}
                    isLoading={isEvaluating}
                    disabled={!answerText.trim()}
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Evaluate Single Response
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Mini Feedback */}
          <div className="space-y-5">
            {!evaluation ? (
              <GlassCard className="h-full min-h-[380px] p-8 flex flex-col items-center justify-center text-center space-y-4 border-white/10" glow>
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Brain className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-base text-foreground">Awaiting Response Submission</h4>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  Type or voice dictate your answer, then click <strong>Evaluate Single Response</strong>.
                </p>
                <Link href="/mock-interview">
                  <Button variant="cyber" size="sm" className="text-xs font-mono">
                    Start Multi-Turn Interview Instead →
                  </Button>
                </Link>
              </GlassCard>
            ) : (
              <SlideUp>
                <GlassCard className="p-6 space-y-5 border-emerald-500/30 shadow-2xl relative" glow>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                    <div>
                      <Badge variant="emerald" size="sm">
                        DRILL EVALUATION
                      </Badge>
                      <h3 className="font-extrabold text-xl text-foreground pt-1">
                        Score: {evaluation.scores.overall}%
                      </h3>
                    </div>

                    <Link href="/mock-interview">
                      <Button variant="glow" size="sm" className="text-xs font-mono">
                        Launch Full Studio →
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-muted-foreground text-[10px]">Technical Knowledge:</span>
                      <div className="font-bold text-cyan-400">{evaluation.scores.technicalKnowledge}%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-muted-foreground text-[10px]">Relevance:</span>
                      <div className="font-bold text-emerald-400">{evaluation.scores.relevance}%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-muted-foreground text-[10px]">Communication:</span>
                      <div className="font-bold text-violet-400">{evaluation.scores.communication}%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-muted-foreground text-[10px]">Confidence Metric:</span>
                      <div className="font-bold text-amber-400">{evaluation.scores.confidenceIndicators}%</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Strengths:
                    </span>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-xs pt-1">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Improvement Tip:
                    </span>
                    <p className="text-muted-foreground">{evaluation.improvementTip}</p>
                  </div>
                </GlassCard>
              </SlideUp>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
