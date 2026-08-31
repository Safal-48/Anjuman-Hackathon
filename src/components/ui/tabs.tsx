"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex p-1 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md",
        className
      )}
    >
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg flex items-center gap-2 z-10",
              isActive
                ? "text-white"
                : "text-muted-foreground hover:text-foreground/90"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 rounded-lg shadow-glow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {tab.icon && <span className="relative z-20">{tab.icon}</span>}
            <span className="relative z-20">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="relative z-20 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
