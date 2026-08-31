"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { DigitalPortfolioView } from "@/components/portfolio/digital-portfolio-view";
import { DigitalPortfolioSummary } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/auth-context";

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<DigitalPortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPortfolio = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio/verified");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      }
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  return (
    <div className="py-10">
      <Container size="xl">
        {isLoading || !portfolio ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <DigitalPortfolioView portfolio={portfolio} onRefresh={loadPortfolio} />
        )}
      </Container>
    </div>
  );
}
