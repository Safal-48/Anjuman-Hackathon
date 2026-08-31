"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  Briefcase,
  Target,
  FolderGit2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { studentOnboardingSchema, StudentOnboardingInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/auth-context";
import { OnboardingLayout } from "./onboarding-layout";

const popularSkills = [
  "Python",
  "React",
  "TypeScript",
  "Next.js",
  "Machine Learning",
  "PyTorch",
  "Docker",
  "PostgreSQL",
  "Three.js",
  "Rust",
  "Kubernetes",
  "Cybersecurity",
];

const popularInterests = [
  "Artificial Intelligence",
  "Autonomous Systems",
  "FinTech",
  "Healthcare Tech",
  "Cloud Architecture",
  "Edge Computing",
];

export function StudentOnboarding() {
  const { user, updateOnboarding, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newCert, setNewCert] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<StudentOnboardingInput>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      education: "",
      institution: "",
      academicYear: "3rd Year",
      skills: ["React", "TypeScript", "Python"],
      interests: ["Artificial Intelligence"],
      careerGoal: "",
      experience: "",
      projects: [
        {
          title: "",
          description: "",
          link: "",
        },
      ],
      certifications: [],
      resumeUrl: "",
      resumeFileName: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const currentSkills = watch("skills") || [];
  const currentInterests = watch("interests") || [];
  const currentCerts = watch("certifications") || [];
  const resumeFileName = watch("resumeFileName");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setValue("skills", [...currentSkills, trimmed], { shouldValidate: true });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !currentInterests.includes(trimmed)) {
      setValue("interests", [...currentInterests, trimmed], { shouldValidate: true });
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setValue(
      "interests",
      currentInterests.filter((i) => i !== interestToRemove),
      { shouldValidate: true }
    );
  };

  const addCert = () => {
    const trimmed = newCert.trim();
    if (trimmed && !currentCerts.includes(trimmed)) {
      setValue("certifications", [...currentCerts, trimmed]);
      setNewCert("");
    }
  };

  const removeCert = (certToRemove: string) => {
    setValue(
      "certifications",
      currentCerts.filter((c) => c !== certToRemove)
    );
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["fullName", "education", "institution", "academicYear"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(["skills", "interests", "careerGoal"]);
      if (isValid) setStep(3);
    }
  };

  const onSubmit = async (data: StudentOnboardingInput) => {
    setServerError(null);
    const res = await updateOnboarding({
      role: "student",
      data,
    });
    if (!res.success) {
      setServerError(res.error || "Failed to finalize student profile");
    }
  };

  const stepTitles = [
    "Academic Profile",
    "Skills & Ambition",
    "Experience & Projects",
  ];

  return (
    <OnboardingLayout
      role="student"
      currentStep={step}
      totalSteps={3}
      stepTitles={stepTitles}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {serverError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Academic Profile */}
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
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Aarav Sharma"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Degree & Major
                  </label>
                  <Input
                    placeholder="e.g. B.Tech Computer Science & AI"
                    {...register("education")}
                  />
                  {errors.education && (
                    <p className="text-xs text-rose-400">{errors.education.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic Year / Standing
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    {...register("academicYear")}
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                    <option value="PhD Candidate">PhD Candidate</option>
                  </select>
                  {errors.academicYear && (
                    <p className="text-xs text-rose-400">{errors.academicYear.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Institution / University Name
                </label>
                <Input
                  placeholder="e.g. Indian Institute of Technology / National Institute of Tech"
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                  {...register("institution")}
                />
                {errors.institution && (
                  <p className="text-xs text-rose-400">{errors.institution.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  variant="glow"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue to Skills & Ambition
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Skills & Ambition */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Technical Skills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Technical Skills & Stack
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a skill and press Add (e.g. Next.js, PyTorch)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(newSkill);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={() => addSkill(newSkill)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1 min-h-[32px]">
                  {currentSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Popular Skill Suggestions */}
                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground font-mono block mb-1.5">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSkills.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.skills && (
                  <p className="text-xs text-rose-400">{errors.skills.message}</p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Domains of Interest
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest area..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest(newInterest);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={() => addInterest(newInterest)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentInterests.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 border border-violet-500/40 text-violet-300"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(item)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-xs text-rose-400">{errors.interests.message}</p>
                )}
              </div>

              {/* Career Goal */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Primary Career Goal</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. Aspiring to build frontier distributed AI infrastructure and lead engineering teams in scalable enterprise systems."
                  {...register("careerGoal")}
                />
                {errors.careerGoal && (
                  <p className="text-xs text-rose-400">{errors.careerGoal.message}</p>
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
                  type="button"
                  variant="glow"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue to Experience & Projects
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Experience, Projects & Resume */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Experience Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Experience Summary / Internship Background</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. Fresher with extensive project work OR 6-month software engineering intern at a high-growth startup."
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-xs text-rose-400">{errors.experience.message}</p>
                )}
              </div>

              {/* Projects List */}
              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Featured Projects</span>
                  </label>
                  <Button
                    type="button"
                    variant="cyber"
                    size="sm"
                    onClick={() => append({ title: "", description: "", link: "" })}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 rounded-xl bg-black/30 border border-white/[0.08] space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-cyan-400 font-semibold">
                          Project #{index + 1}
                        </span>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-muted-foreground hover:text-rose-400 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <Input
                        placeholder="Project Title (e.g. Distributed Neural Cache Engine)"
                        {...register(`projects.${index}.title` as const)}
                      />
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="Project description and key technologies used..."
                        {...register(`projects.${index}.description` as const)}
                      />
                      <Input
                        placeholder="Project or Repository URL (e.g. https://github.com/...)"
                        {...register(`projects.${index}.link` as const)}
                      />
                    </div>
                  ))}
                </div>
                {errors.projects && (
                  <p className="text-xs text-rose-400">{errors.projects.message}</p>
                )}
              </div>

              {/* Certifications */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Certifications & Honors</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. AWS Certified Solutions Architect, Google Cloud Associate..."
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCert();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={addCert}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentCerts.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 border border-emerald-500/40 text-emerald-300"
                    >
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCert(cert)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Link or Upload Simulator */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Resume / CV Document</span>
                </label>
                <div className="p-4 rounded-xl border border-dashed border-white/20 bg-slate-950/40 flex flex-col items-center justify-center text-center">
                  <Upload className="h-6 w-6 text-cyan-400 mb-2" />
                  <p className="text-xs text-foreground font-medium">
                    {resumeFileName || "Upload PDF Resume or provide document link"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Accepted formats: PDF, DOCX (Max 10MB)
                  </p>
                  <div className="mt-3 w-full max-w-sm">
                    <Input
                      placeholder="Or enter public resume URL..."
                      {...register("resumeUrl")}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => setStep(2)}
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
                  Complete Onboarding & Enter Command Center
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </OnboardingLayout>
  );
}
