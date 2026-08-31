"use client";

import React, { useState } from "react";
import { Award, Plus, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { CertificationEntity } from "@/lib/supabase/types";

interface CertificationsCardProps {
  certifications: CertificationEntity[];
  isOwner?: boolean;
  onAddCert?: (data: { title: string; issuingOrganization: string; credentialId?: string; credentialUrl?: string }) => Promise<void>;
  onDeleteCert?: (id: string) => Promise<void>;
}

export function CertificationsCard({
  certifications = [],
  isOwner = false,
  onAddCert,
  onDeleteCert,
}: CertificationsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || !onAddCert) return;
    setIsSubmitting(true);
    await onAddCert({
      title: title.trim(),
      issuingOrganization: issuer.trim(),
      credentialId: credentialId.trim() || undefined,
      credentialUrl: credentialUrl.trim() || undefined,
    });
    setTitle("");
    setIssuer("");
    setCredentialId("");
    setCredentialUrl("");
    setIsSubmitting(false);
    setIsAdding(false);
  };

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Certifications & Credentials</h2>
            <p className="text-xs text-muted-foreground">Accredited certifications and industry credentials</p>
          </div>
        </div>

        {isOwner && onAddCert && (
          <Button
            variant="cyber"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isAdding ? "Cancel" : "Add Certificate"}
          </Button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Certificate Title</label>
              <Input
                placeholder="e.g. AWS Certified Solutions Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Issuing Organization</label>
              <Input
                placeholder="e.g. Amazon Web Services, Google, DeepLearning.AI"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Credential ID (Optional)</label>
              <Input
                placeholder="e.g. AWS-SAA-90412"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Verification URL (Optional)</label>
              <Input
                placeholder="https://..."
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting}>
              Save Certificate
            </Button>
          </div>
        </form>
      )}

      {certifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certifications Listed"
          description="Add your official cloud, AI, or developer certifications to strengthen your profile."
        />
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-emerald-300 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuingOrganization}
                    {cert.credentialId && ` • ID: ${cert.credentialId}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Verify</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {isOwner && onDeleteCert && (
                  <button
                    type="button"
                    onClick={() => onDeleteCert(cert.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 p-1 transition-opacity"
                    title="Delete certificate"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
