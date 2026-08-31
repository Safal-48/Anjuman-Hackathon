"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { ProfileEditModal } from "@/components/profile/profile-edit-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { FullUserProfile, SkillLevel, AchievementCategory } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<FullUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/profile");
      } else {
        fetchProfile();
      }
    }
  }, [authLoading, isAuthenticated, router, fetchProfile]);

  // Skill Handlers
  const handleAddSkill = async (data: { skillName: string; level: SkillLevel; proficiencyScore: number; category: string }) => {
    await fetch("/api/profile/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProfile();
  };

  const handleDeleteSkill = async (skillId: string) => {
    await fetch(`/api/profile/skills?id=${skillId}`, { method: "DELETE" });
    fetchProfile();
  };

  // Project Handlers
  const handleAddProject = async (data: { title: string; summary: string; techStack: string[]; liveUrl?: string; repoUrl?: string }) => {
    await fetch("/api/profile/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProfile();
  };

  const handleDeleteProject = async (projectId: string) => {
    await fetch(`/api/profile/projects?id=${projectId}`, { method: "DELETE" });
    fetchProfile();
  };

  // Certification Handlers
  const handleAddCert = async (data: { title: string; issuingOrganization: string; credentialId?: string; credentialUrl?: string }) => {
    await fetch("/api/profile/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProfile();
  };

  const handleDeleteCert = async (certId: string) => {
    await fetch(`/api/profile/certifications?id=${certId}`, { method: "DELETE" });
    fetchProfile();
  };

  // Achievement Handlers
  const handleAddAchievement = async (data: { title: string; category: AchievementCategory; description: string; proofUrl?: string }) => {
    await fetch("/api/profile/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProfile();
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    await fetch(`/api/profile/achievements?id=${achievementId}`, { method: "DELETE" });
    fetchProfile();
  };

  // Core Profile Update
  const handleSaveCoreProfile = async (data: { fullName?: string; bio?: string; location?: string; careerGoal?: string; education?: string; organizationName?: string }) => {
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProfile();
  };

  if (isLoading || !profile) {
    return (
      <Container size="xl" className="py-10 space-y-8">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </Container>
    );
  }

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        <FadeIn>
          <ProfileHeader
            profile={profile}
            isOwner={true}
            onEditClick={() => setIsEditModalOpen(true)}
          />
        </FadeIn>

        {/* Role-Specific Profile Sections */}
        <div className="mt-8 space-y-8">
          {profile.role === "student" && (
            <>
              {/* Career Readiness Gauge */}
              <SlideUp delay={0.1}>
                <CareerReadinessGauge profile={profile} />
              </SlideUp>

              {/* Skills Matrix & Portfolio Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SlideUp delay={0.2}>
                  <SkillMatrix
                    skills={profile.skills}
                    isOwner={true}
                    onAddSkill={handleAddSkill}
                    onDeleteSkill={handleDeleteSkill}
                  />
                </SlideUp>

                <SlideUp delay={0.3}>
                  <ProjectGallery
                    projects={profile.projects}
                    isOwner={true}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                  />
                </SlideUp>
              </div>

              {/* Certifications & Honors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SlideUp delay={0.4}>
                  <CertificationsCard
                    certifications={profile.certifications}
                    isOwner={true}
                    onAddCert={handleAddCert}
                    onDeleteCert={handleDeleteCert}
                  />
                </SlideUp>

                <SlideUp delay={0.5}>
                  <AchievementsCard
                    achievements={profile.achievements}
                    isOwner={true}
                    onAddAchievement={handleAddAchievement}
                    onDeleteAchievement={handleDeleteAchievement}
                  />
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
                <AchievementsCard
                  achievements={profile.achievements}
                  isOwner={true}
                  onAddAchievement={handleAddAchievement}
                  onDeleteAchievement={handleDeleteAchievement}
                />
              </SlideUp>
            </div>
          )}

          {profile.role === "institution" && (
            <SlideUp delay={0.1}>
              <InstitutionProfileView profile={profile} />
            </SlideUp>
          )}
        </div>

        {/* Interactive Profile Edit Modal */}
        <ProfileEditModal
          profile={profile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCoreProfile}
        />
      </Container>
    </div>
  );
}
