import {
  OpportunityEntity,
  FullUserProfile,
  ExplainableMatchResult,
} from "@/lib/supabase/types";

/**
 * Deterministically evaluates explainable candidate-opportunity compatibility
 */
export function calculateExplainableMatch(
  student: FullUserProfile,
  opportunity: OpportunityEntity
): ExplainableMatchResult {
  const reqSkills = opportunity.requiredSkills || [];
  const prefSkills = opportunity.preferredSkills || [];
  const allOppSkills = [...reqSkills, ...prefSkills];

  // Map student skills: lowercase -> score
  const studentSkillMap = new Map<string, number>();
  (student.skills || []).forEach((s) => {
    studentSkillMap.set(s.skillName.toLowerCase().trim(), s.proficiencyScore || 75);
  });

  const strongSkills: string[] = [];
  const partialSkills: string[] = [];
  const gapSkills: string[] = [];

  let skillPointsEarned = 0;
  let totalSkillPointsPossible = reqSkills.length * 2 + prefSkills.length * 1;
  if (totalSkillPointsPossible === 0) totalSkillPointsPossible = 1;

  // Evaluate Required Skills (Weight = 2)
  reqSkills.forEach((skill) => {
    const key = skill.toLowerCase().trim();
    const score = studentSkillMap.get(key);

    if (score !== undefined) {
      if (score >= 75) {
        strongSkills.push(skill);
        skillPointsEarned += 2;
      } else {
        partialSkills.push(skill);
        skillPointsEarned += 1.2;
      }
    } else {
      // Check for partial substring match (e.g. "React" in "React / Next.js")
      const partialMatch = Array.from(studentSkillMap.entries()).find(([sKey]) =>
        sKey.includes(key) || key.includes(sKey)
      );

      if (partialMatch) {
        partialSkills.push(skill);
        skillPointsEarned += 1.0;
      } else {
        gapSkills.push(skill);
      }
    }
  });

  // Evaluate Preferred Skills (Weight = 1)
  prefSkills.forEach((skill) => {
    const key = skill.toLowerCase().trim();
    const score = studentSkillMap.get(key);

    if (score !== undefined) {
      if (score >= 70) {
        strongSkills.push(skill);
        skillPointsEarned += 1.0;
      } else {
        partialSkills.push(skill);
        skillPointsEarned += 0.6;
      }
    } else {
      const partialMatch = Array.from(studentSkillMap.entries()).find(([sKey]) =>
        sKey.includes(key) || key.includes(sKey)
      );
      if (partialMatch) {
        partialSkills.push(skill);
        skillPointsEarned += 0.5;
      } else {
        gapSkills.push(skill);
      }
    }
  });

  const skillMatch = Math.min(Math.round((skillPointsEarned / totalSkillPointsPossible) * 100), 100);

  // 2. Eligibility & Academic Alignment Factor (20% weight)
  let eligibilityMatch = 85;
  const studentGpa = student.studentProfile?.gpa || 8.5;
  if (opportunity.minGpa && studentGpa < opportunity.minGpa) {
    eligibilityMatch -= 25;
  }
  if (opportunity.eligibility) {
    const lowerElig = opportunity.eligibility.toLowerCase();
    const edu = (student.studentProfile?.education || "").toLowerCase();
    if (lowerElig.includes("b.tech") && edu.includes("b.tech")) {
      eligibilityMatch += 10;
    }
  }
  eligibilityMatch = Math.min(Math.max(eligibilityMatch, 50), 100);

  // 3. Career Goal & Domain Alignment Factor (15% weight)
  let careerMatch = 80;
  const careerGoal = (student.studentProfile?.careerGoal || "").toLowerCase();
  const oppTitle = opportunity.title.toLowerCase();
  const oppDesc = opportunity.description.toLowerCase();

  if (
    careerGoal.includes("ai") && (oppTitle.includes("ai") || oppDesc.includes("neural") || oppDesc.includes("machine learning")) ||
    careerGoal.includes("cloud") && (oppTitle.includes("cloud") || oppDesc.includes("devops")) ||
    careerGoal.includes("system") && (oppTitle.includes("architect") || oppDesc.includes("distributed"))
  ) {
    careerMatch = 95;
  }

  // 4. Experience & Project Evidence Factor (15% weight)
  let experienceMatch = 70;
  const projectCount = student.projects?.length || 0;
  const certCount = student.certifications?.length || 0;
  experienceMatch += Math.min(projectCount * 8, 20);
  experienceMatch += Math.min(certCount * 5, 10);
  experienceMatch = Math.min(experienceMatch, 100);

  // Weighted Overall Compatibility Calculation
  const overallScore = Math.round(
    skillMatch * 0.50 +
    eligibilityMatch * 0.20 +
    careerMatch * 0.15 +
    experienceMatch * 0.15
  );

  // Formulate human-readable explainable reasoning summary
  let reasoningSummary = "";
  if (overallScore >= 85) {
    reasoningSummary = `High compatibility (${overallScore}%). Strong verified competency in ${strongSkills.slice(0, 3).join(", ")}, with excellent academic eligibility and portfolio evidence.`;
  } else if (overallScore >= 70) {
    reasoningSummary = `Solid match (${overallScore}%). Core prerequisite skills matched. Closing ${gapSkills.slice(0, 2).join(" and ")} will push candidate into top-tier readiness.`;
  } else {
    reasoningSummary = `Developing match (${overallScore}%). Deficits detected in key requirements: ${gapSkills.slice(0, 3).join(", ")}.`;
  }

  return {
    overallScore,
    strongSkills,
    partialSkills,
    gapSkills,
    factorBreakdown: {
      skillMatch,
      eligibilityMatch,
      careerMatch,
      experienceMatch,
    },
    reasoningSummary,
  };
}
