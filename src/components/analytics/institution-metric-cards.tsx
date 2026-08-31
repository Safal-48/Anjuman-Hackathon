"use client";

import React from "react";
import { Users, Brain, Briefcase, Award } from "lucide-react";
import { MetricCard } from "@/components/ui/card";
import { InstitutionAnalyticsSummary } from "@/lib/analytics/role-analytics";

interface InstitutionMetricCardsProps {
  analytics: InstitutionAnalyticsSummary;
}

export function InstitutionMetricCards({ analytics }: InstitutionMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Enrolled Students"
        value={analytics.totalStudents.toLocaleString()}
        change="4 Departments"
        isPositive={true}
        icon={<Users className="h-4 w-4 text-cyan-400" />}
      />
      <MetricCard
        title="Average Skill Readiness"
        value={`${analytics.averageSkillReadinessScore}%`}
        change="+5.2 pts gain"
        isPositive={true}
        icon={<Brain className="h-4 w-4 text-violet-400" />}
      />
      <MetricCard
        title="Internship Participation"
        value={`${analytics.internshipParticipationRate}%`}
        change="64.2% active"
        isPositive={true}
        icon={<Briefcase className="h-4 w-4 text-emerald-400" />}
      />
      <MetricCard
        title="Placement Readiness Rate"
        value={`${analytics.placementReadinessRate}%`}
        change="Above benchmark"
        isPositive={true}
        icon={<Award className="h-4 w-4 text-amber-400" />}
      />
    </div>
  );
}
