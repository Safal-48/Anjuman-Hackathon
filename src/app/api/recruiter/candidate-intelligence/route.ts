import { NextRequest, NextResponse } from "next/server";
import {
  getEvaluatedCandidatesForRequirement,
  evaluateCandidateForOpportunity,
  CANDIDATE_TALENT_POOL,
  OpportunityRequirementConfig,
} from "@/lib/analytics/candidate-intelligence-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reqId = searchParams.get("reqId") || "req-cloud-ai";

    const data = getEvaluatedCandidatesForRequirement(reqId);
    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roleTitle = "Custom Role",
      department = "Engineering",
      requiredSkills = ["Python", "SQL", "Data Analysis"],
      preferredSkills = ["Power BI"],
      minEducation = "B.Tech",
      minGraduationYear = 2026,
      maxExperienceYears = 2,
      minResumeReadinessThreshold = 70,
      minAssessmentScoreThreshold = 75,
    }: Partial<OpportunityRequirementConfig> = body;

    const customReq: OpportunityRequirementConfig = {
      id: `custom-req-${Date.now()}`,
      roleTitle,
      department,
      requiredSkills,
      preferredSkills,
      minEducation,
      minGraduationYear,
      maxExperienceYears,
      minResumeReadinessThreshold,
      minAssessmentScoreThreshold,
    };

    const evaluations = CANDIDATE_TALENT_POOL.map((cand) =>
      evaluateCandidateForOpportunity(cand, customReq)
    ).sort((a, b) => b.explainableMatchScore - a.explainableMatchScore);

    return NextResponse.json(
      {
        success: true,
        requirements: customReq,
        evaluations,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
