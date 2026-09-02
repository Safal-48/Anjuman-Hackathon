import * as React from "react";
import Link from "next/link";
import { Mail, Phone, Instagram, ArrowUpRight, Sparkles, Activity, BookOpen, Brain, Zap, Target } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "./container";
import { KaushalSetuLogo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/90 backdrop-blur-2xl relative overflow-hidden text-sm">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand & Mission Column (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <KaushalSetuLogo size="md" showTagline={false} />
            </Link>
            
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-base tracking-tight">
                AI Personalized Learning Assistant & Skill Intelligence.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Empowering students through adaptive diagnostic probes, tailored multi-modal study resources, and empirical mastery tracking.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-400 font-semibold tracking-wider">ADAPTIVE INTELLIGENCE LOOP ACTIVE</span>
            </div>
          </div>

          {/* Col 1: MY LEARNING */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              My Learning
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link href="/career-coach" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>AI Learning Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>My Skill DNA</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-career" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Learning Roadmap</span>
                </Link>
              </li>
              <li>
                <Link href="/learning/resources" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Recommended Resources</span>
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Practice Arena</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: MY PROGRESS & GOALS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              Progress & Goals
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link href="/career-readiness" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Performance Readiness</span>
                </Link>
              </li>
              <li>
                <Link href="/progress/growth" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Skill Growth Velocity</span>
                </Link>
              </li>
              <li>
                <Link href="/progress/history" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Learning History</span>
                </Link>
              </li>
              <li>
                <Link href="/learning/goals" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Goal-Based Learning</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: CAREER TOOLS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Career & Proofs
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link href="/resume-analyzer" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="text-violet-500/60">•</span>
                  <span>Resume ATS Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/mock-interview" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="text-violet-500/60">•</span>
                  <span>AI Mock Interview</span>
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="text-violet-500/60">•</span>
                  <span>Opportunities</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="text-violet-500/60">•</span>
                  <span>Verified Portfolio</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: ECOSYSTEM & STAKEHOLDERS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-amber-400" />
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link href="/assessment" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500/60">•</span>
                  <span>Diagnostic Assessment</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/institution" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500/60">•</span>
                  <span>Institution Analytics</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/academician" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500/60">•</span>
                  <span>Academician Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500/60">•</span>
                  <span>1-on-1 Mentorship</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2026 KaushalSetu. Smart India Hackathon.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">ASSESS → UNDERSTAND → PRIORITIZE → LEARN → PRACTICE → PROVE → REASSESS → ADAPT</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
