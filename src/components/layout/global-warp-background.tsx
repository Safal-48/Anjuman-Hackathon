"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const WarpFieldDefault = dynamic(
  () => import("@/components/3d/warp-field").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#02040A] -z-50" />,
  }
);

export function GlobalWarpBackground() {
  const pathname = usePathname();
  // Only run the heavy WebGL 3D warp particle effect on the landing page to keep dashboard/skills/opportunities ultra-smooth (120 FPS, 0 lag)
  const isLandingPage = pathname === "/" || pathname === "/how-it-works";

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none">
      {isLandingPage ? (
        <WarpFieldDefault
          style={{
            position: "absolute",
            inset: 0,
            width: "100vw",
            height: "100vh",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#02040A]" />
      )}

      {/* Cybernetic ambient grid and radial glow layer */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(99,102,241,0.08),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/40 via-transparent to-[#02040A]/80 pointer-events-none" />
    </div>
  );
}
