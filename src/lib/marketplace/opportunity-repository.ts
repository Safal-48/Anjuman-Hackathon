import {
  OpportunityEntity,
  OpportunityApplicationEntity,
  UserNotificationEntity,
  OpportunityType,
  ApplicationStatus,
  LocationType,
} from "@/lib/supabase/types";
import { calculateExplainableMatch } from "@/lib/marketplace/matching-engine";
import { getFullProfile } from "@/lib/db/profile-repository";
import { getUserById, DEMO_USERS } from "@/lib/auth/session";

// Global in-memory marketplace storage
const globalMarketplaceStore = global as unknown as {
  _titanOpportunities?: Map<string, OpportunityEntity>;
  _titanApplications?: Map<string, OpportunityApplicationEntity>;
  _titanNotifications?: Map<string, UserNotificationEntity>;
};

export const SEEDED_OPPORTUNITIES: OpportunityEntity[] = [
  {
    id: "opp-01",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Titan Frontier AI Labs",
    title: "Distributed AI & Neural Infrastructure Intern",
    opportunityType: "internship",
    description: "Join the core AI infrastructure team to build high-throughput model quantization, TensorRT acceleration pipelines, and distributed GPU cluster telemetry.",
    requiredSkills: ["Python", "PyTorch", "Distributed Systems", "Docker"],
    preferredSkills: ["TypeScript", "Next.js", "Kubernetes", "CUDA"],
    eligibility: "B.Tech/BE in CS, AI, EE (3rd/4th Year, GPA ≥ 8.0)",
    minGpa: 8.0,
    experienceRequired: "Hands-on PyTorch or Distributed Systems project experience",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹65,000 / month",
    duration: "6 Months",
    deadline: "2026-05-15",
    openingsCount: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "HyperScale Cloud Networks",
    title: "Full-Stack Cloud & Web Systems Engineer",
    opportunityType: "job",
    description: "Architect mission-critical reactive cloud platforms, sub-10ms microservices, and edge computing dashboards for enterprise clients.",
    requiredSkills: ["React / Next.js", "TypeScript", "Distributed Systems", "PostgreSQL"],
    preferredSkills: ["Docker", "Redis", "Kafka", "GraphQL"],
    eligibility: "Graduating Batch 2025/2026, Computer Science & Engineering",
    minGpa: 7.5,
    experienceRequired: "Freshers with verified GitHub portfolio",
    location: "Remote (India)",
    locationType: "remote",
    stipendSalary: "₹18 - ₹24 LPA",
    duration: "Full-Time",
    deadline: "2026-06-01",
    openingsCount: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Nvidia Accelerated Computing Partner",
    title: "Low-Latency Edge Vision Telemetry Core",
    opportunityType: "industry_project",
    description: "Live sponsored industry challenge: Benchmark 120 FPS camera streams with PyTorch and TensorRT, optimizing memory footprint on edge nodes.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["Docker", "C++", "FastAPI"],
    eligibility: "Open to all verified student engineers and hackathon finalists",
    experienceRequired: "Demonstrated machine learning or systems programming background",
    location: "Remote",
    locationType: "remote",
    stipendSalary: "₹1,20,000 Milestone Grant",
    duration: "8 Weeks",
    deadline: "2026-04-30",
    openingsCount: 2,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Google Cloud Platform Partner Hub",
    title: "Cloud DevOps & Kubernetes SRE Apprenticeship",
    opportunityType: "apprenticeship",
    description: "12-month accelerated apprenticeship working alongside senior Site Reliability Engineers managing high-availability multi-region Kubernetes clusters.",
    requiredSkills: ["Distributed Systems", "Docker", "System Architecture"],
    preferredSkills: ["Kubernetes", "Linux", "Terraform", "Python"],
    eligibility: "B.Tech/BE pre-final & final year students",
    minGpa: 7.0,
    experienceRequired: "Basic Linux networking & containerization fundamentals",
    location: "Hyderabad, Telangana (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹50,000 / month",
    duration: "12 Months",
    deadline: "2026-05-20",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "DeepLearning Advanced Labs",
    title: "Enterprise LLM Optimization & TensorRT Accelerator Program",
    opportunityType: "training_program",
    description: "Intensive 6-week cohort on quantized large language model deployment, vLLM serving, and distributed KV-cache optimizations.",
    requiredSkills: ["Python", "PyTorch"],
    preferredSkills: ["CUDA", "FastAPI", "Next.js"],
    eligibility: "Students with strong math & linear algebra foundation",
    experienceRequired: "Prior experience training or fine-tuning neural networks",
    location: "Online Live Cohort",
    locationType: "remote",
    stipendSalary: "100% Industry Sponsored Scholarship",
    duration: "6 Weeks",
    deadline: "2026-04-15",
    openingsCount: 30,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "CyberDefense National Council",
    title: "Zero-Trust Protocol Security & Cryptographic Mesh Workshop",
    opportunityType: "workshop",
    description: "Hands-on 2-week masterclass covering zero-knowledge protocols, decentralized identity tokens, and defensive penetration testing.",
    requiredSkills: ["System Architecture", "Algorithms & Complexity"],
    preferredSkills: ["Rust", "Cryptography", "Linux"],
    eligibility: "Engineering students in Cybersecurity, CS, or IT",
    experienceRequired: "Basic socket programming and networking protocols",
    location: "New Delhi (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "Certificate of Distinction + ₹15,000 Merit Stole",
    duration: "2 Weeks",
    deadline: "2026-04-10",
    openingsCount: 20,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-07",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Titan Engineering Fellowship",
    title: "Principal Systems Architect Mentorship Track",
    opportunityType: "mentorship",
    description: "1-on-1 direct mentorship with FAANG & AI startup engineering leaders to refine system design mastery and hackathon research papers.",
    requiredSkills: ["React / Next.js", "Python", "Team Collaboration"],
    preferredSkills: ["Distributed Systems", "Communication & Mentorship"],
    eligibility: "Finalist standing in competitive programming or national hackathons",
    experienceRequired: "High motivation and active engineering portfolio",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Free Mentorship + Research Grant Access",
    duration: "6 Months",
    deadline: "2026-05-01",
    openingsCount: 10,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initialize in-memory singleton
if (!globalMarketplaceStore._titanOpportunities) {
  globalMarketplaceStore._titanOpportunities = new Map<string, OpportunityEntity>();
  globalMarketplaceStore._titanApplications = new Map<string, OpportunityApplicationEntity>();
  globalMarketplaceStore._titanNotifications = new Map<string, UserNotificationEntity>();

  SEEDED_OPPORTUNITIES.forEach((opp) => {
    globalMarketplaceStore._titanOpportunities!.set(opp.id, opp);
  });

  // Pre-seed a sample application for the demo student
  const demoStudentId = DEMO_USERS["student@titan.ai"].id;
  const sampleOpp = SEEDED_OPPORTUNITIES[0];

  const sampleApp: OpportunityApplicationEntity = {
    id: "app-demo-01",
    opportunityId: sampleOpp.id,
    studentId: demoStudentId,
    status: "shortlisted",
    coverNote: "I have built high-performance PyTorch inference platforms and placed as an SIH Finalist for PS 26044.",
    matchScore: 92,
    matchBreakdown: {
      overallScore: 92,
      strongSkills: ["Python", "PyTorch", "Distributed Systems", "Docker"],
      partialSkills: ["TypeScript", "Next.js"],
      gapSkills: ["CUDA"],
      factorBreakdown: {
        skillMatch: 94,
        eligibilityMatch: 95,
        careerMatch: 90,
        experienceMatch: 88,
      },
      reasoningSummary: "Strong match (92%). Verified expertise in Python, PyTorch, and Distributed Systems with high portfolio evidence.",
    },
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  globalMarketplaceStore._titanApplications!.set(sampleApp.id, sampleApp);

  // Pre-seed sample notification
  const sampleNotif: UserNotificationEntity = {
    id: "notif-demo-01",
    userId: demoStudentId,
    title: "Application Shortlisted!",
    message: "Your application for 'Distributed AI & Neural Infrastructure Intern' has been shortlisted by Titan Frontier AI Labs.",
    type: "application_status",
    linkUrl: "/applications",
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  globalMarketplaceStore._titanNotifications!.set(sampleNotif.id, sampleNotif);
}

/**
 * Retrieve all opportunities with optional search, filter, and personalized match computation
 */
export async function getMarketplaceOpportunities(
  studentId?: string,
  filters?: {
    type?: string;
    locationType?: string;
    search?: string;
    minMatch?: number;
  }
): Promise<OpportunityEntity[]> {
  const allOpps = Array.from(globalMarketplaceStore._titanOpportunities!.values());
  const student = studentId ? await getFullProfile(studentId) : null;

  let results = allOpps.map((opp) => {
    let matchResult = undefined;
    if (student) {
      matchResult = calculateExplainableMatch(student, opp);
    }
    return {
      ...opp,
      matchResult,
    };
  });

  // Apply filters
  if (filters?.type && filters.type !== "all") {
    results = results.filter((o) => o.opportunityType === filters.type);
  }
  if (filters?.locationType && filters.locationType !== "all") {
    results = results.filter((o) => o.locationType === filters.locationType);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organizationName.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (filters?.minMatch && student) {
    results = results.filter((o) => (o.matchResult?.overallScore || 0) >= filters.minMatch!);
  }

  // Sort by match score descending if student profile is active
  if (student) {
    results.sort((a, b) => (b.matchResult?.overallScore || 0) - (a.matchResult?.overallScore || 0));
  }

  return results;
}

/**
 * Get single opportunity with explainable match breakdown
 */
export async function getOpportunityById(
  id: string,
  studentId?: string
): Promise<OpportunityEntity | null> {
  const opp = globalMarketplaceStore._titanOpportunities!.get(id);
  if (!opp) return null;

  let matchResult = undefined;
  if (studentId) {
    const student = await getFullProfile(studentId);
    if (student) {
      matchResult = calculateExplainableMatch(student, opp);
    }
  }

  return {
    ...opp,
    matchResult,
  };
}

/**
 * Create a new opportunity (Industry role)
 */
export async function createOpportunity(
  creatorId: string,
  data: {
    title: string;
    organizationName: string;
    opportunityType: OpportunityType;
    description: string;
    requiredSkills: string[];
    preferredSkills?: string[];
    eligibility: string;
    minGpa?: number;
    experienceRequired?: string;
    location: string;
    locationType: LocationType;
    stipendSalary: string;
    duration: string;
    deadline: string;
    openingsCount?: number;
  }
): Promise<OpportunityEntity> {
  const newOpp: OpportunityEntity = {
    id: `opp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    creatorId,
    organizationName: data.organizationName.trim(),
    title: data.title.trim(),
    opportunityType: data.opportunityType,
    description: data.description.trim(),
    requiredSkills: data.requiredSkills,
    preferredSkills: data.preferredSkills || [],
    eligibility: data.eligibility.trim(),
    minGpa: data.minGpa,
    experienceRequired: data.experienceRequired || "Freshers eligible",
    location: data.location.trim(),
    locationType: data.locationType || "hybrid",
    stipendSalary: data.stipendSalary.trim(),
    duration: data.duration.trim(),
    deadline: data.deadline,
    openingsCount: data.openingsCount || 1,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalMarketplaceStore._titanOpportunities!.set(newOpp.id, newOpp);
  return newOpp;
}

/**
 * Submit student application for an opportunity
 */
export async function applyForOpportunity(
  studentId: string,
  opportunityId: string,
  coverNote?: string
): Promise<OpportunityApplicationEntity> {
  const student = await getFullProfile(studentId);
  const opp = globalMarketplaceStore._titanOpportunities!.get(opportunityId);

  if (!student || !opp) {
    throw new Error("Student or Opportunity not found");
  }

  // Check if already applied
  const existing = Array.from(globalMarketplaceStore._titanApplications!.values()).find(
    (a) => a.studentId === studentId && a.opportunityId === opportunityId
  );
  if (existing) {
    return existing;
  }

  const matchBreakdown = calculateExplainableMatch(student, opp);

  const newApp: OpportunityApplicationEntity = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    opportunityId,
    studentId,
    status: "applied",
    coverNote: coverNote?.trim(),
    matchScore: matchBreakdown.overallScore,
    matchBreakdown,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    opportunity: opp,
  };

  globalMarketplaceStore._titanApplications!.set(newApp.id, newApp);

  // Send confirmation notification to student
  createNotification(
    studentId,
    "Application Submitted Successfully",
    `Your application for '${opp.title}' at ${opp.organizationName} has been submitted with a ${matchBreakdown.overallScore}% compatibility rating.`,
    "application_status",
    "/applications"
  );

  return newApp;
}

/**
 * Get applications for a student
 */
export async function getStudentApplications(
  studentId: string
): Promise<OpportunityApplicationEntity[]> {
  const apps = Array.from(globalMarketplaceStore._titanApplications!.values()).filter(
    (a) => a.studentId === studentId
  );

  return apps.map((a) => ({
    ...a,
    opportunity: globalMarketplaceStore._titanOpportunities!.get(a.opportunityId),
  }));
}

/**
 * Get candidate applications for recruiter's opportunities
 */
export async function getRecruiterApplications(
  recruiterId: string
): Promise<OpportunityApplicationEntity[]> {
  const recruiterOpps = Array.from(globalMarketplaceStore._titanOpportunities!.values()).filter(
    (o) => o.creatorId === recruiterId
  );
  const oppIds = new Set(recruiterOpps.map((o) => o.id));

  const apps = Array.from(globalMarketplaceStore._titanApplications!.values()).filter((a) =>
    oppIds.has(a.opportunityId)
  );

  return Promise.all(
    apps.map(async (a) => {
      const student = await getFullProfile(a.studentId);
      return {
        ...a,
        opportunity: globalMarketplaceStore._titanOpportunities!.get(a.opportunityId),
        studentName: student?.fullName,
        studentEmail: student?.email,
        studentInstitution: student?.studentProfile?.institution,
      };
    })
  );
}

/**
 * Update candidate application status (Recruiter Action)
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  recruiterId: string
): Promise<OpportunityApplicationEntity | null> {
  const app = globalMarketplaceStore._titanApplications!.get(applicationId);
  if (!app) return null;

  const opp = globalMarketplaceStore._titanOpportunities!.get(app.opportunityId);
  if (!opp) return null;

  app.status = newStatus;
  app.updatedAt = new Date().toISOString();
  globalMarketplaceStore._titanApplications!.set(applicationId, app);

  // Dispatch real-time notification to the student!
  const statusTitles: Record<ApplicationStatus, string> = {
    applied: "Application Received",
    under_review: "Application Under Review",
    shortlisted: "🎉 Congratulations! You have been Shortlisted",
    interview: "📅 Interview Scheduled",
    selected: "🏆 Offer Extended! You are Selected",
    rejected: "Application Status Update",
  };

  createNotification(
    app.studentId,
    statusTitles[newStatus] || "Application Status Update",
    `Your application for '${opp.title}' at ${opp.organizationName} is now: ${newStatus.toUpperCase().replace("_", " ")}.`,
    "application_status",
    "/applications"
  );

  return app;
}

/**
 * Create a user notification
 */
export function createNotification(
  userId: string,
  title: string,
  message: string,
  type: UserNotificationEntity["type"] = "application_status",
  linkUrl: string = "/applications"
): UserNotificationEntity {
  const notif: UserNotificationEntity = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title,
    message,
    type,
    linkUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  globalMarketplaceStore._titanNotifications!.set(notif.id, notif);
  return notif;
}

/**
 * Fetch notifications for user
 */
export async function getUserNotifications(userId: string): Promise<UserNotificationEntity[]> {
  const notifs = Array.from(globalMarketplaceStore._titanNotifications!.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return notifs;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  const notif = globalMarketplaceStore._titanNotifications!.get(notificationId);
  if (!notif || notif.userId !== userId) return false;

  notif.isRead = true;
  return true;
}
