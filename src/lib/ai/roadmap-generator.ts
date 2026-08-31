import { CandidateContextData } from "@/lib/ai/career-context";
import { SkillGapItem } from "@/lib/supabase/types";

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  subtitle: string;
  durationWeeks: string;
  status: "completed" | "in_progress" | "upcoming";
  milestones: Array<{
    id: string;
    task: string;
    category: "foundational" | "architecture" | "project" | "interview";
    isCompleted: boolean;
    resources: Array<{ name: string; type: "course" | "docs" | "lab" | "project"; url?: string }>;
  }>;
}

export interface PersonalizedRoadmap {
  candidateName: string;
  targetRoleTitle: string;
  currentReadinessScore: number;
  targetReadinessScore: number;
  estimatedTimeToHireWeeks: number;
  phases: RoadmapPhase[];
  suggestedNextActions: string[];
}

/**
 * Generates an explainable 4-Phase Career Roadmap:
 * Current state → Skill gaps → Recommended learning → Target role → Suggested next actions
 */
export function generatePersonalizedRoadmap(
  context: CandidateContextData
): PersonalizedRoadmap {
  const { profile, intelligence } = context;
  const target = intelligence.targetRole;
  const criticalGaps = intelligence.skillGaps.filter(
    (g) => g.gapCategory === "Critical Gap" || g.gapCategory === "Needs Improvement"
  );

  const phases: RoadmapPhase[] = [
    // Phase 1: Current State & Foundational Calibration
    {
      phaseNumber: 1,
      title: "Current State & Foundational Baseline",
      subtitle: "Consolidate verified strengths and calibrate technical prerequisites",
      durationWeeks: "Weeks 1 - 3",
      status: "completed",
      milestones: [
        {
          id: "m1-1",
          task: `Profile Verification: ${profile.fullName} verified with ${profile.skills.length} technical skills`,
          category: "foundational",
          isCompleted: true,
          resources: [{ name: "TECH-TITAN Skill Intelligence Diagnostic", type: "lab" }],
        },
        {
          id: "m1-2",
          task: "Multi-Vector Assessment Completion across Tech, Soft Skills, and Aptitude",
          category: "foundational",
          isCompleted: true,
          resources: [{ name: "Diagnostic Telemetry Log", type: "docs" }],
        },
        {
          id: "m1-3",
          task: `Core Strengths Alignment: ${intelligence.strongSkills.map((s) => s.skillName).slice(0, 2).join(", ")}`,
          category: "foundational",
          isCompleted: true,
          resources: [{ name: "Mastery Proof Repository", type: "project" }],
        },
      ],
    },

    // Phase 2: Skill Gaps Remediation & Targeted Learning
    {
      phaseNumber: 2,
      title: "Skill Gap Remediation & Deep Learning",
      subtitle: `Address ${criticalGaps.length} critical gaps required for ${target.title}`,
      durationWeeks: "Weeks 4 - 8",
      status: "in_progress",
      milestones: criticalGaps.slice(0, 3).map((gap, i) => ({
        id: `m2-${i + 1}`,
        task: `Bridge Deficit in ${gap.skillName} (${gap.studentScore}% → ${gap.requiredScore}% Target)`,
        category: "architecture",
        isCompleted: false,
        resources: [
          { name: `Advanced ${gap.skillName} Architecture Patterns`, type: "course" },
          { name: `${gap.skillName} Production Best Practices & RFCs`, type: "docs" },
        ],
      })),
    },

    // Phase 3: High-Rigor Portfolio & Production Engineering
    {
      phaseNumber: 3,
      title: "High-Rigor Production Engineering",
      subtitle: "Build mission-critical, high-throughput systems demonstrating production competence",
      durationWeeks: "Weeks 9 - 14",
      status: "upcoming",
      milestones: [
        {
          id: "m3-1",
          task: `Architect End-to-End Enterprise Project incorporating ${target.requiredSkills.slice(0, 2).map((s) => s.skillName).join(" & ")}`,
          category: "project",
          isCompleted: false,
          resources: [{ name: "Production Template Starter & Docker Harness", type: "project" }],
        },
        {
          id: "m3-2",
          task: "Benchmarking & Latency Profiling (P99 latency optimization, edge caching, stress testing)",
          category: "project",
          isCompleted: false,
          resources: [{ name: "Distributed Telemetry & Profiling Lab", type: "lab" }],
        },
        {
          id: "m3-3",
          task: "Open Source RFC Contribution & Peer Code Review",
          category: "project",
          isCompleted: false,
          resources: [{ name: "Upstream GitHub Ecosystem", type: "project" }],
        },
      ],
    },

    // Phase 4: Target Role Placement & Mastery
    {
      phaseNumber: 4,
      title: "Target Role Placement & Mastery",
      subtitle: `Finalize candidate positioning for ${target.title} at leading tech enterprises`,
      durationWeeks: "Weeks 15 - 18",
      status: "upcoming",
      milestones: [
        {
          id: "m4-1",
          task: "High-Scale Distributed System Design & Live Architectural Whiteboarding",
          category: "interview",
          isCompleted: false,
          resources: [{ name: "System Design Primer & Architectural Rubrics", type: "docs" }],
        },
        {
          id: "m4-2",
          task: "Industry Recruiter Talent Matching & Placement Dispatch",
          category: "interview",
          isCompleted: false,
          resources: [{ name: "TECH-TITAN Direct Recruiter Pipeline", type: "docs" }],
        },
      ],
    },
  ];

  // If Phase 2 had no gaps, create a mastery milestone
  if (phases[1].milestones.length === 0) {
    phases[1].milestones.push({
      id: "m2-1",
      task: `Mastery Polish for ${target.title} Core Stack`,
      category: "architecture",
      isCompleted: false,
      resources: [{ name: "High-Performance System Architecture", type: "course" }],
    });
  }

  const suggestedNextActions = [
    criticalGaps.length > 0
      ? `Focus first on ${criticalGaps[0].skillName}: ${criticalGaps[0].recommendation}`
      : `Advance your portfolio depth in ${target.requiredSkills[0]?.skillName || "System Architecture"}.`,
    `Build a benchmarked prototype demonstrating low latency and publish to GitHub with live metrics.`,
    `Schedule periodic skill assessments to track readiness score convergence towards ${target.requiredReadinessScore}%.`,
  ];

  return {
    candidateName: profile.fullName,
    targetRoleTitle: target.title,
    currentReadinessScore: intelligence.overallReadinessScore,
    targetReadinessScore: target.requiredReadinessScore,
    estimatedTimeToHireWeeks: 12,
    phases,
    suggestedNextActions,
  };
}
