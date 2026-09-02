"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { loginSchema, LoginInput } from "@/lib/auth/schemas";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { SkilloraIcon } from "@/components/ui/logo";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const res = await login(data);
    if (!res.success) {
      setServerError(res.error || "Authentication failed");
    }
  };

  const handleDemoLogin = (email: string) => {
    setValue("email", email);
    setValue("password", "TitanSecure#2026");
    onSubmit({ email, password: "TitanSecure#2026" });
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-12 flex items-center justify-center">
      {/* Ambient background glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container size="sm" className="relative z-10 max-w-md">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <div className="flex items-center justify-center mb-1">
              <SkilloraIcon size={52} className="shadow-cyan-500/30 shadow-xl" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Authorized Identity Portal
              </span>
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
              <Badge variant="emerald" size="sm" className="font-mono text-[9px]">
                SECURE ACCESS
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              Sign In to <span className="text-white">Skill</span>
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">ora</span>
            </h1>
            <p className="text-xs text-muted-foreground max-w-sm font-mono">
              Learn Smart • Improve Continuously • Own Your Future
            </p>
          </div>
        </FadeIn>

        <SlideUp delay={0.1}>
          <GlassCard
            className="p-6 sm:p-8 border-cyan-500/30 bg-slate-950/75 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.12)] space-y-6 relative overflow-hidden"
            glow
          >
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@organization.com"
                  leftIcon={<Mail className="h-4 w-4 text-cyan-400" />}
                  className="bg-slate-900/80 border-white/10 text-xs font-mono"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    leftIcon={<Lock className="h-4 w-4 text-cyan-400" />}
                    className="bg-slate-900/80 border-white/10 text-xs font-mono"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full justify-center mt-2 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Authenticate & Enter →
              </Button>
            </form>

            {/* Switch to Register */}
            <div className="pt-4 border-t border-white/[0.08] text-center font-mono">
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors underline"
                >
                  Register Here →
                </Link>
              </p>
            </div>

            {/* Fast Demo One-Click Personas */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span>Quick Demo Access (1-Click)</span>
                </span>
                <Badge variant="cyber" size="sm" className="text-[9px]">
                  DEMO PASS
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student@titan.ai")}
                  className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Student</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate block">student@titan.ai</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("industry@titan.ai")}
                  className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:border-violet-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-violet-400 text-xs font-bold">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Recruiter</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate block">industry@titan.ai</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </SlideUp>
      </Container>
    </div>
  );
}
