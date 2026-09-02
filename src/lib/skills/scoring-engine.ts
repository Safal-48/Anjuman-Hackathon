import {
  AssessmentQuestion,
  SkillScoreBreakdown,
  TargetRoleBenchmark,
  SkillGapItem,
  SkillGapCategory,
  SkillLevel,
  QuestionCategory,
  TopicMasteryBreakdown,
  DiagnosticInsight,
  RecurringMistakePattern,
} from "@/lib/supabase/types";

export interface ComputedScores {
  overallReadinessScore: number;
  technicalScore: number;
  softSkillScore: number;
  aptitudeScore: number;
  careerAlignmentScore: number;
  skillBreakdowns: SkillScoreBreakdown[];
  topicBreakdowns: TopicMasteryBreakdown[];
  diagnosticInsights: DiagnosticInsight;
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
 * Deterministically computes category scores, skill breakdowns, and sub-skill/topic mastery from assessment responses
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

  // Skill-specific accumulators: skillTag -> { category, earned, possible, correct, total }
  const skillMap = new Map<string, { category: string; earned: number; possible: number; correct: number; total: number }>();

  // Sub-topic accumulators: `${skillTag}:::${subTopic}` -> { skillName, topicName, earned, possible, correct, total }
  const topicMap = new Map<string, { skillName: string; topicName: string; earned: number; possible: number; correct: number; total: number }>();

  // Mistake tracker for pattern identification
  const missedTopicCounts: Record<string, number> = {};

  questions.forEach((q) => {
    const selectedOptionId = responses[q.id];
    const selectedOption = q.options.find((opt) => opt.id === selectedOptionId);

    const weightEarned = selectedOption ? selectedOption.scoreWeight : 0;
    const isCorrect = selectedOption?.isCorrect === true || weightEarned >= 0.8;
    const maxWeight = 1.0;

    // Accumulate category points
    categoryTotals[q.category].earned += weightEarned;
    categoryTotals[q.category].possible += maxWeight;

    // Accumulate skill tag points
    const currentSkill = skillMap.get(q.skillTag) || {
      category: formatCategoryName(q.category),
      earned: 0,
      possible: 0,
      correct: 0,
      total: 0,
    };
    currentSkill.earned += weightEarned;
    currentSkill.possible += maxWeight;
    currentSkill.total += 1;
    if (isCorrect) currentSkill.correct += 1;
    skillMap.set(q.skillTag, currentSkill);

    // Accumulate sub-topic points
    const subTopic = q.subTopic || "Core Foundations";
    const topicKey = `${q.skillTag}:::${subTopic}`;
    const currentTopic = topicMap.get(topicKey) || {
      skillName: q.skillTag,
      topicName: subTopic,
      earned: 0,
      possible: 0,
      correct: 0,
      total: 0,
    };
    currentTopic.earned += weightEarned;
    currentTopic.possible += maxWeight;
    currentTopic.total += 1;
    if (isCorrect) {
      currentTopic.correct += 1;
    } else {
      missedTopicCounts[subTopic] = (missedTopicCounts[subTopic] || 0) + 1;
    }
    topicMap.set(topicKey, currentTopic);
  });

  const getPercentage = (cat: QuestionCategory): number => {
    const { earned, possible } = categoryTotals[cat];
    if (possible === 0) return 75; // baseline default
    return Math.round((earned / possible) * 100);
  };

  const technicalScore = getPercentage("technical");
  const softSkillScore = getPercentage("soft_skill");
  const aptitudeScore = getPercentage("aptitude");
  const careerAlignmentScore = getPercentage("career_interest");

  // Weighted composite score (Explainable Formula)
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

