import { SkillDNAItem } from "./skill-dna-types";

// In-memory persistent storage for Personal Skill DNA
const globalSkillDNAStore = global as unknown as {
  _titanSkillDNA?: Map<string, SkillDNAItem[]>;
};

export const DEFAULT_SKILL_DNA: SkillDNAItem[] = [
  {
    id: "dna-py",
    skillName: "Python",
    category: "Core Programming & AI",
    proficiencyScore: 82,
    status: "Demonstrated",
    confidence: "High",
    trend: "up",
    evidence: [
      "Passed Diagnostic Assessment Probe (88% in Data Structures)",
      "Completed 4 hands-on Asyncio sandboxes",
      "Git commit telemetry: 14 verified PyTorch repositories",
    ],
    lastAssessment: "Today, 08:45 AM",
    practiceHistory: [
      { id: "p1", date: "Today", activityType: "Diagnostic Quiz", description: "Python Data Structures & Hash Complexity", scoreDelta: "+4%" },
      { id: "p2", date: "2 days ago", activityType: "Sandbox Drill", description: "Asyncio Event Loop Concurrency", scoreDelta: "+6%" },
    ],
    reassessmentHistory: [
      { id: "r1", date: "Today", previousScore: 76, newScore: 82, delta: "+6%" },
      { id: "r2", date: "Last Week", previousScore: 68, newScore: 76, delta: "+8%" },
    ],
  },
  {
    id: "dna-sql",
    skillName: "SQL & Databases",
    category: "Data Systems",
    proficiencyScore: 51,
    status: "Demonstrated",
    confidence: "Medium",
    trend: "down",
    recurringWeakness: "SQL JOINs & Correlated Subqueries",
    evidence: [
      "Diagnostic Assessment: Basics 86%, Filtering 78%, Aggregation 71%",
      "Critical Gap detected: JOINs (42%), Advanced SQL (32%)",
    ],
    lastAssessment: "Today, 09:10 AM",
    practiceHistory: [
      { id: "p3", date: "Today", activityType: "Diagnostic Quiz", description: "Relational Joins & Subqueries Probe", scoreDelta: "-3%" },
      { id: "p4", date: "3 days ago", activityType: "Sandbox Drill", description: "GROUP BY & HAVING clauses", scoreDelta: "+5%" },
    ],
    reassessmentHistory: [
      { id: "r3", date: "Today", previousScore: 54, newScore: 51, delta: "-3%" },
    ],
  },
  {
    id: "dna-pbi",
    skillName: "Power BI & Telemetry",
    category: "Business Intelligence",
    proficiencyScore: 34,
    status: "Self-Declared",
    confidence: "Low",
    trend: "down",
    recurringWeakness: "DAX Formulas & KPI Dashboards",
    evidence: [
      "Self-Declared by student during onboarding (Unverified)",
      "Zero diagnostic assessment attempts logged",
    ],
    lastAssessment: "Never Assessed",
    practiceHistory: [],
    reassessmentHistory: [],
  },
  {
    id: "dna-ts",
    skillName: "TypeScript & React",
    category: "Web Systems",
    proficiencyScore: 92,
    status: "Demonstrated",
    confidence: "High",
    trend: "up",
    evidence: [
      "Passed Next.js App Router & Server Components Probe (95%)",
      "Cryptographic Hash Provenance: TITAN-VERIF-9F8A",
    ],
    lastAssessment: "Yesterday, 04:30 PM",
    practiceHistory: [
      { id: "p5", date: "Yesterday", activityType: "Project Milestone", description: "Strict Metaprogramming & CVA Components", scoreDelta: "+2%" },
    ],
    reassessmentHistory: [
      { id: "r4", date: "Yesterday", previousScore: 90, newScore: 92, delta: "+2%" },
    ],
  },
  {
    id: "dna-dist",
    skillName: "Distributed Systems",
    category: "Cloud & DevOps",
    proficiencyScore: 48,
    status: "Demonstrated",
    confidence: "Medium",
    trend: "down",
    recurringWeakness: "Raft Consensus & Split-Brain Quorum",
    evidence: [
      "Diagnostic Assessment: Consensus Failure Modes (48%)",
    ],
    lastAssessment: "Today, 09:20 AM",
    practiceHistory: [
      { id: "p6", date: "Today", activityType: "Diagnostic Quiz", description: "CAP Theorem & Partition Safety", scoreDelta: "-4%" },
    ],
    reassessmentHistory: [
      { id: "r5", date: "Today", previousScore: 52, newScore: 48, delta: "-4%" },
    ],
  },
];

export async function getPersonalSkillDNA(userId: string): Promise<SkillDNAItem[]> {
  if (!globalSkillDNAStore._titanSkillDNA) {
    globalSkillDNAStore._titanSkillDNA = new Map();
  }

  const existing = globalSkillDNAStore._titanSkillDNA.get(userId);
  if (existing) return existing;

  globalSkillDNAStore._titanSkillDNA.set(userId, [...DEFAULT_SKILL_DNA]);
  return DEFAULT_SKILL_DNA;
}

export async function evolveSkillDNA(
  userId: string,
  skillName: string,
  demonstratedScore: number,
  evidenceText: string
): Promise<SkillDNAItem[]> {
  const list = await getPersonalSkillDNA(userId);
  const updated = list.map((item) => {
    if (item.skillName.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(item.skillName.toLowerCase())) {
      const prevScore = item.proficiencyScore;
      const deltaNum = demonstratedScore - prevScore;
      const deltaStr = deltaNum >= 0 ? `+${deltaNum}%` : `${deltaNum}%`;
      const trend = deltaNum > 0 ? ("up" as const) : deltaNum < 0 ? ("down" as const) : ("stable" as const);
      
      const newReassessment = {
        id: `r-${Date.now()}`,
        date: "Just now",
        previousScore: prevScore,
        newScore: demonstratedScore,
        delta: deltaStr,
      };

      return {
        ...item,
        proficiencyScore: demonstratedScore,
        status: "Demonstrated" as const,
        confidence: "High" as const,
        trend,
        lastAssessment: "Just now",
        evidence: [evidenceText, ...item.evidence],
        reassessmentHistory: [newReassessment, ...item.reassessmentHistory],
      };
    }
    return item;
  });

  globalSkillDNAStore._titanSkillDNA?.set(userId, updated);
  return updated;
}
