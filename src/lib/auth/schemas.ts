import { z } from "zod";

export const publicRoles = ["student", "industry", "academician", "institution"] as const;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(publicRoles, {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms of service to register",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const studentOnboardingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  education: z.string().min(2, "Education level/degree is required (e.g. B.Tech Computer Science)"),
  institution: z.string().min(2, "Institution/University name is required"),
  academicYear: z.string().min(1, "Academic year is required (e.g. 3rd Year)"),
  skills: z.array(z.string()).min(1, "Select or add at least 1 technical skill"),
  interests: z.array(z.string()).min(1, "Add at least 1 field of interest"),
  careerGoal: z.string().min(10, "Career goal must be at least 10 characters"),
  experience: z.string().min(5, "Summarize your background or experience level (e.g. Fresher, 1 internship)"),
  projects: z
    .array(
      z.object({
        title: z.string().min(2, "Project title is required"),
        description: z.string().min(10, "Project description must be at least 10 characters"),
        link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      })
    )
    .min(1, "Please provide at least 1 key project"),
  certifications: z.array(z.string()),
  resumeUrl: z.string().optional(),
  resumeFileName: z.string().optional(),
});

export type StudentOnboardingInput = z.infer<typeof studentOnboardingSchema>;

export const industryOnboardingSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  industryDomain: z.string().min(2, "Industry domain is required (e.g. Artificial Intelligence, Cloud, FinTech)"),
  organizationSize: z.string().min(1, "Please specify organization size"),
  organizationDescription: z.string().min(20, "Organization description must be at least 20 characters"),
  website: z.string().url("Please enter a valid company website URL"),
  recruiterName: z.string().min(2, "Recruiter or contact person name is required"),
  recruiterDesignation: z.string().min(2, "Designation/Title is required"),
  recruiterEmail: z.string().email("Please enter a valid official work email"),
  hiringInterests: z.array(z.string()).min(1, "Select at least 1 talent domain interest"),
});

export type IndustryOnboardingInput = z.infer<typeof industryOnboardingSchema>;

export const academicianOnboardingSchema = z.object({
  institution: z.string().min(2, "Institution / University affiliation is required"),
  department: z.string().min(2, "Department name is required (e.g. Computer Science & Engineering)"),
  designation: z.string().min(2, "Designation is required (e.g. Associate Professor, Head of Research)"),
  expertise: z.array(z.string()).min(1, "List at least 1 primary domain of expertise"),
  experienceYears: z.coerce.number().min(0, "Years of experience must be 0 or greater"),
  researchInterests: z.array(z.string()).min(1, "List at least 1 research area"),
  scholarProfile: z.string().url("Must be a valid profile URL").optional().or(z.literal("")),
});

export type AcademicianOnboardingInput = z.infer<typeof academicianOnboardingSchema>;

export const institutionOnboardingSchema = z.object({
  institutionName: z.string().min(2, "Institution name is required"),
  institutionType: z.enum(["university", "autonomous_college", "affiliated_college", "research_institute", "other"], {
    errorMap: () => ({ message: "Please select institution type" }),
  }),
  registrationCode: z.string().min(2, "AISHE / University registration code is required"),
  address: z.string().min(5, "Campus address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  representativeName: z.string().min(2, "Authorized representative name is required"),
  representativeDesignation: z.string().min(2, "Representative designation is required (e.g. Dean of Academics)"),
  representativeEmail: z.string().email("Authorized official email is required"),
});

export type InstitutionOnboardingInput = z.infer<typeof institutionOnboardingSchema>;
