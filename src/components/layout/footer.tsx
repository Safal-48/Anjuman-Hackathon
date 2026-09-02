import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Instagram,
  ArrowUpRight,
  Sparkles,
  Activity,
  BookOpen,
  Brain,
  Zap,
  Target,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "./container";
import { SkilloraLogo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl relative overflow-hidden text-sm">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <Container size="xl" className="py-12 md:py-16 space-y-12">
        {/* Main Navigation & Ecosystem Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand & Mission Column (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <SkilloraLogo size="md" showTagline={false} />
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

            {/* Quick Social & Contact Badges */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={SITE_CONFIG.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Skillora on Instagram"
                className="h-8 w-8 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/40 flex items-center justify-center transition-all shadow-sm"
              >
                <Instagram className="h-4 w-4" />
              </a>

              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Email Skillora Official"
                className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 flex items-center justify-center transition-all shadow-sm"
              >
                <Mail className="h-4 w-4" />
              </a>

              <a
                href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                title="Call Skillora Support"
                className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 flex items-center justify-center transition-all shadow-sm"
              >
                <Phone className="h-4 w-4" />
              </a>

              <a
                href={SITE_CONFIG.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with Skillora on WhatsApp"
                className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
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

        {/* Official Interactive Connect & Communications Hub */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-cyan-950/20 to-slate-900/90 border border-cyan-500/20 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Official Contact & Support Channels</span>
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Tap any channel below to directly launch the respective app, email, or dialer.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold self-start sm:self-auto">
              Team TechNova
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Instagram */}
            <a
              href={SITE_CONFIG.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-pink-500/20 hover:border-pink-500/60 hover:bg-pink-950/20 transition-all flex items-center gap-3 group"
            >
              <div className="h-9 w-9 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Instagram className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-pink-400 font-semibold uppercase block">Instagram</span>
                <span className="text-xs font-bold text-foreground group-hover:text-pink-300 truncate block">
                  {SITE_CONFIG.contact.instagramHandle}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-pink-400/60 group-hover:text-pink-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* 2. Gmail / Email */}
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/20 hover:border-rose-500/60 hover:bg-rose-950/20 transition-all flex items-center gap-3 group"
            >
              <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-rose-400 font-semibold uppercase block">Official Gmail</span>
                <span className="text-xs font-bold text-foreground group-hover:text-rose-300 truncate block">
                  {SITE_CONFIG.contact.email}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-rose-400/60 group-hover:text-rose-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* 3. Phone / Direct Call */}
            <a
              href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-500/60 hover:bg-cyan-950/20 transition-all flex items-center gap-3 group"
            >
              <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase block">Direct Call</span>
                <span className="text-xs font-bold text-foreground group-hover:text-cyan-300 truncate block">
                  {SITE_CONFIG.contact.phone}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-cyan-400/60 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* 4. WhatsApp Chat */}
            <a
              href={SITE_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-950/20 transition-all flex items-center gap-3 group"
            >
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase block">WhatsApp Chat</span>
                <span className="text-xs font-bold text-foreground group-hover:text-emerald-300 truncate block">
                  +91 93228 33495
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-400/60 group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2026 Skillora. Engineered by Team TechNova.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">ASSESS → UNDERSTAND → PRIORITIZE → LEARN → PRACTICE → PROVE → REASSESS → ADAPT</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
