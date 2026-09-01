"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ArrowRight,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { registerSchema, RegisterInput } from "@/lib/auth/schemas";
import { PublicRole } from "@/lib/auth/types";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { KaushalSetuIcon } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const roleCards: Array<{
  role: PublicRole;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBorder: string;
}> = [
  {
    role: "student",
    title: "Student / Candidate",
    subtitle: "Acquire verified skills, showcase projects, and land frontier careers.",
    badge: "Employability",
    icon: GraduationCap,
    accentColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/15",
    activeBorder: "border-cyan-500/60 bg-cyan-950/30 shadow-[0_0_25px_rgba(6,182,212,0.25)]",
  },
  {
    role: "industry",
    title: "Industry / Recruiter",
    subtitle: "Source elite verified talent, sponsor problems, and post openings.",
    badge: "Hiring Suite",
    icon: Briefcase,
    accentColor: "border-violet-500/40 text-violet-400 bg-violet-500/15",
    activeBorder: "border-violet-500/60 bg-violet-950/30 shadow-[0_0_25px_rgba(139,92,246,0.25)]",
  },
  {
    role: "academician",
    title: "Academician / Faculty",
    subtitle: "Conduct research, mentor learners, and curate advanced curricula.",
    badge: "Curriculum",
    icon: BookOpen,
    accentColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/15",
    activeBorder: "border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]",
  },
  {
    role: "institution",
    title: "Institution / University",
    subtitle: "Oversee departmental metrics, accreditations, and industry linkages.",
    badge: "Accreditation",
    icon: Building2,
    accentColor: "border-amber-500/40 text-amber-400 bg-amber-500/15",
    activeBorder: "border-amber-500/60 bg-amber-950/30 shadow-[0_0_25px_rgba(245,158,11,0.25)]",
  },
];

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<PublicRole>("student");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      password: "",
      agreeTerms: true,
    },
  });

  const currentRole = watch("role");

  const handleRoleSelect = (role: PublicRole) => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const res = await registerUser(data);
    if (!res.success) {
      setServerError(res.error || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-12 flex items-center justify-center">
      {/* Ambient background glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container size="md" className="relative z-10 max-w-2xl">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <div className="flex items-center justify-center mb-1">
              <KaushalSetuIcon size={52} className="shadow-cyan-500/30 shadow-xl" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Smart India Hackathon 2026
              </span>
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
              <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                PS #26044
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
              Join <span className="text-cyan-400">Kaushal</span>
              <span className="text-emerald-400">Setu</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md font-mono">
              Connecting skills to opportunities and building next-generation verified careers.
            </p>
          </div>
        </FadeIn>

        <SlideUp delay={0.1}>
          <GlassCard
            className="p-6 sm:p-8 border-cyan-500/30 bg-slate-950/75 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.12)] space-y-7 relative overflow-hidden"
            glow
          >
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Role Selection Grid */}
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>1. Select Ecosystem Identity:</span>
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Active: <strong className="text-cyan-400 uppercase font-bold">{selectedRole}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {roleCards.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role)}
                      className={cn(
                        "p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group",
                        isSelected
                          ? cn("ring-1 ring-cyan-500/60", item.activeBorder)
                          : "bg-slate-900/40 border-white/[0.08] hover:bg-slate-900/80 hover:border-cyan-500/30"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("p-2 rounded-xl border", item.accentColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="glass" size="sm" className="text-[9px] font-mono">
                            {item.badge}
                          </Badge>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-cyan-300 transition-colors font-mono">
                          {item.title}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="text-xs text-rose-400">{errors.role.message}</p>
              )}
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t border-white/[0.08] font-mono">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-1">
                2. Account Credentials:
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Full Name / Contact Person
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Dr. Aryan Sharma"
                  leftIcon={<User className="h-4 w-4 text-cyan-400" />}
                  className="bg-slate-900/80 border-white/10 text-xs font-mono"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@institution-or-domain.com"
                  leftIcon={<Mail className="h-4 w-4 text-cyan-400" />}
                  className="bg-slate-900/80 border-white/10 text-xs font-mono"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Security Password
                </label>
                <Input
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  leftIcon={<Lock className="h-4 w-4 text-cyan-400" />}
                  className="bg-slate-900/80 border-white/10 text-xs font-mono"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-rose-400">{errors.password.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-muted-foreground leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40"
                    {...register("agreeTerms")}
                  />
                  <span className="text-[11px] leading-relaxed">
                    I agree to the SIH 2026 KaushalSetu Terms of Platform Access and verify the accuracy of my academic/institutional affiliation.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-rose-400 mt-1">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full justify-center text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                disabled={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {isLoading ? "Provisioning Identity..." : `Proceed to ${selectedRole.toUpperCase()} Onboarding`}
              </Button>
            </form>

            <div className="pt-4 border-t border-white/[0.08] text-center text-xs text-muted-foreground font-mono">
              Already have an authorized KaushalSetu identity?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors">
                Sign In to Portal →
              </Link>
            </div>
          </GlassCard>
        </SlideUp>
      </Container>
    </div>
  );
}
