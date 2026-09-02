export type SkillVerificationStatus = "Demonstrated" | "Self-Declared";
export type SkillConfidenceLevel = "High" | "Medium" | "Low";
export type SkillTrendDirection = "up" | "down" | "stable";

export interface SkillPracticeLog {
  id: string;
  date: string;
  activityType: "Sandbox Drill" | "Diagnostic Quiz" | "AI Oral Defense" | "Project Milestone";
  description: string;
  scoreDelta: string;
}

export interface SkillReassessmentLog {
  id: string;
  date: string;
  previousScore: number;
  newScore: number;
  delta: string;
}

export interface SkillDNAItem {
  id: string;
  skillName: string;
  category: string;
  proficiencyScore: number; // 0 - 100
  status: SkillVerificationStatus;
  confidence: SkillConfidenceLevel;
  trend: SkillTrendDirection;
  evidence: string[];
  lastAssessment: string;
  recurringWeakness?: string;
  practiceHistory: SkillPracticeLog[];
  reassessmentHistory: SkillReassessmentLog[];
}
