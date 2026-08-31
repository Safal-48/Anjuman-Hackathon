"use client";

import React, { Suspense, Component, ErrorInfo, ReactNode } from "react";
import dynamic from "next/dynamic";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom WebGL Error Boundary to prevent crashes on non-WebGL hardware or headless runners
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Context or 3D Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-muted-foreground bg-slate-950/40 rounded-xl border border-white/5">
            <AlertCircle className="h-8 w-8 text-cyan-400 mb-2" />
            <p className="text-sm font-medium text-foreground">3D Viewport Hardware Fallback</p>
            <p className="text-xs max-w-xs mt-1 text-muted-foreground">
              WebGL hardware acceleration is unavailable in this environment. Interactive 2D modes active.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

function SceneLoadingSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950/40 rounded-xl border border-white/5">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-2" />
      <span className="text-xs font-mono tracking-wider text-cyan-400/80 uppercase">
        Initializing Quantum Visualizer...
      </span>
    </div>
  );
}

export interface SceneContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: string | number;
}

export function SceneContainer({
  children,
  className,
  height = "400px",
}: SceneContainerProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className={cn("w-full relative overflow-hidden rounded-2xl", className)}
        style={{ height }}
      >
        <SceneLoadingSkeleton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl shadow-glass",
        className
      )}
      style={{ height }}
    >
      <WebGLErrorBoundary>
        <Suspense fallback={<SceneLoadingSkeleton />}>
          {children}
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
