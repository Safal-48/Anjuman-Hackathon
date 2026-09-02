"use client";

import React from "react";
import { OrbBurst } from "./orb-burst";
import { Sparkles, Shield, Cpu } from "lucide-react";

interface ParticleLoaderProps {
  title?: string;
  subtitle?: string;
  size?: number;
  fullScreen?: boolean;
}

export function ParticleLoader({
  title = "Skillora Intelligence Engine",
  subtitle = "Synthesizing real-time career telemetry & neural pathways...",
  size = 200,
  fullScreen = false,
}: ParticleLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
      {/* 3D Elastic Particle Orb Burst */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow Aura behind the Orb */}
        <div className="absolute h-48 w-48 rounded-full bg-cyan-500/15 blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute h-32 w-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div
          style={{ width: size, height: size }}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <OrbBurst
            width={size}
            height={size}
            dotColor="#00f2fe"
            accentColor="#10b981"
            density={260}
            dotSize={140}
            speed={60}
          />
        </div>
      </div>

      {/* Futuristic Status Typography & Telemetry */}
      <div className="space-y-1.5 max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-300 uppercase">
            {title}
          </h3>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed animate-pulse">
          {subtitle}
        </p>
      </div>

      {/* Mini Cyber Badges */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/80 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
        <Cpu className="h-3 w-3 animate-spin text-cyan-400" />
        <span>Quantum Neural State Active</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return <div className="min-h-[360px] flex items-center justify-center w-full">{content}</div>;
}

export default ParticleLoader;
