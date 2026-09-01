"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  FileText,
  Sparkles,
  Users,
  Layers,
  Compass,
  Zap,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentCareerContext } from "@/lib/ai/career-coach-engine";

interface CoachContextSidebarProps {
  context: StudentCareerContext;
  onSelectPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

export function CoachContextSidebar({
  context,
  onSelectPrompt,
  isLoading = false,
}: CoachContextSidebarProps) {
  const quickPrompts = [
    {
      title: "Role Readiness",
      prompt: "Why am I not ready for this role?",
      category: "Target Role Audit",
      badge: "Highest Impact",
    },
    {
      title: "Priority Action",
      prompt: "What should I improve first?",
      category: "Next Best Action",
      badge: "Quick Win",
    },
    {
      title: "Interview Diagnostic",
      prompt: "Why was my interview score low?",
      category: "Mock Interview",
      badge: "Technical",
    },
    {
      title: "Missing Skills",
      prompt: "What skills am I missing?",
      category: "Skill Matrix",
      badge: "Gap Analysis",
    },
    {
      title: "Opportunity Match",
      prompt: "Should I apply for this internship?",
      category: "Marketplace",
      badge: "Advisory",
    },
    {
      title: "GD Performance",
      prompt: "Why was my GD score 78%?",
      category: "Group Discussion",
      badge: "Communication",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Telemetry Snapshot Card */}
      <GlassCard className="p-5 space-y-4 border-cyan-500/30 bg-slate-900/90" glow>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Live Profile Telemetry
            </h3>
          </div>
          <Badge variant="emerald" size="sm" className="font-mono text-[9px]">
            SYNCHRONIZED
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">Candidate:</span>
            <strong className="text-xs font-bold text-foreground font-mono">{context.studentName}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">Target Role:</span>
            <span className="text-xs font-bold text-cyan-300 font-mono text-right max-w-[170px] truncate">
              {context.targetRole}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-xs text-muted-foreground font-mono">Career Readiness:</span>
            <span className="text-sm font-black font-mono text-cyan-400">
              {context.overallCareerReadinessScore}%
            </span>
          </div>
        </div>

        {/* 5-Vector Telemetry Chips */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-muted-foreground block">Verified Skills</span>
            <span className="text-xs font-bold font-mono text-cyan-300">
              {context.skills.verified.length} / 17 Skills
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-muted-foreground block">ATS Resume</span>
            <span className="text-xs font-bold font-mono text-violet-300">
              {context.resume.atsScore} / 100
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-muted-foreground block">Mock Interview</span>
            <span className="text-xs font-bold font-mono text-amber-300">
              {context.mockInterview.latestScore}% Avg
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-muted-foreground block">GD Round</span>
            <span className="text-xs font-bold font-mono text-emerald-300">
              {context.groupDiscussion.latestScore}%
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5">
          <Link href="/career-readiness">
            <Button variant="glass" size="sm" className="w-full text-[11px] font-mono justify-between">
              <span>View Full Readiness Scorecard</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* Suggested Inquiries / Quick Prompts */}
      <GlassCard className="p-5 space-y-4 border-white/10" glow>
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            Curated Coach Inquiries
          </h3>
        </div>

        <div className="space-y-2">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectPrompt(item.prompt)}
              className="w-full p-3 rounded-xl border border-white/5 bg-slate-950/60 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-left transition-all group cursor-pointer space-y-1 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {item.category}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground/90 group-hover:text-cyan-200 leading-snug">
                &ldquo;{item.prompt}&rdquo;
              </p>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
