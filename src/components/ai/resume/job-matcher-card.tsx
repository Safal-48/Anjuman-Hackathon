"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Layers,
  Sparkles,
  Check,
  PlusCircle,
  FileText,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TARGET_JOB_TEMPLATES } from "@/lib/ai/resume-analyzer";

interface JobMatcherCardProps {
  selectedJobId: string;
  onSelectJobId: (jobId: string) => void;
  customJobTitle: string;
  onCustomJobTitleChange: (title: string) => void;
  customJobDescription: string;
  onCustomJobDescriptionChange: (desc: string) => void;
}

export function JobMatcherCard({
  selectedJobId,
  onSelectJobId,
  customJobTitle,
  onCustomJobTitleChange,
  customJobDescription,
  onCustomJobDescriptionChange,
}: JobMatcherCardProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);

  return (
    <GlassCard className="p-6 border-white/10 space-y-5" glow>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Target Role & Job Comparison</h3>
            <p className="text-xs text-muted-foreground">
              Compare your resume against industry job benchmarks or paste a custom JD
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-center"
        >
          {isCustomMode ? "← Choose from Curated Job Catalog" : "+ Paste Custom Job Description"}
        </button>
      </div>

      {!isCustomMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TARGET_JOB_TEMPLATES.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => onSelectJobId(job.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? "bg-violet-500/15 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                    : "bg-slate-900/60 border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      ROLE BENCHMARK
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-violet-400 shrink-0" />}
                  </div>
                  <h4 className="text-xs font-bold text-foreground mt-1 leading-snug">
                    {job.title}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                  {job.requiredSkills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                      {s}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="text-[9px] font-mono text-muted-foreground">+{job.requiredSkills.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase font-mono block mb-1.5">
              Custom Job Title
            </label>
            <input
              type="text"
              value={customJobTitle}
              onChange={(e) => onCustomJobTitleChange(e.target.value)}
              placeholder="e.g. Senior Distributed Systems Engineer at CloudCorp"
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase font-mono block mb-1.5">
              Paste Target Job Description (JD)
            </label>
            <textarea
              rows={4}
              value={customJobDescription}
              onChange={(e) => onCustomJobDescriptionChange(e.target.value)}
              placeholder="Paste the full job requirements, skills, responsibilities from LinkedIn, Indeed, or company careers page..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono resize-none"
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
}
