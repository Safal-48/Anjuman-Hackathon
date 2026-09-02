export interface RecommendationWhyThisTelemetry {
  currentProficiency: number; // e.g. 42
  requiredForGoal: "HIGH" | "MEDIUM" | "LOW";
  recentAccuracy: number; // e.g. 39
  repeatedMistakesCount: number; // e.g. 3
  dependencyImportance: "HIGH" | "MEDIUM" | "LOW";
  calculatedPriority: "HIGH" | "MEDIUM" | "LOW";
  dataEvidenceSummary: string;
}

export interface ExplainableRecommendation {
  id: string;
  topic: string;
  skillDomain: string;
  whatIsRecommended: string;
  resourceType: "Interactive Sandbox" | "Video Breakdown" | "System Walkthrough" | "Code Drill" | "Official Docs";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  
  // 4 Core Explainability Pillars
  whyThisReasoning: RecommendationWhyThisTelemetry;
  whatWillItImprove: string;
  whatToDoAfter: string;
  
  actionUrl: string;
  rating: number;
}
