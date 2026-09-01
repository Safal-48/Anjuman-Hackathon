/**
 * KaushalSetu Candidate Intelligence Engine for Recruiters
 * Provides explainable match scoring, binary eligibility auditing,
 * privacy-safe profile masking, and opportunity requirement customization.
 */

export interface OpportunityRequirementConfig {
  id: string;
  roleTitle: string;
  department: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minEducation: string;
  minGraduationYear: number;
  maxExperienceYears: number;
  minResumeReadinessThreshold: number; // e.g. 70%
  minAssessmentScoreThreshold: number; // e.g. 75%
}

export interface CandidatePrivacyConsent {
  shareContactInfo: boolean;
  shareInterviewTelemetry: boolean;
  shareGDTelemetry: boolean;
  shareResumeFile: boolean;
  shareProjectRepos: boolean;
}

export interface CandidateProfile {
  id: string;
  candidateAlias: string; // Used if contact info is protected
  realName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  graduationYear: number;
  experienceLevel: "Fresher (0-1 yrs)" | "Intern (1-2 yrs)" | "Associate (2+ yrs)";
  privacyConsent: CandidatePrivacyConsent;

  // Multi-Pillar Metrics
  overallReadinessScore: number;
  resumeReadinessScore: number;
  verifiedSkills: Array<{ name: string; score: number; level: string; verified: boolean }>;
  projects: Array<{
    title: string;
    techStack: string[];
    verifiedProvenance: boolean;
    repoCommitCount: number;
    impactSummary: string;
    demoUrl?: string;
  }>;
  certifications: string[];
  mockInterviewScore?: number;
  gdScore?: number;
  assessmentEvidenceScore: number;
  roleAlignmentScore: number;
  targetRole: string;
}

export interface CandidateEvaluationResult {
  candidate: CandidateProfile;
  requirements: OpportunityRequirementConfig;

  // Match Score (Continuous 0-100%)
  explainableMatchScore: number;
  matchedSkills: string[];
  preferredSkillsMatched: string[];
  skillGaps: string[];
  resumeReadiness: number;
  projectEvidenceScore: number;
  assessmentScore: number;
  interviewReadiness?: number;
  roleAlignment: number;

  // Eligibility Criteria (Binary Pass/Fail)
  eligibility: {
    isOverallEligible: boolean;
    educationEligible: boolean;
    requiredSkillsEligible: boolean;
    resumeThresholdEligible: boolean;
    assessmentThresholdEligible: boolean;
    unmetRequirements: string[];
    eligibilityBadge: "Eligible for Technical Review" | "Conditional Review" | "Does Not Meet Criteria";
  };
}

// ============================================================================
// DEFAULT OPPORTUNITY REQUIREMENTS
// ============================================================================
export const DEFAULT_OPPORTUNITY_REQUIREMENTS: OpportunityRequirementConfig[] = [
  {
    id: "req-cloud-ai",
    roleTitle: "Associate Cloud Systems & AI Engineer",
    department: "Platform Engineering",
    requiredSkills: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
    preferredSkills: ["Kubernetes", "Redis", "Python", "GraphQL"],
    minEducation: "B.Tech / B.E in CS / AI / IT",
    minGraduationYear: 2026,
    maxExperienceYears: 1,
    minResumeReadinessThreshold: 75,
    minAssessmentScoreThreshold: 80,
  },
  {
    id: "req-data-analyst",
    roleTitle: "Enterprise Data & Telemetry Specialist",
    department: "Data Intelligence",
    requiredSkills: ["SQL", "Python", "Data Analysis"],
    preferredSkills: ["Power BI", "Tableau", "DAX", "Docker"],
    minEducation: "B.Tech / B.Sc in CS / Data / Stats",
    minGraduationYear: 2026,
    maxExperienceYears: 2,
    minResumeReadinessThreshold: 70,
    minAssessmentScoreThreshold: 75,
  },
  {
    id: "req-fullstack-intern",
    roleTitle: "Full-Stack Platform Engineering Intern",
    department: "Product Engineering",
    requiredSkills: ["React", "TypeScript", "Node.js"],
    preferredSkills: ["Tailwind CSS", "PostgreSQL", "REST APIs"],
    minEducation: "Enrolled in B.Tech / BCA / MCA",
    minGraduationYear: 2027,
    maxExperienceYears: 0,
    minResumeReadinessThreshold: 70,
    minAssessmentScoreThreshold: 70,
  },
];

