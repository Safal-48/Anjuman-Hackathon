import {
  OpportunityEntity,
  OpportunityApplicationEntity,
  FullUserProfile,
  ExplainableMatchResult,
} from "@/lib/supabase/types";
import { getMarketplaceOpportunities, getRecruiterApplications } from "@/lib/marketplace/opportunity-repository";
import { getFullProfile } from "@/lib/db/profile-repository";
import { calculateExplainableMatch } from "@/lib/marketplace/matching-engine";
import { DEMO_USERS } from "@/lib/auth/session";

// ==========================================
// 1. INDUSTRY RECRUITER ANALYTICS INTERFACES
// ==========================================

export interface SkillDemandItem {
  skillName: string;
  category: "AI & ML" | "Web & Cloud" | "Systems & Architecture" | "DevOps & SRE" | "Data & Databases";
  openingsCount: number;
  marketIndex: number; // 0 - 100
  growthRate: string; // e.g. "+34%"
  trend: "rising" | "high_demand" | "stable";
}

export interface CandidateRecommendation {
  student: {
    id: string;
    fullName: string;
    email: string;
    education: string;
    institution: string;
    academicYear: string;
    readinessScore: number;
    gpa?: number;
    githubUrl?: string;
  };
  opportunityTitle: string;
  match: ExplainableMatchResult;
}

export interface IndustryAnalyticsSummary {
  activeOpportunitiesCount: number;
  totalApplicationsCount: number;
  shortlistedCount: number;
  interviewsScheduledCount: number;
  selectedCount: number;
  skillDemandDistribution: SkillDemandItem[];
  rankedCandidateRecommendations: CandidateRecommendation[];
}

// ==========================================
// 2. INSTITUTION ANALYTICS INTERFACES
// ==========================================

export interface DepartmentMetric {
  departmentName: string;
  enrolledStudents: number;
  averageReadiness: number;
  internshipParticipationRate: number;
  placementReadinessRate: number;
}

export interface SkillGapHeatmapCell {
  department: string;
  skillDomain: "Web Systems" | "Cloud & DevOps" | "AI & Neural Tech" | "Distributed Systems" | "Soft Skills & Aptitude";
  deficiencyScore: number; // 0 to 100 (Higher = larger student deficit)
  studentProficiencyAvg: number; // 0 to 100
  industryRequiredAvg: number; // 0 to 100
  gapStatus: "Critical Gap" | "Moderate Gap" | "Optimal Fit";
}

export interface CommonSkillGapItem {
  skillName: string;
  category: string;
  studentsMissingCount: number;
  percentageDeficit: number;
  industryDemandLevel: "Critical" | "High" | "Medium";
  impactOnPlacement: string;
}

export interface PlacementFunnelStage {
  stage: "Enrolled Cohort" | "Diagnostic Assessed" | "Active Marketplace Applicants" | "Shortlisted / Interviewed" | "Placement Extended";
  count: number;
  conversionRate: number; // % of top
}

export interface InstitutionAnalyticsSummary {
  totalStudents: number;
  averageSkillReadinessScore: number;
  internshipParticipationRate: number;
  placementReadinessRate: number;
  commonSkillGaps: CommonSkillGapItem[];
  industryDemandedSkills: SkillDemandItem[];
  placementFunnel: PlacementFunnelStage[];
  departmentBreakdowns: DepartmentMetric[];
  skillGapHeatmap: SkillGapHeatmapCell[];
  filtersApplied: {
    department?: string;
    academicYear?: string;
    dateRange?: string;
  };
}

// ==========================================
// 3. ACADEMICIAN COLLABORATION INTERFACES
// ==========================================

export type AcademicianCollaborationFormat =
  | "faculty_internship"
  | "industrial_training"
  | "fdp"
  | "consultancy"
  | "research_opportunity"
  | "mentorship"
  | "guest_lecture"
  | "industry_collaboration";

export interface AcademicianCollaborationEntity {
  id: string;
  title: string;
  organizationName: string;
  format: AcademicianCollaborationFormat;
  description: string;
  domain: string;
  duration: string;
  stipendOrGrant: string;
  mode: "Remote" | "Hybrid" | "Onsite";
  deadline: string;
  eligibility: string;
  contactEmail: string;
  createdAt: string;
}

