"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Award,
  Briefcase,
  Sparkles,
  FolderGit2,
  FileText,
  Plus,
  ExternalLink,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Layers,
  Percent,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VerifiedCredentialCard } from "@/components/portfolio/verified-credential-card";
import { InstitutionVerifyModal } from "@/components/portfolio/institution-verify-modal";
import { DigitalPortfolioSummary, CredentialType } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrapper";

interface DigitalPortfolioViewProps {
  portfolio: DigitalPortfolioSummary;
  onRefresh: () => void;
}

export function DigitalPortfolioView({ portfolio, onRefresh }: DigitalPortfolioViewProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Verification Modal State
  const [selectedCredForVerify, setSelectedCredForVerify] = useState<{
    id: string;
    type: CredentialType;
    title: string;
  } | null>(null);

  // Add Internship Modal State
  const [isAddInternshipOpen, setIsAddInternshipOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isSubmittingInternship, setIsSubmittingInternship] = useState(false);

  const canVerify = Boolean(
    user && ["institution", "academician", "admin"].includes(user.role)
  );

  const handleAddInternshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInternship(true);
    try {
      const res = await fetch("/api/portfolio/verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          roleTitle,
          location,
          duration,
          description,
          technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
          proofUrl: proofUrl || undefined,
        }),
      });
      if (res.ok) {
        setIsAddInternshipOpen(false);
        setCompanyName("");
        setRoleTitle("");
        setLocation("");
        setDuration("");
        setDescription("");
        setTechInput("");
        setProofUrl("");
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to add internship:", err);
    } finally {
      setIsSubmittingInternship(false);
    }
  };

  const handleVerifySubmit = async (data: any) => {
    try {
      const res = await fetch("/api/portfolio/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  // Compile all items into a unified list
  const allItems: Array<{
    id: string;
    type: CredentialType;
    title: string;
    subtitle?: string;
    description?: string;
    metadata?: string[];
    proofUrl?: string;
    isVerified: boolean;
    verifierBadge?: string;
  }> = [
    // Internships
    ...portfolio.internships.map((i) => ({
      id: i.id,
      type: "internship" as CredentialType,
      title: i.roleTitle,
      subtitle: `${i.companyName} • ${i.duration}`,
      description: i.description,
      metadata: i.technologies,
      proofUrl: i.proofUrl,
      isVerified: i.isVerified,
      verifierBadge: i.verifierBadge,
    })),
    // Projects
    ...portfolio.projects.map((p) => ({
      id: p.id,
      type: "project" as CredentialType,
      title: p.title,
      subtitle: p.repoUrl || p.liveUrl || "GitHub Repository",
      description: p.summary,
      metadata: p.techStack,
      proofUrl: p.liveUrl || p.repoUrl,
      isVerified: p.isVerified,
      verifierBadge: p.verifierBadge,
    })),
    // Skills
    ...portfolio.skills.map((s) => ({
      id: s.id,
      type: "skill" as CredentialType,
      title: s.skillName,
      subtitle: `Proficiency Level: ${s.level.toUpperCase()} (${s.proficiencyScore}%)`,
      metadata: [s.level, `${s.proficiencyScore}% Score`, s.category || "Skill"],
      isVerified: s.isVerified,
      verifierBadge: s.verifierBadge,
    })),
    // Certifications
    ...portfolio.certifications.map((c) => ({
      id: c.id,
      type: "certification" as CredentialType,
      title: c.title,
      subtitle: `${c.issuingOrganization} (${c.issueDate ? new Date(c.issueDate).getFullYear() : "2026"})`,
      metadata: c.credentialId ? [`ID: ${c.credentialId}`] : [],
      proofUrl: c.credentialUrl,
      isVerified: c.isVerified,
      verifierBadge: c.verifierBadge,
    })),
    // Achievements
    ...portfolio.achievements.map((a) => ({
      id: a.id,
      type: "achievement" as CredentialType,
      title: a.title,
      subtitle: a.category.toUpperCase(),
      description: a.description,
      proofUrl: a.proofUrl,
      isVerified: a.isVerified,
      verifierBadge: a.verifierBadge,
    })),
    // Documents
    ...portfolio.documents.map((d) => ({
      id: d.id,
      type: "document" as CredentialType,
      title: d.title,
      subtitle: d.type.toUpperCase(),
      proofUrl: d.fileUrl,
      isVerified: d.isVerified,
      verifierBadge: d.verifierBadge,
    })),
  ];

  // Filter Items
  const filteredItems = allItems.filter((item) => {
    if (activeTab === "verified_only") return item.isVerified;
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* Top Profile Summary Card */}
      <FadeIn>
        <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Bio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="emerald" dot dotColor="emerald">
                  VERIFIED DIGITAL PORTFOLIO
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  CRYPTOGRAPHIC CREDENTIAL LEDGER
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {portfolio.student.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-cyan-400 font-semibold pt-1">
                  {portfolio.student.studentProfile?.education} • {portfolio.student.studentProfile?.institution} ({portfolio.student.studentProfile?.academicYear})
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {portfolio.student.bio || portfolio.student.studentProfile?.experienceSummary || "Full-stack AI systems engineer specializing in low-latency transformer inference, distributed systems, and modern cloud native architectures."}
              </p>
            </div>

            {/* Right: Verification Integrity Badge & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0">
              {/* Integrity Score Box */}
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 text-right space-y-1">
                <div className="flex items-center gap-2 justify-end">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="font-mono font-bold text-lg text-emerald-400">
                    {portfolio.verificationIntegrityScore}% VERIFIED
                  </span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {portfolio.verifiedCount} Verified • {portfolio.selfDeclaredCount} Self-Declared
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => setIsAddInternshipOpen(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Internship
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 cyber-scrollbar">
        {[
          { id: "all", label: `All Credentials (${allItems.length})` },
          { id: "verified_only", label: `🛡️ Verified Only (${portfolio.verifiedCount})` },
          { id: "internship", label: `Internships (${portfolio.internships.length})` },
          { id: "project", label: `Projects (${portfolio.projects.length})` },
          { id: "skill", label: `Skills (${portfolio.skills.length})` },
          { id: "certification", label: `Certifications (${portfolio.certifications.length})` },
          { id: "achievement", label: `Achievements (${portfolio.achievements.length})` },
          { id: "document", label: `Documents (${portfolio.documents.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3D Depth Card Grid */}
      {filteredItems.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-2 border-white/10" glow>
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
          <h4 className="font-bold text-sm text-foreground">No credentials found in this category</h4>
          <p className="text-xs text-muted-foreground">Add new projects or internships to populate your portfolio.</p>
        </GlassCard>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <StaggerItem key={item.id}>
              <VerifiedCredentialCard
                type={item.type}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                metadata={item.metadata}
                proofUrl={item.proofUrl}
                isVerified={item.isVerified}
                verifierBadge={item.verifierBadge}
                canVerify={canVerify}
                onVerifyClick={() =>
                  setSelectedCredForVerify({
                    id: item.id,
                    type: item.type,
                    title: item.title,
                  })
                }
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Add Internship Modal */}
      {isAddInternshipOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-lg p-6 sm:p-8 space-y-5 border-cyan-500/40 shadow-2xl relative" glow>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-base text-foreground">Add Industrial Internship</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddInternshipOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInternshipSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground uppercase font-mono">Company / Organization</label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="e.g. NVIDIA, Google" />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground uppercase font-mono">Role Title</label>
                  <Input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} required placeholder="e.g. AI Systems Intern" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground uppercase font-mono">Location</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Bengaluru / Remote" />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground uppercase font-mono">Duration</label>
                  <Input value={duration} onChange={(e) => setDuration(e.target.value)} required placeholder="e.g. 6 Months (Jan - Jun)" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground uppercase font-mono">Impact & Key Deliverables</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Outline quantifiable achievements and architectures built..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground uppercase font-mono">Technologies (Comma separated)</label>
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="TensorRT, CUDA, PyTorch, Docker" />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground uppercase font-mono">Certificate / Proof Link</label>
                <Input value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="https://drive.google.com/internship-cert.pdf" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddInternshipOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="glow" size="sm" isLoading={isSubmittingInternship}>
                  Save to Portfolio
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Institution Verify Modal */}
      <InstitutionVerifyModal
        isOpen={Boolean(selectedCredForVerify)}
        onClose={() => setSelectedCredForVerify(null)}
        studentId={portfolio.student.id}
        studentName={portfolio.student.fullName}
        credential={selectedCredForVerify}
        onVerifySubmit={handleVerifySubmit}
      />
    </div>
  );
}
