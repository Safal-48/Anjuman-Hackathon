"use client";

import React from "react";
import { Briefcase, Users, UserCheck, Calendar } from "lucide-react";
import { MetricCard } from "@/components/ui/card";
import { IndustryAnalyticsSummary } from "@/lib/analytics/role-analytics";

interface IndustryOverviewCardsProps {
  analytics: IndustryAnalyticsSummary;
}

export function IndustryOverviewCards({ analytics }: IndustryOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Opportunities"
        value={analytics.activeOpportunitiesCount}
        change="+2 new this month"
        isPositive={true}
        icon={<Briefcase className="h-4 w-4 text-cyan-400" />}
      />
      <MetricCard
        title="Candidate Applicants"
        value={analytics.totalApplicationsCount}
        change="+45% velocity"
        isPositive={true}
        icon={<Users className="h-4 w-4 text-violet-400" />}
      />
      <MetricCard
        title="Shortlisted Candidates"
        value={analytics.shortlistedCount}
        change="≥ 85% match"
        isPositive={true}
        icon={<UserCheck className="h-4 w-4 text-emerald-400" />}
      />
      <MetricCard
        title="Interviews Scheduled"
        value={analytics.interviewsScheduledCount}
        change="Active rounds"
        isPositive={true}
        icon={<Calendar className="h-4 w-4 text-amber-400" />}
      />
    </div>
  );
}
