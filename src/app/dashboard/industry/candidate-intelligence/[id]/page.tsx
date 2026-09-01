"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateDetailedEvaluationView } from "@/components/recruiter/candidate-detailed-evaluation-view";
import { CandidateEvaluationResult } from "@/lib/analytics/candidate-intelligence-engine";

export default function CandidateDetailedEvaluationPage() {
  const params = useParams();
  const candidateId = params?.id as string;

  const [evaluation, setEvaluation] = useState<CandidateEvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCandidate() {
      if (!candidateId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/recruiter/candidate-intelligence/${candidateId}`);
        if (res.ok) {
          const data = await res.json();
          setEvaluation(data.evaluation);
        }
      } catch (err) {
        console.error("Failed to load candidate evaluation:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCandidate();
  }, [candidateId]);

  if (isLoading || !evaluation) {
    return (
      <div className="min-h-screen py-12 bg-slate-950 text-foreground">
        <Container size="xl" className="space-y-8 max-w-6xl">
          <Skeleton className="h-36 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-slate-950 text-foreground">
      <Container size="xl">
        <CandidateDetailedEvaluationView evaluation={evaluation} />
      </Container>
    </div>
  );
}
