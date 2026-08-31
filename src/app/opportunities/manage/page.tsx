"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Users,
  Sparkles,
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateOpportunityModal } from "@/components/marketplace/create-opportunity-modal";
import { RecruiterApplicantTable } from "@/components/marketplace/recruiter-applicant-table";
import { OpportunityEntity, OpportunityApplicationEntity, ApplicationStatus } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn } from "@/components/animations/motion-wrapper";

export default function ManageOpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityEntity[]>([]);
  const [applications, setApplications] = useState<OpportunityApplicationEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"applicants" | "listings">("applicants");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [oppsRes, appsRes] = await Promise.all([
        fetch("/api/marketplace/opportunities"),
        fetch("/api/marketplace/applications"),
      ]);

      if (oppsRes.ok) {
        const data = await oppsRes.json();
        setOpportunities(data.opportunities || []);
      }
      if (appsRes.ok) {
        const aData = await appsRes.json();
        setApplications(aData.applications || []);
      }
    } catch (err) {
      console.error("Failed to load recruiter data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateOpportunity = async (data: any) => {
    const res = await fetch("/api/marketplace/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      loadData();
    }
  };

  const handleUpdateStatus = async (appId: string, status: ApplicationStatus) => {
    const res = await fetch(`/api/marketplace/applications/${appId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      loadData();
    }
  };

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Back Link */}
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Top Header */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="violet" dot dotColor="violet">
                    INDUSTRY RECRUITER HUB
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {applications.length} ACTIVE CANDIDATE APPLICANTS
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  Talent Pipeline & Opportunity Management
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Publish industry opportunities, discover qualified student candidates with explainable match analytics, and advance hiring stages.
                </p>
              </div>

              <Button
                variant="glow"
                size="default"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Post New Opportunity
              </Button>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("applicants")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "applicants"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-glow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Candidate Submissions ({applications.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "listings"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-glow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Published Opportunities ({opportunities.length})</span>
          </button>
        </div>

        {/* Tab 1: Applicants Review */}
        {activeTab === "applicants" && (
          <div>
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-2xl" />
            ) : (
              <RecruiterApplicantTable
                applications={applications}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        )}

        {/* Tab 2: Listings */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <GlassCard key={opp.id} className="p-5 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-foreground">{opp.title}</h4>
                    <Badge variant="cyber" size="sm">
                      {opp.opportunityType.toUpperCase().replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {opp.location} • {opp.stipendSalary} • Deadline: {opp.deadline}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/opportunities/${opp.id}`}>
                    <Button variant="glass" size="sm">
                      View Public Listing
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </Container>

      {/* Create Opportunity Modal */}
      <CreateOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitOpportunity={handleCreateOpportunity}
      />
    </div>
  );
}
