"use client";

import React, { useRef, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Award,
  Briefcase,
  Code2,
  FolderGit2,
  FileText,
  ExternalLink,
  Lock,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CredentialType } from "@/lib/supabase/types";

interface VerifiedCredentialCardProps {
  type: CredentialType;
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: string[];
  proofUrl?: string;
  isVerified: boolean;
  verifierBadge?: string;
  verificationHash?: string;
  onVerifyClick?: () => void;
  canVerify?: boolean;
}

export function VerifiedCredentialCard({
  type,
  title,
  subtitle,
  description,
  metadata = [],
  proofUrl,
  isVerified,
  verifierBadge = "Institution Verified",
  verificationHash,
  onVerifyClick,
  canVerify = false,
}: VerifiedCredentialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const typeConfig: Record<
    CredentialType,
    { icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    skill: { icon: Sparkles, color: "text-cyan-400" },
    project: { icon: FolderGit2, color: "text-violet-400" },
    certification: { icon: Award, color: "text-amber-400" },
    internship: { icon: Briefcase, color: "text-emerald-400" },
    achievement: { icon: Award, color: "text-blue-400" },
    document: { icon: FileText, color: "text-slate-400" },
  };

  const Icon = typeConfig[type]?.icon || Sparkles;

  // 3D Perspective Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotX(-(y / rect.height) * 12);
    setRotY((x / rect.width) * 12);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className="h-full"
    >
      <div
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${isVerified ? "12px" : "0px"})`,
          transition: "transform 0.15s ease-out",
        }}
        className="h-full"
      >
        <GlassCard
          className={`h-full p-5 flex flex-col justify-between space-y-4 transition-all duration-300 relative group overflow-hidden ${
            isVerified
              ? "border-emerald-500/40 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
              : "border-white/10 hover:border-white/20"
          }`}
          glow={isVerified}
        >
          {/* Ambient Corner Specular Glow for Verified Items */}
          {isVerified && (
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
          )}

          <div className="space-y-3 relative z-10">
            {/* Header: Type & Verification Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                  <Icon className={`h-4 w-4 ${typeConfig[type]?.color}`} />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  {type}
                </span>
              </div>

              {isVerified ? (
                <Badge variant="emerald" size="sm" className="shadow-glow-sm">
                  <ShieldCheck className="h-3 w-3 mr-1 text-emerald-400" />
                  {verifierBadge.toUpperCase()}
                </Badge>
              ) : (
                <Badge variant="outline" size="sm" className="text-muted-foreground border-white/10">
                  SELF-DECLARED
                </Badge>
              )}
            </div>

            {/* Title & Subtitle */}
            <div>
              <h4 className="font-bold text-base text-foreground group-hover:text-cyan-300 transition-colors leading-snug">
                {title}
              </h4>
              {subtitle && (
                <p className="text-xs font-semibold text-cyan-400 pt-0.5">{subtitle}</p>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {description}
              </p>
            )}

            {/* Metadata Tags */}
            {metadata.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {metadata.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-muted-foreground border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Verification Ledger & Links */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs font-mono relative z-10">
            {isVerified ? (
              <div className="flex items-center gap-1.5 text-emerald-400/90 text-[10px]">
                <FileCheck2 className="h-3.5 w-3.5" />
                <span className="truncate max-w-[160px]">
                  {verificationHash || "TITAN-VERIFIED-AUTH"}
                </span>
              </div>
            ) : (
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3 opacity-60" />
                <span>Pending Audit</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {proofUrl && (
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-muted-foreground hover:text-cyan-300 hover:bg-white/5 transition-colors"
                  title="View Certificate / Artifact"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {canVerify && !isVerified && onVerifyClick && (
                <button
                  type="button"
                  onClick={onVerifyClick}
                  className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold hover:bg-cyan-500/30 transition-colors"
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
