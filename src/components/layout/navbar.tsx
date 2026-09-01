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
} from "lucide-react";
import { Container } from "./container";
import { KaushalSetuIcon } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/marketplace/notification-bell";
import { useAuth } from "@/lib/auth/auth-context";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
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

  const aiSuiteItems = [
    {
      title: "AI Mock Interview Studio",
      desc: "Voice & text simulator with dynamic follow-ups & performance popups",
      href: "/mock-interview",
      icon: Sparkles,
      badge: "Voice AI",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "AI GD Roundtable",
      desc: "Multi-agent virtual discussion room with 5 AI peer personas",
      href: "/group-discussion",
      icon: Users,
      badge: "Multi-Agent",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "AI Career Coach",
      desc: "Grounded conversational advisor with live profile telemetry",
      href: "/career-coach",
      icon: Bot,
      badge: "Grounded AI",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      title: "Resume ATS Studio",
      desc: "5-stage standalone ATS audit with Google XYZ recommendations",
      href: "/resume-analyzer",
      icon: FileText,
      badge: "ATS 0-100",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
  ];

  const readinessItems = [
    {
      title: "Career Readiness Command Center",
      desc: "5-pillar weighted scoring & 3-step Next Best Action pipeline",
      href: "/career-readiness",
      icon: Zap,
      badge: "5-Pillar Score",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Skill Intelligence & Labs",
      desc: "Verified skill assessments, telemetry benchmarks, and deficit drills",
      href: "/skills",
      icon: Brain,
      badge: "Verified Labs",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      title: "Digital Portfolio (GitHub Provenance)",
      desc: "Cryptographic commit telemetry, code provenance, and verified badges",
      href: "/portfolio",
      icon: ShieldCheck,
      badge: "Git Proof",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  const enterpriseItems = [
    {
      title: "Candidate Intelligence Suite",
      desc: "Explainable candidate match scoring with requirements configurator",
      href: "/dashboard/industry/candidate-intelligence",
      icon: Sliders,
      badge: "Explainable Match",
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      title: "Industry Recruiter Command",
      desc: "Talent pipeline manager, market skill demand radar & role postings",
      href: "/dashboard/industry",
      icon: Building2,
      badge: "Recruiter Suite",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Opportunities Marketplace",
      desc: "Pre-screened role marketplace with pre-submission readiness gating",
      href: "/opportunities",
      icon: Compass,
      badge: "70% Threshold",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  const loggedInNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Coach", href: "/career-coach", icon: Bot },
    { label: "Readiness", href: "/career-readiness", icon: Zap },
    { label: "AI Interview", href: "/mock-interview", icon: Sparkles },
    { label: "GD Room", href: "/group-discussion", icon: Users },
    { label: "Resume ATS", href: "/resume-analyzer", icon: FileText },
    { label: "Opportunities", href: "/opportunities", icon: Compass },
    { label: "Skills", href: "/skills", icon: Brain },
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
              <KaushalSetuIcon size={38} className="shadow-cyan-500/20 shadow-lg group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <div className="flex items-center font-extrabold tracking-tight text-lg leading-none">
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    Kaushal
                  </span>
                  <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    Setu
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-1 hidden sm:inline font-semibold">
                  Intelligent Career Operating System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {isAuthenticated ? (
              // Authenticated Navigation Pills
              loggedInNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })
            ) : (
              // Public Mega-Menu Dropdowns (Professional & Non-Crowded)
              <>
                {/* 1. AI Studios Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "ai" ? null : "ai")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap ${
                      openDropdown === "ai" || pathname?.startsWith("/mock-interview") || pathname?.startsWith("/group-discussion") || pathname?.startsWith("/career-coach") || pathname?.startsWith("/resume-analyzer")
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                        : "text-slate-200 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>AI Studios</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "ai" ? "rotate-180 text-cyan-400" : "text-muted-foreground"}`} />
                  </button>

                  {openDropdown === "ai" && (
                    <div className="absolute top-full left-0 mt-2 w-[480px] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 border-b border-white/[0.08] pb-1.5">
                        Interactive AI Capabilities
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {aiSuiteItems.map((item) => {
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

                {/* 2. Readiness & Skills Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "readiness" ? null : "readiness")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap ${
                      openDropdown === "readiness" || pathname?.startsWith("/career-readiness") || pathname?.startsWith("/skills") || pathname?.startsWith("/portfolio")
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                        : "text-slate-200 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5 text-violet-400" />
                    <span>Readiness & Skills</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "readiness" ? "rotate-180 text-violet-400" : "text-muted-foreground"}`} />
                  </button>

                  {openDropdown === "readiness" && (
                    <div className="absolute top-full left-0 mt-2 w-[460px] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-violet-500/30 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400 border-b border-white/[0.08] pb-1.5">
                        Verification & Career Benchmarking
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {readinessItems.map((item) => {
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

                {/* 3. Opportunities Direct Link */}
                <Link
                  href="/opportunities"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap ${
                    pathname === "/opportunities"
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                      : "text-slate-200 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Opportunities</span>
                </Link>

                {/* 4. Enterprise & Recruiters Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "enterprise" ? null : "enterprise")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap ${
                      openDropdown === "enterprise" || pathname?.startsWith("/dashboard/industry")
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                        : "text-slate-200 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Recruiter Suite</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "enterprise" ? "rotate-180 text-cyan-400" : "text-muted-foreground"}`} />
                  </button>

                  {openDropdown === "enterprise" && (
                    <div className="absolute top-full right-0 mt-2 w-[460px] p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 border-b border-white/[0.08] pb-1.5">
                        Industry & Hiring Intelligence
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {enterpriseItems.map((item) => {
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

                {/* 5. Ecosystem Overview Link */}
                <Link
                  href="/#ecosystem-3d"
                  className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all whitespace-nowrap"
                >
                  Ecosystem
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />

                {/* User Profile Pill & Sign Out */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
                  <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-bold text-foreground leading-none truncate max-w-[100px] font-mono">
                        {user.fullName.split(" ")[0]}
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">
                        {user.role}
                      </span>
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-rose-400"
                    onClick={() => logout()}
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-mono font-bold text-slate-200 hover:text-white px-3.5">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="glow" size="sm" className="text-xs font-mono font-bold px-4 shadow-cyan-500/20 shadow-md">
                    Launch Studio →
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <Button
              variant="glass"
              size="icon"
              className="h-9 w-9 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-4 py-5 space-y-4 rounded-b-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto font-mono text-xs">
            {/* AI Studios Group */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block px-2">
                AI Studios
              </span>
              {aiSuiteItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/5"
                >
                  <span>{item.title}</span>
                  <Badge variant="glass" size="sm" className="text-[9px]">
                    {item.badge}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Readiness & Verification */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider block px-2">
                Readiness & Skills
              </span>
              {readinessItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-violet-300 hover:bg-white/5"
                >
                  <span>{item.title}</span>
                  <Badge variant="glass" size="sm" className="text-[9px]">
                    {item.badge}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Recruiter & Opportunities */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block px-2">
                Recruiter & Marketplace
              </span>
              {enterpriseItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-emerald-300 hover:bg-white/5"
                >
                  <span>{item.title}</span>
                  <Badge variant="glass" size="sm" className="text-[9px]">
                    {item.badge}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* User Controls */}
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button variant="cyber" size="sm" className="w-full justify-center text-xs font-mono">
                      Open Dashboard ({user.role.toUpperCase()})
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-center text-xs font-mono"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button variant="glass" size="sm" className="w-full justify-center text-xs font-mono">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button variant="glow" size="sm" className="w-full justify-center text-xs font-mono">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Navbar;
