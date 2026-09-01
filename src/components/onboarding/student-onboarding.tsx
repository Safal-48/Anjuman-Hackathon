"use client";

import React, { useState, useRef } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  FileCheck2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function StudentOnboarding() {
  const { user, updateOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newCert, setNewCert] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resume File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

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
      resumeFileSize: "",
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
  const resumeFileSize = watch("resumeFileSize");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setValue("skills", [...currentSkills, trimmed], { shouldValidate: true });
      setNewSkill("");
      setServerError(null);
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
      setServerError(null);
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
      setValue("certifications", [...currentCerts, trimmed], { shouldValidate: true });
      setNewCert("");
    }
  };

  const removeCert = (certToRemove: string) => {
    setValue(
      "certifications",
      currentCerts.filter((c) => c !== certToRemove)
    );
  };

  // Resume File Upload Handlers
  const handleProcessFile = (file: File) => {
    setFileUploadError(null);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const isExtensionValid = /\.(pdf|docx|doc)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setFileUploadError("Please upload a valid PDF or Word document (.pdf, .docx).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileUploadError("File size exceeds 10MB limit. Please upload a smaller document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setValue("resumeUrl", dataUrl, { shouldValidate: true });
      setValue("resumeFileName", file.name, { shouldValidate: true });
      setValue("resumeFileSize", formatFileSize(file.size), { shouldValidate: true });
      setServerError(null);
    };
    reader.onerror = () => {
      setFileUploadError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleClearResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("resumeFileName", "", { shouldValidate: true });
    setValue("resumeUrl", "", { shouldValidate: true });
    setValue("resumeFileSize", "", { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNextStep = async () => {
    setServerError(null);
    if (step === 1) {
      const isValid = await trigger(["fullName", "education", "institution", "academicYear"]);
      if (isValid) {
        setStep(2);
      } else {
        setServerError("Please complete the required academic profile fields above.");
      }
    } else if (step === 2) {
      const isValid = await trigger(["skills", "interests", "careerGoal"]);
      if (isValid) {
        setStep(3);
      } else {
        setServerError("Please ensure you have selected at least 1 skill, 1 interest, and your career ambition.");
      }
    }
  };

  const onFormError = (formErrors: FieldErrors<StudentOnboardingInput>) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const errorMsg =
        errors.fullName?.message ||
        errors.education?.message ||
        errors.institution?.message ||
        errors.skills?.message ||
        errors.interests?.message ||
        errors.careerGoal?.message ||
        "Please check the form for missing or invalid fields.";
      setServerError(errorMsg);
    }
  };

  const onSubmit = async (data: StudentOnboardingInput) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      // Clean empty projects so user is never blocked by blank entries
      const cleanedProjects = (data.projects || []).filter(
        (p) => (p.title && p.title.trim().length > 0) || (p.description && p.description.trim().length > 0)
      );

      const cleanedData: StudentOnboardingInput = {
        ...data,
        projects: cleanedProjects,
      };

      const res = await updateOnboarding({
        role: "student",
        data: cleanedData,
      });

      if (res.success) {
        // Immediate smooth transition to dashboard command center
        router.push("/dashboard");
        router.refresh();
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 600);
      } else {
        setIsSubmitting(false);
        setServerError(res.error || "Failed to finalize student profile. Please retry.");
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Unexpected error saving profile";
      setServerError(msg);
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
      <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3 shadow-lg shadow-rose-950/40"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Attention Required</p>
              <p className="text-xs text-rose-300/90 mt-0.5">{serverError}</p>
            </div>
          </motion.div>
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
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Aarav Sharma"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Degree & Major <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g. B.Tech Computer Science & AI"
                    {...register("education")}
                  />
                  {errors.education && (
                    <p className="text-xs text-rose-400 font-medium">{errors.education.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic Year / Standing <span className="text-rose-400">*</span>
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
                    <p className="text-xs text-rose-400 font-medium">{errors.academicYear.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Institution / University Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Indian Institute of Technology / National Institute of Tech"
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                  {...register("institution")}
                />
                {errors.institution && (
                  <p className="text-xs text-rose-400 font-medium">{errors.institution.message}</p>
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
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Technical Skills & Stack <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-cyan-400">{currentSkills.length} selected</span>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-950/40"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rose-400 text-cyan-400/80 transition-colors"
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
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-muted-foreground hover:text-cyan-300 transition-all"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.skills && (
                  <p className="text-xs text-rose-400 font-medium">{errors.skills.message}</p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Domains of Interest <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-violet-400">{currentInterests.length} selected</span>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 border border-violet-500/40 text-violet-300 shadow-sm shadow-violet-950/40"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(item)}
                        className="hover:text-rose-400 text-violet-400/80 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground font-mono block mb-1.5">
                    Suggested Domains:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularInterests.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => addInterest(item)}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-violet-500/10 border border-white/10 hover:border-violet-500/30 text-muted-foreground hover:text-violet-300 transition-all"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.interests && (
                  <p className="text-xs text-rose-400 font-medium">{errors.interests.message}</p>
                )}
              </div>

              {/* Career Goal */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Primary Career Goal / Ambition <span className="text-rose-400">*</span></span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. Aspiring to build frontier distributed AI infrastructure and lead engineering teams in scalable enterprise systems."
                  {...register("careerGoal")}
                />
                {errors.careerGoal && (
                  <p className="text-xs text-rose-400 font-medium">{errors.careerGoal.message}</p>
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
                  <span>Experience Summary / Internship Background (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. Fresher with extensive coursework and project work OR 6-month software engineering intern."
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-xs text-rose-400 font-medium">{errors.experience.message}</p>
                )}
              </div>

              {/* Projects List */}
              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Featured Projects (Optional)</span>
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
                      className="p-4 rounded-xl bg-black/30 border border-white/[0.08] space-y-3 relative transition-all hover:border-cyan-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-cyan-400 font-semibold">
                          Project #{index + 1}
                        </span>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-muted-foreground hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Input
                          placeholder="Project Title (e.g. Distributed Neural Cache Engine)"
                          {...register(`projects.${index}.title` as const)}
                        />
                        {errors.projects?.[index]?.title && (
                          <p className="text-xs text-rose-400 font-medium">
                            {errors.projects[index]?.title?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <textarea
                          rows={2}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/50 p-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          placeholder="Project description and key technologies used..."
                          {...register(`projects.${index}.description` as const)}
                        />
                        {errors.projects?.[index]?.description && (
                          <p className="text-xs text-rose-400 font-medium">
                            {errors.projects[index]?.description?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Input
                          placeholder="Project or Repository URL (e.g. https://github.com/...)"
                          {...register(`projects.${index}.link` as const)}
                        />
                        {errors.projects?.[index]?.link && (
                          <p className="text-xs text-rose-400 font-medium">
                            {errors.projects[index]?.link?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Certifications & Honors (Optional)</span>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-950/40"
                    >
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCert(cert)}
                        className="hover:text-rose-400 text-emerald-400/80 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Resume Upload & Dropzone */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Resume / CV Document (Recommended)</span>
                  </span>
                  {resumeFileName && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      Attached
                    </span>
                  )}
                </label>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Drag and Drop Container */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleProcessFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20 scale-[1.01]"
                      : resumeFileName
                      ? "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/60"
                      : "border-white/20 bg-slate-950/50 hover:border-cyan-500/50 hover:bg-slate-900/60"
                  }`}
                >
                  {resumeFileName ? (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                      <div className="flex items-center gap-3.5 text-left">
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-md shadow-cyan-950/50">
                          <FileText className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate max-w-[220px] sm:max-w-xs">
                            {resumeFileName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {resumeFileSize && (
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-muted-foreground">
                                {resumeFileSize}
                              </span>
                            )}
                            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Ready for ATS Matching
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="cyber"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                        >
                          Replace File
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={handleClearResume}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-md shadow-cyan-950/30">
                        <Upload className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      <p className="text-sm text-foreground font-semibold">
                        Click to upload Resume or Drag & Drop here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Accepted formats: <span className="text-cyan-300 font-mono">PDF, DOCX, DOC</span> (Up to 10MB)
                      </p>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="glass"
                          size="sm"
                          className="pointer-events-none text-xs border-cyan-500/30 text-cyan-300"
                        >
                          Browse Document from Computer
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {fileUploadError && (
                  <p className="text-xs text-rose-400 font-medium mt-1">{fileUploadError}</p>
                )}

                {/* Optional Document URL Fallback */}
                <div className="pt-2">
                  <Input
                    placeholder="Or enter public resume URL (e.g. Google Drive, LinkedIn, Portfolio)..."
                    {...register("resumeUrl")}
                  />
                </div>
              </div>

              {/* Step Navigation & Submission */}
              <div className="pt-4 flex justify-between items-center">
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => {
                    setServerError(null);
                    setStep(2);
                  }}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  isLoading={isLoading || isSubmitting}
                  rightIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  {isSubmitting ? "Activating Command Center..." : "Complete Onboarding & Enter Command Center"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </OnboardingLayout>
  );
}
