"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AssessmentRunner } from "@/components/skills/assessment-runner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { AssessmentQuestion, AssessmentSession } from "@/lib/supabase/types";

export default function AssessmentPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/assessment");
      } else {
        loadAssessmentData();
      }
    }
  }, [authLoading, isAuthenticated, router]);

  async function loadAssessmentData() {
    try {
      const [questionsRes, sessionRes] = await Promise.all([
        fetch("/api/assessment/questions"),
        fetch("/api/assessment/session"),
      ]);

      if (questionsRes.ok) {
        const qData = await questionsRes.json();
        setQuestions(qData.questions || []);
      }

      if (sessionRes.ok) {
        const sData = await sessionRes.json();
        setActiveSession(sData.session || null);
      }
    } catch (err) {
      console.error("Failed to load assessment data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAnswerSaved = async (questionId: string, optionId: string, index: number) => {
    await fetch("/api/assessment/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, optionId, questionIndex: index }),
    });
  };

  const handleSubmitAssessment = async (targetRoleId?: string) => {
    await fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRoleId }),
    });
  };

  if (isLoading || authLoading) {
    return (
      <Container size="lg" className="py-10 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  return (
    <div className="py-10">
      <Container size="lg">
        <AssessmentRunner
          questions={questions}
          initialSession={activeSession}
          onAnswerSaved={handleAnswerSaved}
          onSubmitAssessment={handleSubmitAssessment}
        />
      </Container>
    </div>
  );
}
