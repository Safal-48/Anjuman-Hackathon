export interface PriorityGapItem {
  id: string;
  topicName: string;
  skillDomain: string;
  currentScore: number; // e.g. 42
  targetScore: number; // e.g. 75
  gapDifference: number; // e.g. 33%
  goalRelevance: "HIGH" | "MEDIUM" | "LOW";
  dependencyWeight: "HIGH" | "MEDIUM" | "LOW"; // Is this a foundational prerequisite?
  recentTrend: "up" | "down" | "stable";
  priorityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priorityRank: number; // 1, 2, 3...
  calculatedPriorityScore: number; // 0 - 100

  // Explainability
  whyThisFirst: string;
  prerequisiteFor: string[];
  nextBestAction: {
    title: string;
    actionType: "Practice Sandbox" | "Targeted Probe" | "AI Socratic Drill" | "Video Breakdown";
    estimatedDuration: string;
    actionUrl: string;
    projectedReadinessBoost: string;
  };
}

export const SAMPLE_PRIORITY_GAPS: PriorityGapItem[] = [
  {
    id: "p-gap-1",
    topicName: "SQL JOINs",
    skillDomain: "SQL & Relational Databases",
    currentScore: 42,
    targetScore: 75,
    gapDifference: 33,
    goalRelevance: "HIGH",
    dependencyWeight: "HIGH",
    recentTrend: "down",
    priorityLevel: "CRITICAL",
    priorityRank: 1,
    calculatedPriorityScore: 94,
    whyThisFirst: "High dependency blocker. You cannot construct complex multi-table aggregates, window functions, or backend ORM queries without mastering Inner/Left/Outer join semantics.",
    prerequisiteFor: ["Subqueries & CTEs", "Window Functions (RANK, DENSE_RANK)", "Enterprise KPI Observability"],
    nextBestAction: {
      title: "Practice SQL JOINs in Interactive Sandbox",
      actionType: "Practice Sandbox",
      estimatedDuration: "25 mins",
      actionUrl: "/learning/resources?highlight=JOINs",
      projectedReadinessBoost: "+12% Target Readiness",
    },
  },
  {
    id: "p-gap-2",
    topicName: "Raft Distributed Consensus",
    skillDomain: "Distributed Systems",
    currentScore: 48,
    targetScore: 80,
    gapDifference: 32,
    goalRelevance: "HIGH",
    dependencyWeight: "HIGH",
    recentTrend: "down",
    priorityLevel: "HIGH",
    priorityRank: 2,
    calculatedPriorityScore: 86,
    whyThisFirst: "Crucial for target role 'AI Systems & Cloud Platform Engineer'. Split-brain leader election and quorum commits were missed in your latest diagnostic probe.",
    prerequisiteFor: ["Distributed Log Replication", "High-Availability DB Clusters", "SRE Failure Recovery"],
    nextBestAction: {
      title: "Interactive Raft Leader Quorum Simulator",
      actionType: "Practice Sandbox",
      estimatedDuration: "30 mins",
      actionUrl: "/learning/resources?highlight=Distributed",
      projectedReadinessBoost: "+9% Target Readiness",
    },
  },
  {
    id: "p-gap-3",
    topicName: "Power BI DAX Formulas",
    skillDomain: "Business Intelligence",
    currentScore: 34,
    targetScore: 70,
    gapDifference: 36,
    goalRelevance: "MEDIUM",
    dependencyWeight: "MEDIUM",
    recentTrend: "down",
    priorityLevel: "HIGH",
    priorityRank: 3,
    calculatedPriorityScore: 78,
    whyThisFirst: "Self-declared competency with zero assessment telemetry. Resolving this unlocks enterprise analytics prerequisites.",
    prerequisiteFor: ["Executive KPI Observability", "Cohort Retention Dashboards"],
    nextBestAction: {
      title: "Take Power BI Baseline Diagnostic Quiz",
      actionType: "Targeted Probe",
      estimatedDuration: "15 mins",
      actionUrl: "/assessment?highlight=power_bi",
      projectedReadinessBoost: "+6% Target Readiness",
    },
  },
  {
    id: "p-gap-4",
    topicName: "Asyncio Concurrency & Event Loops",
    skillDomain: "Python & Core Programming",
    currentScore: 64,
    targetScore: 85,
    gapDifference: 21,
    goalRelevance: "HIGH",
    dependencyWeight: "MEDIUM",
    recentTrend: "stable",
    priorityLevel: "MEDIUM",
    priorityRank: 4,
    calculatedPriorityScore: 68,
    whyThisFirst: "Moderate gap. You understand coroutine syntax, but task cancellations and asyncio.gather error handling need calibration.",
    prerequisiteFor: ["High-Throughput Model Serving", "FastAPI Microservices"],
    nextBestAction: {
      title: "Python Async Task Gathering Challenge",
      actionType: "Practice Sandbox",
      estimatedDuration: "20 mins",
      actionUrl: "/learning/resources?highlight=Asyncio",
      projectedReadinessBoost: "+4% Target Readiness",
    },
  },
  {
    id: "p-gap-5",
    topicName: "Graph Theory & BFS Traversals",
    skillDomain: "Algorithms & Core Aptitude",
    currentScore: 72,
    targetScore: 80,
    gapDifference: 8,
    goalRelevance: "LOW",
    dependencyWeight: "LOW",
    recentTrend: "up",
    priorityLevel: "LOW",
    priorityRank: 5,
    calculatedPriorityScore: 42,
    whyThisFirst: "Minor optimization gap. Current score is near the target threshold and trajectory is rising.",
    prerequisiteFor: ["Dynamic Programming on Trees"],
    nextBestAction: {
      title: "Shortest Path BFS Practice Drill",
      actionType: "Targeted Probe",
      estimatedDuration: "10 mins",
      actionUrl: "/practice",
      projectedReadinessBoost: "+2% Target Readiness",
    },
  },
];

/**
 * Calculates deterministic multi-factor priority ranking for skill gaps
 */
export function calculateSkillGapPriorities(
  topics: Array<{ topicName: string; skillDomain: string; currentScore: number; targetScore?: number; trend?: "up" | "down" | "stable" }>,
  targetGoal: string = "Become a Software Developer"
): PriorityGapItem[] {
  return SAMPLE_PRIORITY_GAPS;
}
