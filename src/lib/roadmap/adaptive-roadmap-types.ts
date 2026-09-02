export type RoadmapMilestoneStatus =
  | "completed"
  | "proven"
  | "current_priority"
  | "upcoming"
  | "locked";

export interface MilestonePipelineFlow {
  learningResource: {
    title: string;
    type: "Interactive Sandbox" | "Video Breakdown" | "System Walkthrough" | "Code Lab";
    duration: string;
    url: string;
  };
  explanation: {
    keyConcepts: string[];
    socraticSummary: string;
    hinglishAnalogy?: string;
  };
  practice: {
    sandboxTitle: string;
    challengeCount: number;
    estimatedMinutes: number;
    practiceUrl: string;
  };
  assessment: {
    probeTitle: string;
    questionCount: number;
    passThresholdPercentage: number;
    quizUrl: string;
  };
  result: {
    preScore: number; // e.g. 42
    postScore?: number; // e.g. 84
    verifiedDelta?: string; // e.g. "+42% Gain"
    isProven: boolean;
    provenTimestamp?: string;
  };
}

export interface AdaptiveRoadmapNode {
  id: string;
  title: string;
  category: string;
  order: number;
  status: RoadmapMilestoneStatus;
  statusBadge: "✅ Completed" | "🟢 Skill Proven" | "🔴 CURRENT PRIORITY" | "⚪ Upcoming" | "🔒 Locked";
  currentProficiency: number;
  targetProficiency: number;
  relevance: "HIGH" | "MEDIUM" | "LOW";
  dependencyPrerequisites: string[];
  pipelineFlow: MilestonePipelineFlow;
}

export interface AdaptiveTrackRoadmap {
  trackId: string;
  trackTitle: string;
  targetRole: string;
  targetReadinessScore: number;
  currentTrackProgress: number; // 0 - 100
  nodes: AdaptiveRoadmapNode[];
}
