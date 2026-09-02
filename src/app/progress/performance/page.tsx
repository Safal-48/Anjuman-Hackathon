"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Dna,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvidenceBasedProgressMatrix } from "@/components/progress/evidence-based-progress-matrix";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function PerformanceProgressPage() {
  return (
    <div className="py-10 space-y-8 min-h-screen bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-6">
        {/* Navigation Breadcrumb & Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Competency Proof Engine
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Learning Progress &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Proven Skills</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Distinguish between what you are currently learning, what you have practiced in sandboxes, and what you have empirically proven on diagnostic assessments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/progress/growth">
                <Button variant="outline" size="sm" className="gap-1.5 font-mono text-xs border-white/10 hover:border-cyan-500/30">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Growth Velocity
                </Button>
              </Link>
              <Link href="/progress/history">
                <Button variant="outline" size="sm" className="gap-1.5 font-mono text-xs border-white/10 hover:border-cyan-500/30">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  Activity History
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Evidence Matrix Section */}
        <SlideUp delay={0.05}>
          <EvidenceBasedProgressMatrix />
        </SlideUp>
      </Container>
    </div>
  );
}
