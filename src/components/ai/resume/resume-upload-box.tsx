"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  Code2,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_RESUMES } from "@/lib/ai/resume-analyzer";

interface ResumeUploadBoxProps {
  onAnalyze: (resumeText: string) => void;
  isLoading?: boolean;
}

export function ResumeUploadBox({ onAnalyze, isLoading = false }: ResumeUploadBoxProps) {
  const [activeMode, setActiveMode] = useState<"upload" | "paste">("upload");
  const [rawText, setRawText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setRawText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSelectSample = (sampleKey: keyof typeof SAMPLE_RESUMES) => {
    const sample = SAMPLE_RESUMES[sampleKey];
    if (sample) {
      setSelectedFileName(`${sample.role}_Exemplar.pdf`);
      setRawText(sample.text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    onAnalyze(rawText);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box Card */}
      <GlassCard className="p-6 sm:p-8 border-cyan-500/20 shadow-2xl relative" glow>
        {/* Toggle Mode: File Upload vs Raw Text */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMode("upload")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === "upload"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload PDF / Document
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("paste")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === "paste"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          {/* Sample Benchmark Resume Loaders */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              Try Sample:
            </span>
            <button
              type="button"
              onClick={() => handleSelectSample("ai_engineer")}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              ⭐ Tier-1 AI Engineer
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample("fullstack_developer")}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              Junior Full-Stack
            </button>
          </div>
        </div>

        {/* Mode 1: Drag & Drop Upload Zone */}
        {activeMode === "upload" ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 relative ${
              isDragging
                ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                : "border-white/15 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/60"
            }`}
          >
            <input
              type="file"
              id="resume-file-input"
              accept=".txt,.pdf,.docx,.doc,.rtf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-glow-sm">
                <Upload className="h-8 w-8 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-foreground">
                  {selectedFileName ? (
                    <span className="text-cyan-300 font-mono flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      {selectedFileName}
                    </span>
                  ) : (
                    "Drag & Drop your Resume or Click to Browse"
                  )}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Supports PDF, DOCX, TXT • Evaluates ATS parsing, section integrity, and metrics
                </p>
              </div>

              {selectedFileName && (
                <Badge variant="emerald" size="sm" className="font-mono text-xs">
                  ✓ Resume Loaded ({rawText.split(/\s+/).filter(Boolean).length} words)
                </Badge>
              )}
            </div>
          </div>
        ) : (
          /* Mode 2: Paste Raw Text */
          <div className="space-y-3">
            <textarea
              rows={10}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your complete resume text here (Contact, Education, Technical Skills, Experience, Projects, Certifications)..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none leading-relaxed font-mono resize-none"
            />
            <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
              <span>{rawText.split(/\s+/).filter(Boolean).length} words detected</span>
              <span>Formatting and keywords will be analyzed across ATS criteria</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 mt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Deterministic 0-100 scoring with explainable rubric telemetry.</span>
          </div>

          <Button
            type="button"
            variant="glow"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!rawText.trim() || isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto px-8 py-6 text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Run ATS Diagnostic & Job Comparison →
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
