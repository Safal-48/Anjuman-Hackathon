export interface MistakeOccurrence {
  stage: "Assessment 1" | "Practice Sandbox" | "Assessment 2" | "Mock Interview";
  date: string;
  result: "failed" | "passed";
  questionSnippet: string;
  identifiedMisconception: string;
}

export interface RecurringMistakeItem {
  id: string;
  conceptName: string;
  skillDomain: string;
  consecutiveFailuresCount: number;
  status: "Recurring Weakness" | "Under Remediation" | "Resolved";
  history: MistakeOccurrence[];
  targetedInterventionUrl: string;
  suggestedAction: string;
}

export interface SkillDecayItem {
  id: string;
  skillName: string;
  category: string;
  peakScore: number; // e.g. 84
  currentScore: number; // e.g. 63
  decayDelta: number; // e.g. -21%
  lastPracticedDaysAgo: number; // e.g. 14
  decayRisk: "HIGH" | "MODERATE" | "STABLE";
  reinforcementRecommendation: string;
  remedialUrl: string;
}

export const SAMPLE_RECURRING_MISTAKES: RecurringMistakeItem[] = [
  {
    id: "rm-sql-join",
    conceptName: "SQL JOINs (NULL Handling & Inactive Records)",
    skillDomain: "SQL & Relational Databases",
    consecutiveFailuresCount: 3,
    status: "Recurring Weakness",
    history: [
      {
        stage: "Assessment 1",
        date: "3 days ago",
        result: "failed",
        questionSnippet: "Preserving zero-order customers in Customer-Order query",
        identifiedMisconception: "Selected INNER JOIN instead of LEFT JOIN.",
      },
      {
        stage: "Practice Sandbox",
        date: "2 days ago",
        result: "failed",
        questionSnippet: "Calculating revenue with COALESCE fallback",
        identifiedMisconception: "Used COUNT(*) on grouped tuple containing NULLs.",
      },
      {
        stage: "Assessment 2",
        date: "Today, 09:10 AM",
        result: "failed",
        questionSnippet: "Multi-table left outer join with NULL predicates",
        identifiedMisconception: "Nested subquery selected with O(N²) execution latency.",
      },
    ],
    suggestedAction: "Launch Targeted 15-Minute SQL JOIN Remediation Sprint",
    targetedInterventionUrl: "/learning/intervention",
  },
  {
    id: "rm-dist-quorum",
    conceptName: "Raft Quorum Commit Acknowledgments",
    skillDomain: "Distributed Systems",
    consecutiveFailuresCount: 2,
    status: "Recurring Weakness",
    history: [
      {
        stage: "Assessment 1",
        date: "4 days ago",
        result: "failed",
        questionSnippet: "Leader split-brain log replication commit criteria",
        identifiedMisconception: "Assumed unanimous 100% agreement required rather than majority quorum (N/2 + 1).",
      },
      {
        stage: "Practice Sandbox",
        date: "Yesterday",
        result: "failed",
        questionSnippet: "Network partition minority cluster behavior",
        identifiedMisconception: "Allowed minority partition to acknowledge write commitments.",
      },
    ],
    suggestedAction: "Interactive Raft Leader Quorum Simulator Drill",
    targetedInterventionUrl: "/learning/resources?highlight=Distributed",
  },
];

export const SAMPLE_SKILL_DECAY_DATA: SkillDecayItem[] = [
  {
    id: "decay-sql",
    skillName: "SQL & Relational Queries",
    category: "Data Systems",
    peakScore: 84,
    currentScore: 63,
    decayDelta: -21,
    lastPracticedDaysAgo: 16,
    decayRisk: "HIGH",
    reinforcementRecommendation: "Spaced repetition recommended! 16 days since last practice; query optimization reflexes have decayed by 21%.",
    remedialUrl: "/learning/intervention",
  },
  {
    id: "decay-dist",
    skillName: "Distributed Systems (CAP & Raft)",
    category: "Architecture",
    peakScore: 82,
    currentScore: 74,
    decayDelta: -8,
    lastPracticedDaysAgo: 9,
    decayRisk: "MODERATE",
    reinforcementRecommendation: "Quick 5-minute refresher quiz recommended to retain Raft leader election edge cases.",
    remedialUrl: "/assessment",
  },
  {
    id: "decay-py",
    skillName: "Python & Core Programming",
    category: "Programming & AI",
    peakScore: 88,
    currentScore: 85,
    decayDelta: -3,
    lastPracticedDaysAgo: 2,
    decayRisk: "STABLE",
    reinforcementRecommendation: "Retention is high and stable (+85%). Ready for advanced async challenge.",
    remedialUrl: "/practice",
  },
];
