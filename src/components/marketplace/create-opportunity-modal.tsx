"use client";

import React, { useState } from "react";
import { X, Plus, Sparkles, Building2, Briefcase, MapPin, Calendar, Clock, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpportunityType, LocationType } from "@/lib/supabase/types";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOpportunity: (data: {
    title: string;
    organizationName: string;
    opportunityType: OpportunityType;
    description: string;
    requiredSkills: string[];
    preferredSkills: string[];
    eligibility: string;
    minGpa?: number;
    experienceRequired: string;
    location: string;
    locationType: LocationType;
    stipendSalary: string;
    duration: string;
    deadline: string;
    openingsCount: number;
  }) => Promise<void>;
}

export function CreateOpportunityModal({
  isOpen,
  onClose,
  onSubmitOpportunity,
}: CreateOpportunityModalProps) {
  const [title, setTitle] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [opportunityType, setOpportunityType] = useState<OpportunityType>("internship");
  const [description, setDescription] = useState("");
  const [requiredSkillsInput, setRequiredSkillsInput] = useState("Python, PyTorch, Distributed Systems");
  const [preferredSkillsInput, setPreferredSkillsInput] = useState("Docker, Kubernetes, Next.js");
  const [eligibility, setEligibility] = useState("B.Tech/BE in CS/IT/AI (3rd/4th Year, GPA ≥ 7.5)");
  const [minGpa, setMinGpa] = useState("7.5");
  const [experienceRequired, setExperienceRequired] = useState("Freshers with verified GitHub portfolio");
  const [location, setLocation] = useState("Bengaluru, India (Hybrid)");
  const [locationType, setLocationType] = useState<LocationType>("hybrid");
  const [stipendSalary, setStipendSalary] = useState("₹50,000 / month");
  const [duration, setDuration] = useState("6 Months");
  const [deadline, setDeadline] = useState("2026-06-30");
  const [openingsCount, setOpeningsCount] = useState("3");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const reqSkills = requiredSkillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const prefSkills = preferredSkillsInput.split(",").map((s) => s.trim()).filter(Boolean);

    await onSubmitOpportunity({
      title: title.trim(),
      organizationName: organizationName.trim() || "Titan Industry Partner",
      opportunityType,
      description: description.trim(),
      requiredSkills: reqSkills,
      preferredSkills: prefSkills,
      eligibility: eligibility.trim(),
      minGpa: minGpa ? Number(minGpa) : undefined,
      experienceRequired: experienceRequired.trim(),
      location: location.trim(),
      locationType,
      stipendSalary: stipendSalary.trim(),
      duration: duration.trim(),
      deadline,
      openingsCount: openingsCount ? Number(openingsCount) : 1,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border-cyan-500/40 shadow-2xl relative cyber-scrollbar" glow>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shadow-glow-sm">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Post New Industry Opportunity</h3>
              <p className="text-xs text-muted-foreground">Publish structured internships, jobs, projects, or training programs</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Opportunity Title</label>
              <Input
                placeholder="e.g. Distributed Neural Systems Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Opportunity Type</label>
              <select
                className="h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-cyan-500"
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
              >
                <option value="internship">Internship</option>
                <option value="job">Full-Time Job</option>
                <option value="industry_project">Industry Project Challenge</option>
                <option value="apprenticeship">Apprenticeship</option>
                <option value="training_program">Training Program</option>
                <option value="workshop">Workshop</option>
                <option value="mentorship">Mentorship Track</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Organization Name</label>
            <Input
              placeholder="e.g. Titan Frontier AI Labs"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Description & Key Responsibilities</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project scope, engineering challenges, and team expectations..."
              className="w-full rounded-lg border border-white/10 bg-slate-900/90 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-cyan-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Required Skills (Comma-separated)</label>
              <Input
                placeholder="Python, PyTorch, Distributed Systems"
                value={requiredSkillsInput}
                onChange={(e) => setRequiredSkillsInput(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Preferred Skills (Optional)</label>
              <Input
                placeholder="Docker, Kubernetes, Next.js"
                value={preferredSkillsInput}
                onChange={(e) => setPreferredSkillsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Location</label>
              <Input
                placeholder="Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Location Mode</label>
              <select
                className="h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-cyan-500"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
              >
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Stipend / CTC</label>
              <Input
                placeholder="₹65,000 / month"
                value={stipendSalary}
                onChange={(e) => setStipendSalary(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Duration</label>
              <Input
                placeholder="6 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Deadline Date</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Openings</label>
              <Input
                type="number"
                min="1"
                value={openingsCount}
                onChange={(e) => setOpeningsCount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting} leftIcon={<Plus className="h-4 w-4" />}>
              Publish Opportunity
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
