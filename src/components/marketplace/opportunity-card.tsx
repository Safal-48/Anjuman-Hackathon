"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Users,
  Compass,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpportunityEntity, OpportunityType } from "@/lib/supabase/types";

interface OpportunityCardProps {
  opportunity: OpportunityEntity;
  onOpenCompatibility?: (opp: OpportunityEntity) => void;
  onQuickApply?: (opp: OpportunityEntity) => void;
}

export function OpportunityCard({
  opportunity,
  onOpenCompatibility,
  onQuickApply,
}: OpportunityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const match = opportunity.matchResult;

  const typeConfig: Record<
    OpportunityType,
    { label: string; variant: "cyber" | "violet" | "emerald" | "amber" | "glass"; icon: React.ComponentType<{ className?: string }> }
  > = {
    internship: { label: "Internship", variant: "cyber", icon: GraduationCap },
    job: { label: "Full-Time Job", variant: "violet", icon: Briefcase },
    industry_project: { label: "Industry Project", variant: "emerald", icon: FolderGit2 },
    apprenticeship: { label: "Apprenticeship", variant: "amber", icon: Compass },
    training_program: { label: "Training Cohort", variant: "cyber", icon: BookOpen },
    workshop: { label: "Workshop", variant: "violet", icon: Zap },
    mentorship: { label: "Mentorship Track", variant: "emerald", icon: Users },
  };

  const currentType = typeConfig[opportunity.opportunityType] || typeConfig.internship;
  const TypeIcon = currentType.icon;

  const matchScore = match?.overallScore || 75;
  const matchBadgeColor =
    matchScore >= 85 ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10 shadow-glow-sm" :
    matchScore >= 70 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" :
    "text-amber-400 border-amber-500/40 bg-amber-500/10";

  return (
    <GlassCard
      className="p-6 flex flex-col justify-between space-y-5 border-white/10 hover:border-cyan-500/40 transition-all duration-300 relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      glow={isHovered}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

      {/* Top Meta Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={currentType.variant} size="sm">
              <TypeIcon className="h-3 w-3 mr-1" />
              {currentType.label.toUpperCase()}
            </Badge>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-muted-foreground">
              {opportunity.locationType.toUpperCase()}
            </span>
          </div>

          {/* Explainable Match Badge */}
          {match && (
            <button
              type="button"
              onClick={() => onOpenCompatibility?.(opportunity)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all flex items-center gap-1 cursor-pointer ${matchBadgeColor}`}
              title="Click to view explainable compatibility factors"
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>{match.overallScore}% MATCH</span>
            </button>
          )}
        </div>

        {/* Title & Organization */}
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-300 transition-colors leading-snug">
            {opportunity.title}
          </h3>
          <p className="text-xs font-semibold text-muted-foreground/90 pt-0.5">
            {opportunity.organizationName}
          </p>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      {/* Structured Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground pt-1 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{opportunity.location}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate text-emerald-400 font-bold">
          <span className="text-muted-foreground font-normal">Stipend:</span>
          <span className="truncate">{opportunity.stipendSalary}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{opportunity.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Due: {opportunity.deadline}</span>
        </div>
      </div>

      {/* Explainable Skill Breakdown Preview */}
      {match && (
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Skill Match Telemetry</span>
            <button
              type="button"
              onClick={() => onOpenCompatibility?.(opportunity)}
              className="text-cyan-400 hover:underline text-[10px]"
            >
              Why this score?
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {match.strongSkills.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                <span>{s}</span>
              </span>
            ))}
            {match.partialSkills.slice(0, 1).map((s) => (
              <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="h-2.5 w-2.5 text-amber-400" />
                <span>{s}</span>
              </span>
            ))}
            {match.gapSkills.slice(0, 1).map((s) => (
              <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <XCircle className="h-2.5 w-2.5 text-rose-400" />
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link href={`/opportunities/${opportunity.id}`} className="flex-1">
          <Button variant="glass" size="sm" className="w-full">
            View Details
          </Button>
        </Link>

        <Button
          variant="glow"
          size="sm"
          onClick={() => onQuickApply?.(opportunity)}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          Apply Now
        </Button>
      </div>
    </GlassCard>
  );
}
