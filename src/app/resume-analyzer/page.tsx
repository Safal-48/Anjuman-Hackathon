"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  RotateCcw,
  Loader2,
  Brain,
  Layers,
  Award,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResumeUploadBox } from "@/components/ai/resume/resume-upload-box";
import { JobMatcherCard } from "@/components/ai/resume/job-matcher-card";
import { ResumeAnalysisDashboard } from "@/components/ai/resume/resume-analysis-dashboard";
import { DetailedATSAnalysis } from "@/lib/ai/resume-analyzer";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

type AnalyzerStep = "input" | "processing" | "results";

export default function DedicatedResumeAnalyzerPage() {
  const [step, setStep] = useState<AnalyzerStep>("input");
  const [selectedJobId, setSelectedJobId] = useState("ai_systems_engineer");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [customJobDescription, setCustomJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DetailedATSAnalysis | null>(null);

  const handleAnalyzeResume = async (resumeText: string) => {
    setIsAnalyzing(true);
    setStep("processing");

    try {
      const res = await fetch("/api/ai/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetJobId: selectedJobId,
          customJobTitle: customJobTitle.trim() || undefined,
          customJobDescription: customJobDescription.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze resume content");
      }

      const data = await res.json();
      // Brief simulated processing delay for visual entity extraction
      setTimeout(() => {
        setAnalysisResult(data.analysis);
        setStep("results");
        setIsAnalyzing(false);
      }, 700);
    } catch (err) {
      console.error("Resume analysis error:", err);
      alert("Failed to analyze resume. Please verify the text and try again.");
      setStep("input");
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setStep("input");
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-8">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Return to Dashboard"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Skillora Intelligence Suite
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-cyan-400" />
                <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                  DEDICATED MODULE
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                AI Resume & ATS Readiness Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step === "results" && (
              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs font-mono"
              >
                Upload New Resume
              </Button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deterministic ATS Scoring</span>
            </div>
          </div>
        </div>

        {/* Step 1: Input (Resume Upload & Job Comparison Setup) */}
        {step === "input" && (
          <FadeIn>
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Job Matcher Selector */}
              <JobMatcherCard
                selectedJobId={selectedJobId}
                onSelectJobId={setSelectedJobId}
                customJobTitle={customJobTitle}
                onCustomJobTitleChange={setCustomJobTitle}
                customJobDescription={customJobDescription}
                onCustomJobDescriptionChange={setCustomJobDescription}
              />

              {/* Upload Box */}
              <ResumeUploadBox onAnalyze={handleAnalyzeResume} isLoading={isAnalyzing} />
            </div>
          </FadeIn>
        )}

        {/* Step 2: Processing Live Animation */}
        {step === "processing" && (
          <FadeIn>
            <GlassCard className="p-12 text-center space-y-5 max-w-lg mx-auto border-cyan-500/30 my-12" glow>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-sm">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-foreground">
                  Analyzing Resume & ATS Compatibility...
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Extracting contact, education, skill catalog entities, action verbs, and quantifiable metrics against target job requirements.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs font-mono text-cyan-300">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Checking ATS parsing heuristics...</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Benchmarking against role keywords...</span>
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        )}

        {/* Step 3: Deep Analysis Dashboard */}
        {step === "results" && analysisResult && (
          <ResumeAnalysisDashboard
            analysis={analysisResult}
            onReset={handleReset}
          />
        )}
      </Container>
    </div>
  );
}
