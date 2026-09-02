import { getFullProfile } from "@/lib/db/profile-repository";
import { getSkillIntelligenceReport } from "@/lib/skills/assessment-repository";
import { FullUserProfile, SkillIntelligenceReport } from "@/lib/supabase/types";

export interface CandidateContextData {
  profile: FullUserProfile;
  intelligence: SkillIntelligenceReport;
  contextSummaryText: string;
}

/**
 * Assembles live structured telemetry for a student candidate
 */
export async function getCandidateContext(
  userId: string,
  targetRoleId?: string
): Promise<CandidateContextData | null> {
  const profile = await getFullProfile(userId);
  if (!profile) return null;

  const intelligence = await getSkillIntelligenceReport(userId, targetRoleId);
  if (!intelligence) return null;

  const verifiedSkillsList = profile.skills
    .map((s: any) => `${s.skillName} (${s.level}, ${s.proficiencyScore}%)`)
    .join(", ");

  const verifiedProjectsList = profile.projects
    .map((p: any) => `"${p.title}": ${p.summary} [Tech: ${p.techStack.join(", ")}]`)
    .join("; ");

  const strongSkillsList = intelligence.strongSkills
    .map((s: any) => `${s.skillName} (${s.score}%)`)
    .join(", ");

  const weakSkillsList = intelligence.weakSkills
    .map((s: any) => `${s.skillName} (${s.score}%)`)
    .join(", ");

  const gapsList = intelligence.skillGaps
    .map(
      (g: any) =>
        `${g.skillName} [Status: ${g.gapCategory}, Student: ${g.studentScore}%, Target Req: ${g.requiredScore}%, Deficit: ${g.gapDifference} pts, Action: ${g.recommendation}]`
    )
    .join("\n- ");

  const contextSummaryText = `
CANDIDATE PROFILE TELEMETRY:
- Full Name: ${profile.fullName}
- Current Education: ${profile.studentProfile?.education || "Engineering / Technology"} at ${profile.studentProfile?.institution || "University"} (${profile.studentProfile?.academicYear || "Final Year"})
- Stated Career Ambition: ${profile.studentProfile?.careerGoal || "Software & AI Engineering"}
- Current Overall Career Readiness Score: ${intelligence.overallReadinessScore}%

EVALUATED SKILL DIMENSIONS:
- Technical Score: ${intelligence.technicalScore}%
- Soft Skills Score: ${intelligence.softSkillScore}%
- Cognitive Aptitude Score: ${intelligence.aptitudeScore}%
- Career Alignment Score: ${intelligence.careerAlignmentScore}%

VERIFIED PROFILE SKILLS:
${verifiedSkillsList || "None verified yet"}

PUBLISHED PORTFOLIO PROJECTS:
${verifiedProjectsList || "None published yet"}

ASSESSMENT STRENGTHS (SUPERPOWERS):
${strongSkillsList || "All evaluated within baseline"}

PRIORITY GROWTH AREAS:
${weakSkillsList || "No critical deficits detected"}

TARGET INDUSTRY ROLE BENCHMARK:
- Role Title: ${intelligence.targetRole.title}
- Required Readiness Threshold: ${intelligence.targetRole.requiredReadinessScore}%
- Evaluated Skill Gaps & Deficits:
- ${gapsList}
`.trim();

  return {
    profile,
    intelligence,
    contextSummaryText,
  };
}
