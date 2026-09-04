"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  FileCheck2,
  ExternalLink,
  X,
  Briefcase,
  Building2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { OpportunityEntity } from "@/lib/supabase/types";

interface ApplicationSuccessModalProps {
  isOpen: boolean;
  opportunity: OpportunityEntity | null;
  onClose: () => void;
  applicationRef?: string;
}

export function ApplicationSuccessModal({
  isOpen,
  opportunity,
  onClose,
  applicationRef = `SKL-APP-${Math.floor(100000 + Math.random() * 900000)}`,
}: ApplicationSuccessModalProps) {
  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <SlideUp className="w-full max-w-xl">
        <GlassCard
          className="p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-b from-slate-900/95 via-slate-950 to-emerald-950/25 shadow-[0_0_60px_rgba(16,185,129,0.18)] relative overflow-hidden rounded-3xl"
          glow
        >
          {/* Subtle Ambient Glowing Background Orb */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors z-10"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon & Verification Badge */}
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="relative">
              <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)] animate-bounce duration-1000">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Application Verified &amp; Transmitted</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Application Successfully Submitted!
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span>Reference ID:</span>
              <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                {applicationRef}
              </span>
            </div>
          </div>

          {/* Target Role & Entity Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Target Opportunity</span>
              <Badge variant="cyber" className="text-[10px] uppercase font-mono">
                {opportunity.opportunityType}
              </Badge>
            </div>
            <h3 className="text-lg font-black text-white leading-snug">
              {opportunity.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium pt-1">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>{opportunity.organizationName || "Industry Partner"}</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <span>{opportunity.locationType}</span>
              </span>
            </div>
          </div>

          {/* Professional Narrative Paragraph */}
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            <p>
              Your candidacy dossier—including your <strong className="text-white font-semibold">Verified Skill DNA</strong>, <strong className="text-white font-semibold">Empirical Diagnostic Proofs</strong>, and <strong className="text-white font-semibold">ATS-Aligned Credentials</strong>—has been formally submitted to the hiring and selection committee.
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              A cryptographic timestamp has been logged on your institutional profile. The recruiting panel reviews qualified submissions continuously; you will receive automated notifications upon status transitions.
            </p>
          </div>

          {/* 3 Status Pillar Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center space-y-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mx-auto" />
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Skill DNA</div>
              <div className="text-xs font-bold text-emerald-300">100% Verified</div>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center space-y-1">
              <FileCheck2 className="h-4 w-4 text-cyan-400 mx-auto" />
              <div className="text-[10px] font-mono uppercase text-muted-foreground">ATS Dispatch</div>
              <div className="text-xs font-bold text-cyan-300">Delivered</div>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-center space-y-1">
              <Clock className="h-4 w-4 text-indigo-400 mx-auto" />
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Response</div>
              <div className="text-xs font-bold text-indigo-300">2-3 Work Days</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="cyber"
              size="lg"
              className="w-full sm:flex-1 font-bold text-sm"
              onClick={onClose}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Done &amp; Explore More
            </Button>

            <Link href="/progress/performance" className="w-full sm:w-auto">
              <Button
                variant="glow"
                size="lg"
                className="w-full font-bold text-sm"
                rightIcon={<ExternalLink className="h-4 w-4" />}
              >
                Track Proven Skills
              </Button>
            </Link>
          </div>
        </GlassCard>
      </SlideUp>
    </div>
  );
}
