"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  Briefcase,
  User,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { industryOnboardingSchema, IndustryOnboardingInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/auth-context";
import { OnboardingLayout } from "./onboarding-layout";

const popularHiringDomains = [
  "AI / Machine Learning",
  "Full Stack Systems",
  "Cloud & DevOps",
  "Cybersecurity",
  "Autonomous Robotics",
  "Data Engineering",
  "Embedded Systems",
];

import { useRouter } from "next/navigation";

export function IndustryOnboarding() {
  const { user, updateOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [newDomain, setNewDomain] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<IndustryOnboardingInput>({
    resolver: zodResolver(industryOnboardingSchema),
    defaultValues: {
      organizationName: "",
      industryDomain: "",
      organizationSize: "100-500",
      organizationDescription: "",
      website: "",
      recruiterName: user?.fullName || "",
      recruiterDesignation: "Talent Acquisition Lead",
      recruiterEmail: user?.email || "",
      hiringInterests: ["AI / Machine Learning", "Full Stack Systems"],
    },
  });

  const hiringInterests = watch("hiringInterests") || [];

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !hiringInterests.includes(trimmed)) {
      setValue("hiringInterests", [...hiringInterests, trimmed], { shouldValidate: true });
      setNewDomain("");
      setServerError(null);
    }
  };

  const removeInterest = (itemToRemove: string) => {
    setValue(
      "hiringInterests",
      hiringInterests.filter((i) => i !== itemToRemove),
      { shouldValidate: true }
    );
  };

  const handleNextStep = async () => {
    setServerError(null);
    const isValid = await trigger([
      "organizationName",
      "industryDomain",
      "organizationSize",
      "organizationDescription",
      "website",
    ]);
    if (isValid) {
      setStep(2);
    } else {
      setServerError("Please complete the required organization profile fields.");
    }
  };

  const onFormError = () => {
    const err =
      errors.organizationName?.message ||
      errors.industryDomain?.message ||
      errors.website?.message ||
      errors.organizationDescription?.message ||
      errors.recruiterName?.message ||
      errors.recruiterDesignation?.message ||
      errors.recruiterEmail?.message ||
      "Please fill out all required fields.";
    setServerError(err);
  };

  const onSubmit = async (data: IndustryOnboardingInput) => {
    setServerError(null);
    const res = await updateOnboarding({
      role: "industry",
      data,
    });
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 600);
    } else {
      setServerError(res.error || "Failed to finalize industry profile");
    }
  };

  const stepTitles = ["Organization Profile", "Recruiter Credentials & Hiring Focus"];

  return (
    <OnboardingLayout
      role="industry"
      currentStep={step}
      totalSteps={2}
      stepTitles={stepTitles}
    >
      <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
        {serverError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {serverError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Organization Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Organization Name
                  </label>
                  <Input
                    placeholder="e.g. CyberDynamics AI Corp"
                    leftIcon={<Building2 className="h-4 w-4" />}
                    {...register("organizationName")}
                  />
                  {errors.organizationName && (
                    <p className="text-xs text-rose-400">{errors.organizationName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Primary Industry Domain
                  </label>
                  <Input
                    placeholder="e.g. Enterprise Cloud & Autonomy"
                    {...register("industryDomain")}
                  />
                  {errors.industryDomain && (
                    <p className="text-xs text-rose-400">{errors.industryDomain.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Organization Size
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-violet-500"
                    {...register("organizationSize")}
                  >
                    <option value="1-50">1 - 50 Employees (Early Stage)</option>
                    <option value="50-200">50 - 200 Employees (Growth)</option>
                    <option value="200-1000">200 - 1,000 Employees (Mid-Market)</option>
                    <option value="1000+">1,000+ Employees (Global Enterprise)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Official Website URL
                  </label>
                  <Input
                    placeholder="https://organization.com"
                    leftIcon={<Globe className="h-4 w-4" />}
                    {...register("website")}
                  />
                  {errors.website && (
                    <p className="text-xs text-rose-400">{errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Organization Mission & Tech Overview
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Describe your organization's core operations, technological focus, and hiring philosophy..."
                  {...register("organizationDescription")}
                />
                {errors.organizationDescription && (
                  <p className="text-xs text-rose-400">{errors.organizationDescription.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  variant="glow"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue to Recruiter Profile
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Recruiter Credentials & Hiring Focus */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Authorized Recruiter / Contact Name
                  </label>
                  <Input
                    placeholder="e.g. Elena Rostova"
                    leftIcon={<User className="h-4 w-4" />}
                    {...register("recruiterName")}
                  />
                  {errors.recruiterName && (
                    <p className="text-xs text-rose-400">{errors.recruiterName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Designation / Title
                  </label>
                  <Input
                    placeholder="e.g. Director of Technical Talent"
                    leftIcon={<Briefcase className="h-4 w-4" />}
                    {...register("recruiterDesignation")}
                  />
                  {errors.recruiterDesignation && (
                    <p className="text-xs text-rose-400">{errors.recruiterDesignation.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Official Recruiter Email
                </label>
                <Input
                  type="email"
                  placeholder="recruiter@organization.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  {...register("recruiterEmail")}
                />
                {errors.recruiterEmail && (
                  <p className="text-xs text-rose-400">{errors.recruiterEmail.message}</p>
                )}
              </div>

              {/* Target Talent Domains */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Talent Sourcing Domains
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add specialized hiring category..."
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest(newDomain);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={() => addInterest(newDomain)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hiringInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 border border-violet-500/40 text-violet-300"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground font-mono block mb-1.5">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularHiringDomains.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => addInterest(d)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        + {d}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.hiringInterests && (
                  <p className="text-xs text-rose-400">{errors.hiringInterests.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Activate Recruiter Portal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </OnboardingLayout>
  );
}