// ============================================================================
// CANDIDATE TALENT POOL (PRE-SCREENED VERIFIED CANDIDATES)
// ============================================================================
export const CANDIDATE_TALENT_POOL: CandidateProfile[] = [
  {
    id: "cand-safal-01",
    candidateAlias: "Candidate #KS-8492",
    realName: "Safal Sharma",
    email: "safal.sharma@iitbhu.ac.in",
    phone: "+91 98765 43210",
    college: "Indian Institute of Technology (BHU) Varanasi",
    degree: "B.Tech in Computer Science & Artificial Intelligence",
    graduationYear: 2026,
    experienceLevel: "Fresher (0-1 yrs)",
    privacyConsent: {
      shareContactInfo: true,
      shareInterviewTelemetry: true,
      shareGDTelemetry: true,
      shareResumeFile: true,
      shareProjectRepos: true,
    },
    overallReadinessScore: 84,
    resumeReadinessScore: 82,
    verifiedSkills: [
      { name: "Next.js", score: 94, level: "Expert", verified: true },
      { name: "TypeScript", score: 92, level: "Expert", verified: true },
      { name: "PostgreSQL", score: 88, level: "Advanced", verified: true },
      { name: "Docker", score: 85, level: "Intermediate", verified: true },
      { name: "Python", score: 82, level: "Intermediate", verified: true },
      { name: "SQL", score: 86, level: "Advanced", verified: true },
      { name: "Data Analysis", score: 80, level: "Intermediate", verified: true },
      { name: "REST APIs", score: 90, level: "Expert", verified: true },
    ],
    projects: [
      {
        title: "KaushalSetu AI Intelligence Suite",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        verifiedProvenance: true,
        repoCommitCount: 148,
        impactSummary: "Built multi-agent mock interview, ATS resume parsing, and 7-vector GD simulator.",
        demoUrl: "https://kaushalsetu.gov.in",
      },
      {
        title: "Distributed Stream Ingestion Engine",
        techStack: ["Node.js", "Redis Pub/Sub", "Docker", "PostgreSQL"],
        verifiedProvenance: true,
        repoCommitCount: 92,
        impactSummary: "Benchmarked 12,000 req/sec with sub-15ms p99 latency.",
      },
    ],
    certifications: ["AWS Certified Cloud Practitioner", "Meta Front-End Professional"],
    mockInterviewScore: 86,
    gdScore: 78,
    assessmentEvidenceScore: 88,
    roleAlignmentScore: 89,
    targetRole: "Full-Stack AI & Cloud Systems Engineer",
  },
  {
    id: "cand-ananya-02",
    candidateAlias: "Candidate #KS-7219",
    realName: "Ananya Verma",
    email: "ananya.v@dtu.ac.in",
    phone: "+91 91234 56789",
    college: "Delhi Technological University (DTU)",
    degree: "B.Tech in Information Technology",
    graduationYear: 2026,
    experienceLevel: "Fresher (0-1 yrs)",
    privacyConsent: {
      shareContactInfo: false, // Masked contact info for privacy
      shareInterviewTelemetry: true,
      shareGDTelemetry: true,
      shareResumeFile: true,
      shareProjectRepos: true,
    },
    overallReadinessScore: 88,
    resumeReadinessScore: 86,
    verifiedSkills: [
      { name: "SQL", score: 92, level: "Expert", verified: true },
      { name: "Python", score: 90, level: "Expert", verified: true },
      { name: "Data Analysis", score: 88, level: "Advanced", verified: true },
      { name: "Power BI", score: 86, level: "Advanced", verified: true },
      { name: "Tableau", score: 84, level: "Advanced", verified: true },
      { name: "PostgreSQL", score: 82, level: "Intermediate", verified: true },
    ],
    projects: [
      {
        title: "Enterprise Sales & Churn Analytics Suite",
        techStack: ["Python", "SQL", "Power BI", "Pandas"],
        verifiedProvenance: true,
        repoCommitCount: 115,
        impactSummary: "Automated ETL pipeline analyzing 4.2M transactional records with DAX metrics.",
      },
    ],
    certifications: ["Microsoft Certified: Power BI Data Analyst Associate (PL-300)"],
    mockInterviewScore: 84,
    gdScore: 85,
    assessmentEvidenceScore: 90,
    roleAlignmentScore: 94,
    targetRole: "Enterprise Data & Telemetry Specialist",
  },
  {
    id: "cand-rohan-03",
    candidateAlias: "Candidate #KS-9104",
    realName: "Rohan Iyer",
    email: "rohan.iyer@bits-pilani.ac.in",
    phone: "+91 98111 22334",
    college: "BITS Pilani",
    degree: "B.Tech in Computer Science",
    graduationYear: 2026,
    experienceLevel: "Intern (1-2 yrs)",
    privacyConsent: {
      shareContactInfo: true,
      shareInterviewTelemetry: true,
      shareGDTelemetry: false,
      shareResumeFile: true,
      shareProjectRepos: true,
    },
    overallReadinessScore: 91,
    resumeReadinessScore: 89,
    verifiedSkills: [
      { name: "Next.js", score: 95, level: "Expert", verified: true },
      { name: "TypeScript", score: 94, level: "Expert", verified: true },
      { name: "Kubernetes", score: 88, level: "Advanced", verified: true },
      { name: "Docker", score: 90, level: "Expert", verified: true },
      { name: "Redis", score: 86, level: "Advanced", verified: true },
      { name: "PostgreSQL", score: 90, level: "Expert", verified: true },
    ],
    projects: [
      {
        title: "Kubernetes Microservices Mesh & Ingress",
        techStack: ["Kubernetes", "Helm", "Go", "Docker"],
        verifiedProvenance: true,
        repoCommitCount: 210,
        impactSummary: "Deployed zero-downtime blue/green deployment controller.",
      },
    ],
    certifications: ["Certified Kubernetes Application Developer (CKAD)"],
    mockInterviewScore: 92,
    assessmentEvidenceScore: 93,
    roleAlignmentScore: 96,
    targetRole: "Cloud Platform Systems Engineer",
  },
  {
    id: "cand-priya-04",
    candidateAlias: "Candidate #KS-3351",
    realName: "Priya Nair",
    email: "priya.nair@nitk.edu.in",
    phone: "+91 94455 66778",
    college: "National Institute of Technology Karnataka (NITK) Surathkal",
    degree: "B.Tech in Electronics & Communication",
    graduationYear: 2026,
    experienceLevel: "Fresher (0-1 yrs)",
    privacyConsent: {
      shareContactInfo: false,
      shareInterviewTelemetry: false,
      shareGDTelemetry: true,
      shareResumeFile: true,
      shareProjectRepos: true,
    },
    overallReadinessScore: 76,
    resumeReadinessScore: 72,
    verifiedSkills: [
      { name: "React", score: 82, level: "Intermediate", verified: true },
      { name: "TypeScript", score: 78, level: "Intermediate", verified: true },
      { name: "Node.js", score: 80, level: "Intermediate", verified: true },
      { name: "Tailwind CSS", score: 85, level: "Advanced", verified: true },
    ],
    projects: [
      {
        title: "Real-time Collaborative Task Board",
        techStack: ["React", "TypeScript", "Node.js", "Socket.io"],
        verifiedProvenance: true,
        repoCommitCount: 65,
        impactSummary: "Built live multi-user whiteboard with WebSockets.",
      },
    ],
    certifications: ["Meta Front-End Developer Certificate"],
    assessmentEvidenceScore: 75,
    roleAlignmentScore: 78,
    targetRole: "Frontend Platform Engineer",
  },
];

