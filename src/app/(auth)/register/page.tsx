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
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}> = [
  {
    role: "student",
    title: "Student",
    subtitle: "Acquire verified skills, showcase projects, and land frontier careers.",
    icon: GraduationCap,
    accentColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
  },
  {
    role: "industry",
    title: "Industry / Recruiter",
    subtitle: "Source elite verified talent, sponsor problems, and post openings.",
    icon: Briefcase,
    accentColor: "border-violet-500/40 text-violet-400 bg-violet-500/10",
  },
  {
    role: "academician",
    title: "Academician / Faculty",
    subtitle: "Conduct research, mentor learners, and curate advanced curricula.",
    icon: BookOpen,
    accentColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  },
  {
    role: "institution",
    title: "Institution / University",
    subtitle: "Oversee departmental metrics, accreditations, and industry linkages.",
    icon: Building2,
    accentColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
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
    <div className="relative min-h-[calc(100vh-4rem)] py-12 flex items-center justify-center">
      <Container size="md">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <div className="flex items-center justify-center mb-2">
              <KaushalSetuIcon size={56} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Join <span className="text-cyan-400">Kaushal</span><span className="text-emerald-400">Setu</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Connecting skills to opportunities and building next-generation verified careers.
            </p>
          </div>
        </FadeIn>

        <SlideUp delay={0.1}>
          <GlassCard className="p-8 border-white/10 shadow-2xl space-y-8" glow>
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Role Selection Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Ecosystem Identity
                </label>
                <span className="text-xs text-muted-foreground font-mono">
                  Role: <strong className="text-cyan-400 uppercase">{selectedRole}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleCards.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group",
                        isSelected
                          ? "bg-slate-900/90 border-cyan-500/60 shadow-glow-sm ring-1 ring-cyan-500/50"
                          : "bg-slate-950/40 border-white/[0.06] hover:bg-slate-900/50 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("p-2.5 rounded-xl border", item.accentColor)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t border-white/[0.06]">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name / Contact Person
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Dr. Aryan Sharma"
                  leftIcon={<User className="h-4 w-4" />}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@institution-or-domain.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Security Password
                </label>
                <Input
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  leftIcon={<Lock className="h-4 w-4" />}
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
                  <span>
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
                className="w-full justify-center mt-4"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Proceed to {selectedRole.toUpperCase()} Onboarding
              </Button>
            </form>

            <div className="pt-4 border-t border-white/[0.06] text-center">
              <p className="text-sm text-muted-foreground">
                Already registered with KaushalSetu?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </GlassCard>
        </SlideUp>
      </Container>
    </div>
  );
}
