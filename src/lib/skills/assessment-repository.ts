import {
  AssessmentQuestion,
  AssessmentSession,
  TargetRoleBenchmark,
  SkillIntelligenceReport,
  StudentSkillEntity,
} from "@/lib/supabase/types";
import { computeAssessmentScores, calculateExplainableGaps } from "@/lib/skills/scoring-engine";
import { getUserById, DEMO_USERS } from "@/lib/auth/session";

// Global in-memory storage for Assessment Questions, Sessions, and Reports
const globalAssessmentStore = global as unknown as {
  _titanQuestions?: AssessmentQuestion[];
  _titanSessions?: Map<string, AssessmentSession>;
  _titanReports?: Map<string, SkillIntelligenceReport>;
  _titanTargetRoles?: TargetRoleBenchmark[];
};

export const DEFAULT_TARGET_ROLES: TargetRoleBenchmark[] = [
  {
    id: "ai_systems_engineer",
    title: "AI Systems & LLM Platform Engineer",
    description: "Designs high-throughput distributed neural network architectures, TensorRT optimization pipelines, and scalable LLM orchestration.",
    requiredReadinessScore: 85,
    requiredSkills: [
      { skillName: "Python & PyTorch", category: "AI & Machine Learning", requiredScore: 90, weight: 1.5 },
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 85, weight: 1.3 },
      { skillName: "React / Next.js", category: "Web Systems", requiredScore: 75, weight: 0.8 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 85, weight: 1.2 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 90, weight: 1.4 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 85, weight: 1.0 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
      { skillName: "Communication & Mentorship", category: "Soft Skills", requiredScore: 75, weight: 0.8 },
    ],
  },
  {
    id: "full_stack_architect",
    title: "Full-Stack Cloud Architect",
    description: "Architects end-to-end mission-critical SaaS applications, microservices, and reactive frontend experiences.",
    requiredReadinessScore: 82,
    requiredSkills: [
      { skillName: "React / Next.js", category: "Web Systems", requiredScore: 95, weight: 1.5 },
      { skillName: "TypeScript", category: "Web Systems", requiredScore: 90, weight: 1.4 },
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 85, weight: 1.2 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 88, weight: 1.3 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 80, weight: 1.0 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 80, weight: 1.0 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 85, weight: 1.0 },
      { skillName: "Communication & Mentorship", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
    ],
  },
  {
    id: "cloud_devops_sre",
    title: "Cloud DevOps & Reliability Engineer (SRE)",
    description: "Builds automated CI/CD pipelines, container orchestration meshes, and high-availability infrastructure.",
    requiredReadinessScore: 80,
    requiredSkills: [
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 92, weight: 1.5 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 85, weight: 1.3 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 75, weight: 1.0 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 85, weight: 1.1 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
      { skillName: "Communication & Mentorship", category: "Soft Skills", requiredScore: 75, weight: 0.8 },
    ],
  },
  {
    id: "cybersecurity_specialist",
    title: "Cybersecurity & Cryptography Specialist",
    description: "Secures distributed protocols, performs vulnerability analysis, and reinforces cryptographic identity layers.",
    requiredReadinessScore: 84,
    requiredSkills: [
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 88, weight: 1.3 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 90, weight: 1.4 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 90, weight: 1.4 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 90, weight: 1.2 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 75, weight: 0.8 },
    ],
  },
];

