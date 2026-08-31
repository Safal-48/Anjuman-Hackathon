"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Award,
  XCircle,
  Building2,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OpportunityApplicationEntity, ApplicationStatus } from "@/lib/supabase/types";

interface ApplicationTrackerProps {
  applications: OpportunityApplicationEntity[];
}

const STAGES: Array<{ status: ApplicationStatus; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { status: "applied", label: "Applied", icon: Clock },
  { status: "under_review", label: "Under Review", icon: UserCheck },
  { status: "shortlisted", label: "Shortlisted", icon: Sparkles },
  { status: "interview", label: "Interview", icon: Calendar },
  { status: "selected", label: "Selected", icon: Award },
];

export function ApplicationTracker({ applications }: ApplicationTrackerProps) {
  if (applications.length === 0) {
    return (
      <GlassCard className="p-12 text-center space-y-4 border-white/10" glow>
        <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Clock className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="font-bold text-lg text-foreground">No Applications Yet</h3>
          <p className="text-xs text-muted-foreground">
            Explore the Opportunity Marketplace to apply for matched internships, jobs, and industry challenges.
          </p>
        </div>
        <Link href="/opportunities">
          <Button variant="glow" size="sm">
            Explore Opportunities
          </Button>
        </Link>
      </GlassCard>
    );
  }

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case "applied": return 0;
      case "under_review": return 1;
      case "shortlisted": return 2;
      case "interview": return 3;
      case "selected": return 4;
      case "rejected": return -1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {applications.map((app) => {
        const currentStageIndex = getStageIndex(app.status);
        const isRejected = app.status === "rejected";
        const opp = app.opportunity;

        return (
          <GlassCard key={app.id} className="p-6 space-y-6 border-white/10 hover:border-cyan-500/30 transition-all" glow>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg text-foreground">{opp?.title || "Opportunity"}</h4>
                  <Badge variant={isRejected ? "destructive" : "cyber"} size="sm">
                    {app.status.toUpperCase().replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {opp?.organizationName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                  {app.matchScore}% Match
                </div>
                {opp && (
                  <Link href={`/opportunities/${opp.id}`}>
                    <Button variant="glass" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                      View Posting
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stepper Pipeline */}
            {!isRejected ? (
              <div className="py-2">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                  {STAGES.map((stage, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;
                    const Icon = stage.icon;

                    return (
                      <div
                        key={stage.status}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                          isCurrent
                            ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-glow-sm"
                            : isPassed
                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                            : "bg-white/[0.02] border-white/5 text-muted-foreground/50"
                        }`}
                      >
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                            isCurrent
                              ? "bg-cyan-500 text-slate-950"
                              : isPassed
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold leading-tight">{stage.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                <span>
                  This application was not selected for further rounds. Review your skill gaps and continue applying to higher-compatibility opportunities.
                </span>
              </div>
            )}

            {/* Candidate Cover Note & Match Breakdown Snapshot */}
            {app.coverNote && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold block mb-1">Submitted Candidate Statement:</strong>
                &ldquo;{app.coverNote}&rdquo;
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
