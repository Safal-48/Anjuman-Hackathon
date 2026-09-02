"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Video,
  FileCode,
  ExternalLink,
  CheckCircle2,
  Clock,
  Flame,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  Star,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/motion-wrapper";

interface Resource {
  id: string;
  title: string;
  category: "Distributed Systems" | "AI & Neural Networks" | "System Architecture" | "TypeScript & Web" | "Algorithms";
  type: "Video Lecture" | "Interactive Sandbox" | "Official Docs" | "System Design Walkthrough";
  deficitAddressed: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  matchReason: string;
  url: string;
  rating: number;
  completed?: boolean;
}

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Raft Consensus & Distributed Log Replication Deep Dive",
    category: "Distributed Systems",
    type: "System Design Walkthrough",
    deficitAddressed: "Distributed Systems Deficit (-28% Gap)",
    priority: "High",
    duration: "45 mins",
    difficulty: "Advanced",
    matchReason: "Directly addresses failure modes identified in your latest Architecture Diagnostic Probe.",
    url: "https://raft.github.io/",
    rating: 4.9,
  },
  {
    id: "res-2",
    title: "TensorRT & ONNX Runtime Model Optimization Masterclass",
    category: "AI & Neural Networks",
    type: "Interactive Sandbox",
    deficitAddressed: "Inference Latency Optimization (-22% Gap)",
    priority: "High",
    duration: "60 mins",
    difficulty: "Advanced",
    matchReason: "Target role 'AI Systems Engineer' requires 90% benchmark; current score is 68%.",
    url: "https://onnxruntime.ai/",
    rating: 4.8,
  },
  {
    id: "res-3",
    title: "TypeScript Generics, Conditional Types & AST Transformations",
    category: "TypeScript & Web",
    type: "Interactive Sandbox",
    deficitAddressed: "Type-Level Programming (-15% Gap)",
    priority: "Medium",
    duration: "30 mins",
    difficulty: "Intermediate",
    matchReason: "Recommended for building zero-leak architectural components.",
    url: "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
    rating: 4.9,
  },
  {
    id: "res-4",
    title: "Designing Event-Driven Microservices with Apache Kafka",
    category: "Distributed Systems",
    type: "Video Lecture",
    deficitAddressed: "Asynchronous Queueing Deficit (-18% Gap)",
    priority: "Medium",
    duration: "50 mins",
    difficulty: "Intermediate",
    matchReason: "Prerequisite for Phase 2 Production Cloud Architecture milestone.",
    url: "https://kafka.apache.org/documentation/",
    rating: 4.7,
  },
  {
    id: "res-5",
    title: "Dynamic Programming & Tree Decomposition Algorithms",
    category: "Algorithms",
    type: "Interactive Sandbox",
    deficitAddressed: "Algorithmic Complexity Optimization (-12% Gap)",
    priority: "Low",
    duration: "40 mins",
    difficulty: "Intermediate",
    matchReason: "Refines algorithmic efficiency for live technical challenges.",
    url: "https://leetcode.com/",
    rating: 4.8,
  },
  {
    id: "res-6",
    title: "High-Throughput Redis Caching Patterns & Invalidation Strategies",
    category: "System Architecture",
    type: "Official Docs",
    deficitAddressed: "Cache Invalidation & Thundering Herd Deficit",
    priority: "Medium",
    duration: "25 mins",
    difficulty: "Intermediate",
    matchReason: "Essential for scaling low-latency web gateways.",
    url: "https://redis.io/docs/manual/patterns/",
    rating: 4.9,
  },
];

export default function RecommendedResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>(SAMPLE_RESOURCES);

  const categories = ["All", "Distributed Systems", "AI & Neural Networks", "System Architecture", "TypeScript & Web", "Algorithms"];

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === "All" || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.deficitAddressed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleComplete = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  return (
    <div className="min-h-screen py-10 bg-slate-950/40">
      <Container size="xl">
        <FadeIn>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive Learning Intervention Engine
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Learning Resources</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Curated study materials, video breakdowns, and interactive sandboxes dynamically prioritized based on your diagnostic assessment performance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/assessment">
                <Button variant="cyber" size="sm" className="gap-2">
                  <Brain className="h-4 w-4" />
                  Retake Diagnostic Probe
                </Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:border-cyan-500/30">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  Ask AI Tutor
                </Button>
              </Link>
            </div>
          </div>

          {/* Performance Intervention Banner */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/30 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shrink-0">
                <Flame className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Current Priority Intervention: Distributed Systems & Consensus</span>
                  <Badge variant="destructive" size="sm" className="font-mono text-[10px]">28% Deficit</Badge>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Completing the 2 high-priority items below will boost your Target Role Readiness by an estimated <span className="text-emerald-400 font-bold">+14%</span>.
                </p>
              </div>
            </div>
            <Link href="/ai-career">
              <Button variant="cyber" size="sm" className="whitespace-nowrap text-xs gap-1.5">
                View 4-Phase Roadmap <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm"
                      : "text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-white/[0.06]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or deficits..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Resource Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => (
              <GlassCard
                key={res.id}
                className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                  res.completed
                    ? "border-emerald-500/30 bg-slate-950/60 opacity-80"
                    : res.priority === "High"
                    ? "border-cyan-500/30 bg-slate-900/40 hover:border-cyan-400/60"
                    : "border-white/[0.08] bg-slate-900/30 hover:border-white/20"
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge
                      variant={res.priority === "High" ? "destructive" : res.priority === "Medium" ? "amber" : "default"}
                      size="sm"
                      className="font-mono text-[10px]"
                    >
                      {res.priority} Priority
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {res.duration}
                    </span>
                  </div>

                  {/* Title & Deficit */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono">
                    <TrendingUp className="h-3 w-3 shrink-0" />
                    <span className="truncate">{res.deficitAddressed}</span>
                  </div>

                  {/* Match Reason */}
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                    {res.matchReason}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleComplete(res.id)}
                    className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
                      res.completed ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${res.completed ? "text-emerald-400" : "text-slate-600"}`} />
                    <span>{res.completed ? "Completed" : "Mark Done"}</span>
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="cyber" size="sm" className="text-xs gap-1.5 h-8 px-3">
                      Start Learning <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