export const DEFAULT_QUESTIONS: AssessmentQuestion[] = [
  // 1. Technical: Next.js / Web Systems
  {
    id: "q-tech-01",
    category: "technical",
    skillTag: "React / Next.js",
    difficulty: "medium",
    questionText: "In Next.js App Router, how does React Server Components (RSC) impact client-side bundle size and data fetching latency?",
    questionType: "single_choice",
    displayOrder: 1,
    explanation: "React Server Components execute entirely on the server and stream pre-rendered HTML without shipping component JS to the client bundle.",
    options: [
      { id: "opt-1a", text: "RSC ships component code to the client and requires client-side re-fetching.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-1b", text: "RSC executes only on the server, zeroing client JS bundle overhead and co-locating data queries next to the database.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-1c", text: "RSC converts all code into static WebAssembly modules that run in the browser worker thread.", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-1d", text: "RSC only works when client-side Hydration is completely disabled.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // 2. Technical: Python & PyTorch
  {
    id: "q-tech-02",
    category: "technical",
    skillTag: "Python & PyTorch",
    difficulty: "hard",
    questionText: "When training a deep neural network with PyTorch, what is the primary consequence of omitting `optimizer.zero_grad()` prior to `loss.backward()`?",
    questionType: "single_choice",
    displayOrder: 2,
    explanation: "PyTorch accumulates gradients by default; failing to zero them causes unintended gradient accumulation across iterations.",
    options: [
      { id: "opt-2a", text: "Gradients from subsequent batches accumulate into existing gradients, causing destabilized parameter updates.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-2b", text: "The GPU VRAM is immediately deallocated, throwing a CUDA runtime exception.", scoreWeight: 0.1, isCorrect: false },
      { id: "opt-2c", text: "The learning rate decays to zero automatically.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-2d", text: "The network switches to inference mode implicitly.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // 3. Technical: Distributed Systems
  {
    id: "q-tech-03",
    category: "technical",
    skillTag: "Distributed Systems",
    difficulty: "hard",
    questionText: "Under the CAP theorem, during an active network partition in a distributed multi-region database, what fundamental trade-off must be chosen?",
    questionType: "single_choice",
    displayOrder: 3,
    explanation: "When network partition (P) occurs, a distributed system must choose between returning consistent, up-to-date data (C) or guaranteeing immediate availability (A).",
    options: [
      { id: "opt-3a", text: "Choose between Linear Consistency (C) vs High Availability (A).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-3b", text: "Choose between ACID compliance vs Data Encryption at rest.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-3c", text: "Choose between Monolithic deployment vs Microservices.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-3d", text: "Choose between TCP socket streaming vs UDP broadcast packets.", scoreWeight: 0.1, isCorrect: false },
    ],
  },
  // 4. Technical: System Architecture
  {
    id: "q-tech-04",
    category: "technical",
    skillTag: "System Architecture",
    difficulty: "medium",
    questionText: "What architecture pattern is most suitable for handling sudden traffic spikes in an event-driven telemetry pipeline without dropping incoming payloads?",
    questionType: "single_choice",
    displayOrder: 4,
    explanation: "Message broker buffers (e.g. Kafka/RabbitMQ) decouple producers from consumers, smoothing peak ingestion loads.",
    options: [
      { id: "opt-4a", text: "Synchronous blocking HTTP POST requests directly into the primary relational database.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-4b", text: "Distributed message queue buffer (e.g., Apache Kafka / Redis Streams) with asynchronous worker pooling.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-4c", text: "Client-side infinite retry loop with zero exponential backoff.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-4d", text: "Server-Sent Events without backpressure buffers.", scoreWeight: 0.2, isCorrect: false },
    ],
  },
  // 5. Soft Skill: Team Collaboration
  {
    id: "q-soft-01",
    category: "soft_skill",
    skillTag: "Team Collaboration",
    difficulty: "medium",
    questionText: "A high-severity blocker arises in a cross-functional sprint between frontend and backend leads 24 hours before hackathon submission. What is the optimal approach?",
    questionType: "single_choice",
    displayOrder: 5,
    explanation: "Effective collaboration requires immediate alignment on unified interface contracts (API schema / mock responses) so teams unblock in parallel.",
    options: [
      { id: "opt-5a", text: "Agree on an immutable OpenAPI/TypeScript contract immediately, mock endpoints on the frontend, and resolve backend logic in parallel.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-5b", text: "Halt all frontend development until the backend is completely refactored and deployed.", scoreWeight: 0.1, isCorrect: false },
      { id: "opt-5c", text: "Rewrite the entire backend code without informing the frontend team.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-5d", text: "Escalate blame to team management and request a submission extension.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // 6. Soft Skill: Communication & Mentorship
  {
    id: "q-soft-02",
    category: "soft_skill",
    skillTag: "Communication & Mentorship",
    difficulty: "medium",
    questionText: "When conducting code reviews on a junior engineer's pull request containing suboptimal $O(N^2)$ algorithmic loops, what feedback style fosters the best engineering outcome?",
    questionType: "single_choice",
    displayOrder: 6,
    explanation: "Constructive code reviews provide educational context, quantify latency implications, and suggest idiomatic alternatives.",
    options: [
      { id: "opt-6a", text: "Reject the PR with 'Too slow' without explanation.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-6b", text: "Highlight the time complexity bottleneck, explain the scale impact at 100k records, and suggest an $O(N)$ hash-map approach with documentation references.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-6c", text: "Merge the PR immediately and silently fix it in a private branch later.", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-6d", text: "Tell the developer that performance does not matter in modern computing.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // 7. Aptitude: Algorithms & Complexity
  {
    id: "q-apt-01",
    category: "aptitude",
    skillTag: "Algorithms & Complexity",
    difficulty: "medium",
    questionText: "What is the worst-case time complexity of searching for an element in an unsorted array of size $N$ versus a balanced Binary Search Tree (AVL/Red-Black)?",
    questionType: "single_choice",
    displayOrder: 7,
    explanation: "Unsorted array lookup is linear $O(N)$, whereas a balanced BST maintains height $O(\\log N)$.",
    options: [
      { id: "opt-7a", text: "Unsorted Array: $O(N)$, Balanced BST: $O(\\log N)$.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-7b", text: "Unsorted Array: $O(1)$, Balanced BST: $O(N)$.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-7c", text: "Unsorted Array: $O(N \\log N)$, Balanced BST: $O(N^2)$.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-7d", text: "Both data structures have identical $O(1)$ worst-case time complexity.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // 8. Aptitude: Problem Solving & Logic
  {
    id: "q-apt-02",
    category: "aptitude",
    skillTag: "Problem Solving",
    difficulty: "hard",
    questionText: "You are designing an LRU (Least Recently Used) cache with $O(1)$ get and $O(1)$ put operations. Which combined data structure achieves this optimality?",
    questionType: "single_choice",
    displayOrder: 8,
    explanation: "A Hash Map provides $O(1)$ key lookup, while a Doubly Linked List enables $O(1)$ node removal and insertion at head/tail.",
    options: [
      { id: "opt-8a", text: "Hash Map combined with a Doubly Linked List.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-8b", text: "Single Array with Binary Search.", scoreWeight: 0.1, isCorrect: false },
      { id: "opt-8c", text: "Min-Heap priority queue.", scoreWeight: 0.3, isCorrect: false },
      { id: "opt-8d", text: "Singly Linked List with bubble sort.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // 9. Career Interest: Domain Focus
  {
    id: "q-car-01",
    category: "career_interest",
    skillTag: "Career & Domain Focus",
    difficulty: "easy",
    questionText: "Which engineering domain best matches your target technical leadership and career ambition over the next 24-36 months?",
    questionType: "single_choice",
    displayOrder: 9,
    explanation: "Domain alignment helps calibrate target role recommendations.",
    options: [
      { id: "opt-9a", text: "Distributed AI Architecture, High-Performance Inference, and LLM Infrastructure.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-9b", text: "Full-Stack Web Systems, High-Concurrency APIs, and Reactive Cloud Platforms.", scoreWeight: 0.9, isCorrect: true },
      { id: "opt-9c", text: "Cloud DevOps, Kubernetes SRE, and Autonomous CI/CD Mesh Systems.", scoreWeight: 0.9, isCorrect: true },
      { id: "opt-9d", text: "Cybersecurity, Zero-Trust Cryptographic Infrastructure, and Protocol Defense.", scoreWeight: 0.9, isCorrect: true },
    ],
  },
];

// Initialize in-memory singleton
if (!globalAssessmentStore._titanQuestions) {
  globalAssessmentStore._titanQuestions = [...DEFAULT_QUESTIONS];
  globalAssessmentStore._titanSessions = new Map<string, AssessmentSession>();
  globalAssessmentStore._titanReports = new Map<string, SkillIntelligenceReport>();
  globalAssessmentStore._titanTargetRoles = [...DEFAULT_TARGET_ROLES];

  // Pre-seed demo student skill evaluation
  const demoStudentId = DEMO_USERS["student@titan.ai"].id;
  const demoTargetRole = DEFAULT_TARGET_ROLES[0]; // AI Systems Engineer

  const initialResponses: Record<string, string> = {
    "q-tech-01": "opt-1b",
    "q-tech-02": "opt-2a",
    "q-tech-03": "opt-3a",
    "q-tech-04": "opt-4b",
    "q-soft-01": "opt-5a",
    "q-soft-02": "opt-6b",
    "q-apt-01": "opt-7a",
    "q-apt-02": "opt-8a",
    "q-car-01": "opt-9a",
  };

  const computed = computeAssessmentScores(DEFAULT_QUESTIONS, initialResponses);
  const gaps = calculateExplainableGaps(computed.skillBreakdowns, demoTargetRole);

  const demoReport: SkillIntelligenceReport = {
    id: "eval-demo-01",
    userId: demoStudentId,
    overallReadinessScore: computed.overallReadinessScore,
    technicalScore: computed.technicalScore,
    softSkillScore: computed.softSkillScore,
    aptitudeScore: computed.aptitudeScore,
    careerAlignmentScore: computed.careerAlignmentScore,
    skillBreakdowns: computed.skillBreakdowns,
    strongSkills: computed.strongSkills,
    weakSkills: computed.weakSkills,
    targetRole: demoTargetRole,
    skillGaps: gaps,
    evaluatedAt: new Date().toISOString(),
  };

  globalAssessmentStore._titanReports!.set(demoStudentId, demoReport);
}

/**
 * Fetch all assessment questions
 */
export async function getAssessmentQuestions(category?: string): Promise<AssessmentQuestion[]> {
  const all = globalAssessmentStore._titanQuestions || DEFAULT_QUESTIONS;
  if (!category) return all;
  return all.filter((q) => q.category === category);
}

/**
 * Fetch all target roles
 */
export async function getTargetRoles(): Promise<TargetRoleBenchmark[]> {
  return globalAssessmentStore._titanTargetRoles || DEFAULT_TARGET_ROLES;
}

/**
 * Get active assessment session for a user (to resume without data loss)
 */
export async function getActiveSession(userId: string): Promise<AssessmentSession | null> {
  const session = globalAssessmentStore._titanSessions?.get(userId);
  if (!session || session.status !== "in_progress") return null;
  return session;
}

/**
 * Start or restart an assessment session
 */
export async function startAssessmentSession(userId: string): Promise<AssessmentSession> {
  const session: AssessmentSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    status: "in_progress",
    currentQuestionIndex: 0,
    responses: {},
    startedAt: new Date().toISOString(),
  };

  globalAssessmentStore._titanSessions!.set(userId, session);
  return session;
}

/**
 * Save an answer to an in-progress session
 */
export async function saveAssessmentAnswer(
  userId: string,
  questionId: string,
  optionId: string,
  questionIndex?: number
): Promise<AssessmentSession | null> {
  let session = globalAssessmentStore._titanSessions?.get(userId);
  if (!session || session.status !== "in_progress") {
    session = await startAssessmentSession(userId);
  }

  session.responses[questionId] = optionId;
  if (typeof questionIndex === "number") {
    session.currentQuestionIndex = questionIndex;
  }

  globalAssessmentStore._titanSessions!.set(userId, session);
  return session;
}

/**
 * Submit assessment, compute deterministic scores, and sync to student profile
 */
export async function submitAssessmentSession(
  userId: string,
  targetRoleId: string = "ai_systems_engineer"
): Promise<SkillIntelligenceReport> {
  let session = globalAssessmentStore._titanSessions?.get(userId);
  if (!session) {
    session = await startAssessmentSession(userId);
  }

  session.status = "completed";
  session.completedAt = new Date().toISOString();
  globalAssessmentStore._titanSessions!.set(userId, session);

  const questions = globalAssessmentStore._titanQuestions || DEFAULT_QUESTIONS;
  const computed = computeAssessmentScores(questions, session.responses);

  const targetRole =
    (globalAssessmentStore._titanTargetRoles || DEFAULT_TARGET_ROLES).find((r) => r.id === targetRoleId) ||
    DEFAULT_TARGET_ROLES[0];

  const skillGaps = calculateExplainableGaps(computed.skillBreakdowns, targetRole);

  const report: SkillIntelligenceReport = {
    id: `report-${Date.now()}`,
    userId,
    sessionId: session.id,
    overallReadinessScore: computed.overallReadinessScore,
    technicalScore: computed.technicalScore,
    softSkillScore: computed.softSkillScore,
    aptitudeScore: computed.aptitudeScore,
    careerAlignmentScore: computed.careerAlignmentScore,
    skillBreakdowns: computed.skillBreakdowns,
    strongSkills: computed.strongSkills,
    weakSkills: computed.weakSkills,
    targetRole,
    skillGaps,
    evaluatedAt: new Date().toISOString(),
  };

  globalAssessmentStore._titanReports!.set(userId, report);

  // Sync readiness score with user's student profile
  const user = getUserById(userId);
  if (user && user.studentProfile) {
    user.studentProfile.readinessScore = computed.overallReadinessScore;
    user.updatedAt = new Date().toISOString();
  }

  return report;
}

/**
 * Get the latest Skill Intelligence Report for a user
 */
export async function getSkillIntelligenceReport(
  userId: string,
  targetRoleId?: string
): Promise<SkillIntelligenceReport | null> {
  let report = globalAssessmentStore._titanReports?.get(userId);
  if (!report) {
    // Generate default baseline report for user
    report = await submitAssessmentSession(userId, targetRoleId || "ai_systems_engineer");
  }

  if (targetRoleId && report.targetRole.id !== targetRoleId) {
    const role = (globalAssessmentStore._titanTargetRoles || DEFAULT_TARGET_ROLES).find((r) => r.id === targetRoleId);
    if (role) {
      report.targetRole = role;
      report.skillGaps = calculateExplainableGaps(report.skillBreakdowns, role);
      globalAssessmentStore._titanReports!.set(userId, report);
    }
  }

  return report;
}
