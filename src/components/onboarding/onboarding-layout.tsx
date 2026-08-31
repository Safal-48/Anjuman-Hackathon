"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  role: UserRole;
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  children: React.ReactNode;
}

export function OnboardingLayout({
  role,
  currentStep,
  totalSteps,
  stepTitles,
  children,
}: OnboardingLayoutProps) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const roleLabels: Record<UserRole, { label: string; badge: "cyber" | "violet" | "emerald" | "amber" | "destructive" }> = {
    student: { label: "Student Profile", badge: "cyber" },
    industry: { label: "Industry & Recruiter", badge: "violet" },
    academician: { label: "Academician & Faculty", badge: "emerald" },
    institution: { label: "Institutional Portal", badge: "amber" },
    admin: { label: "Administrator", badge: "destructive" },
  };

  const meta = roleLabels[role] || { label: "User Onboarding", badge: "cyber" };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 relative">
      <Container size="md">
        {/* Top Progress & Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={meta.badge} dot dotColor="cyan">
                  {meta.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stepTitles[currentStep - 1] || "Configure Your Identity"}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {progressPercent}% COMPLETE
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-500 ease-out shadow-glow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Pill Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
            {stepTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div
                  key={title}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                    isCompleted && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
                    isCurrent && "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-glow-sm",
                    !isCompleted && !isCurrent && "bg-white/[0.02] border-white/[0.06] text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      isCompleted && "bg-emerald-500 text-slate-950",
                      isCurrent && "bg-cyan-400 text-slate-950",
                      !isCompleted && !isCurrent && "bg-slate-800 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : stepNumber}
                  </div>
                  <span className="truncate">{title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Container */}
        <GlassCard className="p-6 sm:p-8 border-white/10 shadow-2xl relative" glow>
          {children}
        </GlassCard>
      </Container>
    </div>
  );
}