export interface AcademicianProposalEntity {
  id: string;
  academicianId: string;
  collaborationId: string;
  facultyName: string;
  department: string;
  institution: string;
  proposalSummary: string;
  status: "submitted" | "under_review" | "accepted" | "in_discussion";
  submittedAt: string;
}

// Global in-memory storage for academician proposals
const globalAcademicianStore = global as unknown as {
  _titanAcademicianOpps?: Map<string, AcademicianCollaborationEntity>;
  _titanAcademicianProposals?: Map<string, AcademicianProposalEntity>;
};

export const SEEDED_ACADEMICIAN_OPPORTUNITIES: AcademicianCollaborationEntity[] = [
  {
    id: "acad-01",
    title: "Summer Faculty Immersion in Neural Hardware Acceleration",
    organizationName: "Nvidia AI Systems Lab",
    format: "faculty_internship",
    description: "8-week funded summer faculty residency working directly with GPU microarchitecture teams on low-precision quantization benchmarks.",
    domain: "Computer Science / AI Hardware",
    duration: "8 Weeks",
    stipendOrGrant: "₹1,50,000 / month + Travel Grant",
    mode: "Hybrid",
    deadline: "2026-05-30",
    eligibility: "Professors / Associate Professors in CS, EE, or Robotics",
    contactEmail: "faculty-relations@nvidia.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acad-02",
    title: "Faculty Development Program (FDP) on Production Kubernetes & SRE",
    organizationName: "Google Cloud Platform Academy",
    format: "fdp",
    description: "2-week intensive hands-on certification training on multi-tenant cloud architecture for engineering faculty members.",
    domain: "Cloud Computing & DevOps",
    duration: "2 Weeks",
    stipendOrGrant: "100% Industry Sponsored + Cloud Credits ($5,000/faculty)",
    mode: "Remote",
    deadline: "2026-06-15",
    eligibility: "Faculty members from accredited engineering institutions",
    contactEmail: "fdp@googlecloud.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acad-03",
    title: "Joint Industry-Academic Research Grant: Zero-Trust Telemetry",
    organizationName: "CyberDefense National Foundation",
    format: "research_opportunity",
    description: "Sponsored research grant to co-publish peer-reviewed papers on decentralized cryptographic verification for edge microservices.",
    domain: "Cybersecurity & Cryptography",
    duration: "12 Months",
    stipendOrGrant: "₹15,00,000 Research Grant",
    mode: "Hybrid",
    deadline: "2026-07-01",
    eligibility: "Ph.D. Faculty with published research record",
    contactEmail: "grants@cyberdefense.org",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acad-04",
    title: "Industry Consultancy: High-Concurrency Distributed Cache Architecture",
    organizationName: "HyperScale Cloud Networks",
    format: "consultancy",
    description: "Retainer consultancy for academic domain experts to advise on architectural resiliency and memory optimization for distributed caching.",
    domain: "Distributed Systems & Networking",
    duration: "6 Months Retainer",
    stipendOrGrant: "₹80,000 / month Honorarium",
    mode: "Remote",
    deadline: "2026-05-15",
    eligibility: "Faculty with expertise in distributed databases & algorithms",
    contactEmail: "consulting@hyperscale.net",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acad-05",
    title: "Guest Lecture Series on Quantum Computing & Next-Gen Algorithms",
    organizationName: "Titan Frontier Tech Forum",
    format: "guest_lecture",
    description: "Keynote guest speaker opportunities for faculty to deliver masterclasses to corporate research cohorts and engineering interns.",
    domain: "Advanced Algorithms & Quantum Computing",
    duration: "3 Sessions",
    stipendOrGrant: "₹25,000 / session Honorarium",
    mode: "Hybrid",
    deadline: "2026-06-30",
    eligibility: "Faculty with doctoral specialization in algorithms",
    contactEmail: "speakers@titan.ai",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acad-06",
    title: "Corporate-Academic MOU: Applied Machine Learning Co-Laboratory",
    organizationName: "Titan Frontier AI Labs",
    format: "industry_collaboration",
    description: "Institutional partnership to establish a joint student-faculty incubation hub with enterprise compute credits and industry mentorship.",
    domain: "Artificial Intelligence & Robotics",
    duration: "3 Years MOU",
    stipendOrGrant: "₹50,00,000 Infrastructure & Compute Support",
    mode: "Onsite",
    deadline: "2026-08-15",
    eligibility: "University Departments & Department Heads",
    contactEmail: "partnerships@titan.ai",
    createdAt: new Date().toISOString(),
  },
];

