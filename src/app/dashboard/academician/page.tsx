"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  GraduationCap,
  FlaskConical,
  Briefcase,
  BookOpen,
  Award,
  Users,
  Building2,
  Sparkles,
  Compass,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AcademicianCollaborationCard } from "@/components/analytics/academician-collaboration-card";
import { ProposeCollaborationModal } from "@/components/analytics/propose-collaboration-modal";
import {
  AcademicianCollaborationEntity,
  AcademicianCollaborationFormat,
} from "@/lib/analytics/role-analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrapper";

const FORMAT_TABS: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "all", label: "All Formats", icon: Compass },
  { id: "faculty_internship", label: "Faculty Internships", icon: GraduationCap },
  { id: "industrial_training", label: "Industrial Training", icon: BookOpen },
  { id: "fdp", label: "FDPs", icon: Award },
  { id: "consultancy", label: "Consultancy", icon: Briefcase },
  { id: "research_opportunity", label: "Research Grants", icon: FlaskConical },
  { id: "mentorship", label: "Mentorship", icon: Users },
  { id: "guest_lecture", label: "Guest Lectures", icon: BookOpen },
  { id: "industry_collaboration", label: "Corporate MOUs", icon: Building2 },
];

export default function AcademicianPortalPage() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<AcademicianCollaborationEntity[]>([]);
  const [activeFormat, setActiveFormat] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollabForModal, setSelectedCollabForModal] = useState<AcademicianCollaborationEntity | null>(null);

  const loadCollaborations = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = activeFormat === "all" ? "/api/academician/collaborations" : `/api/academician/collaborations?format=${activeFormat}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCollaborations(data.collaborations || []);
      }
    } catch (err) {
      console.error("Failed to load academician collaborations:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFormat]);

  useEffect(() => {
    loadCollaborations();
  }, [loadCollaborations]);

  const handleSubmitProposal = async (data: any) => {
    try {
      const res = await fetch("/api/academician/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Faculty collaboration proposal submitted successfully!");
      }
    } catch (err) {
      console.error("Proposal submission failed:", err);
    }
  };

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Banner Header */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="violet" dot dotColor="violet">
                    ACADEMICIAN INNOVATION SUITE
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    8 COLLABORATION FORMATS
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  Faculty & Academician Collaboration Portal
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Bridge academic research and industry excellence: apply for funded faculty internships, industrial training, sponsored research grants, consultancy retainers, and institutional MOUs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/opportunities">
                  <Button variant="glow" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
                    Student Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* 8-Format Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 cyber-scrollbar">
          {FORMAT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormat(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-violet-400" : "text-muted-foreground"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Collaboration Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : collaborations.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3 border-white/10" glow>
            <FlaskConical className="h-10 w-10 text-violet-400 mx-auto" />
            <h3 className="font-bold text-lg text-foreground">No collaboration listings in this format</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try exploring other formats like FDPs, Sponsored Research, or Consultancy Retainers.
            </p>
          </GlassCard>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((collab) => (
              <StaggerItem key={collab.id}>
                <AcademicianCollaborationCard
                  collaboration={collab}
                  onPropose={(c) => setSelectedCollabForModal(c)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>

      {/* Propose Collaboration Modal */}
      <ProposeCollaborationModal
        collaboration={selectedCollabForModal}
        isOpen={Boolean(selectedCollabForModal)}
        onClose={() => setSelectedCollabForModal(null)}
        onSubmitProposal={handleSubmitProposal}
      />
    </div>
  );
}
