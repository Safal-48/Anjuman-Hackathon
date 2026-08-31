"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  FlaskConical,
  Briefcase,
  Compass,
  Video,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MentorCard } from "@/components/mentorship/mentor-card";
import { RequestMentorshipModal } from "@/components/mentorship/request-mentorship-modal";
import { SessionProgressTracker } from "@/components/mentorship/session-progress-tracker";
import {
  MentorProfileEntity,
  MentorshipSessionEntity,
  CollaborationEventEntity,
  MentorshipStatus,
} from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrapper";

export default function MentorshipHubPage() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorProfileEntity[]>([]);
  const [collaborationEvents, setCollaborationEvents] = useState<CollaborationEventEntity[]>([]);
  const [sessions, setSessions] = useState<MentorshipSessionEntity[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Request Modal State
  const [selectedMentorForModal, setSelectedMentorForModal] = useState<MentorProfileEntity | null>(null);

  const loadMentorshipData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Mentors & Collaboration Events
      const url = selectedExpertise === "all" ? "/api/mentorship/mentors" : `/api/mentorship/mentors?expertise=${selectedExpertise}`;
      const mentorRes = await fetch(url);
      if (mentorRes.ok) {
        const mData = await mentorRes.json();
        setMentors(mData.mentors || []);
        setCollaborationEvents(mData.collaborationEvents || []);
      }

      // 2. Fetch Active Sessions
      const sessionRes = await fetch("/api/mentorship/requests");
      if (sessionRes.ok) {
        const sData = await sessionRes.json();
        setSessions(sData.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load mentorship data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedExpertise]);

  useEffect(() => {
    loadMentorshipData();
  }, [loadMentorshipData]);

  const handleRequestSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/mentorship/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        loadMentorshipData();
      }
    } catch (err) {
      console.error("Failed to submit request:", err);
    }
  };

  const handleFeedbackSubmit = async (sessionId: string, rating: number, comment: string) => {
    try {
      const res = await fetch("/api/mentorship/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating, comment }),
      });
      if (res.ok) {
        loadMentorshipData();
      }
    } catch (err) {
      console.error("Feedback submit failed:", err);
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
                    MENTORSHIP & COLLABORATION HUB
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    1-ON-1 SESSIONS & LIVE WORKSHOPS
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  Connect with Industry Mentors & Academic Fellows
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Accelerate your career readiness with personalized 1-on-1 guidance, architecture reviews, masterclasses, and sponsored industry collaboration projects.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/portfolio">
                  <Button variant="glow" size="sm" leftIcon={<Sparkles className="h-4 w-4" />}>
                    My Digital Portfolio
                  </Button>
                </Link>
                <Link href="/opportunities">
                  <Button variant="glass" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
                    Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Section 1: Active Mentorship Sessions & Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-lg text-foreground">My Active Mentorship Sessions</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {sessions.length} Active Sessions
            </span>
          </div>

          <SessionProgressTracker
            sessions={sessions}
            onFeedbackSubmit={handleFeedbackSubmit}
          />
        </div>

        {/* Section 2: Mentor Discovery Catalog */}
        <div className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              <h3 className="font-bold text-lg text-foreground">Discover Expert Mentors</h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 cyber-scrollbar">
              {[
                { id: "all", label: "All Mentors" },
                { id: "AI", label: "AI & ML Systems" },
                { id: "Cloud", label: "Cloud & DevOps" },
                { id: "Research", label: "Academic Research" },
                { id: "Leadership", label: "Leadership & Placement" },
              ].map((tab) => {
                const isActive = selectedExpertise === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedExpertise(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-glow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : mentors.length === 0 ? (
            <GlassCard className="p-10 text-center space-y-2 border-white/10" glow>
              <Users className="h-8 w-8 text-muted-foreground mx-auto" />
              <h4 className="font-bold text-sm text-foreground">No mentors in this category</h4>
              <p className="text-xs text-muted-foreground">Try selecting &quot;All Mentors&quot; to view full catalog.</p>
            </GlassCard>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor) => (
                <StaggerItem key={mentor.id}>
                  <MentorCard
                    mentor={mentor}
                    onRequest={(m) => setSelectedMentorForModal(m)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        {/* Section 3: Live Collaboration Opportunities (Workshops, Keynotes, Projects, Research) */}
        <div className="space-y-5 pt-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-foreground">
                Collaboration Opportunities & Masterclasses
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Sponsored by Tech Leaders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collaborationEvents.map((evt) => {
              const typeBadgeVariant: Record<string, "cyber" | "violet" | "emerald" | "amber"> = {
                workshop: "cyber",
                guest_lecture: "violet",
                live_project: "emerald",
                research_collaboration: "amber",
              };

              return (
                <GlassCard
                  key={evt.id}
                  className="p-5 flex flex-col justify-between space-y-4 border-white/10 hover:border-emerald-500/40 transition-all duration-300 relative group"
                  glow
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={typeBadgeVariant[evt.type] || "cyber"} size="sm">
                        {evt.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {evt.mode}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground group-hover:text-emerald-300 transition-colors leading-snug">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-cyan-400 font-semibold">{evt.hostOrganization}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{evt.hostSpeaker}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {evt.topicsCovered.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 text-muted-foreground border border-white/5"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                    <div className="flex justify-between text-muted-foreground text-[11px]">
                      <span>Date:</span>
                      <span className="text-foreground">{evt.date}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-[11px]">
                      <span>Seats:</span>
                      <span className="text-emerald-400">{evt.seatsAvailable} Left</span>
                    </div>

                    <Button
                      variant="glow"
                      size="sm"
                      className="w-full"
                      onClick={() => alert(`Registered for ${evt.title}!`)}
                    >
                      {evt.actionCta}
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Request Mentorship Modal */}
      <RequestMentorshipModal
        mentor={selectedMentorForModal}
        isOpen={Boolean(selectedMentorForModal)}
        onClose={() => setSelectedMentorForModal(null)}
        onSubmitRequest={handleRequestSubmit}
      />
    </div>
  );
}
