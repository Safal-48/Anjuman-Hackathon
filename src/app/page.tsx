"use client";

import * as React from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Database,
  Code2,
  Box,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Lock,
  Boxes,
  Eye,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, MetricCard } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import dynamic from "next/dynamic";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
  HoverCardMotion,
} from "@/components/animations/motion-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/lib/constants";

const EcosystemVisualizerCanvas = dynamic(
  () => import("@/components/3d/ecosystem-node").then((mod) => mod.EcosystemVisualizerCanvas),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
  }
);

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState("arch");
  const [testInput, setTestInput] = React.useState("");
  const [btnLoading, setBtnLoading] = React.useState(false);

  const architectureLayers = [
    {
      id: "arch",
      label: "System Architecture",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      id: "ui",
      label: "Design System",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: "data",
      label: "Data & Security",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "3d",
      label: "3D Visualizer Core",
      icon: <Box className="h-4 w-4" />,
    },
  ];

  const handleSimulateLoad = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 1500);
  };

  return (
    <div className="relative pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
        <Container size="xl">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Hackathon Badge */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-glow-sm">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span>SMART INDIA HACKATHON 2026</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-white font-semibold">PROBLEM STATEMENT #{SITE_CONFIG.sih.problemStatementId}</span>
              </div>
            </FadeIn>

            {/* Main Headline */}
            <SlideUp delay={0.1}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Production Architecture for{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-500 bg-clip-text text-transparent">
                  {SITE_CONFIG.name}
                </span>
              </h1>
            </SlideUp>

            {/* Sub-headline */}
            <SlideUp delay={0.2}>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Foundational architecture engineered for extreme scale, type safety, modular scalability, and modern SaaS aesthetics.
              </p>
            </SlideUp>

            {/* CTAs */}
            <SlideUp delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/register">
                  <Button
                    variant="glow"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Get Started / Register
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="glass"
                    size="lg"
                    leftIcon={<Lock className="h-4 w-4 text-cyan-400" />}
                  >
                    Sign In to Portal
                  </Button>
                </Link>
                <a href="#architecture">
                  <Button
                    variant="cyber"
                    size="lg"
                    leftIcon={<Layers className="h-4 w-4" />}
                  >
                    Architecture
                  </Button>
                </a>
              </div>
            </SlideUp>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="mt-16">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StaggerItem>
                <MetricCard
                  title="Architecture Uptime"
                  value="99.99%"
                  change="+0.04% SLA"
                  isPositive={true}
                  icon={<Zap className="h-4 w-4" />}
                />
              </StaggerItem>
              <StaggerItem>
                <MetricCard
                  title="Core Framework"
                  value="Next.js 14"
                  change="App Router"
                  isPositive={true}
                  icon={<Code2 className="h-4 w-4" />}
                />
              </StaggerItem>
              <StaggerItem>
                <MetricCard
                  title="Data Persistence"
                  value="Supabase"
                  change="PostgreSQL"
                  isPositive={true}
                  icon={<Database className="h-4 w-4" />}
                />
              </StaggerItem>
              <StaggerItem>
                <MetricCard
                  title="3D Graphics"
                  value="WebGL 2.0"
                  change="R3F / Three.js"
                  isPositive={true}
                  icon={<Boxes className="h-4 w-4" />}
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </Container>
      </section>

      {/* 3D Ecosystem Visualizer Preview Section */}
      <section id="ecosystem-3d" className="py-16 relative">
        <Container size="xl">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Description */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="violet" dot dotColor="violet">
                  Interactive 3D Engine
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">React Three Fiber</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Holographic Ecosystem Visualizer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Lightweight, SSR-safe 3D rendering pipeline ready to support future complex ecosystem topology, interconnected nodes, and telemetry graphs without degrading initial page load times.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Dynamic client-only hydration with zero SSR mismatches</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Integrated WebGL hardware acceleration boundary & fallback</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Smooth 60FPS organic mesh distortion & particle vortex</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Viewport Component */}
            <div className="flex-1 w-full max-w-xl">
              <EcosystemVisualizerCanvas height="440px" />
            </div>
          </div>
        </Container>
      </section>

      {/* Architecture Deep Dive Section with Tabs */}
      <section id="architecture" className="py-16 border-t border-white/[0.06]">
        <Container size="xl">
          <div className="flex flex-col items-center text-center mb-10 space-y-3">
            <Badge variant="cyber" dot dotColor="cyan">
              Full Stack Scaffold
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Modular Foundation Architecture
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Built strictly following enterprise patterns: separation of concerns, declarative layouts, typed environment variables, and modular components.
            </p>

            <div className="pt-4">
              <Tabs
                items={architectureLayers}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-8">
            {activeTab === "arch" && (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StaggerItem>
                  <GlassCard className="p-6 h-full space-y-4" glow>
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Next.js 14 App Router</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Leverages React Server Components (RSC) for maximum performance, automatic code splitting, optimized caching, and streaming SSR.
                    </p>
                    <div className="pt-2 font-mono text-xs text-cyan-400">
                      src/app/layout.tsx • src/app/page.tsx
                    </div>
                  </GlassCard>
                </StaggerItem>

                <StaggerItem>
                  <GlassCard className="p-6 h-full space-y-4" glow>
                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center justify-center">
                      <Lock className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Typed Environment Layer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Runtime validation via Zod guarantees missing variables are caught early with descriptive diagnostic warnings before deployment.
                    </p>
                    <div className="pt-2 font-mono text-xs text-violet-400">
                      src/lib/env.ts • .env.example
                    </div>
                  </GlassCard>
                </StaggerItem>

                <StaggerItem>
                  <GlassCard className="p-6 h-full space-y-4" glow>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Workflow className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Error & Loading Boundaries</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Standardized Suspense skeletons, React error boundaries, and custom 404 handlers ensure bulletproof user experience under all network conditions.
                    </p>
                    <div className="pt-2 font-mono text-xs text-emerald-400">
                      src/app/error.tsx • src/app/loading.tsx
                    </div>
                  </GlassCard>
                </StaggerItem>
              </StaggerContainer>
            )}

            {activeTab === "ui" && (
              <GlassCard className="p-8 space-y-8" id="design-system">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Interactive UI Primitives</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    CVA-powered atomic design components with glassmorphic depth, glow variants, and micro-interactions.
                  </p>
                </div>

                {/* Button Showcase */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Button Variants & States
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="glow" onClick={handleSimulateLoad} isLoading={btnLoading}>
                      Glow Action (Click Me)
                    </Button>
                    <Button variant="cyber">Cyber Variant</Button>
                    <Button variant="glass">Glass Minimal</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                {/* Badges Showcase */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status Badges with Pulse Indicators
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="cyber" dot dotColor="cyan">
                      CYBER ACTIVE
                    </Badge>
                    <Badge variant="emerald" dot dotColor="emerald">
                      NODE HEALTHY
                    </Badge>
                    <Badge variant="amber" dot dotColor="amber">
                      SYNCING (98%)
                    </Badge>
                    <Badge variant="violet" dot dotColor="violet">
                      AI INFERENCE
                    </Badge>
                    <Badge variant="glass">
                      GLASS BADGE
                    </Badge>
                  </div>
                </div>

                {/* Inputs Showcase */}
                <div className="space-y-3 max-w-md">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Glow Input Field
                  </span>
                  <Input
                    placeholder="Enter system command or query..."
                    leftIcon={<Terminal className="h-4 w-4" />}
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                  />
                </div>
              </GlassCard>
            )}

            {activeTab === "data" && (
              <GlassCard className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">PostgreSQL & Supabase Architecture</h3>
                    <p className="text-sm text-muted-foreground">
                      Structured for SSR safety, cookie session management, and strong TypeScript schema typing.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-sm font-semibold text-cyan-300">Client-Side Helper (`createClient`)</div>
                    <p className="text-xs text-muted-foreground">
                      Instantiates `@supabase/ssr` browser client for reactive subscriptions, client authentication, and optimistic mutations.
                    </p>
                    <pre className="text-[11px] font-mono text-muted-foreground/80 pt-2">
                      src/lib/supabase/client.ts
                    </pre>
                  </div>

                  <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-sm font-semibold text-violet-300">Server Helper (`createServerSupabaseClient`)</div>
                    <p className="text-xs text-muted-foreground">
                      Encapsulates Next.js 14 cookie store for Server Components, Route Handlers, and Server Actions.
                    </p>
                    <pre className="text-[11px] font-mono text-muted-foreground/80 pt-2">
                      src/lib/supabase/server.ts
                    </pre>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeTab === "3d" && (
              <GlassCard className="p-8 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                      <Box className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Interactive 3D Visualizer Core</h3>
                      <p className="text-sm text-muted-foreground">
                        Hardware-accelerated WebGL shader particle ecosystem with fluid orbit controls.
                      </p>
                    </div>
                  </div>
                  <Badge variant="cyber" dot dotColor="cyan">
                    WEBGL 2.0 ACTIVE
                  </Badge>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40 shadow-2xl">
                  <EcosystemVisualizerCanvas />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="font-semibold text-sm text-foreground mb-1">Lazy Initialization</div>
                    <p className="text-xs text-muted-foreground">Mounts canvas strictly after client hydration to prevent main thread blocking.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="font-semibold text-sm text-foreground mb-1">Hardware Fallback</div>
                    <p className="text-xs text-muted-foreground">Gracefully swaps into accessible 2D vector fallback when WebGL is unavailable.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="font-semibold text-sm text-foreground mb-1">Memory Efficiency</div>
                    <p className="text-xs text-muted-foreground">Releases Three.js buffer geometries and materials on component unmount.</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </Container>
      </section>

      {/* System Diagnostics & Health Status */}
      <section id="health" className="py-16">
        <Container size="xl">
          <GlassCard className="p-8 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                  <span className="text-xs font-mono font-semibold tracking-wider uppercase text-emerald-400">
                    Production Infrastructure Ready
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  System Diagnostics & Health Check
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Endpoint active at <code className="text-cyan-400 font-mono">/api/health</code> returning system metrics, runtime configuration, and database connection readiness.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/api/health" target="_blank">
                  <Button
                    variant="cyber"
                    leftIcon={<Terminal className="h-4 w-4" />}
                  >
                    Open /api/health
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </Container>
      </section>
    </div>
  );
}
