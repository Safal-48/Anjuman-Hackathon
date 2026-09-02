import { ProvenLoopSession } from "./proven-loop-types";

export const SAMPLE_PROVEN_SESSIONS: ProvenLoopSession[] = [
  {
    id: "loop-sql-join",
    skillName: "SQL JOINs",
    category: "Data Systems",
    beforeScore: 42,
    targetThreshold: 75,
    learn: {
      status: "completed",
      resourceTitle: "Relational Multi-Table Overlap & COALESCE Guardrails",
      duration: "15 mins",
      completedAt: "Today, 09:30 AM",
    },
    practice: {
      status: "completed",
      questionsCount: 5,
      intermediateScore: 68,
      completedAt: "Today, 09:45 AM",
    },
    prove: {
      status: "completed",
      probeTitle: "Timed SQL JOINs Diagnostic Probe",
      questionCount: 5,
      completedAt: "Today, 10:00 AM",
    },
    reassess: {
      status: "completed",
      finalScore: 82,
      verifiedDelta: "+40% Gain",
      isSkillProven: true,
      completedAt: "Today, 10:05 AM",
    },
  },
  {
    id: "loop-raft-consensus",
    skillName: "Raft Distributed Consensus",
    category: "Distributed Systems",
    beforeScore: 48,
    targetThreshold: 75,
    learn: {
      status: "completed",
      resourceTitle: "Majority Quorum (N/2 + 1) Leader Election Simulator",
      duration: "25 mins",
      completedAt: "Yesterday, 04:10 PM",
    },
    practice: {
      status: "completed",
      questionsCount: 4,
      intermediateScore: 65,
      completedAt: "Yesterday, 04:35 PM",
    },
    prove: {
      status: "completed",
      probeTitle: "Partition Fault-Tolerance Probe",
      questionCount: 4,
      completedAt: "Yesterday, 04:50 PM",
    },
    reassess: {
      status: "completed",
      finalScore: 78,
      verifiedDelta: "+30% Gain",
      isSkillProven: true,
      completedAt: "Yesterday, 04:55 PM",
    },
  },
  {
    id: "loop-power-bi",
    skillName: "Power BI DAX Formulas",
    category: "Business Intelligence",
    beforeScore: 34,
    targetThreshold: 75,
    learn: {
      status: "completed",
      resourceTitle: "Row Context vs. Filter Context Masterclass",
      duration: "30 mins",
      completedAt: "Today, 08:00 AM",
    },
    practice: {
      status: "completed",
      questionsCount: 3,
      intermediateScore: 55,
      completedAt: "Today, 08:30 AM",
    },
    prove: {
      status: "completed",
      probeTitle: "CALCULATE Engine Probe",
      questionCount: 4,
      completedAt: "Today, 08:45 AM",
    },
    reassess: {
      status: "completed",
      finalScore: 62,
      verifiedDelta: "+28% Gain",
      isSkillProven: false, // 62 < 75 Target Threshold
      completedAt: "Today, 08:50 AM",
    },
    adaptiveInterventionSpawned: {
      interventionId: "intervention-dax-02",
      title: "Targeted Remedial Sprint: DAX CALCULATE & FILTER Modifiers",
      reason: "Reassessment score (62%) was below the 75% threshold. Automatically generated a scaffolded 12-minute practice sprint.",
      createdAt: "Today, 08:52 AM",
    },
  },
];
