"use client";

import * as React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Menu, X, Terminal, LogOut, UserCheck, LayoutDashboard, Sparkles, Compass } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/marketplace/notification-bell";
import { Container } from "./container";
import { useAuth } from "@/lib/auth/auth-context";

export function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] shadow-glass"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-glow-sm group-hover:shadow-glow-md transition-all">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950/90 backdrop-blur-sm">
                  <Cpu className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-foreground text-base group-hover:text-cyan-400 transition-colors">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase -mt-0.5">
                  SIH 2026 • PS {SITE_CONFIG.sih.problemStatementId}
                </span>
              </div>
            </Link>

            <Badge variant="cyber" size="sm" dot dotColor="cyan" className="hidden sm:inline-flex ml-2">
              CORE ONLINE
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {SITE_CONFIG.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:text-cyan-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions & Dynamic Auth State */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    variant="glass"
                    size="sm"
                    leftIcon={<LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button
                    variant="glass"
                    size="sm"
                    leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
                  >
                    Portfolio
                  </Button>
                </Link>
                <Link href="/mentorship">
                  <Button
                    variant="glass"
                    size="sm"
                    leftIcon={<UserCheck className="h-3.5 w-3.5 text-violet-400" />}
                  >
                    Mentorship
                  </Button>
                </Link>
                <Link href="/opportunities">
                  <Button
                    variant="glass"
                    size="sm"
                    leftIcon={<Compass className="h-3.5 w-3.5 text-amber-400" />}
                  >
                    Marketplace
                  </Button>
                </Link>
                <Link href="/skills">
                  <Button
                    variant="glass"
                    size="sm"
                    leftIcon={<Sparkles className="h-3.5 w-3.5 text-cyan-400" />}
                  >
                    Skills
                  </Button>
                </Link>
                <Link href="/ai-career">
                  <Button
                    variant="glass"
                    size="sm"
                    leftIcon={<Cpu className="h-3.5 w-3.5 text-violet-400" />}
                  >
                    AI Copilot
                  </Button>
                </Link>
                <NotificationBell />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  leftIcon={<LogOut className="h-3.5 w-3.5 text-rose-400" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="glow" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <Button
              variant="glass"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-3 rounded-b-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            {SITE_CONFIG.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-cyan-400 hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button variant="cyber" size="sm" className="w-full justify-center">
                      Open Dashboard ({user.role.toUpperCase()})
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button variant="glass" size="sm" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button variant="glow" size="sm" className="w-full justify-center">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
