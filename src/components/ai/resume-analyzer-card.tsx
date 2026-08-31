"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  Layers,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExtractedResumeData } from "@/lib/ai/resume-analyzer";
import { TargetRoleBenchmark } from "@/lib/supabase/types";

interface ResumeAnalyzerCardProps {
  targetRole: TargetRoleBenchmark;
  onAnalyzeResume: (resumeText: string) => Promise<ExtractedResumeData>;
}

const SAMPLE_RESUME = `Aarav Sharma
aarav.sharma@titan.ai | +91 98765 43210 | Bengaluru, India
GitHub: https://github.com/aarav-sharma | LinkedIn: https://linkedin.com/in/aarav-sharma

EDUCATION:
Indian Institute of Technology, B.Tech in Computer Science & AI (2022 - 2026), GPA: 9.1 / 10.0

TECHNICAL SKILLS:
Languages & Frameworks: Python, PyTorch, React, Next.js, TypeScript, Docker, SQL, Redis
Systems & Core: Distributed Systems, System Design, Algorithms & Data Structures, Git

WORK EXPERIENCE:
AI Research Intern - Frontier Neural Systems Lab (May 2025 - Nov 2025)
- Engineered model quantization pipeline with PyTorch and TensorRT, achieving 42% inference speedup.
- Collaborated across distributed engineering sprint to deploy microservices on Docker containers.

KEY PROJECTS:
1. Real-Time Vision Telemetry Platform: Low-latency video stream pipeline processing 120 FPS camera streams with sub-10ms latency using PyTorch and Next.js.
2. Distributed Neural Cache Engine: High-concurrency caching mesh handling 15k requests/sec with Redis and TypeScript.

CERTIFICATIONS & HONORS:
- AWS Certified Solutions Architect - Associate
- National Smart India Hackathon Finalist (Problem Statement 26044)`;

export function ResumeAnalyzerCard({ targetRole, onAnalyzeResume }: ResumeAnalyzerCardProps) {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [analysis, setAnalysis] = useState<ExtractedResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "experience" | "feedback">("overview");

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await onAnalyzeResume(resumeText);
      setAnalysis(data);
    } catch (err) {
      console.error("Resume analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Input Area */}
      <GlassCard className="p-6 space-y-4 border-white/10" glow>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">AI Resume Entity & Alignment Analyzer</h3>
              <p className="text-xs text-muted-foreground">
                Non-fabricating extraction for Education, Skills, Projects, Experience & Keyword Alignment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setResumeText(SAMPLE_RESUME)}
            >
              Load Sample Resume
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Analyze Resume
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
            Paste Resume Markdown / Plain Text
          </label>
          <textarea
            rows={7}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your complete resume text here..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-4 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-violet-500 outline-none cyber-scrollbar"
          />
        </div>
      </GlassCard>

      {/* Analysis Results View */}
      {analysis && (
        <GlassCard className="p-6 space-y-6 animate-in fade-in duration-300">
          {/* Alignment Banner */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-foreground">{analysis.candidateName}</h4>
                <Badge variant="emerald" size="sm">
                  {analysis.education[0]?.institution || "Accredited"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {analysis.email} • {analysis.phone}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Role Keyword Match</span>
                <span className="text-lg font-mono font-extrabold text-cyan-400">
                  {analysis.targetRoleMatchScore}%
                </span>
              </div>
              <Badge variant={analysis.targetRoleMatchScore >= 80 ? "cyber" : "amber"}>
                {targetRole.title.split(" ")[0].toUpperCase()} READY
              </Badge>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-white/[0.06] pb-3">
            {[
              { id: "overview", label: "Overview & Feedback" },
              { id: "skills", label: `Skills (${analysis.technicalSkills.length})` },
              { id: "experience", label: `Experience & Projects` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview & Feedback */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matching Keywords */}
                <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-semibold uppercase text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Detected Core Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchingKeywords.map((k) => (
                      <span key={k} className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/20 space-y-2">
                  <span className="text-xs font-semibold uppercase text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> Missing Target Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.length === 0 ? (
                      <span className="text-xs text-emerald-400 font-mono">None! All target keywords present.</span>
                    ) : (
                      analysis.missingKeywords.map((k) => (
                        <span key={k} className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {k}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Feedback */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <span className="text-xs font-semibold uppercase text-cyan-300">Actionable Resume Feedback</span>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {analysis.actionableFeedback.map((fb, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono">•</span>
                      <span>{fb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Skills */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Extracted Technical Stack</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.technicalSkills.map((s) => (
                    <Badge key={s} variant="cyber" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Extracted Soft Skills</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.softSkills.map((s) => (
                    <Badge key={s} variant="violet" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Experience & Projects */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Extracted Work Experience</span>
                {analysis.experience.map((exp, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-foreground">{exp.role}</span>
                      <span className="font-mono text-muted-foreground">{exp.company}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{exp.summary}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Extracted Projects</span>
                {analysis.projects.map((proj, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <span className="font-bold text-foreground text-xs">{proj.title}</span>
                    <p className="text-xs text-muted-foreground">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
