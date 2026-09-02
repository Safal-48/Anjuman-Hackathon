"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  Star,
  Zap,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { ExplainableRecommendationCard } from "@/components/recommendations/explainable-recommendation-card";
import { SAMPLE_EXPLAINABLE_RECOMMENDATIONS } from "@/lib/recommendations/recommendation-engine";
import { ExplainableRecommendation } from "@/lib/recommendations/explainable-recommendations-types";

function ResourcesContent() {
  const searchParams = useSearchParams();
  const highlightParam = searchParams.get("highlight") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(highlightParam);
  const [recommendations, setRecommendations] = useState<ExplainableRecommendation[]>(
    SAMPLE_EXPLAINABLE_RECOMMENDATIONS
  );

  useEffect(() => {
    if (highlightParam) {
      setSearchQuery(highlightParam);
    }
  }, [highlightParam]);

  const categories = [
    "All",
    "SQL & Relational Databases",
    "Distributed Systems",
    "Python & Core Programming",
    "Business Intelligence",
    "Algorithms & Aptitude",
  ];

  const filtered = recommendations.filter((rec) => {
    const matchesCat = selectedCategory === "All" || rec.skillDomain === selectedCategory;
    const matchesSearch =
      rec.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.whatIsRecommended.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.skillDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.whatWillItImprove.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Header Banner */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-cyan-500/30 bg-slate-900/60 relative overflow-hidden" glow>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      &ldquo;Why This?&rdquo; Explainable Recommendation Engine
                    </h1>
                    <Badge variant="cyber" size="sm" className="font-mono text-[10px]">
                      Evidence-Backed Learning
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                    Every learning recommendation is deterministically computed from your diagnostic performance, repeated error patterns, and prerequisite dependencies. Never random course suggestions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/assessment">
                  <Button variant="outline" size="sm" className="text-xs font-mono border-white/10 hover:border-cyan-500/30">
                    Retake Diagnostic Probe
                  </Button>
                </Link>
                <Link href="/skills">
                  <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                    <span>View Skill DNA</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* 4 Pillars Guide Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/[0.08] text-xs">
            <span className="font-mono font-bold text-cyan-400 block mb-1">1. WHAT IS RECOMMENDED</span>
            <p className="text-[11px] text-slate-400">Targeted sandboxes and system breakdowns specific to your gap.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/[0.08] text-xs">
            <span className="font-mono font-bold text-amber-400 block mb-1">2. WHY IS IT RECOMMENDED?</span>
            <p className="text-[11px] text-slate-400">Live inspection of your accuracy %, mistake count, and goal weight.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/[0.08] text-xs">
            <span className="font-mono font-bold text-emerald-400 block mb-1">3. WHAT WILL IT IMPROVE?</span>
            <p className="text-[11px] text-slate-400">Exact readiness score delta and unblocked role competencies.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/[0.08] text-xs">
            <span className="font-mono font-bold text-violet-400 block mb-1">4. WHAT TO DO AFTER?</span>
            <p className="text-[11px] text-slate-400">Next milestone to verify permanent concept retention.</p>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black font-bold shadow-glow-sm"
                    : "bg-slate-900/80 border border-white/10 text-slate-300 hover:border-cyan-500/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or deficit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Grid of Explainable Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filtered.map((rec, idx) => (
            <SlideUp key={rec.id} delay={0.05 * idx}>
              <ExplainableRecommendationCard
                recommendation={rec}
                initiallyExpanded={idx === 0 || highlightParam.length > 0}
              />
            </SlideUp>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function RecommendedResourcesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-mono text-slate-400">Loading explainable recommendations...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}