// ============================================================================
// COMPATIBILITY & ELIGIBILITY EVALUATOR
// ============================================================================

export function evaluateCandidateForOpportunity(
  candidate: CandidateProfile,
  requirements: OpportunityRequirementConfig
): CandidateEvaluationResult {
  const candidateSkillNames = candidate.verifiedSkills.map((s) => s.name.toLowerCase());

  // 1. Skill Matching
  const matchedSkills: string[] = [];
  const skillGaps: string[] = [];

  requirements.requiredSkills.forEach((req) => {
    if (candidateSkillNames.some((cs) => cs === req.toLowerCase() || cs.includes(req.toLowerCase()))) {
      matchedSkills.push(req);
    } else {
      skillGaps.push(req);
    }
  });

  const preferredSkillsMatched: string[] = [];
  requirements.preferredSkills.forEach((pref) => {
    if (candidateSkillNames.some((cs) => cs === pref.toLowerCase() || cs.includes(pref.toLowerCase()))) {
      preferredSkillsMatched.push(pref);
    }
  });

  // 2. Continuous Match Score Calculation (0 - 100%)
  // - Required Skills Match: 35%
  // - Preferred Skills Bonus: 15%
  // - Resume Readiness: 15%
  // - Assessment Evidence: 15%
  // - Interview Readiness: 10%
  // - Project Provenance: 10%
  const reqSkillRatio = requirements.requiredSkills.length > 0
    ? matchedSkills.length / requirements.requiredSkills.length
    : 1;

  const prefSkillRatio = requirements.preferredSkills.length > 0
    ? preferredSkillsMatched.length / requirements.preferredSkills.length
    : 0;

  const interviewVal = candidate.privacyConsent.shareInterviewTelemetry && candidate.mockInterviewScore
    ? candidate.mockInterviewScore
    : 80;

  const explainableMatchScore = Math.min(
    Math.round(
      reqSkillRatio * 35 +
      prefSkillRatio * 15 +
      (candidate.resumeReadinessScore / 100) * 15 +
      (candidate.assessmentEvidenceScore / 100) * 15 +
      (interviewVal / 100) * 10 +
      (candidate.projects.length >= 2 ? 10 : 6)
    ),
    99
  );

  // 3. Binary Eligibility Criteria Evaluation
  const unmetRequirements: string[] = [];

  const requiredSkillsEligible = skillGaps.length === 0;
  if (!requiredSkillsEligible) {
    unmetRequirements.push(`Missing Mandatory Skills: ${skillGaps.join(", ")}`);
  }

  const educationEligible = candidate.graduationYear <= requirements.minGraduationYear;
  if (!educationEligible) {
    unmetRequirements.push(`Graduation year (${candidate.graduationYear}) exceeds requirement (${requirements.minGraduationYear})`);
  }

  const resumeThresholdEligible = candidate.resumeReadinessScore >= requirements.minResumeReadinessThreshold;
  if (!resumeThresholdEligible) {
    unmetRequirements.push(`Resume score (${candidate.resumeReadinessScore}%) is below requirement (${requirements.minResumeReadinessThreshold}%)`);
  }

  const assessmentThresholdEligible = candidate.assessmentEvidenceScore >= requirements.minAssessmentScoreThreshold;
  if (!assessmentThresholdEligible) {
    unmetRequirements.push(`Assessment evidence (${candidate.assessmentEvidenceScore}%) is below requirement (${requirements.minAssessmentScoreThreshold}%)`);
  }

  const isOverallEligible =
    requiredSkillsEligible &&
    educationEligible &&
    resumeThresholdEligible &&
    assessmentThresholdEligible;

  let eligibilityBadge: CandidateEvaluationResult["eligibility"]["eligibilityBadge"] = "Does Not Meet Criteria";
  if (isOverallEligible) {
    eligibilityBadge = "Eligible for Technical Review";
  } else if (requiredSkillsEligible && resumeThresholdEligible) {
    eligibilityBadge = "Conditional Review";
  }

  return {
    candidate,
    requirements,
    explainableMatchScore,
    matchedSkills,
    preferredSkillsMatched,
    skillGaps,
    resumeReadiness: candidate.resumeReadinessScore,
    projectEvidenceScore: candidate.projects.length >= 2 ? 90 : 70,
    assessmentScore: candidate.assessmentEvidenceScore,
    interviewReadiness: candidate.privacyConsent.shareInterviewTelemetry ? candidate.mockInterviewScore : undefined,
    roleAlignment: candidate.roleAlignmentScore,
    eligibility: {
      isOverallEligible,
      educationEligible,
      requiredSkillsEligible,
      resumeThresholdEligible,
      assessmentThresholdEligible,
      unmetRequirements,
      eligibilityBadge,
    },
  };
}

