"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/auth/schemas";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    const res = await forgotPassword(data);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message || "Reset link sent successfully");
    } else {
      setServerError(res.error || "Failed to process recovery request");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 flex items-center justify-center">
      <Container size="sm">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-glow-sm mb-2">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Recover Access
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enter your registered email address and we will dispatch credentials recovery instructions.
            </p>
          </div>
        </FadeIn>

        <SlideUp delay={0.1}>
          <GlassCard className="p-8 border-white/10 shadow-2xl space-y-6" glow>
            {successMessage ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h3 className="font-semibold text-foreground text-base">Recovery Dispatched</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {successMessage}
                </p>
                <div className="pt-4">
                  <Link href="/login">
                    <Button variant="glow" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Registered Email
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

                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full justify-center mt-2"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Send Recovery Link
                </Button>

                <div className="pt-4 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Return to Login</span>
                  </Link>
                </div>
              </form>
            )}
          </GlassCard>
        </SlideUp>
      </Container>
    </div>
  );
}
