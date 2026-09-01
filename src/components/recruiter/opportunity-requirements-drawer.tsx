"use client";

import React, { useState } from "react";
import {
  Sliders,
  Check,
  X,
  Plus,
  Target,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpportunityRequirementConfig } from "@/lib/analytics/candidate-intelligence-engine";

interface OpportunityRequirementsDrawerProps {
  currentConfig: OpportunityRequirementConfig;
  allPresetConfigs: OpportunityRequirementConfig[];
  onSelectPreset: (presetId: string) => void;
  onApplyCustomConfig: (config: OpportunityRequirementConfig) => void;
  onClose: () => void;
}

export function OpportunityRequirementsDrawer({
  currentConfig,
  allPresetConfigs,
  onSelectPreset,
  onApplyCustomConfig,
  onClose,
}: OpportunityRequirementsDrawerProps) {
  const [roleTitle, setRoleTitle] = useState(currentConfig.roleTitle);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(currentConfig.requiredSkills);
  const [preferredSkills, setPreferredSkills] = useState<string[]>(currentConfig.preferredSkills);
  const [minEducation, setMinEducation] = useState(currentConfig.minEducation);
  const [minResumeThreshold, setMinResumeThreshold] = useState(currentConfig.minResumeReadinessThreshold);
  const [minAssessmentThreshold, setMinAssessmentThreshold] = useState(currentConfig.minAssessmentScoreThreshold);

  const [newRequiredSkill, setNewRequiredSkill] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");

  const addRequiredSkill = () => {
    if (newRequiredSkill.trim() && !requiredSkills.includes(newRequiredSkill.trim())) {
      setRequiredSkills([...requiredSkills, newRequiredSkill.trim()]);
      setNewRequiredSkill("");
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const addPreferredSkill = () => {
    if (newPreferredSkill.trim() && !preferredSkills.includes(newPreferredSkill.trim())) {
      setPreferredSkills([...preferredSkills, newPreferredSkill.trim()]);
      setNewPreferredSkill("");
    }
  };

  const removePreferredSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    const updated: OpportunityRequirementConfig = {
      id: `custom-${Date.now()}`,
      roleTitle,
      department: currentConfig.department,
      requiredSkills,
      preferredSkills,
      minEducation,
      minGraduationYear: currentConfig.minGraduationYear,
      maxExperienceYears: currentConfig.maxExperienceYears,
      minResumeReadinessThreshold: minResumeThreshold,
      minAssessmentScoreThreshold: minAssessmentThreshold,
    };
    onApplyCustomConfig(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-2xl p-6 sm:p-8 space-y-6 border-cyan-500/30 max-h-[90vh] overflow-y-auto" glow>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold text-foreground font-mono">
                Define Opportunity Requirements & Thresholds
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">
                Configure eligibility criteria vs matching weights
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preset Selectors */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-muted-foreground uppercase">
            Select Opportunity Preset:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {allPresetConfigs.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectPreset(preset.id);
                  setRoleTitle(preset.roleTitle);
                  setRequiredSkills(preset.requiredSkills);
                  setPreferredSkills(preset.preferredSkills);
                  setMinEducation(preset.minEducation);
                  setMinResumeThreshold(preset.minResumeReadinessThreshold);
                  setMinAssessmentThreshold(preset.minAssessmentScoreThreshold);
                }}
                className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                  currentConfig.id === preset.id
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-glow-sm"
                    : "bg-slate-900/60 border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-bold block truncate">{preset.roleTitle}</span>
                <span className="text-[10px] text-muted-foreground">{preset.requiredSkills.length} Required Skills</span>
              </button>
            ))}
          </div>
        </div>

        {/* Role Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-muted-foreground uppercase">
            Role Title:
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs sm:text-sm text-foreground font-mono outline-none focus:border-cyan-500"
          />
        </div>

        {/* Required Skills (Mandatory for Eligibility) */}
        <div className="space-y-2 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-300 uppercase">
              1. Required Skills (Mandatory for Binary Eligibility):
            </span>
            <Badge variant="destructive" size="sm" className="font-mono text-[9px]">
              CRITICAL GATE
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {requiredSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-black/60 text-rose-200 border border-rose-500/30 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button type="button" onClick={() => removeRequiredSkill(skill)} className="hover:text-rose-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newRequiredSkill}
              onChange={(e) => setNewRequiredSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequiredSkill())}
              placeholder="Add required skill (e.g. Python, SQL)..."
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 p-2 text-xs font-mono text-foreground outline-none"
            />
            <Button type="button" variant="glass" size="sm" onClick={addRequiredSkill} className="text-xs font-mono">
              + Add
            </Button>
          </div>
        </div>

        {/* Preferred Skills (Boosts Match Score) */}
        <div className="space-y-2 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
              2. Preferred Skills (Boosts Explainable Match Score):
            </span>
            <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
              MATCH BONUS
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {preferredSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-black/60 text-cyan-200 border border-cyan-500/30 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button type="button" onClick={() => removePreferredSkill(skill)} className="hover:text-cyan-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newPreferredSkill}
              onChange={(e) => setNewPreferredSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreferredSkill())}
              placeholder="Add preferred skill (e.g. Power BI, Kubernetes)..."
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 p-2 text-xs font-mono text-foreground outline-none"
            />
            <Button type="button" variant="glass" size="sm" onClick={addPreferredSkill} className="text-xs font-mono">
              + Add
            </Button>
          </div>
        </div>

        {/* Threshold Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Resume ATS Threshold:</span>
              <strong className="text-cyan-300">{minResumeThreshold}%</strong>
            </div>
            <input
              type="range"
              min={50}
              max={90}
              step={5}
              value={minResumeThreshold}
              onChange={(e) => setMinResumeThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-muted-foreground block">
              Default KaushalSetu application threshold: 70%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Assessment Evidence Threshold:</span>
              <strong className="text-violet-300">{minAssessmentThreshold}%</strong>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              step={5}
              value={minAssessmentThreshold}
              onChange={(e) => setMinAssessmentThreshold(Number(e.target.value))}
              className="w-full accent-violet-400"
            />
            <span className="text-[10px] text-muted-foreground block">
              Benchmark technical readiness cutoff
            </span>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <Button type="button" variant="glass" size="default" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>
          <Button
            type="button"
            variant="glow"
            size="default"
            onClick={handleSave}
            className="px-6 text-xs font-mono font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Apply & Recalculate Talent Pool →
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
