"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Briefcase,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationTracker } from "@/components/marketplace/application-tracker";
import { OpportunityApplicationEntity } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";
import { FadeIn } from "@/components/animations/motion-wrapper";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<OpportunityApplicationEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("/api/marketplace/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, []);

  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Banner Header */}
        <FadeIn>
          <GlassCard className="p-6 sm:p-8 border-white/10 relative overflow-hidden" glow>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="cyber" dot dotColor="cyan">
                    APPLICATION TRACKER
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {applications.length} ACTIVE SUBMISSIONS
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  My Career Applications Pipeline
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Real-time status tracking across the complete hiring lifecycle: Applied → Under Review → Shortlisted → Interview → Selected.
                </p>
              </div>

              <Link href="/opportunities">
                <Button variant="glow" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
                  Explore More Opportunities
                </Button>
              </Link>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Application Tracker Stepper View */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : (
          <ApplicationTracker applications={applications} />
        )}
      </Container>
    </div>
  );
}
