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
      { skillName: "SQL & Data Engineering", category: "Data Systems", requiredScore: 85, weight: 1.2 },
      { skillName: "React / Next.js", category: "Web Systems", requiredScore: 75, weight: 0.8 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 85, weight: 1.2 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 90, weight: 1.4 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 85, weight: 1.0 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
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
      { skillName: "SQL & Data Engineering", category: "Data Systems", requiredScore: 88, weight: 1.3 },
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 85, weight: 1.2 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 88, weight: 1.3 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 80, weight: 1.0 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 85, weight: 1.0 },
    ],
  },
  {
    id: "data_analyst_engineer",
    title: "Data Analyst & Business Intelligence Engineer",
    description: "Specializes in relational database queries, data modeling, SQL analytics, and Power BI dashboards.",
    requiredReadinessScore: 80,
    requiredSkills: [
      { skillName: "SQL & Data Engineering", category: "Data Systems", requiredScore: 92, weight: 1.6 },
      { skillName: "Python & Data Structures", category: "Data Science", requiredScore: 85, weight: 1.3 },
      { skillName: "Statistics & Aptitude", category: "Core Aptitude", requiredScore: 85, weight: 1.2 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 80, weight: 1.0 },
      { skillName: "Communication", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
    ],
  },
];

export const DEFAULT_QUESTIONS: AssessmentQuestion[] = [
  // --------------------------------------------------------------------------
  // 1. SQL TOPICS & SUB-SKILLS
  // --------------------------------------------------------------------------
  {
    id: "q-sql-01",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Basics",
    difficulty: "easy",
    questionText: "Which SQL clause is used to eliminate duplicate rows from a query result set?",
    questionType: "single_choice",
    displayOrder: 1,
    explanation: "The `DISTINCT` keyword following `SELECT` removes duplicate records from the returned dataset.",
    options: [
      { id: "opt-s1a", text: "SELECT UNIQUE col FROM table;", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s1b", text: "SELECT DISTINCT col FROM table;", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s1c", text: "SELECT DIFFERENT col FROM table;", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s1d", text: "SELECT DEDUPLICATE col FROM table;", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-02",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Filtering",
    difficulty: "easy",
    questionText: "When filtering records in SQL, which operator allows you to specify multiple discrete candidate values in a `WHERE` predicate?",
    questionType: "single_choice",
    displayOrder: 2,
    explanation: "The `IN` operator allows checking if a column value matches any value within a specified list or subquery.",
    options: [
      { id: "opt-s2a", text: "WHERE status IN ('active', 'pending', 'verified')", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s2b", text: "WHERE status WITHIN ('active', 'pending')", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s2c", text: "WHERE status CONTAINS ('active')", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s2d", text: "WHERE status MATCH ('active')", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-03",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Aggregation",
    difficulty: "medium",
    questionText: "What is the critical semantic difference between `WHERE` and `HAVING` clauses in SQL?",
    questionType: "single_choice",
    displayOrder: 3,
    explanation: "`WHERE` filters individual rows before grouping occurs, while `HAVING` filters aggregated group records after `GROUP BY` calculation.",
    options: [
      { id: "opt-s3a", text: "WHERE filters rows before aggregation; HAVING filters aggregated group metrics post-GROUP BY.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s3b", text: "HAVING filters rows before aggregation; WHERE filters groups.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s3c", text: "WHERE and HAVING are 100% interchangeable synonyms in standard ANSI SQL.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s3d", text: "HAVING can only be used with subqueries.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-04",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "GROUP BY",
    difficulty: "medium",
    questionText: "In SQL, what happens if you select a non-aggregated column that is NOT included in the `GROUP BY` clause under standard SQL modes?",
    questionType: "single_choice",
    displayOrder: 4,
    explanation: "Standard ANSI SQL raises an error because the engine cannot determine which row's value to represent for the grouped tuple.",
    options: [
      { id: "opt-s4a", text: "The engine raises a syntax error (or unpredictable non-deterministic values without ONLY_FULL_GROUP_BY).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s4b", text: "The engine automatically computes the average across all non-grouped columns.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s4c", text: "The engine automatically drops that column from the output.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s4d", text: "The query automatically converts to a DISTINCT subquery.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-05",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "JOINs",
    difficulty: "medium",
    questionText: "You have a `Customers` table (100 rows) and an `Orders` table (50 rows). A `LEFT JOIN` on `Customers.id = Orders.customer_id` will return:",
    questionType: "single_choice",
    displayOrder: 5,
    explanation: "A `LEFT JOIN` preserves all rows from the left table (`Customers`), populating matching order fields or `NULL` if a customer has zero orders.",
    options: [
      { id: "opt-s5a", text: "At least 100 rows (all customers preserved, with NULLs for customers without orders).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s5b", text: "Exactly 50 rows (only customers with active orders).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s5c", text: "Exactly 5000 rows (Cartesian product).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s5d", text: "Only customers who have placed more than 2 orders.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-06",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Subqueries",
    difficulty: "hard",
    questionText: "What is the primary performance drawback of a Correlated Subquery evaluated in a `WHERE` clause compared to a JOIN or Window Function?",
    questionType: "single_choice",
    displayOrder: 6,
    explanation: "A correlated subquery references columns from the outer query, causing the inner query to re-execute for each individual row of the outer table (O(N*M) complexity).",
    options: [
      { id: "opt-s6a", text: "It executes row-by-row for every candidate row of the outer query, resulting in O(N*M) performance bottlenecks.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s6b", text: "Correlated subqueries cannot access indexed columns.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s6c", text: "They cause immediate deadlocks on read-only transactions.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s6d", text: "They can only return scalar string values.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-07",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Advanced SQL",
    difficulty: "hard",
    questionText: "What does `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)` compute?",
    questionType: "single_choice",
    displayOrder: 7,
    explanation: "`DENSE_RANK()` assigns ranks within each department partition by salary without skipping rank numbers when ties occur.",
    options: [
      { id: "opt-s7a", text: "Consecutive ranking of salaries within each department without skipping rank numbers on ties (e.g. 1, 2, 2, 3).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s7b", text: "Skipping ranks on ties (e.g. 1, 2, 2, 4).", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-s7c", text: "The cumulative running total salary per department.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s7d", text: "A random distribution hash for sharding.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. PYTHON & MACHINE LEARNING
  // --------------------------------------------------------------------------
  {
    id: "q-py-01",
    category: "technical",
    skillTag: "Python & Core Programming",
    subTopic: "Data Structures",
    difficulty: "medium",
    questionText: "In Python, what is the average time complexity of checking membership (`x in collection`) for a `set` vs. a `list`?",
    questionType: "single_choice",
    displayOrder: 8,
    explanation: "Python `set` uses hash tables yielding O(1) average lookup, whereas `list` requires linear O(N) scan.",
    options: [
      { id: "opt-p1a", text: "Set: O(1) average hash lookup; List: O(N) linear iteration.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-p1b", text: "Both Set and List have O(log N) binary search complexity.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-p1c", text: "Set: O(N); List: O(1).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-p1d", text: "Set lookup requires sorting the collection on every query.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-py-02",
    category: "technical",
    skillTag: "Python & Core Programming",
    subTopic: "Async Concurrency",
    difficulty: "hard",
    questionText: "What is the primary benefit of `asyncio.gather(*tasks)` in Python asynchronous architectures?",
    questionType: "single_choice",
    displayOrder: 9,
    explanation: "`asyncio.gather()` schedules multiple coroutines concurrently on the event loop and awaits all results concurrently without blocking.",
    options: [
      { id: "opt-p2a", text: "Executes multiple asynchronous coroutines concurrently on the event loop and returns an aggregated result list.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-p2b", text: "Spawns multiple OS processes to bypass the Python GIL for CPU-bound tasks.", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-p2c", text: "Forces tasks to execute strictly sequentially in FIFO order.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-p2d", text: "Automatically parallelizes execution across GPU cores.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. DISTRIBUTED SYSTEMS & ARCHITECTURE
  // --------------------------------------------------------------------------
  {
    id: "q-dist-01",
    category: "technical",
    skillTag: "Distributed Systems",
    subTopic: "Consensus",
    difficulty: "hard",
    questionText: "In the Raft consensus algorithm, how does a cluster guarantee safety and prevent split-brain leader commits during network partition?",
    questionType: "single_choice",
    displayOrder: 10,
    explanation: "A Raft leader must receive write acknowledgments from a strict majority quorum (`N/2 + 1`) of active nodes before committing a log entry.",
    options: [
      { id: "opt-d1a", text: "Writes require majority quorum confirmation (`N/2 + 1` nodes); a minority partition cannot commit log entries.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-d1b", text: "Any isolated node can commit writes locally and reconcile later via eventual consistency.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-d1c", text: "Raft requires 100% unanimous agreement from all nodes before acknowledging any write.", scoreWeight: 0.1, isCorrect: false },
      { id: "opt-d1d", text: "Leaders are elected strictly using physical hardware timestamp comparisons.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 4. APTITUDE & COMPLEXITY
  // --------------------------------------------------------------------------
  {
    id: "q-apt-01",
    category: "aptitude",
    skillTag: "Algorithms & Complexity",
    subTopic: "Graph Theory",
    difficulty: "medium",
    questionText: "What is the time complexity of Breadth-First Search (BFS) on an unweighted graph represented as an Adjacency List with `V` vertices and `E` edges?",
    questionType: "single_choice",
    displayOrder: 11,
    explanation: "BFS visits each vertex once and traverses each edge once, leading to O(V + E) complexity.",
    options: [
      { id: "opt-a1a", text: "O(V + E)", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-a1b", text: "O(V * E)", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-a1c", text: "O(V²)", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-a1d", text: "O(log V)", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. SOFT SKILL: COLLABORATION
  // --------------------------------------------------------------------------
  {
    id: "q-soft-01",
    category: "soft_skill",
    skillTag: "Team Collaboration",
    subTopic: "Conflict Resolution",
    difficulty: "medium",
    questionText: "A critical architectural disagreement arises between frontend and backend leads 48 hours before launch. What is the optimal engineering approach?",
    questionType: "single_choice",
    displayOrder: 12,
    explanation: "Collaborative engineering teams formalize unified interface contracts (e.g. OpenAPI / TypeScript schemas) and write automated contract tests.",
    options: [
      { id: "opt-so1a", text: "Define a shared TypeScript interface / API schema contract and unblock parallel progress via mock stubs.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-so1b", text: "Delay all frontend development until the backend is 100% deployed to production.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-so1c", text: "Rewrite the entire backend in Python without consulting the team.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-so1d", text: "Cancel the release indefinitely.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
];

export async function getAllQuestions(category?: string): Promise<AssessmentQuestion[]> {
  if (!globalAssessmentStore._titanQuestions) {
    globalAssessmentStore._titanQuestions = [...DEFAULT_QUESTIONS];
  }
  if (category && category !== "all") {
    return globalAssessmentStore._titanQuestions.filter((q) => q.category === category);
  }
  return globalAssessmentStore._titanQuestions;
}

export async function getAdaptiveDiagnosticQuestions(context?: {
  primaryLearningGoal?: string;
  skills?: string[];
  currentLevel?: string;
}): Promise<AssessmentQuestion[]> {
  const all = await getAllQuestions();

  // If student specifically targeted SQL or Python, ensure their core sub-topics appear first
  if (context?.primaryLearningGoal?.toLowerCase().includes("sql")) {
    const sqlQuestions = all.filter((q) => q.skillTag.includes("SQL"));
    const otherQuestions = all.filter((q) => !q.skillTag.includes("SQL"));
    return [...sqlQuestions, ...otherQuestions];
  }

  if (context?.primaryLearningGoal?.toLowerCase().includes("python")) {
    const pyQuestions = all.filter((q) => q.skillTag.includes("Python") || q.skillTag.includes("AI"));
    const otherQuestions = all.filter((q) => !q.skillTag.includes("Python") && !q.skillTag.includes("AI"));
    return [...pyQuestions, ...otherQuestions];
  }

  return all;
}

export async function getTargetRoles(): Promise<TargetRoleBenchmark[]> {
  if (!globalAssessmentStore._titanTargetRoles) {
    globalAssessmentStore._titanTargetRoles = [...DEFAULT_TARGET_ROLES];
  }
  return globalAssessmentStore._titanTargetRoles;
}

export async function getTargetRoleById(id: string): Promise<TargetRoleBenchmark | null> {
  const roles = await getTargetRoles();
  return roles.find((r) => r.id === id) || roles[0] || null;
}

export async function getAssessmentSession(userId: string): Promise<AssessmentSession | null> {
  if (!globalAssessmentStore._titanSessions) {
    globalAssessmentStore._titanSessions = new Map();
  }
  return globalAssessmentStore._titanSessions.get(userId) || null;
}

export async function saveAssessmentAnswer(
  userId: string,
  questionId: string,
  optionId: string,
  currentQuestionIndex: number = 0
): Promise<AssessmentSession> {
  if (!globalAssessmentStore._titanSessions) {
    globalAssessmentStore._titanSessions = new Map();
  }

  const existing = globalAssessmentStore._titanSessions.get(userId) || {
    id: `sess-${Date.now()}`,
    userId,
    status: "in_progress",
    currentQuestionIndex: 0,
    responses: {},
    startedAt: new Date().toISOString(),
  };

  existing.responses[questionId] = optionId;
  existing.currentQuestionIndex = currentQuestionIndex;
  globalAssessmentStore._titanSessions.set(userId, existing);

  return existing;
}

export async function submitAssessmentSession(
  userId: string,
  targetRoleId?: string
): Promise<SkillIntelligenceReport> {
  const session = await getAssessmentSession(userId);
  const questions = await getAllQuestions();
  const responses = session?.responses || {};

  // Compute multi-vector scores & sub-topic granular mastery
  const computed = computeAssessmentScores(questions, responses);

  // Select target role
  const targetRole = targetRoleId
    ? (await getTargetRoleById(targetRoleId)) || DEFAULT_TARGET_ROLES[0]
    : DEFAULT_TARGET_ROLES[0];

  // Calculate explainable gaps
  const skillGaps = calculateExplainableGaps(computed.skillBreakdowns, targetRole);

  const report: SkillIntelligenceReport = {
    id: `rep-${Date.now()}`,
    userId,
    sessionId: session?.id,
    overallReadinessScore: computed.overallReadinessScore,
    technicalScore: computed.technicalScore,
    softSkillScore: computed.softSkillScore,
    aptitudeScore: computed.aptitudeScore,
    careerAlignmentScore: computed.careerAlignmentScore,
    skillBreakdowns: computed.skillBreakdowns,
    topicBreakdowns: computed.topicBreakdowns,
    diagnosticInsights: computed.diagnosticInsights,
    strongSkills: computed.strongSkills,
    weakSkills: computed.weakSkills,
    targetRole,
    skillGaps,
    evaluatedAt: new Date().toISOString(),
  };

  if (!globalAssessmentStore._titanReports) {
    globalAssessmentStore._titanReports = new Map();
  }
  globalAssessmentStore._titanReports.set(userId, report);

  if (session) {
    session.status = "completed";
    session.completedAt = new Date().toISOString();
    globalAssessmentStore._titanSessions?.set(userId, session);
  }

  return report;
}

export async function getLatestSkillReport(
  userId: string,
  targetRoleId?: string
): Promise<SkillIntelligenceReport | null> {
  if (!globalAssessmentStore._titanReports) {
    globalAssessmentStore._titanReports = new Map();
  }

  const report = globalAssessmentStore._titanReports.get(userId);
  if (report) return report;

  // Generate deterministic baseline report if none exists
  const questions = await getAllQuestions();
  const sampleResponses: Record<string, string> = {
    "q-sql-01": "opt-s1b",
    "q-sql-02": "opt-s2a",
    "q-sql-03": "opt-s3a",
    "q-sql-04": "opt-s4a",
    "q-sql-05": "opt-s5b", // deliberately wrong for sub-topic demo (e.g. JOINs: 42%)
    "q-sql-06": "opt-s6a",
    "q-sql-07": "opt-s7b",
    "q-py-01": "opt-p1a",
    "q-py-02": "opt-p2a",
    "q-dist-01": "opt-d1a",
    "q-apt-01": "opt-a1a",
    "q-soft-01": "opt-so1a",
  };

  const computed = computeAssessmentScores(questions, sampleResponses);
  const targetRole = targetRoleId
    ? (await getTargetRoleById(targetRoleId)) || DEFAULT_TARGET_ROLES[0]
    : DEFAULT_TARGET_ROLES[0];
  const skillGaps = calculateExplainableGaps(computed.skillBreakdowns, targetRole);

  const fallbackReport: SkillIntelligenceReport = {
    id: `rep-default-${userId}`,
    userId,
    overallReadinessScore: computed.overallReadinessScore,
    technicalScore: computed.technicalScore,
    softSkillScore: computed.softSkillScore,
    aptitudeScore: computed.aptitudeScore,
    careerAlignmentScore: computed.careerAlignmentScore,
    skillBreakdowns: computed.skillBreakdowns,
    topicBreakdowns: computed.topicBreakdowns,
    diagnosticInsights: computed.diagnosticInsights,
    strongSkills: computed.strongSkills,
    weakSkills: computed.weakSkills,
    targetRole,
    skillGaps,
    evaluatedAt: new Date().toISOString(),
  };

  globalAssessmentStore._titanReports.set(userId, fallbackReport);
  return fallbackReport;
}

// Backwards-Compatible API Aliases
export const getAssessmentQuestions = getAllQuestions;
export const getActiveSession = getAssessmentSession;
export const getSkillIntelligenceReport = getLatestSkillReport;

export async function startAssessmentSession(userId: string): Promise<AssessmentSession> {
  const existing = await getAssessmentSession(userId);
  if (existing && existing.status === "in_progress") return existing;
  
  const newSess: AssessmentSession = {
    id: `sess-${Date.now()}`,
    userId,
    status: "in_progress",
    currentQuestionIndex: 0,
    responses: {},
    startedAt: new Date().toISOString(),
  };

  if (!globalAssessmentStore._titanSessions) {
    globalAssessmentStore._titanSessions = new Map();
  }
  globalAssessmentStore._titanSessions.set(userId, newSess);
  return newSess;
}
