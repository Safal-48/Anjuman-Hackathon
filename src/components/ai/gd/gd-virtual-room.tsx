"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Clock,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Hand,
  RotateCcw,
  Loader2,
  Radio,
  Play,
  Pause,
  Award,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GDParticipantAvatar } from "./gd-participant-avatar";
import {
  GDConfig,
  GDTopic,
  GDParticipantPersona,
  GDMessage,
  GDTurnEvaluation,
} from "@/lib/ai/gd-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

interface GDVirtualRoomProps {
  config: GDConfig;
  topic: GDTopic;
  participants: GDParticipantPersona[];
  initialMessages: GDMessage[];
  sessionId: string;
  onCompleteGD: (
    allMessages: GDMessage[],
    studentEvaluations: GDTurnEvaluation[]
  ) => void;
  onCancelGD: () => void;
}

export function GDVirtualRoom({
  config,
  topic,
  participants,
  initialMessages,
  sessionId,
  onCompleteGD,
  onCancelGD,
}: GDVirtualRoomProps) {
  const [messages, setMessages] = useState<GDMessage[]>(initialMessages);
  const [studentInput, setStudentInput] = useState("");
  const [evaluations, setEvaluations] = useState<GDTurnEvaluation[]>([]);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [ttsMuted, setTtsMuted] = useState(false);

  // Timer State (in seconds)
  const totalAllocatedSeconds = config.durationMinutes * 60;
  const [elapsedSeconds, setElapsedSeconds] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Speech Recognition (Voice Input)
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat stream to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessingTurn]);

  // Elapsed Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= totalAllocatedSeconds) {
          setIsTimerRunning(false);
          return totalAllocatedSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, totalAllocatedSeconds]);

  // Speech Synthesis helper
  const speakText = (text: string, persona?: GDParticipantPersona) => {
    if (ttsMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (persona) {
        utterance.pitch = persona.voicePitch;
        utterance.rate = persona.voiceRate;
      }
      if (config.language === "hi") {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-US";
      }

      utterance.onstart = () => {
        if (persona) setActiveSpeakerId(persona.id);
      };
      utterance.onend = () => {
        setActiveSpeakerId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS playback warning:", e);
    }
  };

  // Speak the latest AI message if not student
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.speakerId !== "student") {
      const persona = participants.find((p) => p.id === lastMsg.speakerId);
      setActiveSpeakerId(lastMsg.speakerId);
      speakText(lastMsg.text, persona);
    }
  }, [messages.length]);

  // Speech-to-Text Setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = config.language === "hi" ? "hi-IN" : "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setStudentInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognitionRef.current.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsDictating(false);
      };

      recognitionRef.current.onend = () => {
        setIsDictating(false);
      };
    }
  }, [config.language]);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }

    if (isDictating) {
      recognitionRef.current.stop();
      setIsDictating(false);
    } else {
      setIsDictating(true);
      recognitionRef.current.start();
    }
  };

  // Handle Candidate Submitting their Speech Turn
  const handleSendContribution = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentInput.trim() || isProcessingTurn) return;

    if (isDictating && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsDictating(false);
    }

    const cleanText = studentInput.trim();
    const studentMsg: GDMessage = {
      id: `msg_${messages.length + 1}_${Date.now()}`,
      speakerId: "student",
      speakerName: "You (Candidate)",
      text: cleanText,
      timestampSeconds: elapsedSeconds,
      sentiment: "supporting",
    };

    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);
    setStudentInput("");
    setIsProcessingTurn(true);
    setActiveSpeakerId("student");

    try {
      const res = await fetch("/api/ai/gd/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          topic,
          participants,
          allMessages: updatedMessages,
          studentText: cleanText,
          currentElapsedSeconds: elapsedSeconds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process GD response");
      }

      const data = await res.json();
      setEvaluations((prev) => [...prev, data.studentEvaluation]);

      // Add AI participants' responses sequentially
      if (data.nextAIMessages && data.nextAIMessages.length > 0) {
        setTimeout(() => {
          setMessages((prev) => [...prev, ...data.nextAIMessages]);
          setIsProcessingTurn(false);
        }, 1200);
      } else {
        setIsProcessingTurn(false);
      }
    } catch (err) {
      console.error("GD Turn Error:", err);
      setIsProcessingTurn(false);
    }
  };

  const handleLoadExemplar = () => {
    setStudentInput(
      "Building on the points raised by Arjun and Priya, we cannot look at this merely as a cost reduction equation. While AI models handle routine boilerplate syntax, the primary responsibility of entry-level engineers shifts toward system telemetry, verification of edge-case test boundaries, and latency optimization. Therefore, institutions must align with practical portfolio evidence rather than rote syntax memorization."
    );
  };

  const handleFinishDiscussion = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    onCompleteGD(messages, evaluations);
  };

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const remainingSeconds = Math.max(totalAllocatedSeconds - elapsedSeconds, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Status & Timer Bar */}
      <GlassCard className="p-4 sm:p-5 border-cyan-500/30 shadow-xl" glow>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Topic Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                {topic.categoryLabel}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground uppercase">
                {config.difficulty.replace(/_/g, " ")} Tier
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {topic.title}
            </h3>
          </div>

          {/* Controls: Timer, Mute & Finish */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>
                Remaining: <strong className="text-cyan-300">{formatSeconds(remainingSeconds)}</strong>
              </span>
            </div>

            {/* Mute TTS Audio */}
            <button
              type="button"
              onClick={() => {
                if (!ttsMuted && typeof window !== "undefined") window.speechSynthesis.cancel();
                setTtsMuted(!ttsMuted);
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"
              title={ttsMuted ? "Unmute AI voices" : "Mute AI voices"}
            >
              {ttsMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
            </button>

            {/* Conclude Action */}
            <Button
              type="button"
              variant="glow"
              size="sm"
              onClick={handleFinishDiscussion}
              className="text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]"
            >
              Conclude & View Audit →
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Main Roundtable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Participants Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
              Discussion Table ({participants.length} AI Peers)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Room
            </span>
          </div>

          <div className="space-y-3">
            {participants.map((p) => (
              <GDParticipantAvatar
                key={p.id}
                participant={p}
                isSpeaking={activeSpeakerId === p.id}
                isAddressed={messages[messages.length - 1]?.addressedTo === "student" && messages[messages.length - 1]?.speakerId === p.id}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Live Transcript Stream & Candidate Interaction Box (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Transcript Feed Box */}
          <GlassCard className="p-4 sm:p-5 border-white/10 flex-1 min-h-[380px] max-h-[440px] flex flex-col justify-between overflow-hidden" glow>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3 text-xs font-mono">
              <span className="text-muted-foreground">Live Discussion Transcript</span>
              <span className="text-cyan-400">{messages.length} Contributions Recorded</span>
            </div>

            {/* Scrollable Message List */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg) => {
                const isStudent = msg.speakerId === "student";
                const isMod = msg.speakerId === "moderator";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1 ${
                      isStudent ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`font-bold ${isStudent ? "text-cyan-300" : isMod ? "text-amber-300" : "text-foreground"}`}>
                        {msg.speakerName}
                      </span>
                      {msg.speakerStyle && (
                        <span className="text-[10px] text-muted-foreground">({msg.speakerStyle})</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{formatSeconds(msg.timestampSeconds)}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] text-xs leading-relaxed font-mono ${
                        isStudent
                          ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-sm"
                          : isMod
                          ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                          : msg.sentiment === "challenging"
                          ? "bg-rose-950/40 text-rose-200 border border-rose-500/30 rounded-tl-sm"
                          : "bg-slate-900/90 text-foreground/90 border border-white/10 rounded-tl-sm"
                      }`}
                    >
                      {msg.sentiment === "challenging" && (
                        <span className="text-[9px] font-bold text-rose-400 uppercase block mb-1">
                          ⚡ Counter-Argument Raised
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isProcessingTurn && (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI peers are analyzing your argument and synthesizing counter-points...</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Candidate Speech Workbench */}
          <GlassCard className="p-4 sm:p-5 border-cyan-500/30 space-y-3" glow>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase">
                  Your Turn / Contribution
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  ({studentInput.split(/\s+/).filter(Boolean).length} words)
                </span>
              </div>

              <button
                type="button"
                onClick={handleLoadExemplar}
                className="text-[11px] font-mono text-cyan-400 hover:underline"
              >
                + Load Exemplar Contribution
              </button>
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendContribution} className="space-y-3">
              <textarea
                rows={3}
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="State your viewpoint, reference frameworks, or address Priya/Arjun's points directly..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono resize-none leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Voice Dictation Button */}
                <Button
                  type="button"
                  variant={isDictating ? "glow" : "glass"}
                  size="sm"
                  onClick={toggleDictation}
                  leftIcon={isDictating ? <Mic className="h-3.5 w-3.5 animate-pulse text-rose-400" /> : <Mic className="h-3.5 w-3.5" />}
                  className="text-xs font-mono"
                >
                  {isDictating ? "Listening... (Click to Stop)" : "Voice Dictate"}
                </Button>

                {/* Submit Contribution */}
                <Button
                  type="submit"
                  variant="glow"
                  size="sm"
                  disabled={!studentInput.trim() || isProcessingTurn}
                  rightIcon={<Send className="h-3.5 w-3.5" />}
                  className="font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] px-6"
                >
                  Speak & Enter Discussion →
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
