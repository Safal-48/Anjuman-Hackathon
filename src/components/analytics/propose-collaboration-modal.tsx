"use client";

import React, { useState } from "react";
import { X, Send, Sparkles, Building2, FlaskConical, GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AcademicianCollaborationEntity } from "@/lib/analytics/role-analytics";

interface ProposeCollaborationModalProps {
  collaboration: AcademicianCollaborationEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (data: {
    collaborationId: string;
    facultyName: string;
    department: string;
    institution: string;
    proposalSummary: string;
  }) => Promise<void>;
}

export function ProposeCollaborationModal({
  collaboration,
  isOpen,
  onClose,
  onSubmitProposal,
}: ProposeCollaborationModalProps) {
  const [facultyName, setFacultyName] = useState("Dr. Rajeshwar Rao");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [institution, setInstitution] = useState("Indian Institute of Technology");
  const [proposalSummary, setProposalSummary] = useState(
    "I lead the Distributed Systems & AI Architecture Research Group with 14 published IEEE/ACM papers. I propose to co-investigate low-latency model quantization pipelines and host joint student workshops."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !collaboration) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalSummary.trim()) return;

    setIsSubmitting(true);
    await onSubmitProposal({
      collaborationId: collaboration.id,
      facultyName,
      department,
      institution,
      proposalSummary,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border-violet-500/40 shadow-2xl relative cyber-scrollbar" glow>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shadow-glow-sm">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Submit Faculty Collaboration Proposal</h3>
              <p className="text-xs text-muted-foreground">
                {collaboration.title} • {collaboration.organizationName}
              </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Lead Faculty Name</label>
              <Input
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">Department</label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">University / Institution</label>
            <Input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Collaboration Scope & Research Abstract
            </label>
            <textarea
              rows={4}
              value={proposalSummary}
              onChange={(e) => setProposalSummary(e.target.value)}
              placeholder="Outline research alignment, lab resources, prior publications, or curriculum integration plans..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-violet-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting} leftIcon={<Send className="h-4 w-4" />}>
              Submit Proposal to {collaboration.organizationName}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
