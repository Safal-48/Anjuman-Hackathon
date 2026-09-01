"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const WarpFieldDefault = dynamic(
  () => import("@/components/3d/warp-field").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#02040A] -z-50" />,
  }
);

export function GlobalWarpBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none">
      {/* 3D WebGL Warp Field & Particle Stars (Active Globally Across All Pages) */}
      <WarpFieldDefault
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0.85,
        }}
      />

      {/* Cybernetic ambient grid and glowing radial flares */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:48px_48px] opacity-25 pointer-events-none" />
      
      {/* Dynamic Animated Ambient Glow Flares */}
      <div className="absolute top-1/6 left-1/4 w-[500px] h-[500px] bg-cyan-500/12 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/12 rounded-full blur-[120px] animate-pulse pointer-events-none duration-1000" />
      <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Radial overlay for contrast & readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.16),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(99,102,241,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/30 via-transparent to-[#02040A]/70 pointer-events-none" />
    </div>
  );
}
