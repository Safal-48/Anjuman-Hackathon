"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { ErrorCard } from "@/components/ui/error-card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error Captured:", error);
  }, [error]);

  return (
    <Container size="md" className="py-24 flex items-center justify-center min-h-[70vh]">
      <ErrorCard
        title="Application Exception Encountered"
        message="A runtime exception occurred in the primary render pipeline. Diagnostic telemetry has logged this event."
        error={error}
        onRetry={() => reset()}
        className="w-full"
      />
    </Container>
  );
}
