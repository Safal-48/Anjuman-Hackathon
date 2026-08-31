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
      <WarpFieldDefault
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
      {/* Ambient gradient and grid layer over the warp field for crisp UI legibility */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/30 via-transparent to-[#02040A]/60 pointer-events-none" />
    </div>
  );
}
