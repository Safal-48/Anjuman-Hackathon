"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Activity,
  Cpu,
  Database,
  Sliders,
  Terminal,
  Shield,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  disabled?: boolean;
}

const defaultNav: SidebarItem[] = [
  { icon: <Layers className="h-4 w-4" />, label: "Dashboard", href: "/" },
  { icon: <Cpu className="h-4 w-4" />, label: "Ecosystem Graph", href: "#ecosystem-3d" },
  { icon: <Database className="h-4 w-4" />, label: "Data Schema", href: "#architecture", badge: "Supabase" },
  { icon: <Activity className="h-4 w-4" />, label: "Telemetry & Logs", href: "#health", badge: "Live" },
  { icon: <Sliders className="h-4 w-4" />, label: "Design System", href: "#design-system" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r border-white/[0.08] bg-slate-950/70 backdrop-blur-xl p-4 min-h-screen",
        className
      )}
    >
      <div className="px-3 py-2 mb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Navigation Control
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {defaultNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-glow-sm"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(isActive ? "text-cyan-400" : "text-muted-foreground group-hover:text-foreground")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={isActive ? "cyber" : "glass"}
                  size="sm"
                  className="text-[10px] px-1.5"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/[0.06] px-3 space-y-3">
        <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Core State</span>
            <span className="text-emerald-400 font-mono">HEALTHY</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