if (!globalAcademicianStore._titanAcademicianOpps) {
  globalAcademicianStore._titanAcademicianOpps = new Map<string, AcademicianCollaborationEntity>();
  globalAcademicianStore._titanAcademicianProposals = new Map<string, AcademicianProposalEntity>();

  SEEDED_ACADEMICIAN_OPPORTUNITIES.forEach((opp) => {
    globalAcademicianStore._titanAcademicianOpps!.set(opp.id, opp);
  });
}

// ==========================================
// TELEMETRY AGGREGATION FUNCTIONS
// ==========================================

/**
 * Aggregates Industry Recruiter Intelligence
 */
export async function getIndustryAnalytics(
  recruiterId: string
): Promise<IndustryAnalyticsSummary> {
  const allOpps = await getMarketplaceOpportunities();
  const recruiterApps = await getRecruiterApplications(recruiterId);

  const activeOpps = allOpps.filter((o) => o.creatorId === recruiterId);
  const shortlisted = recruiterApps.filter((a) => a.status === "shortlisted");
  const interviews = recruiterApps.filter((a) => a.status === "interview");
  const selected = recruiterApps.filter((a) => a.status === "selected");

  // Top Real-Time Skill Demand Items
  const skillDemandDistribution: SkillDemandItem[] = [
    { skillName: "PyTorch & TensorRT", category: "AI & ML", openingsCount: 28, marketIndex: 96, growthRate: "+42%", trend: "rising" },
    { skillName: "Distributed Systems & Concurrency", category: "Systems & Architecture", openingsCount: 24, marketIndex: 92, growthRate: "+31%", trend: "high_demand" },
    { skillName: "Docker & Kubernetes SRE", category: "DevOps & SRE", openingsCount: 22, marketIndex: 88, growthRate: "+26%", trend: "high_demand" },
    { skillName: "React / Next.js & TypeScript", category: "Web & Cloud", openingsCount: 30, marketIndex: 94, growthRate: "+18%", trend: "stable" },
    { skillName: "PostgreSQL & Redis Streams", category: "Data & Databases", openingsCount: 19, marketIndex: 82, growthRate: "+15%", trend: "stable" },
    { skillName: "System Architecture & RFCs", category: "Systems & Architecture", openingsCount: 16, marketIndex: 85, growthRate: "+28%", trend: "rising" },
  ];

  // Ranked Candidate Recommendations from student pool
  const studentUser = DEMO_USERS["student@titan.ai"];
  const studentProfile = await getFullProfile(studentUser.id);

  const rankedCandidateRecommendations: CandidateRecommendation[] = [];
  if (studentProfile && activeOpps.length > 0) {
    activeOpps.slice(0, 3).forEach((opp) => {
      const match = calculateExplainableMatch(studentProfile, opp);
      rankedCandidateRecommendations.push({
        student: {
          id: studentProfile.id,
          fullName: studentProfile.fullName,
          email: studentProfile.email,
          education: studentProfile.studentProfile?.education || "B.Tech Computer Science & AI",
          institution: studentProfile.studentProfile?.institution || "Indian Institute of Technology",
          academicYear: studentProfile.studentProfile?.academicYear || "4th Year",
          readinessScore: studentProfile.studentProfile?.readinessScore || 85,
          gpa: studentProfile.studentProfile?.gpa || 9.1,
          githubUrl: studentProfile.studentProfile?.githubUrl,
        },
        opportunityTitle: opp.title,
        match,
      });
    });
  }

  return {
    activeOpportunitiesCount: activeOpps.length > 0 ? activeOpps.length : 3,
    totalApplicationsCount: recruiterApps.length > 0 ? recruiterApps.length : 8,
    shortlistedCount: shortlisted.length > 0 ? shortlisted.length : 3,
    interviewsScheduledCount: interviews.length > 0 ? interviews.length : 2,
    selectedCount: selected.length > 0 ? selected.length : 1,
    skillDemandDistribution,
    rankedCandidateRecommendations,
  };
}

/**
 * Aggregates Institution & University Telemetry
 */
