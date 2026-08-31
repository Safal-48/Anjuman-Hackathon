"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Sparkles,
  FileText,
  Compass,
  Target,
  Brain,
  Award,
  Layers,
  ArrowUpRight,
  Mic,
  Volume2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CareerChatInterface } from "@/components/ai/career-chat-interface";
import { ResumeAnalyzerCard } from "@/components/ai/resume-analyzer-card";
import { RoadmapTimeline } from "@/components/ai/roadmap-timeline";
import { InterviewSimulator } from "@/components/ai/interview-simulator";
import { BilingualVoiceToggle } from "@/components/ai/bilingual-voice-toggle";
import { AIOrb } from "@/components/ai/ai-orb";
import { useAuth } from "@/lib/auth/auth-context";
import { SkillIntelligenceReport, TargetRoleBenchmark } from "@/lib/supabase/types";
import { ExtractedResumeData } from "@/lib/ai/resume-analyzer";
import { PersonalizedRoadmap } from "@/lib/ai/roadmap-generator";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function AICareerPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"assistant" | "interview" | "resume" | "roadmap">("assistant");
  const [report, setReport] = useState<SkillIntelligenceReport | null>(null);
  const [availableRoles, setAvailableRoles] = useState<TargetRoleBenchmark[]>([]);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Bilingual Voice State
  const [voiceLang, setVoiceLang] = useState<"en" | "hi">("en");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const loadData = useCallback(async (roleId?: string) => {
    try {
      const reportUrl = roleId ? `/api/skills/intelligence?role=${roleId}` : "/api/skills/intelligence";
      const roadmapUrl = roleId ? `/api/ai/roadmap?role=${roleId}` : "/api/ai/roadmap";

      const [reportRes, roadmapRes] = await Promise.all([
        fetch(reportUrl, { headers: { "Cache-Control": "no-cache" } }),
        fetch(roadmapUrl, { headers: { "Cache-Control": "no-cache" } }),
      ]);

      if (reportRes.ok) {
        const data = await reportRes.json();
        setReport(data.report);
        setAvailableRoles(data.availableRoles || []);
      }

      if (roadmapRes.ok) {
        const rData = await roadmapRes.json();
        setRoadmap(rData.roadmap);
      }
    } catch (err) {
      console.error("Failed to load AI career data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/ai-career");
      } else {
        loadData();
      }
    }
  }, [authLoading, isAuthenticated, router, loadData]);

  // Handle Voice Guidance Speak
  const handleSpeakGuidance = async (text: string, lang: "en" | "hi") => {
    if (typeof window === "undefined") return;

    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      const res = await fetch("/api/ai/voice/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          targetRole: report?.targetRole.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const spoken = data.guidance?.spokenText || text;

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(spoken);
          utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
          utterance.rate = 0.95;

          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          window.speechSynthesis.speak(utterance);
        } else {
          alert(`[Voice Guidance]: ${spoken}`);
        }
      }
    } catch (err) {
      console.error("Voice guidance failed:", err);
      setIsSpeaking(false);
    }
  };

  // Handle Chat Message Submit
  const handleSendMessage = async (message: string) => {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, targetRoleId: report?.targetRole.id }),
    });
    const data = await res.json();
    return data;
  };

  // Handle Resume Analysis Submit
  const handleAnalyzeResume = async (resumeText: string): Promise<ExtractedResumeData> => {
    const res = await fetch("/api/ai/resume-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, targetRoleId: report?.targetRole.id }),
    });
    const data = await res.json();
    return data.analysis;
  };

  // Handle Role Switch
  const handleRoleChange = async (newRoleId: string) => {
    setIsLoading(true);
    await fetch("/api/skills/intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRoleId: newRoleId }),
    });
    loadData(newRoleId);
  };

  if (isLoading || authLoading || !report) {
    return (
      <Container size="xl" className="py-10 space-y-8">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  const sampleVoiceGuidance =
    voiceLang === "hi"
      ? `नमस्ते! आपकी प्रोफाइल के अनुसार, आपका Next.js और PyTorch मजबूत है। AI Systems Engineer रोल के लिए मुख्य गैप Distributed Concurrency है।`
      : `Hello! Based on your verified telemetry, your foundation in Next.js and PyTorch is strong. Focus on Distributed Concurrency to maximize compatibility.`;

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Top Intelligence Banner */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <AIOrb status="active" size="md" />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                      AI Career Intelligence Copilot
                    </h1>
                    <Badge variant="cyber" dot dotColor="cyan">
                      BILINGUAL & MOCK INTERVIEW ACTIVE
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Contextual AI Assistant • AI Mock Interview Simulator • Bilingual Speech (EN/HI) • 4-Phase Roadmap
                  </p>
                </div>
              </div>

              {/* Target Role Switcher */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <span className="text-xs font-semibold uppercase text-muted-foreground hidden sm:inline">
                  Target Role:
                </span>
                <select
                  className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 py-1 text-xs sm:text-sm font-semibold text-cyan-300 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                  value={report.targetRole.id}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  {availableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Bilingual Voice Guidance Bar */}
        <BilingualVoiceToggle
          language={voiceLang}
          onLanguageChange={setVoiceLang}
          onSpeakText={handleSpeakGuidance}
          isSpeaking={isSpeaking}
          sampleGuidanceText={sampleVoiceGuidance}
        />

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
          {[
            { id: "assistant", label: "AI Career Assistant", icon: Bot },
            { id: "interview", label: "AI Mock Interview Simulator", icon: Brain },
            { id: "resume", label: "Resume Intelligence", icon: FileText },
            { id: "roadmap", label: "Personalized Roadmap", icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-muted-foreground"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="mt-6">
          {activeTab === "assistant" && (
            <SlideUp>
              <CareerChatInterface report={report} onSendMessage={handleSendMessage} />
            </SlideUp>
          )}

          {activeTab === "interview" && (
            <SlideUp>
              <InterviewSimulator />
            </SlideUp>
          )}

          {activeTab === "resume" && (
            <SlideUp>
              <ResumeAnalyzerCard targetRole={report.targetRole} onAnalyzeResume={handleAnalyzeResume} />
            </SlideUp>
          )}

          {activeTab === "roadmap" && roadmap && (
            <SlideUp>
              <RoadmapTimeline roadmap={roadmap} />
            </SlideUp>
          )}
        </div>
      </Container>
    </div>
  );
}
