"use client";

import React, { useEffect, useCallback } from "react";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Brain,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FinalInterviewReport,
  INTERVIEW_READINESS_CONFIG,
  getInterviewPerformanceStatus,
  generatePerformanceInsight,
} from "@/lib/ai/interview-engine";

interface InterviewCompletionPopupProps {
  isOpen: boolean;
  report: FinalInterviewReport | null;
  readinessThreshold?: number;
  onClose: () => void;
  onViewDetails: (sessionId: string) => void;
  onRetry: () => void;
}

export function InterviewCompletionPopup({
  isOpen,
  report,
  readinessThreshold = INTERVIEW_READINESS_CONFIG.defaultReadinessThreshold,
  onClose,
  onViewDetails,
  onRetry,
}: InterviewCompletionPopupProps) {
  // Handle Keyboard Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  // Fallback Error / Unavailable State
  if (!report) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-modal-title"
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <GlassCard className="w-full max-w-md p-6 space-y-4 border-rose-500/30 text-center" glow>
          <div className="h-12 w-12 mx-auto rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 id="completion-modal-title" className="text-lg font-bold text-foreground font-mono">
            Evaluation Currently Unavailable
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your interview transcript has been safely persisted, but the diagnostic scoring synthesis could not be loaded.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="glass" size="sm" onClick={onClose} className="flex-1 font-mono text-xs">
              Close
            </Button>
            <Button variant="glow" size="sm" onClick={onRetry} className="flex-1 font-mono text-xs font-bold">
              Start New Attempt
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Calculate metrics derived from actual completed evaluation data
  const overallScorePercent = report.overallScore ?? 0;
  const scoreOutOf10 = (overallScorePercent / 10).toFixed(1);
  const status = getInterviewPerformanceStatus(overallScorePercent, readinessThreshold);
  const isInterviewReady = status === "INTERVIEW READY";

  const aiInsight = generatePerformanceInsight(report);

  // Category Ratings mapped to 1-5 scale
  const ratings = [
    {
      label: "Technical Knowledge",
      score: report.categoryRatings?.technicalKnowledge ?? overallScorePercent,
    },
    {
      label: "Communication",
      score: report.categoryRatings?.communication ?? overallScorePercent,
    },
    {
      label: "Answer Quality",
      score: report.categoryRatings?.answerQuality ?? overallScorePercent,
    },
    {
      label: "Problem Solving",
      score: Math.round(
        ((report.categoryRatings?.completeness ?? overallScorePercent) * 0.5) +
        ((report.categoryRatings?.relevance ?? overallScorePercent) * 0.5)
      ),
    },
    {
      label: "Confidence / Delivery",
      score: report.categoryRatings?.confidenceIndicators ?? overallScorePercent,
    },
  ];

  // Helper to render 5 stars based on score
  const renderStars = (scoreVal: number) => {
    // 0-100 mapped to 1-5 stars
    const starCount = Math.min(5, Math.max(1, Math.round((scoreVal / 100) * 5)));
    return (
      <div className="flex items-center gap-1" aria-label={`${starCount} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= starCount;
          return (
            <Star
              key={starIndex}
              className={`h-3.5 w-3.5 transition-colors ${
                isFilled
                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                  : "text-slate-700 fill-slate-800"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="interview-completed-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <GlassCard
        className="w-full max-w-lg p-6 sm:p-8 space-y-6 border-cyan-500/40 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto"
        glow
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Close summary popup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 1. Header & Hierarchy */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Interview Completed</span>
          </div>

          <h2 id="interview-completed-title" className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight">
            Performance Summary
          </h2>

          <p className="text-xs text-muted-foreground font-mono">
            Role: <strong className="text-foreground/90">{report.config.roleId.replace(/_/g, " ").toUpperCase()}</strong> • Evaluated by {report.interviewer.name}
          </p>
        </div>

        {/* 2. Overall Performance & Dynamic Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Overall Score */}
          <div className="text-center sm:text-left space-y-0.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold block">
              Overall Performance
            </span>
            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
              <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                {scoreOutOf10}
              </span>
              <span className="text-sm font-mono text-muted-foreground font-semibold">/ 10</span>
              <span className="text-xs font-mono text-cyan-300/80 ml-1">({overallScorePercent}%)</span>
            </div>
          </div>

          {/* Performance Status Badge (Calculated from threshold) */}
          <div className="text-center sm:text-right space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold block">
              Readiness Status
            </span>
            <Badge
              variant={isInterviewReady ? "emerald" : "amber"}
              size="default"
              className="font-mono text-xs font-bold px-3 py-1 flex items-center gap-1.5 shadow-glow-sm"
            >
              {isInterviewReady ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>INTERVIEW READY</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>NEEDS IMPROVEMENT</span>
                </>
              )}
            </Badge>

            {/* Observational Presence Pill */}
            {report.attentionSummary?.isAvailable ? (
              <div className="pt-1 text-[10px] font-mono text-emerald-400/90 flex items-center justify-center sm:justify-end gap-1">
                <span>● Presence:</span>
                <span className="font-bold">{report.attentionSummary.focusPercentage}% Focus</span>
              </div>
            ) : (
              <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center justify-center sm:justify-end gap-1">
                <span>● Presence:</span>
                <span>Camera N/A</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Quick Ratings (Visual Star Rating Indicators) */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/80 border border-white/10 font-mono">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block border-b border-white/[0.08] pb-2">
            Quick Ratings:
          </span>

          <div className="space-y-2 pt-1">
            {ratings.map((cat) => (
              <div
                key={cat.label}
                className="flex items-center justify-between text-xs py-0.5"
              >
                <span className="text-foreground/90 font-medium">{cat.label}</span>
                <div className="flex items-center gap-2">
                  {renderStars(cat.score)}
                  <span className="text-[11px] text-muted-foreground w-8 text-right font-bold">
                    {cat.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AI Insight (ONE short grounded insight) */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-bold">
            <Brain className="h-3.5 w-3.5 shrink-0" />
            <span>AI Performance Insight:</span>
          </div>
          <p className="text-xs text-foreground/90 font-mono leading-relaxed pl-5 italic">
            &ldquo;{aiInsight}&rdquo;
          </p>
        </div>

        {/* 5. Clear Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            variant="glass"
            size="default"
            onClick={onRetry}
            leftIcon={<RotateCcw className="h-4 w-4" />}
            className="w-full sm:flex-1 text-xs font-mono"
          >
            Retry Interview
          </Button>

          <Button
            type="button"
            variant="glow"
            size="default"
            onClick={() => onViewDetails(report.sessionId)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:flex-1 text-xs font-mono font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            View Detailed Report →
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
