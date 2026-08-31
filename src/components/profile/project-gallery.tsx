"use client";

import React, { useState } from "react";
import { FolderGit2, Plus, ExternalLink, Github, Trash2, Edit2, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectEntity } from "@/lib/supabase/types";

interface ProjectGalleryProps {
  projects: ProjectEntity[];
  isOwner?: boolean;
  onAddProject?: (data: { title: string; summary: string; techStack: string[]; liveUrl?: string; repoUrl?: string }) => Promise<void>;
  onDeleteProject?: (id: string) => Promise<void>;
}

export function ProjectGallery({
  projects = [],
  isOwner = false,
  onAddProject,
  onDeleteProject,
}: ProjectGalleryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [techStackInput, setTechStackInput] = useState("React, TypeScript, PyTorch");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !onAddProject) return;
    setIsSubmitting(true);
    const stack = techStackInput.split(",").map((s) => s.trim()).filter(Boolean);
    await onAddProject({
      title: title.trim(),
      summary: summary.trim(),
      techStack: stack,
      liveUrl: liveUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
    });
    setTitle("");
    setSummary("");
    setLiveUrl("");
    setRepoUrl("");
    setIsSubmitting(false);
    setIsAdding(false);
  };

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Featured Project Portfolio</h2>
            <p className="text-xs text-muted-foreground">Engineering prototypes, open source work, and verified systems</p>
          </div>
        </div>

        {isOwner && onAddProject && (
          <Button
            variant="cyber"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isAdding ? "Cancel" : "Add Project"}
          </Button>
        )}
      </div>

      {/* Add Project Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-xl bg-black/40 border border-violet-500/30 space-y-4 animate-in fade-in duration-200"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Project Title</label>
            <Input
              placeholder="e.g. Distributed Neural Cache Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Project Summary & Impact</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-slate-900/80 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-violet-500"
              placeholder="Describe the architectural solution, key challenges, and performance metrics..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Technologies Used (Comma Separated)</label>
            <Input
              placeholder="e.g. Next.js, PyTorch, Docker, TensorRT"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Live Deployment URL (Optional)</label>
              <Input
                placeholder="https://my-app.domain.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Repository URL (Optional)</label>
              <Input
                placeholder="https://github.com/user/project"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm" isLoading={isSubmitting}>
              Publish Project
            </Button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No Projects Published"
          description="Showcase high-impact engineering projects with live links to boost your career readiness."
          action={
            isOwner && onAddProject ? (
              <Button variant="cyber" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Add First Project
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base text-foreground group-hover:text-violet-300 transition-colors">
                    {proj.title}
                  </h3>
                  {isOwner && onDeleteProject && (
                    <button
                      type="button"
                      onClick={() => onDeleteProject(proj.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 p-1 transition-opacity"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {proj.summary}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1">
                  {(proj.techStack || []).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* External Action Links */}
                <div className="flex items-center gap-3 pt-1">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Repository</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
