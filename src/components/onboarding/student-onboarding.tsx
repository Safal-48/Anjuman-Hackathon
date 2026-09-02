"use client";

import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Brain,
  Award,
  AlertCircle,
  FileCheck2,
  Languages,
  Clock,
  Zap,
  BookOpen,
  HelpCircle,
  Layers,
  Flame,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/card";
import { studentOnboardingSchema, StudentOnboardingInput } from "@/lib/auth/schemas";
import { useAuth } from "@/lib/auth/auth-context";
import { OnboardingLayout } from "./onboarding-layout";

// Quick Preset Options for Smart Learning Profile
const primaryGoalPresets = [
  "Learn Python",
  "Master SQL",
  "Learn Data Science",
  "Prepare for Exams",
  "Prepare for Placements",
  "Build Projects",
  "Prepare for Internship",
  "Become a Data Analyst",
  "Become a Software Developer",
  "Learn AI/ML",
];

const popularSkills = [
  "Python",
  "SQL",
  "C++",
  "Java",
  "JavaScript",
  "React",
  "TypeScript",
  "Excel",
  "Power BI",
  "Statistics",
  "Machine Learning",
  "PyTorch",
  "Docker",
  "System Design",
];

const motivationOptions = [
  "Placements",
  "Internship",
  "Grades / GPA",
  "Exams",
  "Job Switch",
  "Building Production Projects",
  "Competitive Programming",
];

const learningStyles = [
  { id: "Videos", label: "Video Deep Dives", icon: "🎬", desc: "Visual breakdowns & architectural concept animations" },
  { id: "Reading", label: "Structured Reading", icon: "📖", desc: "Concise cheat sheets, documentation & case studies" },
  { id: "Practice", label: "Hands-on Practice", icon: "⚡", desc: "Interactive sandboxes & live coding challenges" },
  { id: "Projects", label: "Production Projects", icon: "🛠️", desc: "End-to-end portfolio-grade project milestones" },
  { id: "Quizzes", label: "Diagnostic Quizzes", icon: "🎯", desc: "Fast retention probes & adaptive spaced repetition" },
  { id: "Interactive", label: "Interactive Simulations", icon: "🕹️", desc: "3D visualizers, visual algorithms & graph step-throughs" },
  { id: "AI Tutor", label: "Socratic AI Tutor", icon: "🤖", desc: "Real-time conversational mentor with step-by-step guidance" },
];

const languageExamples: Record<
  "English" | "Hindi" | "Hinglish" | "English + Hindi",
  { explanation: string; query: string; queryResponse: string }
> = {
  English: {
    explanation: "A SQL JOIN combines related records from multiple tables based on a common key.",
    query: "Explain SQL JOIN with a simple real-world example.",
    queryResponse: "Think of an Orders table and a Customers table linked by CustomerID. A JOIN pairs each order with the customer who placed it.",
  },
  Hindi: {
    explanation: "JOIN का उपयोग multiple tables के related records को एक common key के आधार पर combine करने के लिए किया जाता है।",
    query: "मुझे SQL JOIN एक आसान उदाहरण के साथ समझाओ।",
    queryResponse: "मान लीजिए आपके पास Customers और Orders की दो टेबल हैं। JOIN की मदद से आप देख सकते हैं कि किस कस्टमर ने कौन सा ऑर्डर दिया है।",
  },
  Hinglish: {
    explanation: "JOIN basically multiple tables ke related data ko ek common key ke basis par ek saath combine karta hai.",
    query: "Bhai mujhe SQL JOIN simple example ke saath samjha.",
    queryResponse: "Bhai simple hai! Ek Customers table hai aur ek Orders table. JOIN use karke hum CustomerID ke through pata karte hain ki kis user ne kya order kiya.",
  },
  "English + Hindi": {
    explanation: "A JOIN combines related records from multiple tables based on a common key. (यानी multiple tables के data को match करके merge करता है।)",
    query: "Explain SQL JOIN with simple analogy in Hindi/English.",
    queryResponse: "A JOIN links two tables (e.g. Customers & Orders) via CustomerID. (यानी customer info और order details को एक single view में देखना।)",
  },
};

