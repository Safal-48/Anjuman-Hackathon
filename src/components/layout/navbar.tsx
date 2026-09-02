"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Bot,
  Zap,
  Users,
  FileText,
  Compass,
  Brain,
  ShieldCheck,
  Building2,
  GraduationCap,
  ArrowRight,
  Layers,
  Award,
  Sliders,
  CheckCircle2,
  LayoutDashboard,
  Target,
  BookOpen,
  TrendingUp,
  Clock,
  Play,
} from "lucide-react";
import { Container } from "./container";
import { SkilloraLogo, SkilloraIcon } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/marketplace/notification-bell";
import { useAuth } from "@/lib/auth/auth-context";
import { JudgeDemoJourneyModal } from "@/components/demo/judge-demo-journey-modal";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [showJudgeDemoModal, setShowJudgeDemoModal] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Primary Navigation Definitions (Step 2 PRD Specification)
  const myLearningItems = [
    {
      title: "Learning Assistant",
      desc: "Interactive Socratic AI Tutor contextually aware of your skill gaps",
      href: "/learning/assistant",
      icon: Bot,
      badge: "AI Tutor",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "My Skill DNA",
      desc: "Multi-vector diagnostic competency map & benchmark gap radar",
      href: "/skills",
      icon: Brain,
      badge: "Skill DNA",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      title: "Learning Roadmap",
      desc: "Personalized continuous adaptive milestone study plan",
      href: "/learning/roadmap",
      icon: Layers,
      badge: "Dynamic Plan",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Recommended Resources",
      desc: "Multi-modal curated videos, sandboxes & docs prioritized by deficit",
      href: "/learning/resources",
      icon: BookOpen,
      badge: "Adaptive Queue",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Practice Arena",
      desc: "AI oral defense exams, multi-agent GD roundtables & coding drills",
      href: "/practice",
      icon: Play,
      badge: "Oral Drills",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
  ];

  const myProgressItems = [
    {
      title: "Learning Progress & Proven Skills",
      desc: "Weighted learning mastery score & evidence-based proof matrix",
      href: "/progress/performance",
      icon: Zap,
      badge: "Evidence Matrix",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Skill Growth & Delta",
      desc: "Empirical pre- vs. post-intervention trajectory and mastery velocity",
      href: "/progress/growth",
      icon: TrendingUp,
      badge: "Mastery Velocity",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Learning History",
      desc: "Auditable chronological ledger of assessments, drills & credentials",
      href: "/progress/history",
      icon: Clock,
      badge: "Activity Ledger",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
  ];

  const careerToolsItems = [
    {
      title: "Resume / ATS Studio",
      desc: "Deterministic entity extraction and role compatibility grading",
      href: "/resume-analyzer",
      icon: FileText,
      badge: "ATS 0-100",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "AI Mock Interview",
      desc: "Voice & text oral exam with real-time technical depth evaluation",
      href: "/mock-interview",
      icon: Sparkles,
      badge: "Voice AI",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Opportunity Marketplace",
      desc: "Explainable matching for verified internships & industry projects",
      href: "/opportunities",
      icon: Compass,
      badge: "Verified Matches",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-slate-950/60 backdrop-blur-md border-b border-white/[0.05]"
      }`}
    >
      <Container size="xl">
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <SkilloraLogo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation - Repositioned for Education & Personalized Learning */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {/* 1. HOME */}
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                pathname === "/" || pathname === "/dashboard"
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              HOME
            </Link>

            {/* 2. ASSESS */}
            <Link
              href="/assessment"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                pathname?.startsWith("/assessment")
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Brain className="h-3.5 w-3.5 text-cyan-400" />
              <span>ASSESS</span>
            </Link>

            {/* 3. MY LEARNING Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "learning" ? null : "learning")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all whitespace-nowrap ${
                  openDropdown === "learning" || pathname?.startsWith("/career-coach") || pathname?.startsWith("/skills") || pathname?.startsWith("/ai-career") || pathname?.startsWith("/learning") || pathname?.startsWith("/practice")
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                <span>MY LEARNING</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "learning" ? "rotate-180 text-cyan-400" : "text-muted-foreground"}`} />
              </button>

              {openDropdown === "learning" && (
                <div className="absolute top-full left-0 mt-2 w-[480px] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 border-b border-white/[0.08] pb-1.5">
                    Adaptive Learning Suite
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    {myLearningItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition-all flex items-start gap-3 group"
                        >
                          <div className={`p-2 rounded-lg border ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground font-mono group-hover:text-cyan-300 transition-colors">
                                {item.title}
                              </span>
                              <Badge variant="glass" size="sm" className="font-mono text-[9px]">
                                {item.badge}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. MY PROGRESS Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "progress" ? null : "progress")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all whitespace-nowrap ${
                  openDropdown === "progress" || pathname?.startsWith("/career-readiness") || pathname?.startsWith("/progress")
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-glow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>MY PROGRESS</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "progress" ? "rotate-180 text-emerald-400" : "text-muted-foreground"}`} />
              </button>

              {openDropdown === "progress" && (
                <div className="absolute top-full left-0 mt-2 w-[460px] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 border-b border-white/[0.08] pb-1.5">
                    Progress & Mastery Velocity
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    {myProgressItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-transparent hover:border-emerald-500/30 transition-all flex items-start gap-3 group"
                        >
                          <div className={`p-2 rounded-lg border ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground font-mono group-hover:text-emerald-300 transition-colors">
                                {item.title}
                              </span>
                              <Badge variant="glass" size="sm" className="font-mono text-[9px]">
                                {item.badge}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 5. MY GOALS */}
            <Link
              href="/learning/goals"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                pathname?.startsWith("/learning/goals")
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              <span>MY GOALS</span>
            </Link>

            {/* 6. CAREER TOOLS Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "career" ? null : "career")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all whitespace-nowrap ${
                  openDropdown === "career" || pathname?.startsWith("/resume-analyzer") || pathname?.startsWith("/mock-interview") || pathname?.startsWith("/opportunities")
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/40 shadow-glow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>CAREER TOOLS</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "career" ? "rotate-180 text-violet-400" : "text-muted-foreground"}`} />
              </button>

              {openDropdown === "career" && (
                <div className="absolute top-full right-0 mt-2 w-[460px] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-violet-500/30 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400 border-b border-white/[0.08] pb-1.5">
                    Career Bridge & ATS Suite
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    {careerToolsItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-transparent hover:border-violet-500/30 transition-all flex items-start gap-3 group"
                        >
                          <div className={`p-2 rounded-lg border ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground font-mono group-hover:text-violet-300 transition-colors">
                                {item.title}
                              </span>
                              <Badge variant="glass" size="sm" className="font-mono text-[9px]">
                                {item.badge}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 7. PORTFOLIO */}
            <Link
              href="/portfolio"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                pathname === "/portfolio"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-glow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>PORTFOLIO</span>
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Hackathon Judge / Presentation Demo Tour Button */}
            <Button
              onClick={() => setShowJudgeDemoModal(true)}
              variant="cyber"
              size="sm"
              className="hidden md:inline-flex font-mono text-[11px] gap-1.5 shadow-glow h-8 px-3"
            >
              <Award className="h-3.5 w-3.5 text-cyan-300" />
              <span>Judge Tour</span>
            </Button>

            <ThemeToggle />
            <NotificationBell />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:border-cyan-500/40">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="hidden sm:inline font-mono text-xs">{user?.fullName || "Student Profile"}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300 hover:text-white">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="cyber" size="sm" className="font-mono text-xs gap-1.5">
                    Start Learning <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-white/10"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="xl:hidden py-4 border-t border-white/[0.08] space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={isAuthenticated ? "/dashboard" : "/"}
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                <span>HOME</span>
              </Link>
              <Link
                href="/assessment"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2"
              >
                <Brain className="h-4 w-4 text-cyan-400" />
                <span>ASSESS</span>
              </Link>
            </div>

            {/* MY LEARNING SECTION */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-1">MY LEARNING</span>
              <div className="grid grid-cols-1 gap-1 pt-1">
                {myLearningItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-3.5 w-3.5 text-cyan-400" />
                      {item.title}
                    </span>
                    <Badge variant="glass" size="sm" className="text-[9px]">{item.badge}</Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* MY PROGRESS SECTION */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 px-1">MY PROGRESS</span>
              <div className="grid grid-cols-1 gap-1 pt-1">
                {myProgressItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-3.5 w-3.5 text-emerald-400" />
                      {item.title}
                    </span>
                    <Badge variant="glass" size="sm" className="text-[9px]">{item.badge}</Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* CAREER & GOALS */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
              <Link
                href="/learning/goals"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2"
              >
                <Target className="h-4 w-4 text-cyan-400" />
                <span>MY GOALS</span>
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>PORTFOLIO</span>
              </Link>
            </div>
          </div>
        )}
      </Container>

      {/* 14-Step God-Level Student Journey Presentation Modal */}
      <JudgeDemoJourneyModal
        isOpen={showJudgeDemoModal}
        onClose={() => setShowJudgeDemoModal(false)}
      />
    </header>
  );
}