  // Generate granular topic/sub-skill mastery breakdowns (e.g. SQL JOINs: 42%, Filtering: 78%)
  const topicBreakdowns: TopicMasteryBreakdown[] = Array.from(topicMap.values()).map((t) => {
    const score = t.possible > 0 ? Math.round((t.earned / t.possible) * 100) : 70;
    let status: "Mastered" | "Proficient" | "Needs Attention" | "Critical Gap" = "Proficient";
    let priority: "High" | "Medium" | "Low" = "Low";

    if (score >= 80) {
      status = "Mastered";
      priority = "Low";
    } else if (score >= 65) {
      status = "Proficient";
      priority = "Medium";
    } else if (score >= 50) {
      status = "Needs Attention";
      priority = "Medium";
    } else {
      status = "Critical Gap";
      priority = "High";
    }

    return {
      skillName: t.skillName,
      topicName: t.topicName,
      score,
      status,
      questionsCount: t.total,
      correctCount: t.correct,
      priority,
    };
  });

  // Calculate Diagnostic Insights
  const strongAreas = topicBreakdowns
    .filter((t) => t.score >= 75)
    .map((t) => ({
      topic: `${t.skillName} → ${t.topicName}`,
      score: t.score,
      rationale: `Strong conceptual grasp (${t.score}% mastery). Ready for production implementation.`,
    }));

  const weakAreas = topicBreakdowns
    .filter((t) => t.score >= 50 && t.score < 75)
    .map((t) => ({
      topic: `${t.skillName} → ${t.topicName}`,
      score: t.score,
      deficit: 80 - t.score,
      rationale: `Moderate conceptual friction (${t.score}%). Requires targeted practice sandbox.`,
    }));

  const criticalGaps = topicBreakdowns
    .filter((t) => t.score < 50)
    .map((t) => ({
      topic: `${t.skillName} → ${t.topicName}`,
      score: t.score,
      deficit: 85 - t.score,
      immediateAction: `Immediate intervention required (Score: ${t.score}%). Study fundamentals before progressing.`,
    }));

  // Identify recurring mistake patterns
  const recurringMistakes: RecurringMistakePattern[] = [];
  if (missedTopicCounts["JOINs"] || missedTopicCounts["Subqueries"]) {
    recurringMistakes.push({
      id: "rm-sql-join",
      patternName: "Relational Set Coupling vs. Correlated Subquery Optimization",
      affectedTopics: ["SQL → JOINs", "SQL → Subqueries"],
      mistakeFrequency: (missedTopicCounts["JOINs"] || 0) + (missedTopicCounts["Subqueries"] || 0),
      explanation: "Tendency to select nested subqueries where indexed INNER/LEFT JOINs yield O(N) rather than O(N²) execution plans.",
      remedyAction: "Review SQL Execution Plan and practice Join predicates in the Interactive Sandbox.",
    });
  }

  if (missedTopicCounts["Distributed Systems"] || missedTopicCounts["System Architecture"]) {
    recurringMistakes.push({
      id: "rm-dist-consensus",
      patternName: "Distributed Consensus Failure Mode Recovery",
      affectedTopics: ["Distributed Systems → Consensus", "System Architecture → Raft"],
      mistakeFrequency: 2,
      explanation: "Confusion between Split-Brain leader election vs. Quorum commit acknowledgments under network partition.",
      remedyAction: "Explore Raft visualizer walk-through and complete consensus failure drill.",
    });
  }

  // Topics requiring immediate attention
  const immediateAttentionTopics = topicBreakdowns
    .filter((t) => t.priority === "High" || t.score < 60)
    .map((t) => ({
      topic: `${t.skillName}: ${t.topicName}`,
      urgency: t.score < 45 ? ("Immediate" as const) : ("High" as const),
      remedialResourceUrl: `/learning/resources?highlight=${encodeURIComponent(t.topicName)}`,
    }));

  const diagnosticInsights: DiagnosticInsight = {
    strongAreas,
    weakAreas,
    criticalGaps,
    recurringMistakes,
    immediateAttentionTopics,
  };

  const strongSkills = skillBreakdowns.filter((s) => s.strengthType === "strong");
  const weakSkills = skillBreakdowns.filter((s) => s.strengthType === "weak");

  return {
    overallReadinessScore,
    technicalScore,
    softSkillScore,
    aptitudeScore,
    careerAlignmentScore,
    skillBreakdowns,
    topicBreakdowns,
    diagnosticInsights,
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
