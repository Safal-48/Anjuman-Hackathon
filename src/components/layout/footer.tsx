import * as React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Activity, Terminal, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "./container";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-xl relative overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground tracking-tight text-lg">
                {SITE_CONFIG.name}
              </span>
              <Badge variant="cyber" size="sm">
                SIH {SITE_CONFIG.sih.year}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Col 2: Architecture Layers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Architecture
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-cyan-400 transition-colors">Next.js 14 (App Router)</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors">Tailwind CSS + shadcn</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors">Framer Motion Kinetics</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors">Supabase / PostgreSQL</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 transition-colors">Three.js / React Three Fiber</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Project Metadata */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Hackathon Context
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>Problem Statement</span>
                <span className="font-mono text-cyan-400 font-semibold">{SITE_CONFIG.sih.problemStatementId}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Category</span>
                <span className="text-xs text-foreground/80">{SITE_CONFIG.sih.category}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Team</span>
                <span className="font-medium text-foreground">{SITE_CONFIG.sih.teamName}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Developed for Smart India Hackathon {SITE_CONFIG.sih.year}.</p>
          <div className="flex items-center gap-6">
            <Link href="/api/health" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <Activity className="h-3.5 w-3.5" />
              <span>Health Endpoint</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
