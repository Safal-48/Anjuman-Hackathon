"use client";

import React, { useState } from "react";
import { Plus, Trash2, Code2, Award, Zap, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import { StudentSkillEntity, SkillLevel } from "@/lib/supabase/types";

interface SkillMatrixProps {
  skills: StudentSkillEntity[];
  isOwner?: boolean;
  onAddSkill?: (data: { skillName: string; level: SkillLevel; proficiencyScore: number; category: string }) => Promise<void>;
  onDeleteSkill?: (id: string) => Promise<void>;
}

export function SkillMatrix({
  skills = [],
  isOwner = false,
  onAddSkill,
  onDeleteSkill,
}: SkillMatrixProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<SkillLevel>("advanced");
  const [proficiencyScore, setProficiencyScore] = useState(85);
  const [category, setCategory] = useState("Web Systems");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levelColorMap: Record<SkillLevel, { label: string; badgeVariant: "cyber" | "emerald" | "violet" | "amber"; barGradient: string }> = {
    expert: { label: "Expert", badgeVariant: "cyber", barGradient: "from-cyan-400 to-blue-500" },
    advanced: { label: "Advanced", badgeVariant: "emerald", barGradient: "from-emerald-400 to-teal-500" },
    intermediate: { label: "Intermediate", badgeVariant: "violet", barGradient: "from-violet-400 to-purple-500" },
    beginner: { label: "Beginner", badgeVariant: "amber", barGradient: "from-amber-400 to-orange-500" },
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !onAddSkill) return;
    setIsSubmitting(true);
    await onAddSkill({
      skillName: skillName.trim(),
      level,
      proficiencyScore,
      category,
    });
    setSkillName("");
    setIsSubmitting(false);
    setIsAdding(false);
  };

  return (
    <GlassCard className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Verified Skill Matrix</h2>
            <p className="text-xs text-muted-foreground">Proficiency telemetry & verified competency indicators</p>
          </div>
        </div>

        {isOwner && onAddSkill && (
          <Button
            variant="cyber"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isAdding ? "Cancel" : "Add Skill"}
          </Button>
        )}
      </div>

      {/* Add Skill Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 space-y-4 animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Skill Name</label>
              <Input
                placeholder="e.g. Next.js, PyTorch, Kubernetes"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Domain Category</label>
              <select
                className="flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-cyan-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Web Systems">Distributed & Web Systems</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cybersecurity">Cybersecurity & Cryptography</option>
                <option value="Graphics & 3D">Graphics & 3D WebGL</option>
                <option value="Core Engineering">Core Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Competency Level</label>
              <select
                className="flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-cyan-500"
                value={level}
                onChange={(e) => {
                  const val = e.target.value as SkillLevel;
                  setLevel(val);
                  if (val === "expert") setProficiencyScore(95);
                  else if (val === "advanced") setProficiencyScore(85);
                  else if (val === "intermediate") setProficiencyScore(70);
                  else setProficiencyScore(50);
                }}
              >
                <option value="beginner">Beginner (1 - 50%)</option>
                <option value="intermediate">Intermediate (50 - 75%)</option>
                <option value="advanced">Advanced (75 - 90%)</option>
                <option value="expert">Expert (90 - 100%)</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase">Proficiency Rating</span>
                <span className="font-mono text-cyan-400 font-bold">{proficiencyScore}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={proficiencyScore}
                onChange={(e) => setProficiencyScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting}>
              Save Skill to Matrix
            </Button>
          </div>
        </form>
      )}

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Skills Verified Yet"
          description="Add technical skills with proficiency levels to power automated matchmaking."
          action={
            isOwner && onAddSkill ? (
              <Button variant="cyber" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Add First Skill
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((s) => {
            const meta = levelColorMap[s.level] || levelColorMap.intermediate;
            return (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/15 transition-all space-y-2.5 group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground group-hover:text-cyan-300 transition-colors">
                      {s.skillName}
                    </span>
                    <Badge variant={meta.badgeVariant} size="sm">
                      {meta.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {s.proficiencyScore}%
                    </span>
                    {isOwner && onDeleteSkill && (
                      <button
                        type="button"
                        onClick={() => onDeleteSkill(s.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 p-1 transition-opacity"
                        title="Delete skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${meta.barGradient} transition-all duration-500 rounded-full`}
                    style={{ width: `${s.proficiencyScore}%` }}
                  />
                </div>

                {s.category && (
                  <span className="text-[10px] font-mono text-muted-foreground/80 block">
                    {s.category}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
