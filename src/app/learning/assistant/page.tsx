"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  BookOpen,
  Clock,
  Languages,
  CheckCircle2,
  HelpCircle,
  History,
  Radio,
  Dna,
  Layers,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoachChatWorkbench } from "@/components/ai/coach/coach-chat-workbench";
import { CoachContextSidebar } from "@/components/ai/coach/coach-context-sidebar";
import {
  StudentCareerContext,
  DEFAULT_STUDENT_CAREER_CONTEXT,
} from "@/lib/ai/career-coach-engine";
import { FadeIn } from "@/components/animations/motion-wrapper";

const LEARNING_PROMPT_PRESETS = [
  { label: "What should I learn today?", icon: Target, category: "Daily Plan" },
  { label: "Why am I weak in SQL?", icon: HelpCircle, category: "Diagnostic Audit" },
  { label: "Give me a 30-minute study plan.", icon: Clock, category: "Time-Boxed" },
  { label: "Explain JOINs in Hinglish.", icon: Languages, category: "Multilingual AI" },
  { label: "Give me practice questions.", icon: BookOpen, category: "Practice Probe" },
  { label: "What should I learn before Power BI?", icon: Layers, category: "Prerequisites" },
  { label: "I only have 20 minutes today.", icon: Zap, category: "Express Session" },
];

export default function LearningAssistantPage() {
  const [context, setContext] = useState<StudentCareerContext>(DEFAULT_STUDENT_CAREER_CONTEXT);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContext() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/ai/coach");
        if (res.ok) {
          const data = await res.json();
          setContext(data.context || DEFAULT_STUDENT_CAREER_CONTEXT);
        }
      } catch (err) {
        console.error("Failed to load context:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadContext();
  }, []);

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="min-h-screen py-8 md:py-10 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-6 max-w-7xl">
        {/* Header Banner */}
        <FadeIn>
          <GlassCard className="p-6 border-cyan-500/30 bg-slate-900/60 relative overflow-hidden" glow>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Brain className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      AI Personalized Learning Assistant
                    </h1>
                    <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                      Context-Grounded Tutor
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                    Your 24/7 AI tutor initialized with your live <strong>Skill DNA</strong>, diagnostic test telemetry, recurring error patterns, and available learning time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/skills">
                  <Button variant="outline" size="sm" className="text-xs font-mono border-white/10 hover:border-cyan-500/30">
                    <Dna className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
                    Live Skill DNA
                  </Button>
                </Link>
                <Link href="/assessment">
                  <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                    <span>Take Diagnostic Test</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Quick-Prompt Chips Bar */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Quick Learning Prompts (Grounded in Your Telemetry):
          </span>
          <div className="flex flex-wrap gap-2">
            {LEARNING_PROMPT_PRESETS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(item.label)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5 group shadow-sm hover:shadow-glow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Chat Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <CoachChatWorkbench
              context={context}
              externalTriggerPrompt={selectedPrompt}
              onClearTriggerPrompt={() => setSelectedPrompt(null)}
            />
          </div>

          <div className="lg:col-span-4">
            <CoachContextSidebar context={context} onSelectPrompt={handleSelectPrompt} />
          </div>
        </div>
      </Container>
    </div>
  );
}
