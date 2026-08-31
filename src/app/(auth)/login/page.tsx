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
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { loginSchema, LoginInput } from "@/lib/auth/schemas";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { KaushalSetuIcon } from "@/components/ui/logo";

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
    <div className="relative min-h-[calc(100vh-4rem)] py-12 flex items-center justify-center">
      <Container size="sm">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <div className="flex items-center justify-center mb-2">
              <KaushalSetuIcon size={56} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sign In to <span className="text-cyan-400">Kaushal</span><span className="text-emerald-400">Setu</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              Connecting Skills. Bridging Opportunities.
            </p>
          </div>
        </FadeIn>

        <SlideUp delay={0.1}>
          <GlassCard className="p-8 border-white/10 shadow-2xl relative overflow-hidden" glow>
            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@organization.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    leftIcon={<Lock className="h-4 w-4" />}
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
                className="w-full justify-center mt-2"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Authenticate & Enter
              </Button>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Register Here
                </Link>
              </p>
            </div>

            {/* Fast Demo One-Click Personas */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  Quick Demo Access (1-Click)
                </span>
                <Badge variant="cyber" size="sm">
                  Evaluator Presets
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student@titan.ai")}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-cyan-400">
                    <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Student</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">Aarav Sharma</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("industry@titan.ai")}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-500/10 border border-white/[0.06] hover:border-violet-500/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-violet-400">
                    <Briefcase className="h-3.5 w-3.5 text-violet-400" />
                    <span>Industry</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">Elena Rostova</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("academician@titan.ai")}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-emerald-400">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Academician</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">Dr. Sengupta</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("institution@titan.ai")}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-amber-400">
                    <Building2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>Institution</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">Apex Univ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin@titan.ai")}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 text-left transition-all group col-span-2 sm:col-span-2"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-rose-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />
                    <span>Security Admin</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">Full Governance Control</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </SlideUp>
      </Container>
    </div>
  );
}
