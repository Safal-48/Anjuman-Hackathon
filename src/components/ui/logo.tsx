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
  sm: { icon: 30, text: "text-base", tagline: "text-[8px]" },
  md: { icon: 40, text: "text-lg", tagline: "text-[9px]" },
  lg: { icon: 56, text: "text-2xl", tagline: "text-[11px]" },
  xl: { icon: 76, text: "text-3xl", tagline: "text-xs" },
};

export function SkilloraIcon({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-2xl overflow-hidden flex items-center justify-center bg-black/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:border-violet-500 group-hover:shadow-[0_0_22px_rgba(168,85,247,0.5)] transition-all duration-300",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/skillora-logo.png"
        alt="Skillora Logo"
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-cover object-center scale-[1.05] transition-transform duration-300 group-hover:scale-115"
        priority
      />
    </div>
  );
}

export function SkilloraLogo({
  className,
  size = "md",
  showText = true,
  showTagline = true,
  variant = "full",
}: LogoProps) {
  const currentSize = sizeMap[size];

  if (variant === "icon") {
    return <SkilloraIcon size={currentSize.icon} className={className} />;
  }

  return (
    <div className={cn("inline-flex items-center gap-3 group select-none", className)}>
      <SkilloraIcon
        size={currentSize.icon}
        className="group-hover:scale-105 transition-transform duration-300"
      />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight font-extrabold leading-none font-mono">
            <span className="text-white group-hover:text-cyan-300 transition-colors text-lg sm:text-xl font-black">
              Skill
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:brightness-125 transition-all text-lg sm:text-xl font-black">
              ora
            </span>
          </div>
          {showTagline && (
            <span
              className={cn(
                "font-mono tracking-wider text-muted-foreground uppercase mt-1 whitespace-nowrap text-[9px] text-cyan-300/80",
                currentSize.tagline
              )}
            >
              Learn Smart • Improve Continuously
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Aliases for seamless backwards-compatibility
export const KaushalSetuIcon = SkilloraIcon;
export const KaushalSetuLogo = SkilloraLogo;

export default SkilloraLogo;