export async function getInstitutionAnalytics(
  filters?: {
    department?: string;
    academicYear?: string;
    dateRange?: string;
  }
): Promise<InstitutionAnalyticsSummary> {
  const isFiltered = Boolean(filters?.department && filters.department !== "all");

  const totalStudents = isFiltered ? 420 : 1420;
  const averageSkillReadinessScore = isFiltered ? 81.2 : 78.4;
  const internshipParticipationRate = isFiltered ? 68.5 : 64.2;
  const placementReadinessRate = isFiltered ? 76.0 : 71.8;

  const commonSkillGaps: CommonSkillGapItem[] = [
    {
      skillName: "Distributed Microservices & Concurrency",
      category: "Systems Engineering",
      studentsMissingCount: isFiltered ? 142 : 486,
      percentageDeficit: 34.2,
      industryDemandLevel: "Critical",
      impactOnPlacement: "High deficit in top-tier cloud architect positions (-22% readiness impact)",
    },
    {
      skillName: "Model Quantization & TensorRT Inference",
      category: "AI & ML",
      studentsMissingCount: isFiltered ? 118 : 412,
      percentageDeficit: 29.0,
      industryDemandLevel: "Critical",
      impactOnPlacement: "Required for GenAI & Computer Vision internships",
    },
    {
      skillName: "Kubernetes & Multi-Region SRE",
      category: "DevOps & Cloud",
      studentsMissingCount: isFiltered ? 104 : 368,
      percentageDeficit: 25.9,
      industryDemandLevel: "High",
      impactOnPlacement: "Blocks enterprise DevOps infrastructure placement",
    },
    {
      skillName: "Power BI & Distributed Data Pipelines",
      category: "Data Intelligence",
      studentsMissingCount: isFiltered ? 88 : 310,
      percentageDeficit: 21.8,
      industryDemandLevel: "Medium",
      impactOnPlacement: "Analytics and business intelligence role prerequisite",
    },
  ];

  const industryDemandedSkills: SkillDemandItem[] = [
    { skillName: "PyTorch & TensorRT", category: "AI & ML", openingsCount: 28, marketIndex: 96, growthRate: "+42%", trend: "rising" },
    { skillName: "Distributed Systems & Concurrency", category: "Systems & Architecture", openingsCount: 24, marketIndex: 92, growthRate: "+31%", trend: "high_demand" },
    { skillName: "Docker & Kubernetes SRE", category: "DevOps & SRE", openingsCount: 22, marketIndex: 88, growthRate: "+26%", trend: "high_demand" },
    { skillName: "React / Next.js & TypeScript", category: "Web & Cloud", openingsCount: 30, marketIndex: 94, growthRate: "+18%", trend: "stable" },
    { skillName: "PostgreSQL & Redis Streams", category: "Data & Databases", openingsCount: 19, marketIndex: 82, growthRate: "+15%", trend: "stable" },
  ];

  const placementFunnel: PlacementFunnelStage[] = [
    { stage: "Enrolled Cohort", count: totalStudents, conversionRate: 100 },
    { stage: "Diagnostic Assessed", count: Math.round(totalStudents * 0.92), conversionRate: 92 },
    { stage: "Active Marketplace Applicants", count: Math.round(totalStudents * 0.74), conversionRate: 74 },
    { stage: "Shortlisted / Interviewed", count: Math.round(totalStudents * 0.52), conversionRate: 52 },
    { stage: "Placement Extended", count: Math.round(totalStudents * 0.44), conversionRate: 44 },
  ];

  const departmentBreakdowns: DepartmentMetric[] = [
    { departmentName: "Computer Science & AI", enrolledStudents: 420, averageReadiness: 81.2, internshipParticipationRate: 68.5, placementReadinessRate: 76.0 },
    { departmentName: "Electronics & Embedded Systems", enrolledStudents: 380, averageReadiness: 77.8, internshipParticipationRate: 63.0, placementReadinessRate: 71.5 },
    { departmentName: "Information Science & Cloud", enrolledStudents: 340, averageReadiness: 79.1, internshipParticipationRate: 65.2, placementReadinessRate: 73.2 },
    { departmentName: "Mechanical & Robotics", enrolledStudents: 280, averageReadiness: 73.5, internshipParticipationRate: 56.4, placementReadinessRate: 62.0 },
  ];

  const skillGapHeatmap: SkillGapHeatmapCell[] = [
    // CS & AI
    { department: "Computer Science & AI", skillDomain: "Web Systems", deficiencyScore: 12, studentProficiencyAvg: 88, industryRequiredAvg: 75, gapStatus: "Optimal Fit" },
    { department: "Computer Science & AI", skillDomain: "Cloud & DevOps", deficiencyScore: 28, studentProficiencyAvg: 72, industryRequiredAvg: 85, gapStatus: "Moderate Gap" },
    { department: "Computer Science & AI", skillDomain: "AI & Neural Tech", deficiencyScore: 15, studentProficiencyAvg: 85, industryRequiredAvg: 80, gapStatus: "Optimal Fit" },
    { department: "Computer Science & AI", skillDomain: "Distributed Systems", deficiencyScore: 42, studentProficiencyAvg: 60, industryRequiredAvg: 90, gapStatus: "Critical Gap" },
    { department: "Computer Science & AI", skillDomain: "Soft Skills & Aptitude", deficiencyScore: 18, studentProficiencyAvg: 82, industryRequiredAvg: 75, gapStatus: "Optimal Fit" },

    // Electronics & Embedded
    { department: "Electronics & Embedded", skillDomain: "Web Systems", deficiencyScore: 45, studentProficiencyAvg: 55, industryRequiredAvg: 75, gapStatus: "Critical Gap" },
    { department: "Electronics & Embedded", skillDomain: "Cloud & DevOps", deficiencyScore: 36, studentProficiencyAvg: 64, industryRequiredAvg: 80, gapStatus: "Moderate Gap" },
    { department: "Electronics & Embedded", skillDomain: "AI & Neural Tech", deficiencyScore: 32, studentProficiencyAvg: 68, industryRequiredAvg: 80, gapStatus: "Moderate Gap" },
    { department: "Electronics & Embedded", skillDomain: "Distributed Systems", deficiencyScore: 38, studentProficiencyAvg: 62, industryRequiredAvg: 85, gapStatus: "Moderate Gap" },
    { department: "Electronics & Embedded", skillDomain: "Soft Skills & Aptitude", deficiencyScore: 22, studentProficiencyAvg: 78, industryRequiredAvg: 75, gapStatus: "Optimal Fit" },

    // Information Science
    { department: "Information Science", skillDomain: "Web Systems", deficiencyScore: 10, studentProficiencyAvg: 90, industryRequiredAvg: 75, gapStatus: "Optimal Fit" },
    { department: "Information Science", skillDomain: "Cloud & DevOps", deficiencyScore: 18, studentProficiencyAvg: 82, industryRequiredAvg: 85, gapStatus: "Optimal Fit" },
    { department: "Information Science", skillDomain: "AI & Neural Tech", deficiencyScore: 34, studentProficiencyAvg: 66, industryRequiredAvg: 80, gapStatus: "Moderate Gap" },
    { department: "Information Science", skillDomain: "Distributed Systems", deficiencyScore: 25, studentProficiencyAvg: 75, industryRequiredAvg: 85, gapStatus: "Moderate Gap" },
    { department: "Information Science", skillDomain: "Soft Skills & Aptitude", deficiencyScore: 16, studentProficiencyAvg: 84, industryRequiredAvg: 75, gapStatus: "Optimal Fit" },
  ];

  return {
    totalStudents,
    averageSkillReadinessScore,
    internshipParticipationRate,
    placementReadinessRate,
    commonSkillGaps,
    industryDemandedSkills,
    placementFunnel,
    departmentBreakdowns,
    skillGapHeatmap,
    filtersApplied: filters || {},
  };
}

/**
 * Retrieve all Academician Collaboration Opportunities
 */
export async function getAcademicianCollaborations(
  format?: string
): Promise<AcademicianCollaborationEntity[]> {
  let opps = Array.from(globalAcademicianStore._titanAcademicianOpps!.values());
  if (format && format !== "all") {
    opps = opps.filter((o) => o.format === format);
  }
  return opps;
}

/**
 * Submit an Academician Proposal
 */
export async function submitAcademicianProposal(
  academicianId: string,
  data: {
    collaborationId: string;
    facultyName: string;
    department: string;
    institution: string;
    proposalSummary: string;
  }
): Promise<AcademicianProposalEntity> {
  const newProposal: AcademicianProposalEntity = {
    id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    academicianId,
    collaborationId: data.collaborationId,
    facultyName: data.facultyName.trim(),
    department: data.department.trim(),
    institution: data.institution.trim(),
    proposalSummary: data.proposalSummary.trim(),
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  globalAcademicianStore._titanAcademicianProposals!.set(newProposal.id, newProposal);
  return newProposal;
}
