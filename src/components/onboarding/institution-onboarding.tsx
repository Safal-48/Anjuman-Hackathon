"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  ShieldCheck,
  User,
  Mail,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { institutionOnboardingSchema, InstitutionOnboardingInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/auth-context";
import { OnboardingLayout } from "./onboarding-layout";

import { useRouter } from "next/navigation";

export function InstitutionOnboarding() {
  const { user, updateOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<InstitutionOnboardingInput>({
    resolver: zodResolver(institutionOnboardingSchema),
    defaultValues: {
      institutionName: "",
      institutionType: "university",
      registrationCode: "",
      address: "",
      city: "",
      state: "",
      representativeName: user?.fullName || "",
      representativeDesignation: "Registrar / Dean of Academic Affairs",
      representativeEmail: user?.email || "",
    },
  });

  const handleNextStep = async () => {
    setServerError(null);
    const isValid = await trigger([
      "institutionName",
      "institutionType",
      "registrationCode",
      "address",
      "city",
      "state",
    ]);
    if (isValid) {
      setStep(2);
    } else {
      setServerError("Please complete the required institutional registry fields.");
    }
  };

  const onFormError = () => {
    const err =
      errors.institutionName?.message ||
      errors.registrationCode?.message ||
      errors.address?.message ||
      errors.city?.message ||
      errors.state?.message ||
      errors.representativeName?.message ||
      errors.representativeDesignation?.message ||
      errors.representativeEmail?.message ||
      "Please fill out all required institutional fields.";
    setServerError(err);
  };

  const onSubmit = async (data: InstitutionOnboardingInput) => {
    setServerError(null);
    const res = await updateOnboarding({
      role: "institution",
      data,
    });
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 600);
    } else {
      setServerError(res.error || "Failed to finalize institution profile");
    }
  };

  const stepTitles = ["Institutional Registry & Location", "Authorized Representative"];

  return (
    <OnboardingLayout
      role="institution"
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
          {/* STEP 1: Institutional Registry & Location */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Institution Official Name
                </label>
                <Input
                  placeholder="e.g. Apex University of Science and Technology"
                  leftIcon={<Building2 className="h-4 w-4" />}
                  {...register("institutionName")}
                />
                {errors.institutionName && (
                  <p className="text-xs text-rose-400">{errors.institutionName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Institution Category / Type
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                    {...register("institutionType")}
                  >
                    <option value="university">Central / State / Deemed University</option>
                    <option value="autonomous_college">Autonomous Engineering College</option>
                    <option value="affiliated_college">Affiliated Technical Institute</option>
                    <option value="research_institute">National Research Laboratory</option>
                    <option value="other">Other Recognized Entity</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    AISHE / University Accreditation Code
                  </label>
                  <Input
                    placeholder="e.g. AISHE-U-01234 / NAAC-A++"
                    leftIcon={<QrCode className="h-4 w-4" />}
                    {...register("registrationCode")}
                  />
                  {errors.registrationCode && (
                    <p className="text-xs text-rose-400">{errors.registrationCode.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Campus Physical Address
                </label>
                <Input
                  placeholder="Street / Campus Address"
                  leftIcon={<MapPin className="h-4 w-4" />}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-rose-400">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    City
                  </label>
                  <Input
                    placeholder="e.g. Bengaluru"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-xs text-rose-400">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    State / Region
                  </label>
                  <Input
                    placeholder="e.g. Karnataka"
                    {...register("state")}
                  />
                  {errors.state && (
                    <p className="text-xs text-rose-400">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  variant="glow"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue to Authorized Representative
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Authorized Representative */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span>
                  The designated representative serves as the primary liaison for institutional telemetry, student certifications, and SIH 2026 hackathon coordination.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Representative Full Name
                </label>
                <Input
                  placeholder="e.g. Dr. K. R. Ramanathan"
                  leftIcon={<User className="h-4 w-4" />}
                  {...register("representativeName")}
                />
                {errors.representativeName && (
                  <p className="text-xs text-rose-400">{errors.representativeName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Designation / Title
                  </label>
                  <Input
                    placeholder="e.g. Dean of Academics / Director"
                    leftIcon={<Briefcase className="h-4 w-4" />}
                    {...register("representativeDesignation")}
                  />
                  {errors.representativeDesignation && (
                    <p className="text-xs text-rose-400">{errors.representativeDesignation.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Official Institutional Email
                  </label>
                  <Input
                    type="email"
                    placeholder="dean.office@apexuniv.edu.in"
                    leftIcon={<Mail className="h-4 w-4" />}
                    {...register("representativeEmail")}
                  />
                  {errors.representativeEmail && (
                    <p className="text-xs text-rose-400">{errors.representativeEmail.message}</p>
                  )}
                </div>
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
                  Verify & Activate Institutional Hub
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </OnboardingLayout>
  );
}
