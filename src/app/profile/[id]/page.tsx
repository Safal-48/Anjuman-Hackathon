"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SkillMatrix } from "@/components/profile/skill-matrix";
import { ProjectGallery } from "@/components/profile/project-gallery";
import { CertificationsCard } from "@/components/profile/certifications-card";
import { AchievementsCard } from "@/components/profile/achievements-card";
import { CareerReadinessGauge } from "@/components/profile/career-readiness-gauge";
import {
  IndustryProfileView,
  AcademicianProfileView,
  InstitutionProfileView,
} from "@/components/profile/role-views";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { User } from "lucide-react";
import { FullUserProfile } from "@/lib/supabase/types";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function PublicProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [profile, setProfile] = useState<FullUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/profile/${id}`, {
          method: "GET",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Failed to load public profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (isLoading) {
    return (
      <Container size="xl" className="py-10 space-y-8">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container size="md" className="py-24">
        <EmptyState
          icon={User}
          title="Profile Not Found"
          description="The requested ecosystem identity or candidate profile does not exist."
        />
      </Container>
    );
  }

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        <FadeIn>
          <ProfileHeader profile={profile} isOwner={false} />
        </FadeIn>

        <div className="mt-8 space-y-8">
          {profile.role === "student" && (
            <>
              <SlideUp delay={0.1}>
                <CareerReadinessGauge profile={profile} />
              </SlideUp>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SlideUp delay={0.2}>
                  <SkillMatrix skills={profile.skills} isOwner={false} />
                </SlideUp>

                <SlideUp delay={0.3}>
                  <ProjectGallery projects={profile.projects} isOwner={false} />
                </SlideUp>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SlideUp delay={0.4}>
                  <CertificationsCard certifications={profile.certifications} isOwner={false} />
                </SlideUp>

                <SlideUp delay={0.5}>
                  <AchievementsCard achievements={profile.achievements} isOwner={false} />
                </SlideUp>
              </div>
            </>
          )}

          {profile.role === "industry" && (
            <SlideUp delay={0.1}>
              <IndustryProfileView profile={profile} />
            </SlideUp>
          )}

          {profile.role === "academician" && (
            <div className="space-y-8">
              <SlideUp delay={0.1}>
                <AcademicianProfileView profile={profile} />
              </SlideUp>
              <SlideUp delay={0.2}>
                <AchievementsCard achievements={profile.achievements} isOwner={false} />
              </SlideUp>
            </div>
          )}

          {profile.role === "institution" && (
            <SlideUp delay={0.1}>
              <InstitutionProfileView profile={profile} />
            </SlideUp>
          )}
        </div>
      </Container>
    </div>
  );
}
