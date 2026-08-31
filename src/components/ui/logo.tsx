"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  variant?: "full" | "icon" | "nav";
}

const sizeMap = {
  sm: { icon: 28, text: "text-sm", tagline: "text-[8px]" },
  md: { icon: 36, text: "text-base", tagline: "text-[9px]" },
  lg: { icon: 48, text: "text-xl", tagline: "text-[11px]" },
  xl: { icon: 64, text: "text-2xl", tagline: "text-xs" },
};

export function KaushalSetuIcon({
  className,
  size = 36,
  ...props
}: {
  className?: string;
  size?: number;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]", className)}
      {...props}
    >
      <defs>
        {/* Arc Gradients */}
        <linearGradient id="ksArcGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        <linearGradient id="ksBlueGrad" x1="40" y1="70" x2="95" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="ksGreenGrad" x1="160" y1="70" x2="105" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="ksRoadGrad" x1="100" y1="120" x2="100" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Outer Circular Flow Arc */}
      <circle
        cx="100"
        cy="95"
        r="75"
        stroke="url(#ksArcGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="390 90"
        transform="rotate(-90 100 95)"
      />

      {/* Top 4 Icons & Milestone Connectors */}
      <g opacity="0.9">
        {/* Connector dotted lines */}
        <line x1="68" y1="52" x2="84" y2="52" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="98" y1="52" x2="114" y2="52" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="128" y1="52" x2="144" y2="52" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* 1. Academia Cap */}
        <path d="M 58 48 L 50 52 L 58 56 L 66 52 Z" fill="#0284C7" />
        <path d="M 53 54 V 58 C 53 60.5 63 60.5 63 58 V 54" stroke="#0284C7" strokeWidth="1.2" fill="none" />
        <path d="M 64 53 V 59" stroke="#0284C7" strokeWidth="1" />

        {/* 2. Student Person */}
        <circle cx="91" cy="48" r="3.2" fill="#0EA5E9" />
        <path d="M 85 58 C 85 54.5 97 54.5 97 58 Z" fill="#0EA5E9" />

        {/* 3. Skills Gear */}
        <circle cx="121" cy="52" r="4.5" stroke="#10B981" strokeWidth="1.8" fill="none" />
        <circle cx="121" cy="52" r="1.5" fill="#10B981" />

        {/* 4. Industry Briefcase */}
        <rect x="147" y="49" width="12" height="8" rx="1.5" fill="#059669" />
        <path d="M 151 49 V 47 C 151 46.2 155 46.2 155 47 V 49" stroke="#059669" strokeWidth="1" fill="none" />
      </g>

      {/* Bridge Suspension Cables */}
      <g stroke="#0EA5E9" strokeWidth="1.5" opacity="0.65">
        <line x1="48" y1="126" x2="48" y2="108" />
        <line x1="60" y1="126" x2="60" y2="114" />
        <line x1="72" y1="126" x2="72" y2="120" />
        <path d="M 38 126 C 60 100 80 120 80 126" stroke="#0284C7" strokeWidth="2.5" fill="none" />
      </g>
      <g stroke="#10B981" strokeWidth="1.5" opacity="0.65">
        <line x1="152" y1="126" x2="152" y2="108" />
        <line x1="140" y1="126" x2="140" y2="114" />
        <line x1="128" y1="126" x2="128" y2="120" />
        <path d="M 162 126 C 140 100 120 120 120 126" stroke="#059669" strokeWidth="2.5" fill="none" />
      </g>

      {/* Left Bridge Person (Blue - Academia/Student) */}
      <circle cx="78" cy="80" r="6.5" fill="#0284C7" />
      <path
        d="M 85 92 C 85 88 72 88 72 96 L 72 125 L 85 125 L 85 106 L 98 106 C 98 103 98 92 85 92 Z"
        fill="url(#ksBlueGrad)"
      />
      {/* Left Hand Reaching Across */}
      <path d="M 85 94 L 100 94" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />

      {/* Right Bridge Person (Green - Industry/Mentor) */}
      <circle cx="122" cy="80" r="6.5" fill="#10B981" />
      <path
        d="M 115 92 C 115 88 128 88 128 96 L 128 125 L 115 125 L 115 106 L 102 106 C 102 103 102 92 115 92 Z"
        fill="url(#ksGreenGrad)"
      />
      {/* Right Hand Reaching Across / Handshake */}
      <path d="M 115 94 L 100 94" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />

      {/* Center Handshake Node */}
      <circle cx="100" cy="94" r="3.5" fill="#FFFFFF" />

      {/* Central Pathway / Roadway to Future */}
      <path d="M 97 122 L 80 162 L 120 162 L 103 122 Z" fill="url(#ksRoadGrad)" />
      {/* Road Lane Lines */}
      <line x1="100" y1="126" x2="100" y2="136" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="100" y1="142" x2="100" y2="156" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
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
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <KaushalSetuIcon
        size={currentSize.icon}
        className="group-hover:scale-105 transition-transform duration-300"
      />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight font-extrabold leading-none">
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
                "font-mono tracking-wider text-muted-foreground uppercase mt-0.5 whitespace-nowrap",
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
