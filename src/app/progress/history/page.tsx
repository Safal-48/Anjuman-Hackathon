"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { RecurringMistakeDecayMonitor } from "@/components/progress/recurring-mistake-decay-monitor";

interface HistoryEntry {
  id: string;
  type: "Assessment" | "Resource Intervention" | "AI Oral Drill" | "Cryptographic Proof";
  title: string;
  timestamp: string;
  deltaImpact: string;
  details: string;
  badge: string;
}

const HISTORY_ENTRIES: HistoryEntry[] = [
  {
    id: "hist-1",
    type: "Assessment",
    title: "Diagnostic Reassessment: Distributed Systems & Consensus",
    timestamp: "Today, 08:30 AM",
    deltaImpact: "+14% Score Gain",
    details: "Score improved from 58% to 72% after completing the Raft consensus deep-dive intervention.",
    badge: "Score: 72%",
  },
  {
    id: "hist-2",
    type: "Resource Intervention",
    title: "Completed: TensorRT Model Optimization Sandbox",
    timestamp: "Yesterday, 04:15 PM",
    deltaImpact: "+8% Target Readiness",
    details: "Solved inference batching and INT8 quantization hands-on challenge with zero memory leaks.",
    badge: "100% Passed",
  },
  {
    id: "hist-3",
    type: "AI Oral Drill",
    title: "AI Mock Drill: SRE Incident Response & Postmortem Defense",
    timestamp: "3 days ago",
    deltaImpact: "84/100 Technical Relevance",
    details: "Defended microservice cascading failure prevention strategies with Nexora AI Interviewer.",
    badge: "Rated: Strong",
  },
  {
    id: "hist-4",
    type: "Cryptographic Proof",
    title: "Earned Institutional Proof: TypeScript Strict Architecture",
    timestamp: "5 days ago",
    deltaImpact: "Verified Credential Minted",
    details: "Cryptographic hash TITAN-VERIF-9F8A stamped onto public digital portfolio ledger.",
    badge: "TITAN-VERIF-9F8A",
  },
];

export default function LearningHistoryPage() {
  return (
    <div className="min-h-screen py-10 bg-slate-950/40">
      <Container size="xl">
        <FadeIn>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
                <Clock className="h-3.5 w-3.5" />
                Auditable Educational Activity Ledger
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">History & Timeline</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                A chronological, transparent record of all assessments, resource completions, oral defense drills, and cryptographic mastery credentials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/portfolio">
                <Button variant="cyber" size="sm" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  View Verified Portfolio
                </Button>
              </Link>
            </div>
          </div>

          {/* Recurring Mistake Memory & Skill Decay Radar */}
          <div className="mt-8">
            <SlideUp delay={0.05}>
              <RecurringMistakeDecayMonitor />
            </SlideUp>
          </div>

          {/* Timeline Feed */}
          <div className="mt-8 space-y-4">
            {HISTORY_ENTRIES.map((entry) => (
              <GlassCard
                key={entry.id}
                className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/30 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                      {entry.type === "Assessment" && <Brain className="h-5 w-5" />}
                      {entry.type === "Resource Intervention" && <BookOpen className="h-5 w-5" />}
                      {entry.type === "AI Oral Drill" && <Zap className="h-5 w-5" />}
                      {entry.type === "Cryptographic Proof" && <ShieldCheck className="h-5 w-5 text-emerald-400" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-white">{entry.title}</h3>
                        <Badge variant="outline" size="sm" className="font-mono text-[10px] text-cyan-300">
                          {entry.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xl">{entry.details}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.05]">
                    <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                      {entry.badge}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
