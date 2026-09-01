"use client";

import React, { useState } from "react";
import {
  Users,
  Brain,
  Sparkles,
  Clock,
  Globe,
  Sliders,
  Check,
  ArrowRight,
  Flame,
  Briefcase,
  BookOpen,
  Layers,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GD_TOPICS,
  GD_PARTICIPANTS,
  GDConfig,
  GDTopicCategory,
  GDDifficulty,
  GDDuration,
  GDLanguage,
} from "@/lib/ai/gd-engine";

interface GDSetupStepperProps {
  onStartSession: (config: GDConfig) => void;
  isLoading?: boolean;
}

export function GDSetupStepper({ onStartSession, isLoading = false }: GDSetupStepperProps) {
  const [activeCategory, setActiveCategory] = useState<GDTopicCategory>("tech_ai");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("gd-ai-jobs");
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicTitle, setCustomTopicTitle] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<GDDifficulty>("standard_campus");
  const [selectedDuration, setSelectedDuration] = useState<GDDuration>(10);
  const [selectedLanguage, setSelectedLanguage] = useState<GDLanguage>("en");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([
    "arjun_analytical",
    "priya_counter",
    "vikram_assertive",
    "ananya_facts",
  ]);

  const filteredTopics = GD_TOPICS.filter((t) => t.category === activeCategory);

  const toggleParticipant = (id: string) => {
    if (selectedParticipantIds.includes(id)) {
      if (selectedParticipantIds.length > 2) {
        setSelectedParticipantIds(selectedParticipantIds.filter((p) => p !== id));
      }
    } else {
      setSelectedParticipantIds([...selectedParticipantIds, id]);
    }
  };

  const handleStart = () => {
    const config: GDConfig = {
      topicId: isCustomTopic ? "custom" : selectedTopicId,
      customTopicTitle: isCustomTopic ? customTopicTitle.trim() : undefined,
      category: activeCategory,
      difficulty: selectedDifficulty,
      durationMinutes: selectedDuration,
      language: selectedLanguage,
      participantIds: selectedParticipantIds,
    };
    onStartSession(config);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <GlassCard className="p-6 sm:p-8 border-cyan-500/20 shadow-2xl relative overflow-hidden" glow>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="cyber" size="sm" className="font-mono text-xs">
              VIRTUAL GD ROUNDTABLE
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">•</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">Multi-Agent Discussion Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Configure Your AI Group Discussion
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Practice realistic campus placement and executive GD rounds with autonomous AI peers featuring analytical, adversarial, assertive, and consensus-building discussion styles.
          </p>
        </div>
      </GlassCard>

      {/* STEP 1: TOPIC SELECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-foreground font-mono">
              Select Discussion Topic & Domain
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomTopic(!isCustomTopic)}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            {isCustomTopic ? "← Choose Curated Topic" : "+ Propose Custom GD Topic"}
          </button>
        </div>

        {/* Category Filter Tabs */}
        {!isCustomTopic && (
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "tech_ai", label: "Technology & AI Ethics" },
              { id: "business_economy", label: "Business & Economy" },
              { id: "social_policy", label: "Social & Public Policy" },
              { id: "abstract_leadership", label: "Abstract & Leadership" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as GDTopicCategory)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  activeCategory === cat.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                    : "bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Topic Cards Grid OR Custom Input */}
        {!isCustomTopic ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-3 flex flex-col justify-between ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                      : "bg-slate-900/60 border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                        {topic.categoryLabel}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                    </div>
                    <h4 className="text-sm font-bold text-foreground leading-snug">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                    {topic.suggestedKeywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                        {kw}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase font-mono block">
              Enter Custom GD Topic Statement
            </label>
            <textarea
              rows={3}
              value={customTopicTitle}
              onChange={(e) => setCustomTopicTitle(e.target.value)}
              placeholder="e.g. Should algorithmic trading and AI finance be regulated with stricter capital reserves?"
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono resize-none"
            />
          </div>
        )}
      </div>

      {/* STEP 2: DIFFICULTY, DURATION & LANGUAGE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h3 className="font-bold text-base text-foreground font-mono">
            Round Difficulty, Pacing & Language
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase font-mono block">
              Difficulty Tier
            </span>
            <div className="space-y-1.5">
              {[
                { id: "foundational", label: "Foundational (Collaborative Pacing)" },
                { id: "standard_campus", label: "Standard Campus Placement" },
                { id: "frontier_iim", label: "Frontier / IIM Tier (Fast Rebuttals)" },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id as GDDifficulty)}
                  className={`w-full text-left p-2 rounded-xl text-xs font-mono transition-all ${
                    selectedDifficulty === diff.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase font-mono block">
              Round Duration
            </span>
            <div className="space-y-1.5">
              {[
                { val: 5, label: "5 Minutes (Rapid Sprint)" },
                { val: 10, label: "10 Minutes (Standard Benchmark)" },
                { val: 15, label: "15 Minutes (Comprehensive Multi-Round)" },
              ].map((dur) => (
                <button
                  key={dur.val}
                  type="button"
                  onClick={() => setSelectedDuration(dur.val as GDDuration)}
                  className={`w-full text-left p-2 rounded-xl text-xs font-mono transition-all ${
                    selectedDuration === dur.val
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase font-mono block">
              Discussion Language
            </span>
            <div className="space-y-1.5">
              {[
                { id: "en", label: "English (Global Corporate)" },
                { id: "hi", label: "हिंदी (Hindi Technical)" },
                { id: "hinglish", label: "Hinglish (Conversational)" },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.id as GDLanguage)}
                  className={`w-full text-left p-2 rounded-xl text-xs font-mono transition-all ${
                    selectedLanguage === lang.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: AI PARTICIPANT PERSONAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-base text-foreground font-mono">
              AI Discussion Peers in Room ({selectedParticipantIds.length} Selected)
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Select 2 to 5 participants</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GD_PARTICIPANTS.map((participant) => {
            const isSelected = selectedParticipantIds.includes(participant.id);
            return (
              <button
                key={participant.id}
                type="button"
                onClick={() => toggleParticipant(participant.id)}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-500/40 shadow-glow-sm"
                    : "bg-slate-900/50 border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{participant.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                  </div>
                  <Badge variant="cyber" size="sm" className="font-mono text-[9px] mt-0.5">
                    {participant.styleLabel}
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground font-mono leading-relaxed line-clamp-2">
                  {participant.archetypeBio}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch Action */}
      <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          Interactive speech synthesis • Real-time counter-argument evaluation • 7-vector scoring
        </div>

        <Button
          type="button"
          variant="glow"
          size="lg"
          onClick={handleStart}
          isLoading={isLoading}
          disabled={(isCustomTopic && !customTopicTitle.trim()) || isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="w-full sm:w-auto px-8 py-6 text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          Enter Virtual Discussion Room →
        </Button>
      </div>
    </div>
  );
}
