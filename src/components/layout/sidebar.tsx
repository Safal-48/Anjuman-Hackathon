"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  Bot,
  Layers,
  BookOpen,
  Play,
  Zap,
  TrendingUp,
  Clock,
  Target,
  FileText,
  Sparkles,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "CORE",
    items: [
      { label: "Dashboard (Home)", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Skill Assessment", href: "/assessment", icon: <Brain className="h-4 w-4" />, badge: "Assess" },
    ],
  },
  {
    title: "MY LEARNING",
    items: [
      { label: "Learning Assistant", href: "/career-coach", icon: <Bot className="h-4 w-4" />, badge: "AI" },
      { label: "My Skill DNA", href: "/skills", icon: <Brain className="h-4 w-4" /> },
      { label: "Learning Roadmap", href: "/ai-career", icon: <Layers className="h-4 w-4" /> },
      { label: "Recommended Resources", href: "/learning/resources", icon: <BookOpen className="h-4 w-4" />, badge: "Tailored" },
      { label: "Practice Arena", href: "/practice", icon: <Play className="h-4 w-4" /> },
    ],
  },
  {
    title: "MY PROGRESS & GOALS",
    items: [
      { label: "Performance Readiness", href: "/career-readiness", icon: <Zap className="h-4 w-4" /> },
      { label: "Skill Growth Velocity", href: "/progress/growth", icon: <TrendingUp className="h-4 w-4" /> },
      { label: "Learning History", href: "/progress/history", icon: <Clock className="h-4 w-4" /> },
      { label: "Goal-Based Learning", href: "/learning/goals", icon: <Target className="h-4 w-4" />, badge: "Active" },
    ],
  },
  {
    title: "CAREER & PROOFS",
    items: [
      { label: "Resume / ATS", href: "/resume-analyzer", icon: <FileText className="h-4 w-4" /> },
      { label: "Mock Interview", href: "/mock-interview", icon: <Sparkles className="h-4 w-4" /> },
      { label: "Opportunities", href: "/opportunities", icon: <Compass className="h-4 w-4" /> },
      { label: "Verified Portfolio", href: "/portfolio", icon: <ShieldCheck className="h-4 w-4" />, badge: "Ledger" },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r border-white/[0.08] bg-slate-950/80 backdrop-blur-xl p-4 min-h-screen",
        className
      )}
    >
      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-none py-2">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-3 block">
              {section.title}
            </span>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-glow-sm"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={cn(isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300")}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "cyber" : "glass"}
                        size="sm"
                        className="text-[9px] px-1.5 py-0 h-4"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/[0.06] px-3 space-y-3">
        <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-mono text-[10px]">Adaptive Loop</span>
            <span className="text-emerald-400 font-mono text-[10px]">ACTIVE</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
