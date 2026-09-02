export type StageState = "completed" | "in_progress" | "failed" | "not_started";

export interface SkillEvidenceItem {
  id: string;
  skillName: string;
  category: string;
  
  // 4 Explicit Evidence Stages
  learningStage: {
    status: StageState;
    label: string; // e.g. "Completed (25 min module)"
    completedAt?: string;
  };
  practiceStage: {
    status: StageState;
    label: string; // e.g. "5/5 Questions Solved" or "Incomplete Sandboxes"
    accuracyPercent?: number;
  };
  assessmentStage: {
    status: StageState;
    label: string; // e.g. "88% Passed" or "42% Failed on JOINs"
    scorePercent?: number;
  };
  provenStatus: "PROVEN" | "UNPROVEN" | "IN_REMEDIATION";
  
  remedialUrl: string;
  evidenceNotes: string;
}

export const SAMPLE_SKILL_EVIDENCE_DATA: SkillEvidenceItem[] = [
  {
    id: "ev-py",
    skillName: "Python & Core Programming",
    category: "Programming & AI",
    learningStage: {
      status: "completed",
      label: "Completed (2 Modules)",
      completedAt: "4 days ago",
    },
    practiceStage: {
      status: "completed",
      label: "8/8 Sandboxes Solved (100%)",
      accuracyPercent: 100,
    },
    assessmentStage: {
      status: "completed",
      label: "88% Score Passed",
      scorePercent: 88,
    },
    provenStatus: "PROVEN",
    remedialUrl: "/practice",
    evidenceNotes: "All 3 evidence pillars satisfied. Verified mastery recorded on institutional ledger.",
  },
  {
    id: "ev-sql",
    skillName: "SQL & Relational Databases",
    category: "Data Systems",
    learningStage: {
      status: "completed",
      label: "Completed (Relational Set Theory)",
      completedAt: "Today, 09:30 AM",
    },
    practiceStage: {
      status: "in_progress",
      label: "Partial (43% Accuracy on Outer Joins)",
      accuracyPercent: 43,
    },
    assessmentStage: {
      status: "failed",
      label: "42% Failed on Multi-Table JOINs",
      scorePercent: 42,
    },
    provenStatus: "UNPROVEN",
    remedialUrl: "/learning/intervention",
    evidenceNotes: "Learning completed, but failed diagnostic probe. Skill remains unproven until verified.",
  },
  {
    id: "ev-pbi",
    skillName: "Power BI & DAX Telemetry",
    category: "Business Intelligence",
    learningStage: {
      status: "completed",
      label: "Completed (Filter Context Video)",
      completedAt: "Yesterday",
    },
    practiceStage: {
      status: "in_progress",
      label: "55% Intermediate Accuracy",
      accuracyPercent: 55,
    },
    assessmentStage: {
      status: "failed",
      label: "62% Below 75% Threshold",
      scorePercent: 62,
    },
    provenStatus: "IN_REMEDIATION",
    remedialUrl: "/learning/intervention",
    evidenceNotes: "Reassessment score (62%) did not reach the 75% bar. Secondary sprint required.",
  },
  {
    id: "ev-dist",
    skillName: "Distributed Systems (Raft)",
    category: "Architecture",
    learningStage: {
      status: "completed",
      label: "Completed (Quorum Simulator)",
      completedAt: "3 days ago",
    },
    practiceStage: {
      status: "completed",
      label: "4/4 Drills Solved (85%)",
      accuracyPercent: 85,
    },
    assessmentStage: {
      status: "completed",
      label: "78% Score Passed",
      scorePercent: 78,
    },
    provenStatus: "PROVEN",
    remedialUrl: "/learning/resources?highlight=Distributed",
    evidenceNotes: "Empirical evidence verified across leader election and partition fault-tolerance.",
  },
  {
    id: "ev-ts",
    skillName: "TypeScript Strict Metaprogramming",
    category: "Software Engineering",
    learningStage: {
      status: "completed",
      label: "Completed (Generics & Type Guards)",
      completedAt: "5 days ago",
    },
    practiceStage: {
      status: "completed",
      label: "6/6 Code Challenges (95%)",
      accuracyPercent: 95,
    },
    assessmentStage: {
      status: "completed",
      label: "92% Score Passed",
      scorePercent: 92,
    },
    provenStatus: "PROVEN",
    remedialUrl: "/practice",
    evidenceNotes: "High-confidence verified competency stamped on public portfolio.",
  },
];