export function StudentOnboarding() {
  const { user, updateOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resume upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<StudentOnboardingInput>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      education: "B.Tech Computer Science & Engineering",
      institution: "Indian Institute of Technology / NIT",
      academicYear: "3rd Year",
      academicLevel: "Undergraduate",
      branch: "Computer Science & Engineering",
      semester: "Semester 5",
      primaryLearningGoal: "Learn Python",
      currentLevel: "Intermediate",
      skills: ["Python", "SQL", "React"],
      interests: ["Artificial Intelligence", "System Architecture"],
      careerGoal: "AI Systems Engineer / Full-Stack Architect",
      availableLearningTime: "1 hour",
      preferredLearningStyle: ["Interactive", "AI Tutor", "Practice"],
      difficultyPreference: "Balanced",
      preferredLearningTime: "Evening",
      motivation: ["Placements", "Projects"],
      preferredLanguage: "Hinglish",
      experience: "",
      projects: [],
      certifications: [],
      resumeUrl: "",
      resumeFileName: "",
      resumeFileSize: "",
    },
  });

  const currentSkills = watch("skills") || [];
  const selectedGoal = watch("primaryLearningGoal");
  const currentLevel = watch("currentLevel");
  const currentStyles = watch("preferredLearningStyle") || [];
  const currentMotivations = watch("motivation") || [];
  const selectedLanguage = watch("preferredLanguage") || "Hinglish";
  const selectedDifficulty = watch("difficultyPreference");
  const selectedAvailableTime = watch("availableLearningTime");
  const selectedPreferredTime = watch("preferredLearningTime");
  const resumeFileName = watch("resumeFileName");

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

  const toggleLearningStyle = (styleId: string) => {
    if (currentStyles.includes(styleId)) {
      setValue(
        "preferredLearningStyle",
        currentStyles.filter((s) => s !== styleId)
      );
    } else {
      setValue("preferredLearningStyle", [...currentStyles, styleId]);
    }
  };

  const toggleMotivation = (mot: string) => {
    if (currentMotivations.includes(mot)) {
      setValue(
        "motivation",
        currentMotivations.filter((m) => m !== mot)
      );
    } else {
      setValue("motivation", [...currentMotivations, mot]);
    }
  };

  // Step Validation
  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["fullName", "primaryLearningGoal", "careerGoal"]);
    } else if (step === 2) {
      isValid = await trigger(["skills", "currentLevel"]);
    } else if (step === 3) {
      isValid = await trigger(["education", "institution", "academicYear", "availableLearningTime"]);
    } else if (step === 4) {
      isValid = await trigger(["preferredLearningStyle", "difficultyPreference"]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: StudentOnboardingInput) => {
    try {
      setIsSubmitting(true);
      setServerError(null);

      await updateOnboarding({
        role: "student",
        data: {
          ...data,
          readinessScore: 78,
        },
      });

      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Failed to initialize learning profile.");
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Primary Learning Goal & Career Ambition",
    "Self-Declared Skill DNA & Level",
    "Academic Background & Study Time Budget",
    "Learning Modality & Difficulty Preference",
    "🌐 Language Personalization & AI Tutor Mode",
  ];

  return (
    <OnboardingLayout
      role="student"
      currentStep={step}
      totalSteps={5}
      stepTitles={stepTitles}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: PRIMARY LEARNING GOAL & MOTIVATION                                */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center gap-2">
                <Target className="h-4 w-4 shrink-0 text-cyan-400" />
                <span>Step 1 of 5: What is your primary learning mission today?</span>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  {...register("fullName")}
                  placeholder="e.g. Rahul Sharma"
                  className="bg-slate-900/60 border-white/10 text-white"
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Primary Learning Goal Chips */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Select Your Primary Learning Goal <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {primaryGoalPresets.map((goal) => {
                    const isSelected = selectedGoal === goal;
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setValue("primaryLearningGoal", goal, { shouldValidate: true })}
                        className={`p-2.5 rounded-xl text-xs font-mono font-medium transition-all text-left flex items-center justify-between border ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-glow-sm"
                            : "bg-slate-900/50 text-slate-300 border-white/[0.08] hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{goal}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Goal / Career Goal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Target Role / Career Goal <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    {...register("careerGoal")}
                    placeholder="e.g. AI Systems Engineer, Cloud Architect, Data Analyst"
                    className="bg-slate-900/60 border-white/10 text-white text-xs"
                  />
                  {errors.careerGoal && (
                    <p className="text-xs text-rose-400 mt-1">{errors.careerGoal.message}</p>
                  )}
                </div>

                {/* Primary Motivation */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Primary Motivations
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {motivationOptions.map((mot) => {
                      const isSel = currentMotivations.includes(mot);
                      return (
                        <button
                          key={mot}
                          type="button"
                          onClick={() => toggleMotivation(mot)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                            isSel
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-900/40 text-slate-400 border-white/[0.06] hover:text-white"
                          }`}
                        >
                          {mot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: SELF-DECLARED SKILL DNA & LEVEL                                  */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-violet-400 shrink-0" />
                  Step 2 of 5: Self-Declared Skill Inventory & Baseline Level
                </span>
                <Badge variant="amber" size="sm" className="font-mono text-[9px]">
                  Unverified Status
                </Badge>
              </div>

              {/* Current Self-Declared Level */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Current Self-Declared Technical Level <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => {
                    const isSel = currentLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setValue("currentLevel", lvl, { shouldValidate: true })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSel
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-sm"
                            : "bg-slate-900/50 border-white/[0.08] text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold font-mono text-sm">{lvl}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {lvl === "Beginner" && "Foundations & Syntax"}
                          {lvl === "Intermediate" && "Production & Projects"}
                          {lvl === "Advanced" && "System Design & Optimization"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Existing Skills with "Self-Declared" Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300 font-bold">
                    Select Your Existing Skills <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-amber-400">
                    * All items marked Self-Declared until tested
                  </span>
                </div>

                {/* Popular Skill Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {popularSkills.map((sk) => {
                    const isAdded = currentSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => (isAdded ? removeSkill(sk) : addSkill(sk))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 ${
                          isAdded
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                            : "bg-slate-900/40 text-slate-400 border-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span>{sk}</span>
                        {isAdded ? (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Self-Declared
                          </span>
                        ) : (
                          <Plus className="h-3 w-3 opacity-60" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(newSkill);
                      }
                    }}
                    placeholder="Add custom skill (e.g. GraphQL, NextAuth, Kafka)..."
                    className="bg-slate-900/60 border-white/10 text-white text-xs"
                  />
                  <Button
                    type="button"
                    variant="cyber"
                    size="sm"
                    onClick={() => addSkill(newSkill)}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Skills Review Box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-white/[0.08] min-h-[50px] flex flex-wrap gap-2">
                  {currentSkills.length === 0 ? (
                    <span className="text-xs text-slate-500 font-mono">No skills selected yet.</span>
                  ) : (
                    currentSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300"
                      >
                        <span>{sk}</span>
                        <Badge variant="amber" size="sm" className="text-[8px] px-1 py-0 h-3.5">
                          Self-Declared
                        </Badge>
                        <button
                          type="button"
                          onClick={() => removeSkill(sk)}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ACADEMIC BACKGROUND & TIME BUDGET                                 */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Step 3 of 5: Academic Details & Available Study Budget</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Institution / University Name <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    {...register("institution")}
                    placeholder="e.g. Delhi Technological University, NIT Trichy"
                    className="bg-slate-900/60 border-white/10 text-white text-xs"
                  />
                  {errors.institution && (
                    <p className="text-xs text-rose-400 mt-1">{errors.institution.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Degree & Branch <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    {...register("education")}
                    placeholder="e.g. B.Tech Computer Science"
                    className="bg-slate-900/60 border-white/10 text-white text-xs"
                  />
                  {errors.education && (
                    <p className="text-xs text-rose-400 mt-1">{errors.education.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Academic Year <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("academicYear")}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year / Final Year">4th Year / Final Year</option>
                    <option value="Graduated / Alumni">Graduated / Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Current Semester
                  </label>
                  <select
                    {...register("semester")}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>

              {/* Available Daily Learning Time */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Daily Available Learning Time
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["15 min", "30 min", "1 hour", "2 hours", "3+ hours"] as const).map((time) => {
                    const isSel = selectedAvailableTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setValue("availableLearningTime", time)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSel
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-glow-sm"
                            : "bg-slate-900/50 border-white/[0.08] text-slate-400 hover:text-white"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 mx-auto mb-1 text-emerald-400" />
                        <span className="text-xs font-mono font-bold">{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Time of Day */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Preferred Time Slot for Study
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["Morning", "Afternoon", "Evening", "Night", "Flexible"] as const).map((slot) => {
                    const isSel = selectedPreferredTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setValue("preferredLearningTime", slot)}
                        className={`p-2 rounded-xl border text-center transition-all text-xs font-mono ${
                          isSel
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                            : "bg-slate-900/50 border-white/[0.08] text-slate-400 hover:text-white"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: PREFERRED LEARNING STYLE & DIFFICULTY ENGINE                      */}
          {/* ========================================================================= */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Step 4 of 5: Modality Preferences & Adaptive Difficulty Tuning</span>
              </div>

              {/* Learning Style Multi-Select */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Select Your Preferred Learning Styles (Choose 1 or more)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {learningStyles.map((style) => {
                    const isSelected = currentStyles.includes(style.id);
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => toggleLearningStyle(style.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-500/50 shadow-glow-sm"
                            : "bg-slate-900/50 border-white/[0.08] hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xl">{style.icon}</span>
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white font-mono">{style.label}</span>
                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">{style.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Preference */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Adaptive Difficulty Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "Easy Start", desc: "Build momentum with foundational concepts & gentle analogies." },
                    { id: "Balanced", desc: "Equal balance of core concept depth and challenging practical drills." },
                    { id: "Challenge Me", desc: "Fast-track into rigorous edge cases, systems design & performance proofs." },
                  ].map((diff) => {
                    const isSel = selectedDifficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setValue("difficultyPreference", diff.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSel
                            ? "bg-amber-500/20 border-amber-500/50 shadow-glow-sm text-amber-300"
                            : "bg-slate-900/50 border-white/[0.08] text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold font-mono text-xs">{diff.id}</div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">{diff.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: 🌐 LANGUAGE PERSONALIZATION & AI TUTOR DEMO                      */}
          {/* ========================================================================= */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/30 border border-cyan-500/30 text-xs font-mono flex items-center justify-between">
                <span className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Languages className="h-4 w-4 text-cyan-400 shrink-0" />
                  Step 5 of 5: Language Personalization & AI Tutor Mode
                </span>
                <Badge variant="cyber" size="sm" className="font-mono text-[9px]">
                  Bilingual Voice AI
                </Badge>
              </div>

              {/* Language Selection Radios */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Select Your AI Tutor Teaching Language <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(["English", "Hindi", "Hinglish", "English + Hindi"] as const).map((lang) => {
                    const isSel = selectedLanguage === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setValue("preferredLanguage", lang)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSel
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-sm"
                            : "bg-slate-900/50 border-white/[0.08] text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold font-mono text-xs">{lang}</div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {lang === "English" && "Pure English"}
                          {lang === "Hindi" && "शुद्ध हिन्दी"}
                          {lang === "Hinglish" && "Natural Indian Hinglish"}
                          {lang === "English + Hindi" && "Dual Concept Translation"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Teaching Demonstration Box */}
              <GlassCard className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Live AI Tutor Teaching Sample ({selectedLanguage})
                  </span>
                  <span className="text-slate-400 text-[10px]">Concept: SQL JOIN</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.05] text-xs leading-relaxed text-slate-200 font-sans">
                  "{languageExamples[selectedLanguage].explanation}"
                </div>

                {/* Simulated Student Query & Response */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Sample Student Query:</span>
                      <span>"{languageExamples[selectedLanguage].query}"</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs font-mono text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                    <Brain className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">AI Tutor Response:</span>
                      <span>"{languageExamples[selectedLanguage].queryResponse}"</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono pt-1">
                  💡 <strong>Note:</strong> You can speak or type in natural mixed queries like <em>"Bhai mujhe SQL JOIN simple example ke saath samjha"</em> anytime!
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              className="gap-2 border-white/10 hover:border-cyan-500/30 text-xs font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous Step
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleNextStep}
              className="gap-2 text-xs font-mono"
            >
              Next Step
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="cyber"
              size="sm"
              disabled={isSubmitting}
              className="gap-2 text-xs font-mono shadow-glow"
            >
              {isSubmitting ? "Generating AI Study Plan..." : "Initialize Learning Profile & Launch"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </form>
    </OnboardingLayout>
  );
}
