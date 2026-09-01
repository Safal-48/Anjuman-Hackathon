export type UserRole = "student" | "industry" | "academician" | "institution" | "admin";

export type PublicRole = "student" | "industry" | "academician" | "institution";

export interface StudentProfileData {
  fullName: string;
  education: string;
  institution: string;
  academicYear: string;
  skills: string[];
  interests: string[];
  careerGoal: string;
  experience?: string;
  projects?: Array<{
    title?: string;
    description?: string;
    link?: string;
  }>;
  certifications?: string[];
  readinessScore?: number;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
}

export interface IndustryProfileData {
  organizationName: string;
  industryDomain: string;
  organizationSize: string;
  organizationDescription: string;
  website: string;
  recruiterName: string;
  recruiterDesignation: string;
  recruiterEmail: string;
  hiringInterests: string[];
}

export interface AcademicianProfileData {
  institution: string;
  department: string;
  designation: string;
  expertise: string[];
  experienceYears: number;
  researchInterests: string[];
  scholarProfile?: string;
}

export interface InstitutionProfileData {
  institutionName: string;
  institutionType: "university" | "autonomous_college" | "affiliated_college" | "research_institute" | "other";
  registrationCode: string;
  address: string;
  city: string;
  state: string;
  representativeName: string;
  representativeDesignation: string;
  representativeEmail: string;
}

export type RoleOnboardingData =
  | { role: "student"; data: StudentProfileData }
  | { role: "industry"; data: IndustryProfileData }
  | { role: "academician"; data: AcademicianProfileData }
  | { role: "institution"; data: InstitutionProfileData }
  | { role: "admin"; data: Record<string, unknown> };

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isOnboarded: boolean;
  location?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  studentProfile?: StudentProfileData;
  industryProfile?: IndustryProfileData;
  academicianProfile?: AcademicianProfileData;
  institutionProfile?: InstitutionProfileData;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
  message?: string;
}
