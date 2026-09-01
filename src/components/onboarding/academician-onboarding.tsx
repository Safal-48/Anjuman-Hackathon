"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Link as LinkIcon,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { academicianOnboardingSchema, AcademicianOnboardingInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/auth-context";
import { OnboardingLayout } from "./onboarding-layout";

const popularExpertise = [
  "Deep Learning & NLP",
  "Quantum Computing",
  "High Performance Computing",
  "Cybersecurity & Cryptography",
  "Computer Vision",
  "Robotics & Control Systems",
  "Bioinformatics",
];

const popularResearch = [
  "Multi-Agent Reinforcement Learning",
  "Autonomous Agent Orchestration",
  "Explainable Artificial Intelligence",
  "Edge Federated Learning",
  "Post-Quantum Cryptography",
];

import { useRouter } from "next/navigation";

export function AcademicianOnboarding() {
  const { user, updateOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [newExp, setNewExp] = useState("");
  const [newRes, setNewRes] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AcademicianOnboardingInput>({
    resolver: zodResolver(academicianOnboardingSchema),
    defaultValues: {
      institution: "",
      department: "",
      designation: "Professor",
      expertise: ["Deep Learning & NLP"],
      experienceYears: 8,
      researchInterests: ["Multi-Agent Reinforcement Learning"],
      scholarProfile: "",
    },
  });

  const expertiseList = watch("expertise") || [];
  const researchList = watch("researchInterests") || [];

  const addExpertise = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !expertiseList.includes(trimmed)) {
      setValue("expertise", [...expertiseList, trimmed], { shouldValidate: true });
      setNewExp("");
      setServerError(null);
    }
  };

  const removeExpertise = (itemToRemove: string) => {
    setValue(
      "expertise",
      expertiseList.filter((i) => i !== itemToRemove),
      { shouldValidate: true }
    );
  };

  const addResearch = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !researchList.includes(trimmed)) {
      setValue("researchInterests", [...researchList, trimmed], { shouldValidate: true });
      setNewRes("");
      setServerError(null);
    }
  };

  const removeResearch = (itemToRemove: string) => {
    setValue(
      "researchInterests",
      researchList.filter((i) => i !== itemToRemove),
      { shouldValidate: true }
    );
  };

  const handleNextStep = async () => {
    setServerError(null);
    const isValid = await trigger(["institution", "department", "designation", "experienceYears"]);
    if (isValid) {
      setStep(2);
    } else {
      setServerError("Please complete the required academic affiliation fields.");
    }
  };

  const onFormError = () => {
    const err =
      errors.institution?.message ||
      errors.department?.message ||
      errors.designation?.message ||
      errors.expertise?.message ||
      errors.researchInterests?.message ||
      "Please fill out all required academic fields.";
    setServerError(err);
  };

  const onSubmit = async (data: AcademicianOnboardingInput) => {
    setServerError(null);
    const res = await updateOnboarding({
      role: "academician",
      data,
    });
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 600);
    } else {
      setServerError(res.error || "Failed to finalize academician profile");
    }
  };

  const stepTitles = ["Academic Affiliation", "Research & Domain Expertise"];

  return (
    <OnboardingLayout
      role="academician"
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
          {/* STEP 1: Academic Affiliation */}
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
                  Institution / University Name
                </label>
                <Input
                  placeholder="e.g. National Institute of Advanced Technology"
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                  {...register("institution")}
                />
                {errors.institution && (
                  <p className="text-xs text-rose-400">{errors.institution.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Department / Faculty
                  </label>
                  <Input
                    placeholder="e.g. Computer Science & Engineering"
                    {...register("department")}
                  />
                  {errors.department && (
                    <p className="text-xs text-rose-400">{errors.department.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic Designation
                  </label>
                  <Input
                    placeholder="e.g. Associate Professor / Dean of Research"
                    {...register("designation")}
                  />
                  {errors.designation && (
                    <p className="text-xs text-rose-400">{errors.designation.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Academic & Research Experience (Years)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  placeholder="e.g. 10"
                  {...register("experienceYears", { valueAsNumber: true })}
                />
                {errors.experienceYears && (
                  <p className="text-xs text-rose-400">{errors.experienceYears.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  variant="glow"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue to Research & Expertise
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Research & Domain Expertise */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Primary Expertise */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Core Technical Expertise Areas
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add area of expertise..."
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addExpertise(newExp);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={() => addExpertise(newExp)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {expertiseList.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 border border-emerald-500/40 text-emerald-300"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(item)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-muted-foreground font-mono block mb-1">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularExpertise.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => addExpertise(e)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        + {e}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.expertise && (
                  <p className="text-xs text-rose-400">{errors.expertise.message}</p>
                )}
              </div>

              {/* Research Interests */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Research Interests & Lab Topics</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add research topic..."
                    value={newRes}
                    onChange={(e) => setNewRes(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addResearch(newRes);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={() => addResearch(newRes)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {researchList.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeResearch(item)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {popularResearch.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => addResearch(r)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        + {r}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.researchInterests && (
                  <p className="text-xs text-rose-400">{errors.researchInterests.message}</p>
                )}
              </div>

              {/* Scholar / Profile URL */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Google Scholar / ORCID / Faculty Profile URL
                </label>
                <Input
                  placeholder="https://scholar.google.com/citations?user=..."
                  leftIcon={<LinkIcon className="h-4 w-4" />}
                  {...register("scholarProfile")}
                />
                {errors.scholarProfile && (
                  <p className="text-xs text-rose-400">{errors.scholarProfile.message}</p>
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
                  Activate Academic Portal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </OnboardingLayout>
  );
}
