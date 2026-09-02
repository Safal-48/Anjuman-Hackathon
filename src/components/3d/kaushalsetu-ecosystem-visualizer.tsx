"use client";

import * as React from "react";
import { User, Briefcase, GraduationCap, Target, Building2, Sparkles, CheckCircle2 } from "lucide-react";
import { SkilloraIcon } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface EcosystemNodeProps {
  id: string;
  title: string;
  color: string;
  glowColor: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  items: string[];
  position: { x: number; y: number };
  bulletAlign?: "left" | "right";
  isActive?: boolean;
  onHover?: (id: string | null) => void;
}

const NODES = [
  {
    id: "students",
    title: "STUDENTS",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.4)",
    borderColor: "border-cyan-500/40",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    icon: <User className="h-5 w-5 text-cyan-400" />,
    items: ["Skill Assessment", "Career Guidance", "Opportunities", "Portfolio"],
    position: { x: 200, y: 110 },
    lineTarget: { x: 230, y: 130 },
    bulletAlign: "right" as const,
  },
  {
    id: "industry",
    title: "INDUSTRY",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    icon: <Briefcase className="h-5 w-5 text-purple-400" />,
    items: ["Talent Discovery", "Internships & Jobs", "Projects & Training", "Industry Insights"],
    position: { x: 500, y: 110 },
    lineTarget: { x: 470, y: 130 },
    bulletAlign: "left" as const,
  },
  {
    id: "academia",
    title: "ACADEMIA",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    icon: <GraduationCap className="h-5 w-5 text-emerald-400" />,
    items: ["Faculty Development", "Research Collaboration", "Academic Programs", "Mentorship"],
    position: { x: 190, y: 300 },
    lineTarget: { x: 220, y: 280 },
    bulletAlign: "right" as const,
  },
  {
    id: "institutions",
    title: "INSTITUTIONS",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.4)",
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    icon: <Building2 className="h-5 w-5 text-amber-400" />,
    items: ["Student Analytics", "Skill Gap Reports", "Placement Insights", "Outcome Tracking"],
    position: { x: 510, y: 300 },
    lineTarget: { x: 480, y: 280 },
    bulletAlign: "left" as const,
  },
  {
    id: "opportunities",
    title: "OPPORTUNITIES",
    color: "#0ea5e9",
    glowColor: "rgba(14, 165, 233, 0.4)",
    borderColor: "border-sky-500/40",
    bgColor: "bg-sky-500/10",
    textColor: "text-sky-400",
    icon: <Target className="h-5 w-5 text-sky-400" />,
    items: ["Internships", "Jobs", "Projects", "Certifications"],
    position: { x: 350, y: 390 },
    lineTarget: { x: 350, y: 340 },
    bulletAlign: "left" as const,
  },
];

