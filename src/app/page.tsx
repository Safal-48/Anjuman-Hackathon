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
  Brain,
  Target,
  Compass,
  Users,
  User,
  GraduationCap,
  Building2,
  TrendingUp,
  LayoutGrid,
  Wand2,
  Briefcase,
  Rocket,
  BookOpen,
  HeartHandshake,
  Star,
  LineChart,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, MetricCard } from "@/components/ui/card";
import { GlowBorder } from "@/components/ui/glow-border";
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

const SkilloraEcosystemVisualizer = dynamic(
  () => import("@/components/3d/skillora-ecosystem-visualizer").then((mod) => mod.SkilloraEcosystemVisualizer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full rounded-2xl" />,
  }
);

const ScrollHighlight = dynamic(
  () => import("@/components/animations/scroll-highlight").then((mod) => mod.ScrollHighlight),
  {
    ssr: false,
    loading: () => <div className="py-24 text-center text-muted-foreground font-mono">Loading manifesto...</div>,
  }
);

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState("highlights");
  const [testInput, setTestInput] = React.useState("");
  const [btnLoading, setBtnLoading] = React.useState(false);

  const ecosystemTabs = [
    {
      id: "highlights",
      label: "Platform Highlights",
      icon: <LayoutGrid className="h-4 w-4" />,
    },
    {
      id: "how-it-works",
      label: "How It Works",
      icon: <Workflow className="h-4 w-4" />,
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "advantage",
      label: "Our Advantage",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ];

  const handleSimulateLoad = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 1500);
  };

  return (
    <div className="relative pb-24 w-full max-w-full overflow-x-hidden">
      {/* Hero Section with Warp Field Background */}
      <section className="relative pt-16 md:pt-24 pb-20 overflow-hidden min-h-[80vh] flex flex-col justify-center w-full max-w-full">
        {/* Hero Ambient Depth & Glow Overlay */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/70 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
        </div>

        <Container size="xl" className="relative z-10 w-full max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Main Headline */}
            <SlideUp delay={0.1}>
              <h1 className="text-[25px] min-[360px]:text-[27px] min-[410px]:text-[31px] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.18] sm:leading-[1.2]">
                <span className="block whitespace-nowrap">Empowering Careers with</span>
                <span className="block mt-1 sm:mt-3 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  {SITE_CONFIG.name}
                </span>
              </h1>
            </SlideUp>

            {/* Sub-headline */}
            <SlideUp delay={0.2}>
              <p className="text-xs min-[380px]:text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed px-1 sm:px-0">
                {SITE_CONFIG.description}
              </p>
            </SlideUp>

            {/* CTAs */}
            <SlideUp delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-xs sm:max-w-none mx-auto">
                <Link href="/register" className="group w-full sm:w-auto">
                  <Button
                    variant="glow"
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-bold shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:shadow-[0_0_45px_rgba(6,182,212,0.65)] transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden rounded-2xl justify-center"
                    rightIcon={
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    }
                  >
                    <span className="relative z-10">Get Started / Register</span>
                  </Button>
                </Link>
                <Link href="/login" className="group w-full sm:w-auto">
                  <Button
                    variant="glass"
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-bold border-white/15 bg-slate-900/70 hover:bg-slate-800/90 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 hover:scale-105 active:scale-95 group rounded-2xl justify-center"
                    leftIcon={
                      <Lock className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300" />
                    }
                  >
                    Sign In to Portal
                  </Button>
                </Link>
              </div>
            </SlideUp>
          </div>

          {/* Platform Pillars & Intelligence Grid */}
          <div className="mt-10 sm:mt-16">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              <StaggerItem>
                <GlowBorder
                  borderRadius={18}
                  borderWidth={1.5}
                  duration={4}
                  color={["#06b6d4", "#10b981", "#06b6d4"]}
                  className="h-full"
                >
                  <MetricCard
                    title="Skill Intelligence"
                    value="AI-Powered"
                    change="Assess • Map • Identify Gaps"
                    isPositive={true}
                    icon={<Sparkles className="h-4 w-4" />}
                    className="border-0 bg-transparent h-full"
                  />
                </GlowBorder>
              </StaggerItem>
              <StaggerItem>
                <GlowBorder
                  borderRadius={18}
                  borderWidth={1.5}
                  duration={4}
                  color={["#06b6d4", "#a855f7", "#3b82f6"]}
                  className="h-full"
                >
                  <MetricCard
                    title="Smart Matching"
                    value="Explainable AI"
                    change="Skills ↔ Opportunities"
                    isPositive={true}
                    icon={<Workflow className="h-4 w-4" />}
                    className="border-0 bg-transparent h-full"
                  />
                </GlowBorder>
              </StaggerItem>
              <StaggerItem>
                <GlowBorder
                  borderRadius={18}
                  borderWidth={1.5}
                  duration={4}
                  color={["#10b981", "#06b6d4", "#10b981"]}
                  className="h-full"
                >
                  <MetricCard
                    title="Career Readiness"
                    value="Personalized"
                    change="Learn • Improve • Get Ready"
                    isPositive={true}
                    icon={<ShieldCheck className="h-4 w-4" />}
                    className="border-0 bg-transparent h-full"
                  />
                </GlowBorder>
              </StaggerItem>
              <StaggerItem>
                <GlowBorder
                  borderRadius={18}
                  borderWidth={1.5}
                  duration={4}
                  color={["#f59e0b", "#a855f7", "#06b6d4"]}
                  className="h-full"
                >
                  <MetricCard
                    title="Academia × Industry"
                    value="Connected Ecosystem"
                    change="Students • Institutions • Companies"
                    isPositive={true}
                    icon={<Boxes className="h-4 w-4" />}
                    className="border-0 bg-transparent h-full"
                  />
                </GlowBorder>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </Container>
      </section>

      {/* Scroll Highlight Words & Paragraph Section */}
      <section className="relative py-14 md:py-20 overflow-hidden border-y border-white/[0.06] bg-black/25 backdrop-blur-md">
        <Container size="xl">
          <div className="flex flex-col items-center text-center space-y-3 mb-4">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-glow-sm">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>CORE PHILOSOPHY & VISION</span>
              </div>
            </FadeIn>
          </div>

          <ScrollHighlight
            text="Bridging the gap between what students learn, and what industry needs. Turning skills into opportunities, and potential into careers."
            splitBy="words"
            highlightColor="#FFFFFF"
            dimColor="rgba(255, 255, 255, 0.15)"
            scrollStart="top 80%"
            scrollEnd="bottom 35%"
            font={{
              fontFamily: "var(--font-sans), Inter, sans-serif",
              fontSize: "clamp(1.85rem, 4.2vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: "1.25em",
              textAlign: "center",
            }}
          />

          <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-muted-foreground/80 mt-6">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Real-Time Scroll Scrubbing
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="h-3.5 w-3.5" /> GSAP ScrollTrigger Accelerated
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-violet-400">
              <Boxes className="h-3.5 w-3.5" /> Dynamic Kinetic Word Stagger
            </span>
          </div>
        </Container>
      </section>

      {/* Skillora Intelligent Ecosystem Section */}
      <section id="ecosystem-3d" className="py-16 md:py-24 relative">
        <Container size="xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Description */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="violet" dot dotColor="violet">
                  Platform Overview
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Skillora Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                The Intelligent Bridge Between{" "}
                <span className="text-cyan-400">Skills</span>,{" "}
                <span className="text-emerald-400">Learning</span> and{" "}
                <span className="text-purple-400">Opportunity</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                Skillora unifies students, academia, and industry in one AI-powered ecosystem to assess skills, close gaps, and connect the right talent with the right opportunities.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-sm sm:text-base text-foreground/90 font-medium">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>AI-powered skill assessment & gap analysis</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-base text-foreground/90 font-medium">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Smart matching for internships, jobs & projects</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-base text-foreground/90 font-medium">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>End-to-end ecosystem for career growth</span>
                </div>
              </div>
            </div>

            {/* Right: Skillora Interactive Topology Hub Component */}
            <div className="flex-1 w-full max-w-2xl">
              <SkilloraEcosystemVisualizer />
            </div>
          </div>
        </Container>
      </section>

      {/* The Intelligent Ecosystem for Skills and Opportunities Section */}
      <section id="platform-highlights" className="py-16 md:py-24 border-t border-white/[0.06] relative">
        <Container size="xl">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <Badge variant="cyber" dot dotColor="cyan">
              Built for Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              The Intelligent Ecosystem
              <br />
              for <span className="text-emerald-400">Skills</span> and{" "}
              <span className="text-purple-400">Opportunities</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base sm:text-lg leading-relaxed">
              A unified platform that assesses, bridges, and connects – powering students, institutions, and industry for a future-ready workforce.
            </p>

            <div className="pt-4">
              <Tabs
                items={ecosystemTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-8">
            {activeTab === "highlights" && (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Skill Intelligence (Emerald) */}
                <StaggerItem>
                  <GlassCard className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300">
                          <Brain className="h-6 w-6 text-emerald-400" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                          Skill Intelligence
                        </h3>
                        <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                          Know Yourself Better
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>AI-powered skill assessment</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>Personalized skill profiles</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>Identify strengths & skill gaps</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium w-full justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Assess • Analyze • Improve</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* Card 2: Smart Opportunity Matching (Purple) */}
                <StaggerItem>
                  <GlassCard className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
                          <Target className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-purple-400 transition-colors">
                          Smart Opportunity Matching
                        </h3>
                        <p className="text-xs font-semibold text-purple-400 mt-0.5">
                          Find the Right Fit
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                          <span>Explainable AI matching engine</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                          <span>Skills ↔ Internships ↔ Jobs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                          <span>Real-time compatibility score</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium w-full justify-center group-hover:bg-purple-500/20 transition-colors">
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>Match • Apply • Grow</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* Card 3: Career Readiness (Sky/Blue) */}
                <StaggerItem>
                  <GlassCard className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all duration-300">
                          <Compass className="h-6 w-6 text-sky-400" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-sky-400 transition-colors">
                          Career Readiness
                        </h3>
                        <p className="text-xs font-semibold text-sky-400 mt-0.5">
                          Build. Learn. Advance.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span>Personalized learning roadmap</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span>Curated courses & resources</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span>Track progress & readiness</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-medium w-full justify-center group-hover:bg-sky-500/20 transition-colors">
                        <span>Learn • Practice • Succeed</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* Card 4: Connected Ecosystem (Amber/Gold) */}
                <StaggerItem>
                  <GlassCard className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
                          <Users className="h-6 w-6 text-amber-400" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-amber-400 transition-colors">
                          Connected Ecosystem
                        </h3>
                        <p className="text-xs font-semibold text-amber-400 mt-0.5">
                          Stronger Together
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Students • Institutions • Industry</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Internships, projects & mentorships</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Collaboration that creates impact</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium w-full justify-center group-hover:bg-amber-500/20 transition-colors">
                        <span>Connect • Collaborate • Create</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              </StaggerContainer>
            )}

            {activeTab === "how-it-works" && (
              <div className="space-y-8">
                {/* 4 Step Cards Grid */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Step 01: Discover Skills */}
                  <StaggerItem>
                    <GlassCard className="p-6 h-full flex flex-col justify-between space-y-5 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group" glow>
                      <div className="space-y-4">
                        {/* Mini Graphic Preview: Radar & Profile */}
                        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-3 h-28 flex flex-col justify-between relative overflow-hidden">
                          <div className="flex items-center gap-1.5 opacity-60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            {/* Profile Skeleton */}
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <div className="h-2 w-12 rounded bg-white/20" />
                                <div className="h-1.5 w-8 rounded bg-white/10" />
                              </div>
                            </div>
                            {/* Radar Polygon SVG */}
                            <svg viewBox="0 0 50 50" className="h-14 w-14 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                              <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                              <polygon points="25,12 38,18 38,32 25,38 12,32 12,18" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
                              <polygon points="25,8 42,16 38,34 25,41 8,30 14,16" fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="1.5" />
                              <circle cx="42" cy="40" r="5" fill="#10b981" />
                              <path d="M40 40 L41.5 41.5 L44 38.5" stroke="#000" strokeWidth="1" fill="none" />
                            </svg>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div>
                          <div className="text-xl font-mono font-bold text-emerald-400">01</div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                            Discover Skills
                          </h3>
                          <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                            Know Yourself Better
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          We assess your skills, analyze your strengths, and create a personalized skill profile just for you.
                        </p>

                        <div className="h-[1px] w-full bg-white/[0.08]" />

                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>AI-Powered Skill Assessment</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>Personalized Skill Profile</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>Strength Identification</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium w-full justify-center group-hover:bg-emerald-500/20 transition-colors">
                          <LineChart className="h-3.5 w-3.5" />
                          <span>Assess • Analyze • Improve</span>
                        </div>
                      </div>
                    </GlassCard>
                  </StaggerItem>

                  {/* Step 02: Identify Gaps */}
                  <StaggerItem>
                    <GlassCard className="p-6 h-full flex flex-col justify-between space-y-5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group" glow>
                      <div className="space-y-4">
                        {/* Mini Graphic Preview: Donut Gauge + Skill Gaps */}
                        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-2.5 h-28 flex items-center justify-between gap-2 overflow-hidden">
                          {/* Donut Gauge */}
                          <div className="relative flex items-center justify-center shrink-0">
                            <svg className="h-16 w-16 -rotate-90">
                              <circle cx="32" cy="32" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
                              <circle cx="32" cy="32" r="24" stroke="#a855f7" strokeWidth="5" strokeDasharray="150" strokeDashoffset="48" strokeLinecap="round" fill="none" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            </svg>
                            <span className="absolute font-mono font-bold text-xs text-white">68%</span>
                          </div>

                          {/* Gaps List */}
                          <div className="space-y-1 text-[9px] w-full">
                            <div className="font-semibold text-purple-300 text-[10px] pb-0.5">Skill Gaps</div>
                            <div className="flex items-center justify-between p-1 rounded bg-white/[0.04]">
                              <span className="text-muted-foreground truncate">Data Analysis</span>
                              <span className="h-2 w-4 rounded-full bg-purple-500/40 shrink-0" />
                            </div>
                            <div className="flex items-center justify-between p-1 rounded bg-white/[0.04]">
                              <span className="text-muted-foreground truncate">Communication</span>
                              <span className="h-2 w-4 rounded-full bg-rose-500/40 shrink-0" />
                            </div>
                            <div className="flex items-center justify-between p-1 rounded bg-white/[0.04]">
                              <span className="text-muted-foreground truncate">Problem Solving</span>
                              <span className="h-2 w-4 rounded-full bg-emerald-500/40 shrink-0" />
                            </div>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div>
                          <div className="text-xl font-mono font-bold text-purple-400">02</div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-purple-400 transition-colors">
                            Identify Gaps
                          </h3>
                          <p className="text-xs font-semibold text-purple-400 mt-0.5">
                            Know What&apos;s Missing
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          We compare your current skills with industry requirements to identify gaps holding you back.
                        </p>

                        <div className="h-[1px] w-full bg-white/[0.08]" />

                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                            <span>Skill Gap Analysis</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                            <span>Industry Skill Requirements</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                            <span>Career Readiness Score</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium w-full justify-center group-hover:bg-purple-500/20 transition-colors">
                          <Target className="h-3.5 w-3.5" />
                          <span>Diagnose • Prioritize • Focus</span>
                        </div>
                      </div>
                    </GlassCard>
                  </StaggerItem>

                  {/* Step 03: Build Readiness */}
                  <StaggerItem>
                    <GlassCard className="p-6 h-full flex flex-col justify-between space-y-5 border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 group" glow>
                      <div className="space-y-4">
                        {/* Mini Graphic Preview: Learning Roadmap & Milestones */}
                        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-2.5 h-28 flex items-center justify-between gap-2 overflow-hidden relative">
                          {/* Course Milestones List */}
                          <div className="space-y-1 text-[9px] w-1/2">
                            <div className="font-semibold text-sky-300 text-[10px] pb-0.5">Recommended for you</div>
                            <div className="p-1 rounded bg-white/[0.04] text-muted-foreground truncate flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                              <span>Python Basics</span>
                            </div>
                            <div className="p-1 rounded bg-white/[0.04] text-muted-foreground truncate flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              <span>SQL Mastery</span>
                            </div>
                            <div className="p-1 rounded bg-white/[0.04] text-muted-foreground truncate flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Data Visualization</span>
                            </div>
                          </div>

                          {/* Curvy Roadmap SVG */}
                          <div className="w-1/2 h-full flex items-center justify-center">
                            <svg viewBox="0 0 80 60" className="w-full h-full">
                              <path d="M 10 50 Q 30 20, 50 40 T 70 15" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" className="drop-shadow-[0_0_6px_rgba(14,165,233,0.5)]" />
                              <circle cx="10" cy="50" r="3.5" fill="#0ea5e9" />
                              <circle cx="40" cy="30" r="3.5" fill="#38bdf8" />
                              <circle cx="70" cy="15" r="4.5" fill="#0ea5e9" />
                              {/* Finish Flag */}
                              <path d="M 70 15 L 70 5 M 70 5 L 77 9 L 70 12 Z" stroke="#38bdf8" fill="#38bdf8" strokeWidth="1" />
                            </svg>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div>
                          <div className="text-xl font-mono font-bold text-sky-400">03</div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-sky-400 transition-colors">
                            Build Readiness
                          </h3>
                          <p className="text-xs font-semibold text-sky-400 mt-0.5">
                            Turn Gaps Into Growth
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Get a personalized learning roadmap, curated resources, and track your progress step-by-step.
                        </p>

                        <div className="h-[1px] w-full bg-white/[0.08]" />

                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                            <span>Personalized Learning Roadmap</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                            <span>Curated Courses & Resources</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                            <span>Track Progress & Readiness</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-medium w-full justify-center group-hover:bg-sky-500/20 transition-colors">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Learn • Practice • Succeed</span>
                        </div>
                      </div>
                    </GlassCard>
                  </StaggerItem>

                  {/* Step 04: Connect Opportunities */}
                  <StaggerItem>
                    <GlassCard className="p-6 h-full flex flex-col justify-between space-y-5 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 group" glow>
                      <div className="space-y-4">
                        {/* Mini Graphic Preview: Connected Opportunities Topology */}
                        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-2.5 h-28 flex items-center justify-center relative overflow-hidden">
                          <svg viewBox="0 0 100 80" className="w-full h-full">
                            {/* Connecting Beams */}
                            <line x1="50" y1="40" x2="20" y2="20" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                            <line x1="50" y1="40" x2="80" y2="20" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                            <line x1="50" y1="40" x2="20" y2="60" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                            <line x1="50" y1="40" x2="80" y2="60" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />

                            {/* Node 1: Briefcase */}
                            <circle cx="20" cy="20" r="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                            {/* Node 2: Institution */}
                            <circle cx="80" cy="20" r="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                            {/* Node 3: People */}
                            <circle cx="20" cy="60" r="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                            {/* Node 4: Graduation */}
                            <circle cx="80" cy="60" r="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />

                            {/* Center User Node */}
                            <circle cx="50" cy="40" r="11" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-[100px] h-[80px]">
                              <Briefcase className="h-3 w-3 text-amber-400 absolute left-[14px] top-[14px]" />
                              <Building2 className="h-3 w-3 text-amber-400 absolute right-[14px] top-[14px]" />
                              <Users className="h-3 w-3 text-amber-400 absolute left-[14px] bottom-[14px]" />
                              <GraduationCap className="h-3 w-3 text-amber-400 absolute right-[14px] bottom-[14px]" />
                              <User className="h-3.5 w-3.5 text-white absolute left-[43px] top-[33px]" />
                            </div>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div>
                          <div className="text-xl font-mono font-bold text-amber-400">04</div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-amber-400 transition-colors">
                            Connect Opportunities
                          </h3>
                          <p className="text-xs font-semibold text-amber-400 mt-0.5">
                            From Skills to Opportunity
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          We match you with the right internships, jobs, projects, and mentors based on your skills and goals.
                        </p>

                        <div className="h-[1px] w-full bg-white/[0.08]" />

                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span>Explainable AI Matching</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span>Internships, Jobs & Projects</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span>Mentorship & Industry Connect</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium w-full justify-center group-hover:bg-amber-500/20 transition-colors">
                          <Rocket className="h-3.5 w-3.5" />
                          <span>Match • Apply • Grow</span>
                        </div>
                      </div>
                    </GlassCard>
                  </StaggerItem>
                </StaggerContainer>

                {/* Ecosystem Impact Sub-Banner (Image 1 Bottom Bar) */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-5">
                  {/* Header row */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="inline-flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider">
                      <Star className="h-3.5 w-3.5" />
                      <span>ECOSYSTEM IMPACT</span>
                    </div>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="text-muted-foreground text-xs">
                      Creating measurable impact across students, institutions and industry.
                    </span>
                  </div>

                  {/* 4 Pillars in a row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
                    {/* Pillar 1 */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-foreground">Students Empowered</div>
                        <div className="text-[11px] text-muted-foreground">Discover. Learn. Grow.</div>
                        <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          Skill-first future ready
                        </span>
                      </div>
                    </div>

                    {/* Pillar 2 */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-foreground">Institutions Benefit</div>
                        <div className="text-[11px] text-muted-foreground">Insights. Analytics. Outcomes.</div>
                        <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
                          Data-driven decisions
                        </span>
                      </div>
                    </div>

                    {/* Pillar 3 */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.3)]">
                        <HeartHandshake className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-foreground">Industry Connects</div>
                        <div className="text-[11px] text-muted-foreground">Find. Collaborate. Hire.</div>
                        <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400">
                          Right talent, faster
                        </span>
                      </div>
                    </div>

                    {/* Pillar 4 */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                        <Rocket className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-foreground">Opportunities Multiply</div>
                        <div className="text-[11px] text-muted-foreground">Internships. Jobs. Projects.</div>
                        <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          Endless possibilities
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ecosystem" && (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Students & Aspirants */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300">
                        <User className="h-6 w-6 text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                          Students & Aspirants
                        </h3>
                        <p className="text-xs font-semibold text-cyan-400 mt-1">
                          Discover. Develop. Get Ahead.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>AI-powered skill assessment & profiling</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Personalized career & learning roadmaps</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Skill-gap analysis against industry needs</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Internships, jobs, projects & mentorship opportunities</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Verified digital portfolio</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium w-full justify-center group-hover:bg-cyan-500/20 transition-colors font-mono">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Assess • Learn • Build • Connect</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* 2. Academia & Colleges */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300">
                        <GraduationCap className="h-6 w-6 text-emerald-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                          Academia & Colleges
                        </h3>
                        <p className="text-xs font-semibold text-emerald-400 mt-1">
                          Turn Data Into Better Outcomes.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Real-time student skill & readiness analytics</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Identify common skill gaps across cohorts</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Track internships, placements & participation</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Understand industry-demanded skills</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Data-driven insights for skill development</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium w-full justify-center group-hover:bg-emerald-500/20 transition-colors font-mono">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Measure • Understand • Improve</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* 3. Industry & Recruiters */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
                        <Briefcase className="h-6 w-6 text-purple-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors">
                          Industry & Recruiters
                        </h3>
                        <p className="text-xs font-semibold text-purple-400 mt-1">
                          Find Talent Beyond the Resume.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Skill-first candidate discovery</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Explainable candidate–opportunity matching</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Create internships, jobs & industry projects</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Connect with students based on relevant skills</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Build stronger academia–industry collaboration</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium w-full justify-center group-hover:bg-purple-500/20 transition-colors font-mono">
                        <Rocket className="h-3.5 w-3.5" />
                        <span>Discover • Match • Collaborate</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              </StaggerContainer>
            )}

            {activeTab === "advantage" && (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Explainable Matching vs. Black Box */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300">
                        <Brain className="h-6 w-6 text-emerald-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                          Explainable Matching vs. Black Box
                        </h3>
                        <p className="text-xs font-semibold text-emerald-400 mt-1">
                          Know Why You Match.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Transparent compatibility score</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Shows matched & missing skills</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Explains exactly how to improve your match</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium w-full justify-center group-hover:bg-emerald-500/20 transition-colors font-mono">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Assess • Explain • Improve</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* 2. Skills Before Resumes */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300">
                        <ShieldCheck className="h-6 w-6 text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                          Skills Before Resumes
                        </h3>
                        <p className="text-xs font-semibold text-cyan-400 mt-1">
                          Look Beyond the Resume.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Match candidates through verified skill profiles</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Evaluate skills, projects & assessments</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Connect talent with relevant opportunities</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium w-full justify-center group-hover:bg-cyan-500/20 transition-colors font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Skills • Evidence • Opportunity</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* 3. Personalized Career Intelligence */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
                        <Compass className="h-6 w-6 text-purple-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors">
                          Personalized Career Intelligence
                        </h3>
                        <p className="text-xs font-semibold text-purple-400 mt-1">
                          One Path Doesn&apos;t Fit Everyone.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Career paths based on individual skill profiles</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Personalized skill-gap recommendations</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Learning resources aligned with career goals</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>Track progress toward career readiness</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium w-full justify-center group-hover:bg-purple-500/20 transition-colors font-mono">
                        <LineChart className="h-3.5 w-3.5" />
                        <span>Discover • Learn • Grow</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>

                {/* 4. One Ecosystem, Every Stakeholder */}
                <StaggerItem>
                  <GlassCard className="p-7 h-full flex flex-col justify-between space-y-6 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 group" glow>
                    <div className="space-y-4">
                      {/* Top Icon Badge */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
                        <Users className="h-6 w-6 text-amber-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-amber-400 transition-colors">
                          One Ecosystem, Every Stakeholder
                        </h3>
                        <p className="text-xs font-semibold text-amber-400 mt-1">
                          Connect the Entire Journey.
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-white/[0.08]" />

                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Students discover and build skills</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Institutions monitor readiness & skill gaps</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Industry discovers relevant talent</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Academicians enable mentorship & collaboration</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium w-full justify-center group-hover:bg-amber-500/20 transition-colors font-mono">
                        <Rocket className="h-3.5 w-3.5" />
                        <span>Students • Academia • Industry • Opportunities</span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              </StaggerContainer>
            )}
          </div>
        </Container>
      </section>

      {/* Real-Time Platform Insights Banner (Image 2 Bottom Bar) */}
      <section id="insights" className="py-12 relative">
        <Container size="xl">
          <GlassCard className="p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/20 shadow-2xl relative overflow-hidden">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                  REAL-TIME PLATFORM INSIGHTS
                </span>
              </div>

              <Link href="/dashboard">
                <Button
                  variant="cyber"
                  size="sm"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore Live Dashboard
                </Button>
              </Link>
            </div>

            {/* 4 Stats Columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-2">
              {/* Stat 1 */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-glow-sm">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    25,000+
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Students Empowered and Growing
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-glow-sm">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    1,200+
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Opportunities Live Worldwide
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-glow-sm">
                  <Building2 className="h-6 w-6 text-sky-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    350+
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Institutions Onboarded
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-glow-sm">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    85%
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Students Career Readiness Improved
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </Container>
      </section>
    </div>
  );
}
