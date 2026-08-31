"use client";

import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, Lock, Award, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CredentialType } from "@/lib/supabase/types";

interface InstitutionVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  credential: {
    id: string;
    type: CredentialType;
    title: string;
  } | null;
  onVerifySubmit: (data: {
    studentId: string;
    credentialType: CredentialType;
    credentialId: string;
    verificationBadge: string;
    verifierNotes: string;
  }) => Promise<void>;
}

export function InstitutionVerifyModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  credential,
  onVerifySubmit,
}: InstitutionVerifyModalProps) {
  const [verificationBadge, setVerificationBadge] = useState("Institution Verified");
  const [verifierNotes, setVerifierNotes] = useState(
    "Verified against official department records, coursework evaluations, and institutional assessment criteria."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !credential) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onVerifySubmit({
      studentId,
      credentialType: credential.type,
      credentialId: credential.id,
      verificationBadge,
      verifierNotes,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg p-6 sm:p-8 space-y-6 border-emerald-500/40 shadow-2xl relative" glow>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-glow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Authenticate & Stamp Credential</h3>
              <p className="text-xs text-muted-foreground">
                Institutional Ledger Verification for {studentName}
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

        {/* Selected Credential Summary */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">
            Target {credential.type}
          </span>
          <p className="font-bold text-sm text-foreground">{credential.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Verification Badge Seal Title
            </label>
            <select
              value={verificationBadge}
              onChange={(e) => setVerificationBadge(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-slate-900 px-3 text-xs text-foreground font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="Institution Verified">Institution Verified (Department Approved)</option>
              <option value="Faculty Endorsed">Faculty Endorsed (Capstone Evaluated)</option>
              <option value="Industry Benchmark Verified">Industry Benchmark Verified</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Official Audit Remarks / Ledger Notes
            </label>
            <textarea
              rows={3}
              value={verifierNotes}
              onChange={(e) => setVerifierNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
            >
              Stamp Cryptographic Seal
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
