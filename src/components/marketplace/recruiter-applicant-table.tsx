"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Sparkles,
  Award,
  Calendar,
  XCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpportunityApplicationEntity, ApplicationStatus } from "@/lib/supabase/types";

interface RecruiterApplicantTableProps {
  applications: OpportunityApplicationEntity[];
  onUpdateStatus: (applicationId: string, newStatus: ApplicationStatus) => Promise<void>;
}

export function RecruiterApplicantTable({
  applications,
  onUpdateStatus,
}: RecruiterApplicantTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    setUpdatingId(appId);
    try {
      await onUpdateStatus(appId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <GlassCard className="p-10 text-center space-y-3 border-white/10" glow>
        <UserCheck className="h-10 w-10 text-cyan-400 mx-auto" />
        <h3 className="font-bold text-base text-foreground">No Candidate Submissions Yet</h3>
        <p className="text-xs text-muted-foreground">Applications will appear here once candidates apply.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const isUpdating = updatingId === app.id;
        const match = app.matchBreakdown;

        return (
          <GlassCard key={app.id} className="p-5 space-y-4 border-white/10" glow>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Candidate Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">
                    {app.studentName || "Candidate Applicant"}
                  </h4>
                  <Badge variant="cyber" size="sm">
                    {app.matchScore}% COMPATIBILITY
                  </Badge>
                  <Badge variant={app.status === "rejected" ? "destructive" : "emerald"} size="sm">
                    {app.status.toUpperCase().replace("_", " ")}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  Applied for <strong className="text-foreground">{app.opportunity?.title}</strong> • {app.studentInstitution || "University Candidate"} ({app.studentEmail})
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-center">
                <Button
                  variant="glass"
                  size="sm"
                  disabled={isUpdating || app.status === "under_review"}
                  onClick={() => handleStatusChange(app.id, "under_review")}
                >
                  Review
                </Button>
                <Button
                  variant="cyber"
                  size="sm"
                  disabled={isUpdating || app.status === "shortlisted"}
                  onClick={() => handleStatusChange(app.id, "shortlisted")}
                >
                  Shortlist
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  disabled={isUpdating || app.status === "interview"}
                  onClick={() => handleStatusChange(app.id, "interview")}
                >
                  Interview
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  disabled={isUpdating || app.status === "selected"}
                  onClick={() => handleStatusChange(app.id, "selected")}
                >
                  Select / Offer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  disabled={isUpdating || app.status === "rejected"}
                  onClick={() => handleStatusChange(app.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>

            {/* Candidate Cover Statement */}
            {app.coverNote && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-muted-foreground">
                <strong className="text-foreground block mb-0.5">Candidate Note:</strong>
                &ldquo;{app.coverNote}&rdquo;
              </div>
            )}

            {/* Match Telemetry Breakdown */}
            {match && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] uppercase font-mono text-muted-foreground">Matched Superpowers:</span>
                {match.strongSkills.slice(0, 4).map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                    <span>{s}</span>
                  </span>
                ))}
                {match.gapSkills.length > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                    Active Gaps: {match.gapSkills.join(", ")}
                  </span>
                )}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
