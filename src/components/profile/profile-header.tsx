"use client";

import React from "react";
import {
  User,
  MapPin,
  Mail,
  Edit3,
  Share2,
  Download,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FullUserProfile } from "@/lib/supabase/types";
import { UserRole } from "@/lib/auth/types";

interface ProfileHeaderProps {
  profile: FullUserProfile;
  isOwner?: boolean;
  onEditClick?: () => void;
}

export function ProfileHeader({ profile, isOwner = true, onEditClick }: ProfileHeaderProps) {
  const roleBadges: Record<
    UserRole,
    { label: string; badge: "cyber" | "violet" | "emerald" | "amber" | "destructive"; icon: React.ComponentType<{ className?: string }> }
  > = {
    student: { label: "Student Learner", badge: "cyber", icon: GraduationCap },
    industry: { label: "Industry Recruiter", badge: "violet", icon: Briefcase },
    academician: { label: "Academician & Faculty", badge: "emerald", icon: BookOpen },
    institution: { label: "Institutional Portal", badge: "amber", icon: Building2 },
    admin: { label: "System Security Admin", badge: "destructive", icon: ShieldCheck },
  };

  const currentRoleMeta = roleBadges[profile.role] || roleBadges.student;
  const RoleIcon = currentRoleMeta.icon;

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const headline =
    profile.studentProfile?.education ||
    profile.industryProfile?.industryDomain ||
    profile.academicianProfile?.designation ||
    profile.institutionProfile?.institutionName ||
    profile.bio ||
    "TECH-TITAN Ecosystem Member";

  const institutionAffiliation =
    profile.studentProfile?.institution ||
    profile.academicianProfile?.institution ||
    profile.industryProfile?.organizationName ||
    profile.institutionProfile?.institutionName;

  return (
    <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial-glow opacity-30 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left Avatar & Identity Details */}
        <div className="flex items-start sm:items-center gap-5">
          {/* Avatar with Glow Frame */}
          <div className="relative shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[2px] shadow-glow-md">
              <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center font-bold text-xl sm:text-2xl text-cyan-300">
                {initials || <User className="h-8 w-8 text-cyan-400" />}
              </div>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-slate-950 border border-emerald-400/60 flex items-center justify-center shadow-glow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {profile.fullName}
              </h1>
              <Badge variant={currentRoleMeta.badge} dot dotColor="cyan">
                {currentRoleMeta.label.toUpperCase()}
              </Badge>
              {profile.isOnboarded && (
                <Badge variant="emerald" size="sm" className="hidden sm:inline-flex">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> VERIFIED
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium text-cyan-300/90">
              {headline} {institutionAffiliation && `• ${institutionAffiliation}`}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{profile.location}</span>
                </span>
              )}
              <span className="flex items-center gap-1 font-mono">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{profile.email}</span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/80">
                ID: {profile.id}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isOwner && onEditClick && (
            <Button
              variant="glow"
              size="sm"
              onClick={onEditClick}
              leftIcon={<Edit3 className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          )}

          {profile.documents?.find((d) => d.type === "resume") && (
            <a
              href={profile.documents.find((d) => d.type === "resume")?.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="cyber"
                size="sm"
                leftIcon={<Download className="h-4 w-4" />}
              >
                Resume
              </Button>
            </a>
          )}

          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Profile URL copied to clipboard!");
              }
            }}
            leftIcon={<Share2 className="h-4 w-4" />}
          >
            Share
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