/**
 * Returns all candidate evaluations for a given requirement config
 */
export function getEvaluatedCandidatesForRequirement(
  reqId: string = "req-cloud-ai"
): {
  requirements: OpportunityRequirementConfig;
  allRequirements: OpportunityRequirementConfig[];
  evaluations: CandidateEvaluationResult[];
} {
  const req = DEFAULT_OPPORTUNITY_REQUIREMENTS.find((r) => r.id === reqId) || DEFAULT_OPPORTUNITY_REQUIREMENTS[0];
  const evaluations = CANDIDATE_TALENT_POOL.map((cand) =>
    evaluateCandidateForOpportunity(cand, req)
  ).sort((a, b) => b.explainableMatchScore - a.explainableMatchScore);

  return {
    requirements: req,
    allRequirements: DEFAULT_OPPORTUNITY_REQUIREMENTS,
    evaluations,
  };
}

/**
 * Returns single candidate evaluation by ID
 */
export function getSingleCandidateEvaluation(
  candidateId: string,
  reqId: string = "req-cloud-ai"
): CandidateEvaluationResult | null {
  const candidate = CANDIDATE_TALENT_POOL.find((c) => c.id === candidateId);
  if (!candidate) return null;
  const req = DEFAULT_OPPORTUNITY_REQUIREMENTS.find((r) => r.id === reqId) || DEFAULT_OPPORTUNITY_REQUIREMENTS[0];
  return evaluateCandidateForOpportunity(candidate, req);
}
