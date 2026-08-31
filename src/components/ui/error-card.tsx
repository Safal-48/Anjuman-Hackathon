"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { GlassCard } from "./card";

export interface ErrorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = "System Anomaly Detected",
  message = "An unexpected error occurred while executing this operation.",
  error,
  onRetry,
  className,
  ...props
}: ErrorCardProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <GlassCard
      className={cn(
        "p-8 border-rose-500/30 bg-rose-950/20 shadow-[0_0_30px_rgba(244,63,94,0.1)] flex flex-col items-center text-center",
        className
      )}
      {...props}
    >
      <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-semibold text-rose-300 tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground max-w-md mb-4">
        {message}
      </p>

      {errorMessage && (
        <pre className="p-3 bg-black/40 rounded-lg text-xs font-mono text-rose-400/90 border border-rose-500/20 max-w-full overflow-x-auto text-left mb-6">
          {errorMessage}
        </pre>
      )}

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          className="border-rose-500/30 text-rose-300 hover:bg-rose-950/40"
        >
          Re-initialize Component
        </Button>
      )}
    </GlassCard>
  );
}
