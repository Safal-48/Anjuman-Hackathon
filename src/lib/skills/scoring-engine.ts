import {
  AssessmentQuestion,
  SkillScoreBreakdown,
  TargetRoleBenchmark,
  SkillGapItem,
  SkillGapCategory,
  SkillLevel,
  QuestionCategory,
} from "@/lib/supabase/types";

export interface ComputedScores {
  overallReadinessScore: number;
  technicalScore: number;
  softSkillScore: number;
  aptitudeScore: number;
  careerAlignmentScore: number;
  skillBreakdowns: SkillScoreBreakdown[];
  strongSkills: SkillScoreBreakdown[];
  weakSkills: SkillScoreBreakdown[];
}

/**
 * Maps a numerical score (0 - 100) to a standardized SkillLevel
 */
export function mapScoreToSkillLevel(score: number): SkillLevel {
  if (score >= 85) return "expert";
  if (score >= 70) return "advanced";
  if (score >= 50) return "intermediate";
  return "beginner";
}

/**
 * Deterministically computes category scores and skill breakdowns from assessment responses
 */
export function computeAssessmentScores(
  questions: AssessmentQuestion[],
  responses: Record<string, string> // questionId -> optionId
): ComputedScores {
  // Category score accumulators
  const categoryTotals: Record<QuestionCategory, { earned: number; possible: number }> = {
    technical: { earned: 0, possible: 0 },
    soft_skill: { earned: 0, possible: 0 },
    aptitude: { earned: 0, possible: 0 },
    career_interest: { earned: 0, possible: 0 },
  };

  // Skill-specific accumulators: skillTag -> { category, earned, possible }
  const skillMap = new Map<string, { category: string; earned: number; possible: number }>();

  questions.forEach((q) => {
    const selectedOptionId = responses[q.id];
    const selectedOption = q.options.find((opt) => opt.id === selectedOptionId);

    const weightEarned = selectedOption ? selectedOption.scoreWeight : 0;
    const maxWeight = 1.0;

    // Accumulate category points
    categoryTotals[q.category].earned += weightEarned;
    categoryTotals[q.category].possible += maxWeight;

    // Accumulate skill tag points
    const current = skillMap.get(q.skillTag) || {
      category: formatCategoryName(q.category),
      earned: 0,
      possible: 0,
    };
    current.earned += weightEarned;
    current.possible += maxWeight;
    skillMap.set(q.skillTag, current);
  });

  const getPercentage = (cat: QuestionCategory): number => {
    const { earned, possible } = categoryTotals[cat];
    if (possible === 0) return 75; // baseline default if no questions in category
    return Math.round((earned / possible) * 100);
  };

  const technicalScore = getPercentage("technical");
  const softSkillScore = getPercentage("soft_skill");
  const aptitudeScore = getPercentage("aptitude");
  const careerAlignmentScore = getPercentage("career_interest");

  // Weighted composite score (Explainable Formula)
  // Technical: 40%, Soft Skills: 25%, Aptitude: 25%, Career: 10%
  const overallReadinessScore = Math.round(
    technicalScore * 0.4 +
    softSkillScore * 0.25 +
    aptitudeScore * 0.25 +
    careerAlignmentScore * 0.1
  );

  // Generate structured skill breakdowns
  const skillBreakdowns: SkillScoreBreakdown[] = Array.from(skillMap.entries()).map(([skillName, data]) => {
    const score = data.possible > 0 ? Math.round((data.earned / data.possible) * 100) : 70;
    const level = mapScoreToSkillLevel(score);
    const strengthType: "strong" | "moderate" | "weak" =
      score >= 75 ? "strong" : score >= 55 ? "moderate" : "weak";

    return {
      skillName,
      category: data.category,
      score,
      level,
      strengthType,
    };
  });

  const strongSkills = skillBreakdowns.filter((s) => s.strengthType === "strong");
  const weakSkills = skillBreakdowns.filter((s) => s.strengthType === "weak");

  return {
    overallReadinessScore,
    technicalScore,
    softSkillScore,
    aptitudeScore,
    careerAlignmentScore,
    skillBreakdowns,
    strongSkills,
    weakSkills,
  };
}

/**
 * Calculates explainable skill gaps between student evaluated scores and target role benchmarks
 */
export function calculateExplainableGaps(
  studentSkills: SkillScoreBreakdown[],
  targetRole: TargetRoleBenchmark
): SkillGapItem[] {
  const studentSkillMap = new Map<string, number>();
  studentSkills.forEach((s) => {
    studentSkillMap.set(s.skillName.toLowerCase(), s.score);
  });

  return targetRole.requiredSkills.map((req) => {
    // Find closest matching student skill or fallback to default baseline
    const studentScore = studentSkillMap.get(req.skillName.toLowerCase()) ?? 50;
    const requiredScore = req.requiredScore;
    const gapDifference = requiredScore - studentScore;

    let gapCategory: SkillGapCategory = "Strong";
    let recommendation = "";

    if (gapDifference <= 0) {
      gapCategory = "Strong";
      recommendation = `Exceeds industry standard for ${targetRole.title}. Ready for senior/lead problem statements.`;
    } else if (gapDifference <= 10) {
      gapCategory = "Good";
      recommendation = `Within targeted hireability threshold. Recommended to review edge cases and production latency optimization.`;
    } else if (gapDifference <= 25) {
      gapCategory = "Needs Improvement";
      recommendation = `Identified moderate gap of ${gapDifference} points. Complete 2 hands-on projects and deep-dive into distributed core concepts.`;
    } else {
      gapCategory = "Critical Gap";
      recommendation = `High-priority blocker (Deficit: ${gapDifference} pts). Foundational coursework and verified mentorship milestones required.`;
    }

    return {
      skillName: req.skillName,
      category: req.category,
      studentScore,
      requiredScore,
      gapDifference,
      gapCategory,
      recommendation,
    };
  });
}

function formatCategoryName(category: QuestionCategory): string {
  switch (category) {
    case "technical":
      return "Technical Engineering";
    case "soft_skill":
      return "Soft Skills & Teamwork";
    case "aptitude":
      return "Cognitive & Problem Solving";
    case "career_interest":
      return "Career & Domain Focus";
  }
}
