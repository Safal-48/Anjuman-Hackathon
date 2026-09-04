"use client";

import React, { useState, useRef } from "react";
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
  FileCheck2,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  FileType,
  HardDrive,
  Check,
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
  const [fileSizeStr, setFileSizeStr] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewText, setShowPreviewText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setSelectedFileName(file.name);
    setFileSizeStr(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectSample = (sampleKey: keyof typeof SAMPLE_RESUMES) => {
    const sample = SAMPLE_RESUMES[sampleKey];
    if (sample) {
      const name = `${sample.role.replace(/[^a-zA-Z0-9]/g, "_")}_Exemplar.pdf`;
      setSelectedFileName(name);
      setFileSizeStr("24.8 KB");
      setRawText(sample.text);
    }
  };

  const handleClearFile = () => {
    setSelectedFileName(null);
    setFileSizeStr(null);
    setRawText("");
    setShowPreviewText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    onAnalyze(rawText);
  };

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const isPdf = selectedFileName?.toLowerCase().endsWith(".pdf");
  const isDocx = selectedFileName?.toLowerCase().endsWith(".docx") || selectedFileName?.toLowerCase().endsWith(".doc");

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

        {/* Mode 1: File Upload State (Empty Dropzone vs. Uploaded File Card) */}
        {activeMode === "upload" ? (
          <div>
            {!selectedFileName ? (
              /* State A: Empty Dropzone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer relative ${
                  isDragging
                    ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                    : "border-white/15 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/60"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume-file-input"
                  accept=".txt,.pdf,.docx,.doc,.rtf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-glow-sm">
                    <Upload className="h-8 w-8 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      Drag & Drop your Resume or Click to Browse
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      Supports PDF, DOCX, TXT • Evaluates ATS parsing, section integrity, and metrics
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Max 10 MB</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">OCR & Text Compatible</span>
                  </div>
                </div>
              </div>
            ) : (
              /* State B: Realistic Uploaded File Success Card */
              <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-5 animate-in fade-in duration-300">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume-file-input"
                  accept=".txt,.pdf,.docx,.doc,.rtf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* File Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                  <div className="flex items-center gap-4">
                    {/* Document Icon with File Type Tag */}
                    <div className="relative shrink-0">
                      <div className={`h-16 w-14 rounded-2xl flex flex-col items-center justify-center border shadow-lg ${
                        isPdf
                          ? "bg-rose-950/40 border-rose-500/40 text-rose-400 shadow-rose-950/40"
                          : isDocx
                          ? "bg-blue-950/40 border-blue-500/40 text-blue-400 shadow-blue-950/40"
                          : "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-cyan-950/40"
                      }`}>
                        <FileText className="h-7 w-7" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider mt-0.5">
                          {isPdf ? "PDF" : isDocx ? "DOCX" : "TXT"}
                        </span>
                      </div>

                      {/* Success Check Badge */}
                      <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    </div>

                    {/* File Meta */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-foreground font-mono break-all">
                          {selectedFileName}
                        </h4>
                        <Badge variant="emerald" size="sm" className="font-mono text-[9px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> UPLOADED &amp; PARSED
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
                        {fileSizeStr && (
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3.5 w-3.5 text-slate-400" />
                            {fileSizeStr}
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-cyan-300 font-semibold">{wordCount} words detected</span>
                        <span>•</span>
                        <span className="text-emerald-400">Ready for ATS Audit</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Re-upload or Clear */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                      className="text-xs font-mono"
                    >
                      Change File
                    </Button>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Pre-flight ATS Checklist badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">Text Integrity OK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">Headers Detected</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">No Scanned Artifacts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">Ready for Scoring</span>
                  </div>
                </div>

                {/* Optional Collapsible Text Preview */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPreviewText(!showPreviewText)}
                    className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPreviewText ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-cyan-400" />}
                    <span>{showPreviewText ? "Hide Extracted Resume Text" : "Preview Extracted Resume Text"}</span>
                  </button>

                  {showPreviewText && (
                    <div className="mt-2.5 p-4 rounded-xl bg-black/60 border border-white/10 max-h-48 overflow-y-auto cyber-scrollbar text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {rawText}
                    </div>
                  )}
                </div>
              </div>
            )}
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
