"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  variant?: "full" | "icon" | "nav";
}

const sizeMap = {
  sm: { icon: 28, text: "text-sm", tagline: "text-[8px]" },
  md: { icon: 38, text: "text-base", tagline: "text-[9px]" },
  lg: { icon: 52, text: "text-xl", tagline: "text-[11px]" },
  xl: { icon: 72, text: "text-2xl", tagline: "text-xs" },
};

export function KaushalSetuIcon({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-slate-950/80 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] transition-all duration-300",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="KaushalSetu Logo"
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-cover object-center scale-[1.08] transition-transform duration-300 group-hover:scale-115"
        priority
      />
    </div>
  );
}

export function KaushalSetuLogo({
  className,
  size = "md",
  showText = true,
  showTagline = true,
  variant = "full",
}: LogoProps) {
  const currentSize = sizeMap[size];

  if (variant === "icon") {
    return <KaushalSetuIcon size={currentSize.icon} className={className} />;
  }

  return (
    <div className={cn("inline-flex items-center gap-3 group select-none", className)}>
      <KaushalSetuIcon
        size={currentSize.icon}
        className="group-hover:scale-105 transition-transform duration-300"
      />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight font-extrabold leading-none text-foreground">
            <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
              Kaushal
            </span>
            <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Setu
            </span>
          </div>
          {showTagline && (
            <span
              className={cn(
                "font-mono tracking-wider text-muted-foreground uppercase mt-1 whitespace-nowrap",
                currentSize.tagline
              )}
            >
              Connecting Skills • Bridging Opportunities
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default KaushalSetuLogo;
