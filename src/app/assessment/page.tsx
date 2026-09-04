"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AssessmentRunner } from "@/components/skills/assessment-runner";
import { AssessmentSubjectSelector } from "@/components/skills/assessment-subject-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { AssessmentQuestion, AssessmentSession } from "@/lib/supabase/types";
import { ASSESSMENT_SUBJECTS, AssessmentSubject } from "@/lib/skills/assessment-repository";
import { stopAllCameraStreams } from "@/lib/camera/camera-stream-manager";

export default function AssessmentPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<AssessmentSubject | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load questions for the selected subject track
  const loadSubjectQuestions = async (subject: AssessmentSubject, level: string = "intermediate") => {
    setIsLoading(true);
    setSelectedSubject(subject);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }

    try {
      const [questionsRes, sessionRes] = await Promise.all([
        fetch(`/api/assessment/questions?subject=${encodeURIComponent(subject.id)}`),
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
  };

  const handleAnswerSaved = async (questionId: string, optionId: string, index: number) => {
    await fetch("/api/assessment/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, optionId, questionIndex: index }),
    });
  };

  // Ensure camera hardware turns off when user navigates away from Assessment
  useEffect(() => {
    return () => {
      stopAllCameraStreams();
    };
  }, []);

  const handleSubmitAssessment = async (targetRoleId?: string) => {
    stopAllCameraStreams();
    await fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRoleId }),
    });
  };

  const handleBackToSubjectSelection = () => {
    stopAllCameraStreams();
    setSelectedSubject(null);
    setQuestions([]);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  if (authLoading) {
    return (
      <Container size="lg" className="py-10 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  return (
    <div className="py-8 min-h-[calc(100vh-4rem)]">
      <Container size="lg">
        {!selectedSubject ? (
          /* 1. Subject & Course Track Selection Screen */
          <AssessmentSubjectSelector
            onSelectSubject={(subj, level) => loadSubjectQuestions(subj, level)}
          />
        ) : isLoading ? (
          /* 2. Loading State */
          <div className="space-y-6 py-10">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : (
          /* 3. Interactive Assessment Runner for Selected Subject */
          <AssessmentRunner
            questions={questions}
            initialSession={activeSession}
            subjectTitle={selectedSubject.title}
            onChangeSubject={handleBackToSubjectSelection}
            onAnswerSaved={handleAnswerSaved}
            onSubmitAssessment={handleSubmitAssessment}
          />
        )}
      </Container>
    </div>
  );
}
