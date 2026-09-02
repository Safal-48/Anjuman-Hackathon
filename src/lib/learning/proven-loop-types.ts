export type ProvenLoopStageStatus = "pending" | "in_progress" | "completed";

export interface ProvenLoopSession {
  id: string;
  skillName: string;
  category: string;
  beforeScore: number; // e.g. 42
  targetThreshold: number; // e.g. 75
  
  // 1. LEARN
  learn: {
    status: ProvenLoopStageStatus;
    resourceTitle: string;
    duration: string;
    completedAt?: string;
  };

  // 2. PRACTICE
  practice: {
    status: ProvenLoopStageStatus;
    questionsCount: number;
    intermediateScore: number; // e.g. 68
    completedAt?: string;
  };

  // 3. PROVE
  prove: {
    status: ProvenLoopStageStatus;
    probeTitle: string;
    questionCount: number;
    completedAt?: string;
  };

  // 4. REASSESS
  reassess: {
    status: ProvenLoopStageStatus;
    finalScore: number; // e.g. 82
    verifiedDelta: string; // e.g. "+40% Gain"
    isSkillProven: boolean; // finalScore >= targetThreshold
    completedAt?: string;
  };

  // Adaptive Loop Continuation if < targetThreshold
  adaptiveInterventionSpawned?: {
    interventionId: string;
    title: string;
    reason: string;
    createdAt: string;
  };
}
