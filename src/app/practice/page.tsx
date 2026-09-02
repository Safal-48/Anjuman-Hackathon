"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Bot,
  Brain,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Terminal,
  Clock,
  Play,
  Flame,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/motion-wrapper";

export default function PracticeHubPage() {
  const practiceModules = [
    {
      title: "AI Mock Technical Interview",
      desc: "Live voice & text oral exam with real-time technical depth evaluation, follow-up questioning, and 4-vector scoring.",
      href: "/mock-interview",
      badge: "Voice & Text AI",
      icon: Sparkles,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      cta: "Launch Interview Simulator",
    },
    {
      title: "AI Group Discussion Roundtable",
      desc: "Simulate live collaborative group discussions with 5 distinct AI peer personas, turn-taking metrics, and consensus scoring.",
      href: "/group-discussion",
      badge: "Multi-Agent Simulation",
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      cta: "Enter GD Arena",
    },
    {
      title: "Socratic AI Learning Assistant",
      desc: "Interactive concept exploration with Nexora AI Tutor. Ask targeted questions, inspect analogies, and debug misconceptions.",
      href: "/career-coach",
      badge: "Grounded AI Tutor",
      icon: Bot,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
      cta: "Open Socratic Tutor",
    },
    {
      title: "Concept Mastery Diagnostic Probe",
      desc: "Fast, focused 4-dimension diagnostic quizzes to evaluate retention, aptitudes, and calculate precise skill deficits.",
      href: "/assessment",
      badge: "Diagnostic Probe",
      icon: Brain,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      cta: "Start Diagnostic Quiz",
    },
  ];

  return (
    <div className="min-h-screen py-10 bg-slate-950/40">
      <Container size="xl">
        <FadeIn>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Multi-Modal Practice & Oral Defense Hub
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Practice Arena</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Test and reinforce your knowledge through real-time AI oral defenses, multi-agent discussions, diagnostic probes, and Socratic tutoring.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/learning/resources">
                <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:border-cyan-500/30">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  Study Resources
                </Button>
              </Link>
            </div>
          </div>

          {/* Module Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <GlassCard
                  key={idx}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-slate-900/40 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`p-3 rounded-xl border ${mod.color} group-hover:scale-105 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                        {mod.badge}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-amber-400" />
                      Instant Telemetry Feedback
                    </span>

                    <Link href={mod.href}>
                      <Button variant="cyber" size="sm" className="text-xs gap-1.5">
                        {mod.cta} <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
