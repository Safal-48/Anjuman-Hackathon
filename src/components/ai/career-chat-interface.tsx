"use client";

import React, { useState, useRef, useEffect } from "react";
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

export function CareerChatInterface({ report, onSendMessage }: CareerChatInterfaceProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `Hello **${report.userId === "usr-demo-student-01" ? "Aarav" : "Candidate"}**! I am your **AI Career Intelligence Copilot**.\n\nI have loaded your live assessment records for **${report.targetRole.title}** (Readiness: **${report.overallReadinessScore}%**).\n\nAsk me how to bridge your priority skill gaps, architect high-impact projects, or accelerate your placement readiness!`,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isThinking) return;

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

          {/* Context Metric Cards */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground">Active Target Role</span>
              <p className="font-bold text-foreground text-xs leading-tight">{report.targetRole.title}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-muted-foreground">Readiness Index</span>
              <span className="font-mono font-bold text-cyan-400">{report.overallReadinessScore}%</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground">Primary Superpower</span>
              <p className="font-semibold text-emerald-400 text-xs">
                {report.strongSkills[0]?.skillName || "Web Systems"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground">Priority Gap Focus</span>
              <p className="font-semibold text-amber-400 text-xs">
                {report.skillGaps[0]?.skillName || "Distributed Architecture"}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Main Chat Interface */}
      <div className="lg:col-span-3 space-y-4">
        <GlassCard className="h-[600px] flex flex-col justify-between p-4 sm:p-6 border-white/10 relative overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 cyber-scrollbar">
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
            <input
              type="text"
              placeholder="Ask contextual questions on your skills, roadmap, or target role..."
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
