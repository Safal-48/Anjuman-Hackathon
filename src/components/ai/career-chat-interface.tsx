"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Target,
  Zap,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIOrb } from "@/components/ai/ai-orb";
import { AIChatMessage } from "@/lib/ai/ai-service";
import { SkillIntelligenceReport } from "@/lib/supabase/types";
import { motion, AnimatePresence } from "framer-motion";

interface CareerChatInterfaceProps {
  report: SkillIntelligenceReport;
  onSendMessage: (message: string) => Promise<{ reply: string; suggestedPrompts?: string[]; contextBadges?: string[] }>;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export function CareerChatInterface({ report, onSendMessage }: CareerChatInterfaceProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `Hello **${report.userId === "usr-demo-student-01" ? "Aarav" : "Candidate"}**! I am your **AI Career Intelligence Copilot**.\n\nI have loaded your live assessment records for **${report.targetRole.title}** (Readiness: **${report.overallReadinessScore}%**).\n\n🎙️ **Voice Command Enabled!** Speak via mic or type your questions on how to bridge your priority skill gaps, architect high-impact projects, or accelerate placement readiness!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedPrompts: [
        "What skill should I focus on next?",
        `How ready am I for ${report.targetRole.title}?`,
        "What portfolio project will boost my hireability?",
      ],
      contextBadges: [`Target: ${report.targetRole.title}`, `Readiness: ${report.overallReadinessScore}%`],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechConstructor =
        (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => ISpeechRecognition }).webkitSpeechRecognition;

      if (SpeechConstructor) {
        const recognition = new SpeechConstructor();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInputPrompt(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isThinking) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsThinking(true);

    try {
      const data = await onSendMessage(query.trim());
      const botMessage: AIChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPrompts: data.suggestedPrompts || [],
        contextBadges: data.contextBadges || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsThinking(false);
    }
  };

  const latestPrompts = messages[messages.length - 1]?.suggestedPrompts || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Telemetry Context Drawer */}
      <div className="space-y-4 lg:col-span-1">
        <GlassCard className="p-5 space-y-4 border-cyan-500/20" glow>
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
            <AIOrb status={isThinking ? "thinking" : "idle"} size="sm" />
            <div>
              <h3 className="font-bold text-sm text-foreground">AI Intelligence Core</h3>
              <p className="text-[11px] text-muted-foreground">Calibrated with Live Telemetry</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
              <span className="text-muted-foreground">Target Role</span>
              <span className="font-semibold text-cyan-400 font-mono text-right">{report.targetRole.title}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
              <span className="text-muted-foreground">Career Readiness</span>
              <span className="font-bold text-emerald-400 font-mono">{report.overallReadinessScore}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
              <span className="text-muted-foreground">Primary Skill Gap</span>
              <span className="font-medium text-amber-400 text-right">{report.skillGaps[0]?.skillName || "Edge Inference"}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] text-muted-foreground font-semibold block mb-2">Available Actions</span>
            <div className="space-y-1.5">
              <Button
                variant="glass"
                size="sm"
                className="w-full justify-start text-xs text-muted-foreground hover:text-cyan-300"
                onClick={() => handleSend("Generate a personalized study roadmap for my missing skills")}
                leftIcon={<BookOpen className="h-3.5 w-3.5 text-cyan-400" />}
              >
                Request Study Plan
              </Button>
              <Button
                variant="glass"
                size="sm"
                className="w-full justify-start text-xs text-muted-foreground hover:text-emerald-300"
                onClick={() => handleSend("What are the top 3 interview questions I should prepare for?")}
                leftIcon={<Zap className="h-3.5 w-3.5 text-emerald-400" />}
              >
                Simulate Interview Questions
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Conversation Window */}
      <div className="lg:col-span-3">
        <GlassCard className="p-6 h-[640px] flex flex-col justify-between border-white/10" glow>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-sm" />
              <span className="text-xs font-mono text-muted-foreground">COPILOT CONVERSATION STREAM</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-muted-foreground hover:text-foreground"
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset Chat
            </Button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 cyber-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      isUser
                        ? "bg-cyan-500 text-slate-950 font-mono shadow-glow-sm"
                        : "bg-gradient-to-br from-violet-600 to-cyan-600 text-white"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed space-y-2 ${
                      isUser
                        ? "bg-cyan-500/15 border border-cyan-500/30 text-foreground"
                        : "bg-white/[0.03] border border-white/10 text-foreground/90 shadow-glass"
                    }`}
                  >
                    {/* Message Text with markdown line breaks */}
                    <div className="prose prose-invert prose-sm max-w-none space-y-2 whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Context Badges */}
                    {msg.contextBadges && msg.contextBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                        {msg.contextBadges.map((badge) => (
                          <span
                            key={badge}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-cyan-300 border border-cyan-500/20"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-muted-foreground/60 block text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Thinking Indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-xs text-cyan-300 font-mono pl-2"
              >
                <AIOrb status="thinking" size="sm" />
                <span className="animate-pulse">Synthesizing candidate telemetry & role gap rubrics...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Bar */}
          {latestPrompts.length > 0 && !isThinking && (
            <div className="py-2 flex flex-wrap gap-2 border-t border-white/[0.06]">
              {latestPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all flex items-center gap-1.5 group cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Prompt Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2 border-t border-white/[0.08]"
          >
            <Button
              type="button"
              variant={isListening ? "destructive" : "glass"}
              size="icon"
              className={`h-11 w-11 shrink-0 rounded-xl transition-all ${
                isListening
                  ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse"
                  : "border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20"
              }`}
              onClick={toggleListening}
              title={isListening ? "Stop Listening" : "Voice Command (Speak Query)"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <input
              type="text"
              placeholder={isListening ? "Listening... Speak your question now..." : "Ask contextual questions or speak via mic..."}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isThinking}
              className="flex-1 h-11 rounded-xl border border-white/10 bg-slate-900/90 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
            <Button
              type="submit"
              variant="glow"
              size="sm"
              disabled={isThinking || !inputPrompt.trim()}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
