"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { StudentOnboarding } from "@/components/onboarding/student-onboarding";
import { IndustryOnboarding } from "@/components/onboarding/industry-onboarding";
import { AcademicianOnboarding } from "@/components/onboarding/academician-onboarding";
import { InstitutionOnboarding } from "@/components/onboarding/institution-onboarding";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function OnboardingPage() {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/onboarding");
      } else if (user?.isOnboarded) {
        router.push("/dashboard");
      } else if (role === "admin") {
        router.push("/admin");
      }
    }
  }, [isLoading, isAuthenticated, user, role, router]);

  if (isLoading || !isAuthenticated || !role) {
    return (
      <Container size="md" className="py-20 space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-md" />
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </Container>
    );
  }

  switch (role) {
    case "student":
      return <StudentOnboarding />;
    case "industry":
      return <IndustryOnboarding />;
    case "academician":
      return <AcademicianOnboarding />;
    case "institution":
      return <InstitutionOnboarding />;
    default:
      return <StudentOnboarding />;
  }
}