export function SkilloraEcosystemVisualizer() {
  const [activeNode, setActiveNode] = React.useState<string | null>(null);

  return (
    <div className="w-full relative rounded-2xl border border-white/[0.08] bg-slate-950/70 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl overflow-hidden group/canvas">
      {/* Top Header Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-glow-sm" />
          <span>Skillora ECOSYSTEM</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60 hidden sm:inline">
          Interactive Topology
        </span>
      </div>

      {/* SVG Canvas with Animated Nodes & Connecting Lines */}
      <div className="relative w-full aspect-[700/490] max-h-[520px]">
        <svg
          viewBox="0 0 700 490"
          className="w-full h-full select-none"
          style={{ filter: "drop-shadow(0 0 20px rgba(6,182,212,0.1))" }}
        >
          <defs>
            {/* Energy Particle Filter */}
            <filter id="hubGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradients for connecting beams */}
            <linearGradient id="beamStudents" x1="350" y1="210" x2="230" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="beamIndustry" x1="350" y1="210" x2="470" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="beamAcademia" x1="350" y1="210" x2="220" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="beamInstitutions" x1="350" y1="210" x2="480" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="beamOpportunities" x1="350" y1="210" x2="350" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background Concentric Radar Rings */}
          <circle cx="350" cy="210" r="140" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
          <circle cx="350" cy="210" r="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="6 6" fill="none" />

          {/* Connecting Beams to 5 Nodes */}
          <g>
            {/* STUDENTS Line */}
            <line
              x1="350"
              y1="210"
              x2="230"
              y2="130"
              stroke={activeNode === "students" ? "#06b6d4" : "rgba(6,182,212,0.4)"}
              strokeWidth={activeNode === "students" ? "2.5" : "1.5"}
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
            {/* INDUSTRY Line */}
            <line
              x1="350"
              y1="210"
              x2="470"
              y2="130"
              stroke={activeNode === "industry" ? "#a855f7" : "rgba(168,85,247,0.4)"}
              strokeWidth={activeNode === "industry" ? "2.5" : "1.5"}
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
            {/* ACADEMIA Line */}
            <line
              x1="350"
              y1="210"
              x2="220"
              y2="280"
              stroke={activeNode === "academia" ? "#10b981" : "rgba(16,185,129,0.4)"}
              strokeWidth={activeNode === "academia" ? "2.5" : "1.5"}
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
            {/* INSTITUTIONS Line */}
            <line
              x1="350"
              y1="210"
              x2="480"
              y2="280"
              stroke={activeNode === "institutions" ? "#f59e0b" : "rgba(245,158,11,0.4)"}
              strokeWidth={activeNode === "institutions" ? "2.5" : "1.5"}
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
            {/* OPPORTUNITIES Line */}
            <line
              x1="350"
              y1="210"
              x2="350"
              y2="340"
              stroke={activeNode === "opportunities" ? "#0ea5e9" : "rgba(14,165,233,0.4)"}
              strokeWidth={activeNode === "opportunities" ? "2.5" : "1.5"}
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
          </g>

          {/* Central Hub Glowing Ring */}
          <g transform="translate(350, 210)">
            <circle r="72" fill="rgba(3, 7, 18, 0.9)" stroke="#06b6d4" strokeWidth="2.5" className="shadow-glow-md" />
            <circle r="78" fill="none" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1.5" strokeDasharray="6 4" className="animate-[spin_20s_linear_infinite]" />
            <circle r="84" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" strokeDasharray="8 6" className="animate-[spin_35s_linear_infinite_reverse]" />

            {/* Central Content */}
            <foreignObject x="-65" y="-65" width="130" height="130" className="pointer-events-none">
              <div className="flex flex-col items-center justify-center h-full text-center px-1">
                <SkilloraIcon size={36} className="mb-1 drop-shadow-md" />
                <span className="font-extrabold text-[13px] tracking-tight text-white leading-none font-mono">
                  Skill<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">ora</span>
                </span>
                <span className="text-[7px] font-mono tracking-widest text-cyan-300 uppercase mt-1.5 leading-tight font-semibold">
                  LEARN SMART • IMPROVE
                  <br />
                  OWN YOUR FUTURE
                </span>
              </div>
            </foreignObject>
          </g>
        </svg>

        {/* Interactive Floating HTML Nodes for Crisp Icons & Hover states */}
        {/* 1. STUDENTS (Top Left) */}
        <div
          className="absolute left-[2%] sm:left-[6%] top-[8%] flex items-center gap-3 cursor-pointer transition-all duration-300 group"
          onMouseEnter={() => setActiveNode("students")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="text-right hidden sm:block">
            <h4 className="font-bold text-xs tracking-wider text-cyan-400 group-hover:text-cyan-300 uppercase">
              STUDENTS
            </h4>
            <ul className="text-[10px] text-muted-foreground/90 space-y-0.5 mt-0.5">
              <li>• Skill Assessment</li>
              <li>• Career Guidance</li>
              <li>• Opportunities</li>
              <li>• Portfolio</li>
            </ul>
          </div>
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/90 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all duration-300">
            <User className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-left sm:hidden">
            <h4 className="font-bold text-[11px] text-cyan-400 uppercase">STUDENTS</h4>
          </div>
        </div>

        {/* 2. INDUSTRY (Top Right) */}
        <div
          className="absolute right-[2%] sm:right-[6%] top-[8%] flex items-center gap-3 cursor-pointer transition-all duration-300 group"
          onMouseEnter={() => setActiveNode("industry")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/90 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-300">
            <Briefcase className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="font-bold text-xs tracking-wider text-purple-400 group-hover:text-purple-300 uppercase">
              INDUSTRY
            </h4>
            <ul className="text-[10px] text-muted-foreground/90 space-y-0.5 mt-0.5">
              <li>• Talent Discovery</li>
              <li>• Internships & Jobs</li>
              <li>• Projects & Training</li>
              <li>• Industry Insights</li>
            </ul>
          </div>
          <div className="text-left sm:hidden">
            <h4 className="font-bold text-[11px] text-purple-400 uppercase">INDUSTRY</h4>
          </div>
        </div>

        {/* 3. ACADEMIA (Bottom Left) */}
        <div
          className="absolute left-[2%] sm:left-[6%] top-[54%] flex items-center gap-3 cursor-pointer transition-all duration-300 group"
          onMouseEnter={() => setActiveNode("academia")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="text-right hidden sm:block">
            <h4 className="font-bold text-xs tracking-wider text-emerald-400 group-hover:text-emerald-300 uppercase">
              ACADEMIA
            </h4>
            <ul className="text-[10px] text-muted-foreground/90 space-y-0.5 mt-0.5">
              <li>• Faculty Development</li>
              <li>• Research Collaboration</li>
              <li>• Academic Programs</li>
              <li>• Mentorship</li>
            </ul>
          </div>
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/90 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-300">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-left sm:hidden">
            <h4 className="font-bold text-[11px] text-emerald-400 uppercase">ACADEMIA</h4>
          </div>
        </div>

        {/* 4. INSTITUTIONS (Bottom Right) */}
        <div
          className="absolute right-[2%] sm:right-[6%] top-[54%] flex items-center gap-3 cursor-pointer transition-all duration-300 group"
          onMouseEnter={() => setActiveNode("institutions")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/90 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] transition-all duration-300">
            <Building2 className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="font-bold text-xs tracking-wider text-amber-400 group-hover:text-amber-300 uppercase">
              INSTITUTIONS
            </h4>
            <ul className="text-[10px] text-muted-foreground/90 space-y-0.5 mt-0.5">
              <li>• Student Analytics</li>
              <li>• Skill Gap Reports</li>
              <li>• Placement Insights</li>
              <li>• Outcome Tracking</li>
            </ul>
          </div>
          <div className="text-left sm:hidden">
            <h4 className="font-bold text-[11px] text-amber-400 uppercase">INSTITUTIONS</h4>
          </div>
        </div>

        {/* 5. OPPORTUNITIES (Bottom Center) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[2%] flex items-center gap-3 cursor-pointer transition-all duration-300 group"
          onMouseEnter={() => setActiveNode("opportunities")}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/90 border-2 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(14,165,233,0.7)] transition-all duration-300">
            <Target className="h-5 w-5 text-sky-400" />
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="font-bold text-xs tracking-wider text-sky-400 group-hover:text-sky-300 uppercase">
              OPPORTUNITIES
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/90 mt-0.5 whitespace-nowrap">
              <span>• Internships</span>
              <span>• Jobs</span>
              <span>• Projects</span>
              <span>• Certifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkilloraEcosystemVisualizer;
