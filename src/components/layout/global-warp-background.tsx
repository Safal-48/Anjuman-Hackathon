"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const WarpFieldDefault = dynamic(
  () => import("@/components/3d/warp-field").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#02040A]" />,
  }
);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export function GlobalWarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates for interactive particle attraction
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const colors = ["#06b6d4", "#10b981", "#8b5cf6", "#38bdf8", "#a855f7"];
    const particleCount = Math.min(85, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle mouse attraction
        if (mouseActive) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 0.6;
            p.y += (dy / dist) * force * 0.6;
          }
        }

        // Pulse alpha
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        const currentAlpha = Math.max(0.2, Math.min(0.85, p.alpha));

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect with nearby particles (Synaptic Laser Lines)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 130) * 0.25;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect with mouse cursor
        if (mouseActive) {
          const distMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (distMouse < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = "#06b6d4";
            ctx.globalAlpha = (1 - distMouse / 140) * 0.35;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base 3D WebGL Warp Field & Cosmic Star Depth */}
      <WarpFieldDefault
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0.75,
        }}
      />

      {/* 2. Live Interactive Cybernetic Neural Synapse Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        style={{ display: "block" }}
      />

      {/* 3. High-Tech Cybernetic Perspective Grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:48px_48px] opacity-20 pointer-events-none z-[2]" />

      {/* 4. Ambient Glowing Nebula Flares */}
      <div className="absolute top-1/6 left-1/4 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[130px] animate-pulse pointer-events-none z-[2]" />
      <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-violet-500/15 rounded-full blur-[130px] animate-pulse pointer-events-none duration-1000 z-[2]" />
      <div className="absolute top-1/2 right-1/3 w-[450px] h-[450px] bg-emerald-500/12 rounded-full blur-[110px] pointer-events-none z-[2]" />

      {/* 5. Vignette & Contrast Gradients for Optimal Readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.18),rgba(255,255,255,0))] pointer-events-none z-[3]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(139,92,246,0.14),rgba(255,255,255,0))] pointer-events-none z-[3]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/20 via-transparent to-[#02040A]/60 pointer-events-none z-[3]" />
    </div>
  );
}
