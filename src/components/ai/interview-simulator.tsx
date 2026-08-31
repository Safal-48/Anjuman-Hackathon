"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VoiceWaveVisualizer, VoiceActivityState } from "@/components/ai/voice-wave-visualizer";
import {
  InterviewQuestion,
  InterviewEvaluationReport,
} from "@/lib/ai/interview-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

const ROLES = [
  { id: "ai_systems_engineer", label: "AI Systems & LLM Architect" },
  { id: "cloud_sre_architect", label: "Cloud Native SRE & Distributed Systems" },
  { id: "fullstack_architect", label: "Full-Stack Web & Systems Architect" },
];

export function InterviewSimulator() {
  const [selectedRoleId, setSelectedRoleId] = useState("ai_systems_engineer");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluationReport | null>(null);
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
        body: JSON.stringify({ roleId }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
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
      {/* Role Selection & Disclaimer Banner */}
      <GlassCard className="p-6 space-y-4 border-white/10" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">AI Mock Interview Simulator</h3>
              <p className="text-xs text-muted-foreground">
                Practice role-specific system design & technical trade-offs with multi-vector AI evaluation
              </p>
            </div>
          </div>

          {/* Role Picker */}
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-slate-900 px-3 text-xs font-semibold text-cyan-300 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Practice Notice */}
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Self-Improvement Simulator:</strong> This tool is intended for practicing your responses and identifying key concepts. It is not an automated hiring screen.
          </p>
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
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" size="sm">
                    QUESTION {activeQuestionIndex + 1} OF {questions.length}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    {activeQuestion.category.replace("_", " ")}
                  </span>
                </div>

                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveQuestionIndex(i);
                        setEvaluation(null);
                        setAnswerText("");
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeQuestionIndex === i
                          ? "w-6 bg-cyan-400"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
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
                  <span>{showHint ? "Hide Architectural Hint" : "Need a Hint?"}</span>
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
                  Your Technical Response
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
                placeholder="Structure your answer with: Problem Analysis → Architecture → Trade-offs → Quantifiable Impact..."
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
                    Evaluate Response
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Live Multi-Vector Feedback Report */}
          <div className="space-y-5">
            {!evaluation ? (
              <GlassCard className="h-full min-h-[380px] p-8 flex flex-col items-center justify-center text-center space-y-3 border-white/10" glow>
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Brain className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-base text-foreground">Awaiting Response Submission</h4>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  Type or voice dictate your answer, then click <strong>Evaluate Response</strong> to view your Technical, Communication, and Completeness breakdown.
                </p>
              </GlassCard>
            ) : (
              <SlideUp>
                <GlassCard className="p-6 space-y-5 border-emerald-500/30 shadow-2xl relative" glow>
                  {/* Score Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="emerald" size="sm">
                          AI PRACTICE REPORT
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {evaluation.roleTitle}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-foreground pt-1">
                        Evaluation Breakdown
                      </h3>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/60 border border-emerald-500/40 text-center">
                      <span className="font-mono text-[10px] text-muted-foreground block">
                        OVERALL SCORE
                      </span>
                      <span className="font-extrabold text-2xl font-mono text-emerald-400">
                        {evaluation.overallPracticeScore}%
                      </span>
                    </div>
                  </div>

                  {/* 4 Multi-Vector Metric Progress Bars */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Technical Relevance:</span>
                        <span className="font-bold text-cyan-400">
                          {evaluation.metricScores.technicalRelevance}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${evaluation.metricScores.technicalRelevance}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completeness:</span>
                        <span className="font-bold text-violet-400">
                          {evaluation.metricScores.completeness}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-400 rounded-full"
                          style={{ width: `${evaluation.metricScores.completeness}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Communication:</span>
                        <span className="font-bold text-emerald-400">
                          {evaluation.metricScores.communicationClarity}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${evaluation.metricScores.communicationClarity}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence Metric:</span>
                        <span className="font-bold text-amber-400">
                          {evaluation.metricScores.confidenceDelivery}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${evaluation.metricScores.confidenceDelivery}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Improvement Suggestions */}
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="space-y-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> What You Did Well:
                      </span>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Key Areas to Deepen:
                      </span>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {evaluation.areasForImprovement.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Keyword Coverage Tags */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      Domain Keyword Coverage ({evaluation.keywordCoverage.coveragePercentage}%)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluation.keywordCoverage.matchedKeywords.map((k) => (
                        <span
                          key={k}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        >
                          ✓ {k}
                        </span>
                      ))}
                      {evaluation.keywordCoverage.missingKeywords.map((k) => (
                        <span
                          key={k}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        >
                          ✗ {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Next Question CTA */}
                  {activeQuestionIndex < questions.length - 1 && (
                    <Button
                      variant="glow"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setActiveQuestionIndex(activeQuestionIndex + 1);
                        setEvaluation(null);
                        setAnswerText("");
                      }}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Next Question: {questions[activeQuestionIndex + 1].category.replace("_", " ")}
                    </Button>
                  )}
                </GlassCard>
              </SlideUp>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
