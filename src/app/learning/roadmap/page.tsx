"use client";

import React from "react";
import Link from "next/link";
import {
  GitFork,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  Dna,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdaptiveRoadmapTree } from "@/components/roadmap/adaptive-roadmap-tree";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function LearningRoadmapPage() {
  return (
    <div className="py-10 space-y-8 min-h-screen bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-6">
        {/* Header Banner */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-cyan-500/30 bg-slate-900/60 relative overflow-hidden" glow>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <GitFork className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      Adaptive Personalized Learning Roadmap
                    </h1>
                    <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                      Continuous Performance-Driven
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                    Dynamic milestones that change when you prove skill competencies. Every milestone seamlessly links <strong>Learning Resource ➔ Explanation ➔ Practice ➔ Assessment ➔ Result</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/skills">
                  <Button variant="outline" size="sm" className="text-xs font-mono border-white/10 hover:border-cyan-500/30">
                    <Dna className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
                    Personal Skill DNA
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button variant="cyber" size="sm" className="text-xs font-mono gap-1.5 shadow-glow">
                    <span>Practice Arena</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Dynamic Interactive Roadmap Visualizer */}
        <SlideUp delay={0.1}>
          <AdaptiveRoadmapTree />
        </SlideUp>
      </Container>
    </div>
  );
}
