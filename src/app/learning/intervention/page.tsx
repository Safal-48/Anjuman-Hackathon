"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Zap,
  Target,
  Clock,
  Award,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TargetedInterventionRunner } from "@/components/learning/targeted-intervention-runner";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

function InterventionContent() {
  return (
    <div className="py-10 space-y-8 min-h-screen bg-slate-950 text-foreground">
      <Container size="xl" className="space-y-6 max-w-5xl">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/learning/resources"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Targeted Learning Intervention Studio
                </span>
                <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                  Adaptive 7-Step Loop
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                15-Minute Remediation Sprint
              </h1>
            </div>
          </div>

          <Link href="/skills">
            <Button variant="outline" size="sm" className="text-xs font-mono border-white/10">
              Exit to Skill DNA
            </Button>
          </Link>
        </div>

        {/* 7-Step Targeted Runner Component */}
        <SlideUp delay={0.05}>
          <TargetedInterventionRunner />
        </SlideUp>
      </Container>
    </div>
  );
}

export default function TargetedInterventionPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-mono text-slate-400">Loading intervention studio...</div>}>
      <InterventionContent />
    </Suspense>
  );
}
