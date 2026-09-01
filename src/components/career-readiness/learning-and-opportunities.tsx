"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  ArrowRight,
  Clock,
  Star,
  Sparkles,
  CheckCircle2,
  Building,
  MapPin,
  Compass,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CareerReadinessProfile } from "@/lib/analytics/career-readiness-engine";

interface LearningAndOpportunitiesProps {
  profile: CareerReadinessProfile;
}

export function LearningAndOpportunities({ profile }: LearningAndOpportunitiesProps) {
  const { recommendedLearning, relevantOpportunities } = profile;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Recommended Learning (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-400" />
            <h3 className="text-base font-bold text-foreground font-mono">
              Recommended Learning Labs
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Tailored for Gap Closure</span>
        </div>

        <div className="space-y-3">
          {recommendedLearning.map((course) => (
            <GlassCard
              key={course.id}
              className="p-5 border-violet-500/20 bg-slate-900/70 hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-3"
              glow
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="violet" size="sm" className="font-mono text-[9px]">
                    {course.type}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-violet-400" />
                    {course.duration}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-foreground font-mono leading-snug">
                  {course.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>Provider: <strong className="text-foreground">{course.provider}</strong></span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {course.rating}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-300">
                  Target: {course.skillTarget}
                </span>
                <Link href={course.actionUrl}>
                  <Button variant="glass" size="sm" className="text-xs font-mono">
                    Launch Lab →
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Relevant Opportunities (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-foreground font-mono">
              Matching Opportunities
            </h3>
          </div>
          <Link href="/opportunities" className="text-xs font-mono text-cyan-400 hover:underline">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {relevantOpportunities.map((opp) => (
            <GlassCard
              key={opp.id}
              className="p-5 border-cyan-500/20 bg-slate-900/70 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3"
              glow
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={opp.type === "Full-Time" ? "cyber" : "glass"} size="sm" className="font-mono text-[9px]">
                      {opp.type}
                    </Badge>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {opp.stipendOrSalary}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-cyan-400">
                      {opp.matchScore}% Match
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground font-mono leading-snug">
                    {opp.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                    <span className="text-foreground/90">{opp.company}</span>
                    <span>•</span>
                    <span>{opp.location}</span>
                  </div>
                </div>

                {/* Matched / Missing skills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {opp.matchedSkills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                      ✓ {s}
                    </span>
                  ))}
                  {opp.missingSkills.slice(0, 1).map((s) => (
                    <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30">
                      ✗ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Readiness: Good to Apply
                </span>

                <Link href={opp.applyUrl}>
                  <Button variant="glow" size="sm" className="text-xs font-mono font-bold">
                    Apply Now →
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
