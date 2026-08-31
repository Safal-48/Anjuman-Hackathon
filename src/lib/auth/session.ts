import { cookies } from "next/headers";
import { UserProfile, UserRole } from "./types";

export const SESSION_COOKIE_NAME = "titan_session_token";

// Pre-seeded demo users for instantaneous evaluation & testing
export const DEMO_USERS: Record<string, UserProfile> = {
  "student@titan.ai": {
    id: "usr-demo-student-01",
    email: "student@titan.ai",
    fullName: "Aarav Sharma",
    role: "student",
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    studentProfile: {
      fullName: "Aarav Sharma",
      education: "B.Tech Computer Science & AI",
      institution: "Indian Institute of Technology",
      academicYear: "3rd Year",
      skills: ["React", "TypeScript", "Python", "PyTorch", "Next.js", "Docker"],
      interests: ["Deep Learning", "Distributed Systems", "Full-Stack Development"],
      careerGoal: "Lead AI Systems Architect in frontier enterprise AI platforms",
      experience: "Completed 6-month research internship in NLP model optimization",
      projects: [
        {
          title: "Neural Vision Telemetry",
          description: "Real-time edge computing vision pipeline processing 120 FPS camera streams",
          link: "https://github.com/tech-titan/vision-telemetry",
        },
      ],
      certifications: ["AWS Certified Developer", "TensorFlow Developer Certificate"],
      resumeUrl: "https://example.com/resumes/aarav-sharma.pdf",
      resumeFileName: "Aarav_Sharma_Resume.pdf",
    },
  },
  "industry@titan.ai": {
    id: "usr-demo-industry-01",
    email: "industry@titan.ai",
    fullName: "Elena Rostova",
    role: "industry",
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    industryProfile: {
      organizationName: "CyberDynamics Technologies",
      industryDomain: "Autonomous Robotics & Enterprise AI",
      organizationSize: "500-1000",
      organizationDescription: "Pioneering industrial autonomy, sensor fusion, and scalable cloud-robotics ecosystems for critical infrastructure.",
      website: "https://cyberdynamics.tech",
      recruiterName: "Elena Rostova",
      recruiterDesignation: "Director of Technical Talent Acquisition",
      recruiterEmail: "elena@cyberdynamics.tech",
      hiringInterests: ["AI Engineers", "Embedded Systems", "Full Stack Architects"],
    },
  },
  "academician@titan.ai": {
    id: "usr-demo-academic-01",
    email: "academician@titan.ai",
    fullName: "Dr. Vikram Sengupta",
    role: "academician",
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    academicianProfile: {
      institution: "National Institute of Advanced Technology",
      department: "Computer Science & Engineering",
      designation: "Professor & Head of Center for Intelligent Systems",
      expertise: ["Quantum Computing", "Deep Reinforcement Learning", "Parallel Architectures"],
      experienceYears: 14,
      researchInterests: ["Multi-Agent Orchestration", "Fault-Tolerant AI Workloads"],
      scholarProfile: "https://scholar.google.com/citations?user=titan_vikram",
    },
  },
  "institution@titan.ai": {
    id: "usr-demo-institution-01",
    email: "institution@titan.ai",
    fullName: "Registrar Office - Apex University",
    role: "institution",
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    institutionProfile: {
      institutionName: "Apex University of Science & Technology",
      institutionType: "university",
      registrationCode: "AISHE-U-98421",
      address: "Tech Innovation Hub, Silicon Corridor",
      city: "Bengaluru",
      state: "Karnataka",
      representativeName: "Dr. K. R. Ramanathan",
      representativeDesignation: "Dean of Academic & Industry Partnerships",
      representativeEmail: "dean.partnerships@apexuniv.edu.in",
    },
  },
  "admin@titan.ai": {
    id: "usr-demo-admin-01",
    email: "admin@titan.ai",
    fullName: "System Security Administrator",
    role: "admin",
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Global in-memory dynamic storage for runtime sessions & user profiles
const globalStore = global as unknown as {
  _titanUsers?: Map<string, UserProfile>;
  _titanSessions?: Map<string, string>; // sessionToken -> userId
};

if (!globalStore._titanUsers) {
  globalStore._titanUsers = new Map<string, UserProfile>();
  // Pre-seed demo users
  Object.values(DEMO_USERS).forEach((u) => {
    globalStore._titanUsers!.set(u.id, u);
  });
}

if (!globalStore._titanSessions) {
  globalStore._titanSessions = new Map<string, string>();
  // Pre-seed default sessions
  Object.values(DEMO_USERS).forEach((u) => {
    globalStore._titanSessions!.set(`session-${u.id}`, u.id);
  });
}

export function getUserById(id: string): UserProfile | null {
  return globalStore._titanUsers?.get(id) || null;
}

export function getUserByEmail(email: string): UserProfile | null {
  const normalized = email.toLowerCase().trim();
  const users = Array.from(globalStore._titanUsers?.values() || []);
  for (const user of users) {
    if (user.email.toLowerCase() === normalized) {
      return user;
    }
  }
  return null;
}

export function saveUser(user: UserProfile): UserProfile {
  globalStore._titanUsers!.set(user.id, user);
  return user;
}

export function createSessionToken(userId: string): string {
  const token = `titan_sess_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  globalStore._titanSessions!.set(token, userId);
  return token;
}

export function removeSessionToken(token: string): void {
  globalStore._titanSessions!.delete(token);
}

export function getUserByToken(token: string): UserProfile | null {
  const userId = globalStore._titanSessions?.get(token);
  if (!userId) return null;
  return getUserById(userId);
}

/**
 * Server-side helper to read and verify the current session from cookies
 */
export async function getServerSession(): Promise<UserProfile | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return getUserByToken(token);
  } catch {
    return null;
  }
}

/**
 * Server-side guard to require authentication
 */
export async function requireAuth(): Promise<UserProfile> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  return session;
}

/**
 * Server-side guard to require specific roles
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UserProfile> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error(`FORBIDDEN: Access restricted to roles [${allowedRoles.join(", ")}]`);
  }
  return session;
}
