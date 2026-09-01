"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Brain,
  FileText,
  Sparkles,
  Users,
  Layers,
  Compass,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Award,
  HelpCircle,
  Clock,
  Radio,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CoachContextSidebar } from "@/components/ai/coach/coach-context-sidebar";
import { CoachChatWorkbench } from "@/components/ai/coach/coach-chat-workbench";
import {
  StudentCareerContext,
  DEFAULT_STUDENT_CAREER_CONTEXT,
} from "@/lib/ai/career-coach-engine";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function DedicatedCareerCoachPage() {
  const [context, setContext] = useState<StudentCareerContext>(DEFAULT_STUDENT_CAREER_CONTEXT);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCoachContext() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/ai/coach");
        if (res.ok) {
          const data = await res.json();
          setContext(data.context || DEFAULT_STUDENT_CAREER_CONTEXT);
        }
      } catch (err) {
        console.error("Failed to load coach context:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCoachContext();
  }, []);

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-8 max-w-7xl">
        {/* Top Header & Breadcrumb */}
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
                  KaushalSetu AI Intelligence Core
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-cyan-400" />
                <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                  DEDICATED ADVISORY STUDIO
                </Badge>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                AI Career Coach & Strategic Advisor
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-muted-foreground">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Context: <strong>{context.targetRole}</strong></span>
            </div>

            <Link href="/career-readiness">
              <Button variant="glass" size="sm" className="text-xs font-mono">
                Readiness Scorecard
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Advisory Banner */}
        <SlideUp>
          <GlassCard className="p-6 border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-violet-950/30 shadow-xl relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                    DATA-GROUNDED ADVISOR
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-emerald-400">Telemetry Synchronized</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Personalized, Evidence-Backed Career Decisions
                </h2>
                <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                  Your AI Career Coach analyzes your verified skills, ATS resume parsing, mock interview latency, group discussion transcripts, and target job matrices to deliver explainable answers.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/skills">
                  <Button variant="glass" size="sm" className="text-xs font-mono">
                    Skill Labs
                  </Button>
                </Link>
                <Link href="/resume-analyzer">
                  <Button variant="glass" size="sm" className="text-xs font-mono">
                    Resume ATS
                  </Button>
                </Link>
                <Link href="/mock-interview">
                  <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                    Mock Interview
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </SlideUp>

        {/* Main 2-Column Dedicated Studio Layout */}
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (4 cols): Telemetry Sidebar & Quick Inquiry Prompts */}
            <div className="lg:col-span-4">
              <CoachContextSidebar
                context={context}
                onSelectPrompt={handleSelectPrompt}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column (8 cols): Interactive Conversational Workbench */}
            <div className="lg:col-span-8">
              <CoachChatWorkbench
                context={context}
                externalTriggerPrompt={selectedPrompt}
                onClearTriggerPrompt={() => setSelectedPrompt(null)}
              />
            </div>
          </div>
        </FadeIn>

        {/* Footer Module Links */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>KaushalSetu Conversational Career Intelligence Suite • Powered by Verified Evidence</p>
          <div className="flex items-center gap-3">
            <Link href="/portfolio" className="hover:text-cyan-400">Portfolio</Link>
            <span>•</span>
            <Link href="/group-discussion" className="hover:text-cyan-400">GD Simulator</Link>
            <span>•</span>
            <Link href="/opportunities" className="hover:text-cyan-400">Opportunities</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
