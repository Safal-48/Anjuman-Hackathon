"use client";

import React from "react";
import {
  Building2,
  Briefcase,
  BookOpen,
  GraduationCap,
  Globe,
  Mail,
  User,
  MapPin,
  QrCode,
  ShieldCheck,
  ExternalLink,
  FlaskConical,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FullUserProfile } from "@/lib/supabase/types";

export function IndustryProfileView({ profile }: { profile: FullUserProfile }) {
  const p = profile.industryProfile;
  if (!p) return null;

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Organization Telemetry</h2>
              <p className="text-xs text-muted-foreground">Corporate profile, scale, and operational domains</p>
            </div>
          </div>
          <Badge variant="violet" size="sm">
            {p.organizationSize} EMPLOYEES
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Organization Name</span>
            <p className="text-sm font-semibold text-foreground">{p.organizationName}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Primary Domain</span>
            <p className="text-sm font-semibold text-foreground">{p.industryDomain}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Official Website</span>
            {p.website ? (
              <a href={p.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <span className="truncate">{p.website.replace(/^https?:\/\//, "")}</span>
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">Not provided</p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1.5">
          <span className="text-xs font-semibold uppercase text-violet-300">About Organization & Mission</span>
          <p className="text-sm text-foreground/90 leading-relaxed">{p.organizationDescription}</p>
        </div>
      </GlassCard>

      {/* Recruiter Credentials */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Talent Acquisition Representative</h2>
            <p className="text-xs text-muted-foreground">Designated recruiter credentials and point of contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Recruiter Name</span>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>{p.recruiterName}</span>
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Designation</span>
            <p className="text-sm font-semibold text-foreground">{p.recruiterDesignation}</p>
          </div>
        </div>

        {/* Talent Domains */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target Talent Sourcing Focus
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(p.hiringInterests || ["AI Engineers", "Embedded Systems", "Full Stack Architects"]).map((h) => (
              <Badge key={h} variant="violet" size="sm">
                {h}
              </Badge>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function AcademicianProfileView({ profile }: { profile: FullUserProfile }) {
  const p = profile.academicianProfile;
  if (!p) return null;

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Academic Affiliation & Department</h2>
              <p className="text-xs text-muted-foreground">University credentials and research mentorship profile</p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            {p.experienceYears}+ YEARS EXPERIENCE
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Institution</span>
            <p className="text-sm font-semibold text-foreground">{p.institution}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Department</span>
            <p className="text-sm font-semibold text-foreground">{p.department}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Designation</span>
            <p className="text-sm font-semibold text-foreground">{p.designation}</p>
          </div>
        </div>

        {/* Expertise areas */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Primary Domains of Expertise
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(p.expertise || ["Deep Learning", "Quantum Computing", "High Performance Computing"]).map((e) => (
              <Badge key={e} variant="emerald" size="sm">
                {e}
              </Badge>
            ))}
          </div>
        </div>

        {/* Research Interests */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
            <span>Active Research & Lab Topics</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(p.researchInterests || ["Multi-Agent Orchestration", "Explainable AI"]).map((r) => (
              <Badge key={r} variant="cyber" size="sm">
                {r}
              </Badge>
            ))}
          </div>
        </div>

        {p.scholarProfile && (
          <div className="pt-2">
            <a href={p.scholarProfile} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono">
              <span>View Google Scholar / Research Profile</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export function InstitutionProfileView({ profile }: { profile: FullUserProfile }) {
  const p = profile.institutionProfile;
  if (!p) return null;

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Institutional Command Registry</h2>
              <p className="text-xs text-muted-foreground">Accreditation telemetry and campus administrative profile</p>
            </div>
          </div>
          <Badge variant="amber" size="sm">
            {p.registrationCode || "AISHE CERTIFIED"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Official Name</span>
            <p className="text-sm font-semibold text-foreground">{p.institutionName}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Category Type</span>
            <p className="text-sm font-semibold text-foreground uppercase">{p.institutionType.replace("_", " ")}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Campus Location</span>
            <p className="text-sm font-semibold text-foreground">{p.city}, {p.state}</p>
          </div>
        </div>

        {/* Authorized Representative */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3 pt-4">
          <span className="text-xs font-semibold uppercase text-amber-400">Authorized Liaison Representative</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Name & Title</span>
              <p className="font-semibold text-foreground">{p.representativeName} ({p.representativeDesignation})</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Official Liaison Email</span>
              <p className="font-mono text-xs text-cyan-400">{p.representativeEmail}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
