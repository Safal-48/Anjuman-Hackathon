import { NextRequest, NextResponse } from "next/server";
import { getServerSession, DEMO_USERS } from "@/lib/auth/session";
import { getOpportunityById } from "@/lib/marketplace/opportunity-repository";
import { getFullProfile } from "@/lib/db/profile-repository";
import { calculateExplainableMatch } from "@/lib/marketplace/matching-engine";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get("opportunityId") || "opp-01";

    const opp = await getOpportunityById(opportunityId);
    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    // Discover student profiles and calculate compatibility
    const studentUser = DEMO_USERS["student@titan.ai"];
    const studentProfile = await getFullProfile(studentUser.id);

    const candidates = [];
    if (studentProfile) {
      const match = calculateExplainableMatch(studentProfile, opp);
      candidates.push({
        student: {
          id: studentProfile.id,
          fullName: studentProfile.fullName,
          email: studentProfile.email,
          education: studentProfile.studentProfile?.education,
          institution: studentProfile.studentProfile?.institution,
          readinessScore: studentProfile.studentProfile?.readinessScore || 85,
          skills: studentProfile.skills,
          projects: studentProfile.projects,
        },
        match,
      });
    }

    return NextResponse.json({ candidates, opportunity: opp }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
