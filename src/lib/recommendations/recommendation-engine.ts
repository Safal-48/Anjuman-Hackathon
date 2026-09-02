import { ExplainableRecommendation } from "./explainable-recommendations-types";

export const SAMPLE_EXPLAINABLE_RECOMMENDATIONS: ExplainableRecommendation[] = [
  {
    id: "rec-sql-join",
    topic: "SQL JOINs",
    skillDomain: "SQL & Relational Databases",
    whatIsRecommended: "Interactive SQL JOINs Practice Sandbox & Relational Venn Simulator",
    resourceType: "Interactive Sandbox",
    duration: "25 mins",
    difficulty: "Intermediate",
    whyThisReasoning: {
      currentProficiency: 42,
      requiredForGoal: "HIGH",
      recentAccuracy: 39,
      repeatedMistakesCount: 3,
      dependencyImportance: "HIGH",
      calculatedPriority: "HIGH",
      dataEvidenceSummary: "Logged 3 repeated errors when resolving NULLs in LEFT vs INNER joins during your diagnostic assessment.",
    },
    whatWillItImprove: "Closes your 33% gap on Relational Multi-Table Queries, elevating overall SQL Readiness from 51% to 75% and unblocking backend ORM data fetching.",
    whatToDoAfter: "Take a 5-minute Reassessment Probe on Subqueries & CTEs to verify permanent concept retention.",
    actionUrl: "https://sqlbolt.com/lesson/select_queries_with_joins",
    rating: 4.9,
  },
  {
    id: "rec-raft-consensus",
    topic: "Raft Consensus",
    skillDomain: "Distributed Systems",
    whatIsRecommended: "Raft Distributed Consensus & Quorum Failure Simulator",
    resourceType: "System Walkthrough",
    duration: "40 mins",
    difficulty: "Advanced",
    whyThisReasoning: {
      currentProficiency: 48,
      requiredForGoal: "HIGH",
      recentAccuracy: 45,
      repeatedMistakesCount: 2,
      dependencyImportance: "HIGH",
      calculatedPriority: "HIGH",
      dataEvidenceSummary: "Split-brain leader election and quorum commit acknowledgments were missed in the latest system architecture probe.",
    },
    whatWillItImprove: "Mastery of majority quorum (N/2 + 1) commits, partition fault recovery, and leader election safeguards for high-availability cloud systems.",
    whatToDoAfter: "Complete a hands-on Node Partition recovery drill in the Distributed Systems Arena.",
    actionUrl: "https://raft.github.io/",
    rating: 4.9,
  },
  {
    id: "rec-py-asyncio",
    topic: "Async Concurrency",
    skillDomain: "Python & Core Programming",
    whatIsRecommended: "Python Asyncio Event Loop & Concurrent Task Gathering Masterclass",
    resourceType: "Code Drill",
    duration: "30 mins",
    difficulty: "Intermediate",
    whyThisReasoning: {
      currentProficiency: 64,
      requiredForGoal: "HIGH",
      recentAccuracy: 60,
      repeatedMistakesCount: 1,
      dependencyImportance: "MEDIUM",
      calculatedPriority: "MEDIUM",
      dataEvidenceSummary: "Understands coroutine syntax, but task cancellation propagation and gather error handling need calibration.",
    },
    whatWillItImprove: "Enables building non-blocking high-throughput FastAPI web endpoints and LLM streaming pipelines.",
    whatToDoAfter: "Implement an asynchronous background worker queue with exponential retry backoff.",
    actionUrl: "https://docs.python.org/3/library/asyncio.html",
    rating: 4.8,
  },
  {
    id: "rec-pbi-dax",
    topic: "Power BI DAX Formulas",
    skillDomain: "Business Intelligence",
    whatIsRecommended: "Power BI DAX Filter Context & Calculate Engine Deep Dive",
    resourceType: "Video Breakdown",
    duration: "35 mins",
    difficulty: "Beginner",
    whyThisReasoning: {
      currentProficiency: 34,
      requiredForGoal: "MEDIUM",
      recentAccuracy: 30,
      repeatedMistakesCount: 2,
      dependencyImportance: "MEDIUM",
      calculatedPriority: "HIGH",
      dataEvidenceSummary: "Self-declared competency with zero diagnostic assessment telemetry; requires baseline foundation.",
    },
    whatWillItImprove: "Unlocks ability to create dynamic multi-metric KPI dashboards, cohort retention heatmaps, and executive reports.",
    whatToDoAfter: "Take the Power BI Baseline Diagnostic Probe on the Skills Command Center.",
    actionUrl: "https://learn.microsoft.com/en-us/dax/",
    rating: 4.7,
  },
  {
    id: "rec-bfs-graph",
    topic: "Graph Traversals (BFS)",
    skillDomain: "Algorithms & Aptitude",
    whatIsRecommended: "Shortest Path BFS & Queue-Based State Exploration",
    resourceType: "Interactive Sandbox",
    duration: "20 mins",
    difficulty: "Intermediate",
    whyThisReasoning: {
      currentProficiency: 72,
      requiredForGoal: "LOW",
      recentAccuracy: 75,
      repeatedMistakesCount: 0,
      dependencyImportance: "LOW",
      calculatedPriority: "LOW",
      dataEvidenceSummary: "Near target readiness threshold with a positive learning trajectory.",
    },
    whatWillItImprove: "Refines edge-case handling on cyclic graphs and unweighted shortest-path calculations.",
    whatToDoAfter: "Progress to Dijkstra's Algorithm and Weighted Graph Optimizations.",
    actionUrl: "https://visualgo.net/en/dfsbfs",
    rating: 4.9,
  },
];

export async function getExplainableRecommendations(topicHighlight?: string): Promise<ExplainableRecommendation[]> {
  if (!topicHighlight) return SAMPLE_EXPLAINABLE_RECOMMENDATIONS;
  const filtered = SAMPLE_EXPLAINABLE_RECOMMENDATIONS.filter(
    (r) =>
      r.topic.toLowerCase().includes(topicHighlight.toLowerCase()) ||
      r.skillDomain.toLowerCase().includes(topicHighlight.toLowerCase()) ||
      r.whatIsRecommended.toLowerCase().includes(topicHighlight.toLowerCase())
  );
  return filtered.length > 0 ? filtered : SAMPLE_EXPLAINABLE_RECOMMENDATIONS;
}
