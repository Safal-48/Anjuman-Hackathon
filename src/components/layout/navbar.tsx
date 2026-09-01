"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Compass,
  Brain,
  Users,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/marketplace/notification-bell";
import { KaushalSetuIcon } from "@/components/ui/logo";
import { Container } from "./container";
import { useAuth } from "@/lib/auth/auth-context";

export function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loggedInNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", href: "/opportunities", icon: Compass },
    { label: "Skills", href: "/skills", icon: Brain },
    { label: "Mentorship", href: "/mentorship", icon: Users },
    { label: "Portfolio", href: "/portfolio", icon: ShieldCheck },
  ];

  const publicNavItems = [
    { label: "Overview", href: "/#overview" },
    { label: "How It Works", href: "/#platform-highlights" },
    { label: "Ecosystem", href: "/#ecosystem-3d" },
    { label: "Our Advantage", href: "/#platform-highlights" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-glass"
          : "bg-slate-950/40 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <KaushalSetuIcon size={38} className="shadow-cyan-500/20 shadow-lg" />
              <div className="flex flex-col">
                <div className="flex items-center font-extrabold tracking-tight text-base leading-none">
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    Kaushal
                  </span>
                  <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    Setu
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase mt-1 hidden sm:inline">
                  Connecting Skills • Bridging Opportunities
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {isAuthenticated
              ? loggedInNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })
              : publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-cyan-400 hover:bg-white/[0.04] transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Quick Nexora.ai Trigger */}
            <Button
              variant="glass"
              size="sm"
              className="flex items-center gap-1.5 border-cyan-500/40 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-500/20 font-mono text-xs shadow-glow-sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-nexora-chat"));
                }
              }}
              title="Open Nexora.ai Copilot"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Nexora.ai</span>
            </Button>

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
                      <div className="text-xs font-bold text-foreground leading-none truncate max-w-[100px]">
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
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="glow" size="sm" className="text-xs">
                    Register
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
          <div className="lg:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-3 rounded-b-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            {(isAuthenticated ? loggedInNavItems : publicNavItems).map((item) => (
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

export default Navbar;
