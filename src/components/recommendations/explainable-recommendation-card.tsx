"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Flame,
  Zap,
  Layers,
  Star,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExplainableRecommendation } from "@/lib/recommendations/explainable-recommendations-types";

interface ExplainableRecommendationCardProps {
  recommendation: ExplainableRecommendation;
  initiallyExpanded?: boolean;
}

export function ExplainableRecommendationCard({
  recommendation,
  initiallyExpanded = false,
}: ExplainableRecommendationCardProps) {
  const [showWhyThis, setShowWhyThis] = useState(initiallyExpanded);
  const { whyThisReasoning } = recommendation;
  const isHighPriority = whyThisReasoning.calculatedPriority === "HIGH";

  return (
    <GlassCard
      className={`p-6 rounded-2xl border transition-all duration-300 space-y-5 flex flex-col justify-between ${
        isHighPriority
          ? "border-cyan-500/40 bg-slate-900/60 shadow-[0_0_30px_rgba(6,182,212,0.12)]"
          : "border-white/10 bg-slate-900/40"
      }`}
    >
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              {recommendation.topic}
            </span>
            <span className="text-xs text-slate-400 font-mono">• {recommendation.skillDomain}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isHighPriority ? "destructive" : "cyber"}
              size="sm"
              className="font-mono text-[10px]"
            >
              Priority: {whyThisReasoning.calculatedPriority}
            </Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {recommendation.duration}
            </span>
          </div>
        </div>

        {/* 1. WHAT IS RECOMMENDED */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
            1. WHAT IS RECOMMENDED:
          </span>
          <h3 className="text-lg font-bold text-white font-mono mt-0.5 leading-snug">
            {recommendation.whatIsRecommended}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="glass" size="sm" className="font-mono text-[9px]">
              {recommendation.resourceType}
            </Badge>
            <Badge variant="outline" size="sm" className="font-mono text-[9px] border-white/10 text-slate-400">
              {recommendation.difficulty}
            </Badge>
            <span className="text-[11px] text-amber-300 flex items-center gap-1 font-mono ml-auto">
              <Star className="h-3 w-3 fill-amber-300" /> {recommendation.rating}
            </span>
          </div>
        </div>

        {/* 2. WHY THIS? (Interactive Expandable Evidence Drawer) */}
        <div className="rounded-xl border border-cyan-500/30 bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => setShowWhyThis(!showWhyThis)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide">
                2. WHY IS IT RECOMMENDED? (CLICK FOR EVIDENCE)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span>{showWhyThis ? "Collapse Evidence" : "Inspect Data Reasoning"}</span>
              {showWhyThis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {showWhyThis && (
            <div className="p-4 pt-0 border-t border-white/[0.06] space-y-3 animate-in fade-in duration-200">
              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block">Current Proficiency:</span>
                  <strong className="text-rose-400 text-sm font-black">{whyThisReasoning.currentProficiency}%</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block">Required for Goal:</span>
                  <strong className="text-cyan-400 text-sm font-black">{whyThisReasoning.requiredForGoal}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block">Recent Accuracy:</span>
                  <strong className="text-rose-400 text-sm font-black">{whyThisReasoning.recentAccuracy}%</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block">Repeated Mistakes:</span>
                  <strong className="text-amber-400 text-sm font-black">{whyThisReasoning.repeatedMistakesCount} Logged</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block">Dependency Level:</span>
                  <strong className="text-amber-300 text-sm font-black">{whyThisReasoning.dependencyImportance}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block">Resulting Priority:</span>
                  <strong className="text-rose-400 text-sm font-black">{whyThisReasoning.calculatedPriority}</strong>
                </div>
              </div>

              {/* Data Evidence Summary */}
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-cyan-300 font-mono block mb-1">Diagnostic Evidence:</span>
                {whyThisReasoning.dataEvidenceSummary}
              </div>
            </div>
          )}
        </div>

        {/* 3. WHAT WILL IT IMPROVE */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-white/[0.06]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> 3. WHAT WILL IT IMPROVE?
          </span>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            {recommendation.whatWillItImprove}
          </p>
        </div>

        {/* 4. WHAT SHOULD I DO AFTER COMPLETING IT */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-white/[0.06]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> 4. WHAT SHOULD I DO AFTER COMPLETING IT?
          </span>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            {recommendation.whatToDoAfter}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <Link href="/practice" className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors">
          Explore Related Drills
        </Link>

        <a
          href={recommendation.actionUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
            <span>Start Recommendation</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
      </div>
    </GlassCard>
  );
}
