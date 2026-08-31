"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlowBorderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  borderRadius?: number;
  color?: string | string[];
  borderWidth?: number;
  duration?: number;
  className?: string;
  glowClassName?: string;
  children: React.ReactNode;
}

/**
 * GlowBorder Component - Animated glowing traveling border gradient
 * Originkit / MagicUI inspired aesthetic
 */
export function GlowBorder({
  borderRadius = 16,
  color = ["#06b6d4", "#10b981", "#3b82f6"],
  borderWidth = 1.5,
  duration = 4,
  className,
  glowClassName,
  children,
  ...props
}: GlowBorderProps) {
  const colors = Array.isArray(color) ? color : [color];
  const c1 = colors[0] || "#06b6d4";
  const c2 = colors[1] || c1;
  const c3 = colors[2] || c2;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
        } as React.CSSProperties
      }
      className={cn(
        "relative rounded-[var(--border-radius)] p-[var(--border-width)] overflow-hidden transition-all duration-300 group",
        className
      )}
      {...props}
    >
      {/* Background conic gradient rotating beam */}
      <div
        className={cn(
          "absolute inset-[-200%] animate-[spin_var(--duration)_linear_infinite] opacity-90",
          glowClassName
        )}
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 50deg, ${c1} 80deg, ${c2} 110deg, ${c3} 140deg, transparent 170deg, transparent 360deg)`,
        }}
      />

      {/* Blurred glow halo */}
      <div
        className="absolute inset-[-200%] animate-[spin_var(--duration)_linear_infinite] opacity-60 blur-sm pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 50deg, ${c1} 80deg, ${c2} 110deg, ${c3} 140deg, transparent 170deg, transparent 360deg)`,
        }}
      />

      {/* Inner Content with Dark Glass Backdrop */}
      <div className="relative z-10 h-full w-full rounded-[calc(var(--border-radius)-var(--border-width))] bg-slate-950/95 backdrop-blur-2xl">
        {children}
      </div>
    </div>
  );
}

export default GlowBorder;
