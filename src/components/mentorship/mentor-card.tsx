"use client";

import React, { useRef, useState } from "react";
import {
  Users,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MentorProfileEntity } from "@/lib/supabase/types";

interface MentorCardProps {
  mentor: MentorProfileEntity;
  onRequest: (mentor: MentorProfileEntity) => void;
}

export function MentorCard({ mentor, onRequest }: MentorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotX(-(y / rect.height) * 10);
    setRotY((x / rect.width) * 10);
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
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`,
          transition: "transform 0.15s ease-out",
        }}
        className="h-full"
      >
        <GlassCard
          className="h-full p-6 flex flex-col justify-between space-y-5 border-white/10 hover:border-violet-500/40 transition-all duration-300 relative group overflow-hidden"
          glow
        >
          {/* Top Header */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="violet" size="sm">
                <Sparkles className="h-3 w-3 mr-1" />
                VERIFIED MENTOR
              </Badge>
              <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{mentor.rating.toFixed(2)}</span>
                <span className="text-muted-foreground text-[10px]">({mentor.totalSessionsConducted} sessions)</span>
              </div>
            </div>

            {/* Mentor Bio */}
            <div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-violet-300 transition-colors leading-snug">
                {mentor.mentorName}
              </h3>
              <p className="text-xs font-semibold text-cyan-400 pt-0.5">
                {mentor.currentTitle}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {mentor.companyOrInstitution} • {mentor.yearsOfExperience} Yrs Exp
              </p>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {mentor.bio}
            </p>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {mentor.expertiseAreas.map((area) => (
                <span
                  key={area}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Slots & Action */}
          <div className="space-y-3 pt-3 border-t border-white/[0.06] text-xs font-mono relative z-10">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Rate:</span>
              <span className="font-bold text-emerald-400">{mentor.hourlyRateOrFree}</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span>Next Slot:</span>
              <span className="text-foreground">{mentor.availableSlots[0] || "Flexible"}</span>
            </div>

            <Button
              variant="glow"
              size="sm"
              className="w-full"
              onClick={() => onRequest(mentor)}
              rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              Request 1-on-1 Mentorship
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
