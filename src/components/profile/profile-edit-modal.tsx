"use client";

import React, { useState } from "react";
import { X, Save, User, MapPin, Target, GraduationCap, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FullUserProfile } from "@/lib/supabase/types";

interface ProfileEditModalProps {
  profile: FullUserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    fullName?: string;
    bio?: string;
    location?: string;
    careerGoal?: string;
    education?: string;
    organizationName?: string;
  }) => Promise<void>;
}

export function ProfileEditModal({ profile, isOpen, onClose, onSave }: ProfileEditModalProps) {
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [location, setLocation] = useState(profile.location || "");
  const [careerGoal, setCareerGoal] = useState(profile.studentProfile?.careerGoal || "");
  const [education, setEducation] = useState(profile.studentProfile?.education || "");
  const [organizationName, setOrganizationName] = useState(profile.industryProfile?.organizationName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      fullName,
      location,
      careerGoal,
      education,
      organizationName,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg p-6 space-y-5 border-cyan-500/40 shadow-2xl relative" glow>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="font-bold text-lg text-foreground">Edit Identity & Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Location / City</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4" />}
              placeholder="e.g. Bengaluru, India"
            />
          </div>

          {profile.role === "student" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Degree & Academic Major</label>
                <Input
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                  placeholder="e.g. B.Tech Computer Science & AI"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Career Goal</label>
                <textarea
                  rows={3}
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/80 p-3 text-sm text-foreground focus:ring-1 focus:ring-cyan-500"
                  placeholder="Primary professional trajectory..."
                />
              </div>
            </>
          )}

          {profile.role === "industry" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Organization Name</label>
              <Input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                leftIcon={<Building2 className="h-4 w-4" />}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
