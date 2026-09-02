export interface SkillSimulationItem {
  id: string;
  skillName: string;
  category: string;
  baselineScore: number; // e.g. 52
  simulatedScore: number; // e.g. 80
  weight: number; // 0.1 to 1.5
  estimatedHoursToTarget: number;
}

export interface SimulationResult {
  baselineReadinessScore: number;
  projectedReadinessScore: number;
  readinessDelta: number;
  currentBottleneck: string;
  projectedNextBottleneck: string;
  unlockedRoleCount: number;
  highestRoiSkill: string;
}

export const DEFAULT_SIMULATION_SKILLS: SkillSimulationItem[] = [
  {
    id: "sim-sql",
    skillName: "SQL & Relational Databases",
    category: "Data Systems",
    baselineScore: 52,
    simulatedScore: 80,
    weight: 1.3,
    estimatedHoursToTarget: 4,
  },
  {
    id: "sim-pbi",
    skillName: "Power BI & Telemetry",
    category: "Business Intelligence",
    baselineScore: 34,
    simulatedScore: 75,
    weight: 1.1,
    estimatedHoursToTarget: 6,
  },
  {
    id: "sim-dist",
    skillName: "Distributed Systems (Raft)",
    category: "Architecture",
    baselineScore: 48,
    simulatedScore: 80,
    weight: 1.4,
    estimatedHoursToTarget: 5,
  },
  {
    id: "sim-py",
    skillName: "Python & PyTorch",
    category: "AI & ML",
    baselineScore: 82,
    simulatedScore: 90,
    weight: 1.5,
    estimatedHoursToTarget: 3,
  },
  {
    id: "sim-apt",
    skillName: "Algorithms & Complexity",
    category: "Core Aptitude",
    baselineScore: 72,
    simulatedScore: 85,
    weight: 1.0,
    estimatedHoursToTarget: 4,
  },
];

/**
 * Calculates deterministic projected readiness score based on simulated skill levels
 */
export function calculateSimulatedReadiness(
  skills: SkillSimulationItem[]
): SimulationResult {
  let totalWeightedBaseline = 0;
  let totalWeightedSimulated = 0;
  let totalWeight = 0;

  skills.forEach((s) => {
    totalWeightedBaseline += s.baselineScore * s.weight;
    totalWeightedSimulated += s.simulatedScore * s.weight;
    totalWeight += s.weight;
  });

  const baselineReadinessScore = Math.round(totalWeightedBaseline / (totalWeight || 1));
  const projectedReadinessScore = Math.round(totalWeightedSimulated / (totalWeight || 1));
  const readinessDelta = projectedReadinessScore - baselineReadinessScore;

  // Determine current vs next bottleneck
  const sortedSimulated = [...skills].sort((a, b) => a.simulatedScore - b.simulatedScore);
  const currentBottleneck = "SQL JOINs & Relational Modeling (52%)";
  const projectedNextBottleneck =
    sortedSimulated[0].simulatedScore < 80
      ? `${sortedSimulated[0].skillName} (${sortedSimulated[0].simulatedScore}%)`
      : "Enterprise Architecture Capstone";

  // Calculate highest ROI skill (Score Delta * Weight / Hours)
  let bestRoi = 0;
  let highestRoiSkill = "SQL & Relational Databases";
  skills.forEach((s) => {
    const delta = s.simulatedScore - s.baselineScore;
    const roi = (delta * s.weight) / (s.estimatedHoursToTarget || 1);
    if (roi > bestRoi) {
      bestRoi = roi;
      highestRoiSkill = s.skillName;
    }
  });

  return {
    baselineReadinessScore,
    projectedReadinessScore,
    readinessDelta,
    currentBottleneck,
    projectedNextBottleneck,
    unlockedRoleCount: projectedReadinessScore >= 80 ? 4 : projectedReadinessScore >= 70 ? 2 : 1,
    highestRoiSkill,
  };
}
