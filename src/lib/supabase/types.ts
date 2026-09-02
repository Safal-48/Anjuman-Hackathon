export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type AchievementCategory = "hackathon" | "award" | "publication" | "competition" | "patent" | "other";

export type DocumentType = "resume" | "certificate" | "transcript" | "portfolio_doc" | "other";

export type QuestionCategory = "technical" | "soft_skill" | "aptitude" | "career_interest";

export type QuestionType = "single_choice" | "multiple_choice" | "likert_scale";

export type SkillGapCategory = "Strong" | "Good" | "Needs Improvement" | "Critical Gap";

export type OpportunityType =
  | "internship"
  | "job"
  | "industry_project"
  | "apprenticeship"
  | "training_program"
  | "workshop"
  | "mentorship";

export type LocationType = "remote" | "hybrid" | "onsite";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "selected"
  | "rejected";

export type NotificationType =
  | "application_status"
  | "opportunity_match"
  | "recruiter_action"
  | "system";

export interface QuestionOption {
  id: string;
  text: string;
  scoreWeight: number; // 0 to 1
  isCorrect?: boolean;
}

export interface AssessmentQuestion {
  id: string;
  category: QuestionCategory;
  skillTag: string;
  subTopic?: string;
  difficulty: "easy" | "medium" | "hard";
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[];
  explanation?: string;
  displayOrder: number;
}

export interface AssessmentSession {
  id: string;
  userId: string;
  status: "in_progress" | "completed" | "abandoned";
  currentQuestionIndex: number;
  responses: Record<string, string>; // questionId -> optionId
  startedAt: string;
  completedAt?: string;
}

export interface TopicMasteryBreakdown {
  skillName: string;
  topicName: string;
  score: number; // 0 to 100
  status: "Mastered" | "Proficient" | "Needs Attention" | "Critical Gap";
  questionsCount: number;
  correctCount: number;
  priority: "High" | "Medium" | "Low";
}

export interface RecurringMistakePattern {
  id: string;
  patternName: string;
  affectedTopics: string[];
  mistakeFrequency: number;
  explanation: string;
  remedyAction: string;
}

export interface SkillScoreBreakdown {
  skillName: string;
  category: string;
  score: number; // 0 to 100
  level: SkillLevel;
  strengthType: "strong" | "moderate" | "weak";
}

export interface TargetRoleBenchmark {
  id: string;
  title: string;
  description: string;
  requiredReadinessScore: number;
  requiredSkills: Array<{
    skillName: string;
    category: string;
    requiredScore: number;
    weight: number;
  }>;
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  studentScore: number;
  requiredScore: number;
  gapDifference: number; // requiredScore - studentScore
  gapCategory: SkillGapCategory;
  recommendation: string;
}

export interface DiagnosticInsight {
  strongAreas: Array<{ topic: string; score: number; rationale: string }>;
  weakAreas: Array<{ topic: string; score: number; deficit: number; rationale: string }>;
  criticalGaps: Array<{ topic: string; score: number; deficit: number; immediateAction: string }>;
  recurringMistakes: RecurringMistakePattern[];
  immediateAttentionTopics: Array<{ topic: string; urgency: "Immediate" | "High"; remedialResourceUrl: string }>;
}

export interface SkillIntelligenceReport {
  id: string;
  userId: string;
  sessionId?: string;
  overallReadinessScore: number;
  technicalScore: number;
  softSkillScore: number;
  aptitudeScore: number;
  careerAlignmentScore: number;
  skillBreakdowns: SkillScoreBreakdown[];
  topicBreakdowns?: TopicMasteryBreakdown[];
  diagnosticInsights?: DiagnosticInsight;
  strongSkills: SkillScoreBreakdown[];
  weakSkills: SkillScoreBreakdown[];
  targetRole: TargetRoleBenchmark;
  skillGaps: SkillGapItem[];
  evaluatedAt: string;
}

export interface ExplainableMatchResult {
  overallScore: number; // 0 - 100
  strongSkills: string[]; // ✓ skills
  partialSkills: string[]; // ⚠ skills
  gapSkills: string[]; // ✗ missing skills
  factorBreakdown: {
    skillMatch: number; // 0 - 100
    eligibilityMatch: number; // 0 - 100
    careerMatch: number; // 0 - 100
    experienceMatch: number; // 0 - 100
  };
  reasoningSummary: string;
}

export interface OpportunityEntity {
  id: string;
  creatorId: string;
  organizationName: string;
  title: string;
  opportunityType: OpportunityType;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  eligibility: string;
  minGpa?: number;
  experienceRequired: string;
  location: string;
  locationType: LocationType;
  stipendSalary: string;
  duration: string;
  deadline: string;
  openingsCount: number;
  status: "active" | "closed" | "draft";
  createdAt: string;
  updatedAt: string;
  matchResult?: ExplainableMatchResult;
}

export interface OpportunityApplicationEntity {
  id: string;
  opportunityId: string;
  studentId: string;
  status: ApplicationStatus;
  coverNote?: string;
  matchScore: number;
  matchBreakdown: ExplainableMatchResult;
  appliedAt: string;
  updatedAt: string;
  opportunity?: OpportunityEntity;
  studentName?: string;
  studentEmail?: string;
  studentInstitution?: string;
}

export interface UserNotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface StudentSkillEntity {
  id: string;
  studentId: string;
  skillName: string;
  category?: string;
  level: SkillLevel;
  proficiencyScore: number;
  isVerified: boolean;
  createdAt: string;
}

export interface ProjectEntity {
  id: string;
  userId: string;
  title: string;
  summary: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationEntity {
  id: string;
  userId: string;
  title: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
}

export interface AchievementEntity {
  id: string;
  userId: string;
  title: string;
  category: AchievementCategory;
  description: string;
  dateAchieved?: string;
  proofUrl?: string;
  createdAt: string;
}

export interface DocumentEntity {
  id: string;
  userId: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSizeBytes?: number;
  mimeType?: string;
  createdAt: string;
}

export interface FullUserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  location?: string;
  role: "student" | "industry" | "academician" | "institution" | "admin";
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
  studentProfile?: {
    education: string;
    institution: string;
    academicYear: string;
    gpa?: number;
    careerGoal?: string;
    experienceSummary?: string;
    readinessScore: number;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  };
  industryProfile?: {
    organizationName: string;
    industryDomain: string;
    organizationSize: string;
    organizationDescription: string;
    website: string;
    recruiterName: string;
    recruiterDesignation: string;
    recruiterEmail: string;
    hiringInterests?: string[];
  };
  academicianProfile?: {
    institution: string;
    department: string;
    designation: string;
    experienceYears: number;
    scholarProfile?: string;
    expertise?: string[];
    researchInterests?: string[];
  };
  institutionProfile?: {
    institutionName: string;
    institutionType: string;
    registrationCode: string;
    address: string;
    city: string;
    state: string;
    representativeName: string;
    representativeDesignation: string;
    representativeEmail: string;
  };
  skills: StudentSkillEntity[];
  projects: ProjectEntity[];
  certifications: CertificationEntity[];
  achievements: AchievementEntity[];
  documents: DocumentEntity[];
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          location: string | null;
          role: string;
          is_onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          role: string;
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          role?: string;
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunities: {
        Row: {
          id: string;
          creator_id: string;
          organization_name: string;
          title: string;
          opportunity_type: string;
          description: string;
          required_skills: Json;
          preferred_skills: Json;
          eligibility: string;
          min_gpa: number | null;
          experience_required: string;
          location: string;
          location_type: string;
          stipend_salary: string;
          duration: string;
          deadline: string;
          openings_count: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          organization_name: string;
          title: string;
          opportunity_type: string;
          description: string;
          required_skills?: Json;
          preferred_skills?: Json;
          eligibility: string;
          min_gpa?: number | null;
          experience_required?: string;
          location: string;
          location_type?: string;
          stipend_salary: string;
          duration: string;
          deadline: string;
          openings_count?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          organization_name?: string;
          title?: string;
          opportunity_type?: string;
          description?: string;
          required_skills?: Json;
          preferred_skills?: Json;
          eligibility?: string;
          min_gpa?: number | null;
          experience_required?: string;
          location?: string;
          location_type?: string;
          stipend_salary?: string;
          duration?: string;
          deadline?: string;
          openings_count?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunity_applications: {
        Row: {
          id: string;
          opportunity_id: string;
          student_id: string;
          status: string;
          cover_note: string | null;
          match_score: number;
          match_breakdown: Json;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          student_id: string;
          status?: string;
          cover_note?: string | null;
          match_score?: number;
          match_breakdown?: Json;
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          student_id?: string;
          status?: string;
          cover_note?: string | null;
          match_score?: number;
          match_breakdown?: Json;
          applied_at?: string;
          updated_at?: string;
        };
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          link_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          link_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          link_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// ============================================================================
// Employability & Mentorship Interfaces (SIH Problem 26044)
// ============================================================================

export type CredentialType =
  | "skill"
  | "project"
  | "certification"
  | "internship"
  | "achievement"
  | "document";

export type VerificationStatus = "verified" | "pending" | "rejected";

export interface CredentialVerificationEntity {
  id: string;
  credentialType: CredentialType;
  credentialId: string;
  studentId: string;
  verifierId: string;
  verifierRole: string;
  verificationStatus: VerificationStatus;
  verificationBadge: string;
  verificationHash: string;
  verifierNotes?: string;
  verifiedAt: string;
  createdAt: string;
}

export interface StudentInternshipEntity {
  id: string;
  studentId: string;
  companyName: string;
  roleTitle: string;
  location: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  description: string;
  technologies: string[];
  proofUrl?: string;
  isVerified: boolean;
  verifierInstitution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfileEntity {
  id: string;
  userId: string;
  mentorName: string;
  currentTitle: string;
  companyOrInstitution: string;
  expertiseAreas: string[];
  yearsOfExperience: number;
  bio: string;
  hourlyRateOrFree: string;
  availableSlots: string[];
  rating: number;
  totalSessionsConducted: number;
  avatarUrl?: string;
  createdAt: string;
}

export type MentorshipStatus =
  | "pending"
  | "accepted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "rejected";

export interface MentorshipSessionEntity {
  id: string;
  studentId: string;
  studentName?: string;
  mentorId: string;
  mentorName?: string;
  mentorTitle?: string;
  mentorCompany?: string;
  topic: string;
  goalDescription: string;
  status: MentorshipStatus;
  scheduledAt?: string;
  meetingLink?: string;
  mentorNotes?: string;
  feedbackRating?: number;
  feedbackComment?: string;
  milestones: Array<{
    title: string;
    completed: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationEventEntity {
  id: string;
  title: string;
  type: "workshop" | "guest_lecture" | "live_project" | "research_collaboration";
  hostOrganization: string;
  hostSpeaker: string;
  date: string;
  time: string;
  mode: "Virtual (Live)" | "Hybrid" | "In-Person Campus";
  seatsAvailable: number;
  topicsCovered: string[];
  actionCta: string;
}

export interface DigitalPortfolioSummary {
  student: FullUserProfile;
  verifiedCount: number;
  selfDeclaredCount: number;
  verificationIntegrityScore: number;
  skills: Array<StudentSkillEntity & { isVerified: boolean; verifierBadge?: string }>;
  projects: Array<ProjectEntity & { isVerified: boolean; verifierBadge?: string }>;
  certifications: Array<CertificationEntity & { isVerified: boolean; verifierBadge?: string }>;
  internships: Array<StudentInternshipEntity & { isVerified: boolean; verifierBadge?: string }>;
  achievements: Array<AchievementEntity & { isVerified: boolean; verifierBadge?: string }>;
  documents: Array<DocumentEntity & { isVerified: boolean; verifierBadge?: string }>;
}

