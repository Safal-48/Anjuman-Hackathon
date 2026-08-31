"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  GraduationCap,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandidateRecommendation } from "@/lib/analytics/role-analytics";

interface CandidateTalentRadarProps {
  candidates: CandidateRecommendation[];
}

export function CandidateTalentRadar({ candidates }: CandidateTalentRadarProps) {
  if (candidates.length === 0) {
    return (
      <GlassCard className="p-8 text-center space-y-2 border-white/10" glow>
        <Sparkles className="h-8 w-8 text-cyan-400 mx-auto" />
        <h4 className="font-bold text-sm text-foreground">No candidate recommendations yet</h4>
        <p className="text-xs text-muted-foreground">Publish opportunities to trigger AI talent ranking.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((cand, idx) => {
        const student = cand.student;
        const match = cand.match;

        return (
          <GlassCard
            key={idx}
            className="p-5 space-y-4 border-white/10 hover:border-cyan-500/40 transition-all duration-300 relative group"
            glow
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Candidate Bio & Target Match */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground group-hover:text-cyan-300 transition-colors">
                    {student.fullName}
                  </h4>
                  <Badge variant="cyber" size="sm">
                    {match.overallScore}% COMPATIBILITY
                  </Badge>
                  {student.gpa && (
                    <Badge variant="emerald" size="sm">
                      GPA: {student.gpa} / 10.0
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {student.education} • {student.institution} ({student.academicYear})
                </p>
                <p className="text-[11px] font-mono text-cyan-400">
                  Target Match: <strong>{cand.opportunityTitle}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <Link href={`/profile/${student.id}`}>
                  <Button variant="glass" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                    View Full Profile
                  </Button>
                </Link>
                <Link href="/opportunities/manage">
                  <Button variant="glow" size="sm">
                    Hiring Pipeline
                  </Button>
                </Link>
              </div>
            </div>

            {/* Explainable Skill Breakdown Pills */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Verified Match Telemetry</span>
                <span className="text-emerald-400 font-semibold">{match.reasoningSummary.slice(0, 75)}...</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {match.strongSkills.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                    <span>{s}</span>
                  </span>
                ))}
                {match.partialSkills.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5 text-amber-400" />
                    <span>{s}</span>
                  </span>
                ))}
                {match.gapSkills.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <XCircle className="h-2.5 w-2.5 text-rose-400" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
