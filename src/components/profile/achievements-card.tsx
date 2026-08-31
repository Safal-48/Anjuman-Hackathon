"use client";

import React, { useState } from "react";
import { Trophy, Plus, Trash2, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { AchievementEntity, AchievementCategory } from "@/lib/supabase/types";

interface AchievementsCardProps {
  achievements: AchievementEntity[];
  isOwner?: boolean;
  onAddAchievement?: (data: { title: string; category: AchievementCategory; description: string; proofUrl?: string }) => Promise<void>;
  onDeleteAchievement?: (id: string) => Promise<void>;
}

export function AchievementsCard({
  achievements = [],
  isOwner = false,
  onAddAchievement,
  onDeleteAchievement,
}: AchievementsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AchievementCategory>("hackathon");
  const [description, setDescription] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !onAddAchievement) return;
    setIsSubmitting(true);
    await onAddAchievement({
      title: title.trim(),
      category,
      description: description.trim(),
      proofUrl: proofUrl.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setProofUrl("");
    setIsSubmitting(false);
    setIsAdding(false);
  };

  const categoryBadges: Record<AchievementCategory, { label: string; variant: "cyber" | "violet" | "emerald" | "amber" }> = {
    hackathon: { label: "Hackathon", variant: "cyber" },
    award: { label: "Award / Honor", variant: "amber" },
    publication: { label: "Publication", variant: "emerald" },
    competition: { label: "Competition", variant: "violet" },
    patent: { label: "Patent", variant: "cyber" },
    other: { label: "Achievement", variant: "cyber" },
  };

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Honors & Achievements</h2>
            <p className="text-xs text-muted-foreground">Hackathon awards, research publications, and verified competitive achievements</p>
          </div>
        </div>

        {isOwner && onAddAchievement && (
          <Button
            variant="cyber"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isAdding ? "Cancel" : "Add Honor"}
          </Button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-3 animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Achievement Title</label>
              <Input
                placeholder="e.g. Smart India Hackathon Finalist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
              <select
                className="flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-amber-500"
                value={category}
                onChange={(e) => setCategory(e.target.value as AchievementCategory)}
              >
                <option value="hackathon">Hackathon</option>
                <option value="competition">Competitive Programming / Contest</option>
                <option value="publication">Research Paper / Publication</option>
                <option value="award">Academic / Industry Award</option>
                <option value="patent">Patent Filing</option>
                <option value="other">Other Distinction</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Description & Context</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-slate-900/80 p-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-amber-500"
              placeholder="Describe your achievement, rank, or impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Proof / Public Link (Optional)</label>
            <Input
              placeholder="https://..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting}>
              Save Achievement
            </Button>
          </div>
        </form>
      )}

      {achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Honors Listed"
          description="Add hackathon victories, contest ranks, or research papers to elevate your profile credibility."
        />
      ) : (
        <div className="space-y-3">
          {achievements.map((ach) => {
            const meta = categoryBadges[ach.category] || categoryBadges.award;
            return (
              <div
                key={ach.id}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-amber-500/30 transition-all flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-amber-300 transition-colors">
                      {ach.title}
                    </h4>
                    <Badge variant={meta.variant} size="sm">
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {ach.proofUrl && (
                    <a
                      href={ach.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Proof</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {isOwner && onDeleteAchievement && (
                    <button
                      type="button"
                      onClick={() => onDeleteAchievement(ach.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 p-1 transition-opacity"
                      title="Delete achievement"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
