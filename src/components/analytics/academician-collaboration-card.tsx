"use client";

import React from "react";
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Briefcase,
  Users,
  Award,
  Clock,
  Calendar,
  MapPin,
  Send,
  Building2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AcademicianCollaborationEntity,
  AcademicianCollaborationFormat,
} from "@/lib/analytics/role-analytics";

interface AcademicianCollaborationCardProps {
  collaboration: AcademicianCollaborationEntity;
  onPropose: (collab: AcademicianCollaborationEntity) => void;
}

export function AcademicianCollaborationCard({
  collaboration,
  onPropose,
}: AcademicianCollaborationCardProps) {
  const formatConfig: Record<
    AcademicianCollaborationFormat,
    { label: string; variant: "cyber" | "violet" | "emerald" | "amber" | "glass"; icon: React.ComponentType<{ className?: string }> }
  > = {
    faculty_internship: { label: "Faculty Immersion", variant: "cyber", icon: GraduationCap },
    industrial_training: { label: "Industrial Training", variant: "violet", icon: BookOpen },
    fdp: { label: "FDP Cohort", variant: "emerald", icon: Award },
    consultancy: { label: "Consultancy Retainer", variant: "amber", icon: Briefcase },
    research_opportunity: { label: "Sponsored Research", variant: "cyber", icon: FlaskConical },
    mentorship: { label: "Student Mentorship", variant: "violet", icon: Users },
    guest_lecture: { label: "Guest Keynote", variant: "emerald", icon: BookOpen },
    industry_collaboration: { label: "Institutional MOU", variant: "amber", icon: Building2 },
  };

  const config = formatConfig[collaboration.format] || formatConfig.faculty_internship;
  const Icon = config.icon;

  return (
    <GlassCard className="p-6 flex flex-col justify-between space-y-5 border-white/10 hover:border-violet-500/40 transition-all duration-300 relative group overflow-hidden" glow>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <Badge variant={config.variant} size="sm">
            <Icon className="h-3 w-3 mr-1" />
            {config.label.toUpperCase()}
          </Badge>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-muted-foreground border border-white/10">
            {collaboration.mode.toUpperCase()}
          </span>
        </div>

        {/* Title & Organization */}
        <div>
          <h3 className="font-bold text-base text-foreground group-hover:text-violet-300 transition-colors leading-snug">
            {collaboration.title}
          </h3>
          <p className="text-xs font-semibold text-cyan-400 pt-0.5">
            {collaboration.organizationName}
          </p>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {collaboration.description}
        </p>
      </div>

      {/* Meta Grid */}
      <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Domain:</span>
          <span className="font-semibold text-foreground truncate max-w-[200px]">{collaboration.domain}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Grant / Honorarium:</span>
          <span className="font-bold text-emerald-400">{collaboration.stipendOrGrant}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration:</span>
          <span className="text-foreground">{collaboration.duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Deadline:</span>
          <span className="text-amber-400">{collaboration.deadline}</span>
        </div>
      </div>

      {/* Action */}
      <Button
        variant="glow"
        size="sm"
        className="w-full"
        onClick={() => onPropose(collaboration)}
        rightIcon={<Send className="h-3.5 w-3.5" />}
      >
        Submit Collaboration Proposal
      </Button>
    </GlassCard>
  );
}
