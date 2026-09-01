import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  initializeInterviewSession,
  InterviewConfig,
  AVAILABLE_ROLES,
  INTERVIEWER_PERSONAS,
} from "@/lib/ai/interview-engine";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    // Allow demo usage even if session cookie not present by falling back to demo student
    const candidateName = session?.fullName || "Candidate";

    const body = await req.json().catch(() => ({}));
    const {
      roleId = "ai_systems_engineer",
      experienceLevel = "junior",
      interviewType = "technical",
      language = "en",
      difficulty = "intermediate",
      interviewerId = "aditi_sharma",
      totalQuestions = 4,
    } = body;

    const config: InterviewConfig = {
      roleId,
      experienceLevel,
      interviewType,
      language,
      difficulty,
      interviewerId,
      totalQuestions,
    };

    const sessionData = await initializeInterviewSession(config);

    return NextResponse.json({
      success: true,
      candidateName,
      ...sessionData,
      availableRoles: AVAILABLE_ROLES,
      availablePersonas: Object.values(INTERVIEWER_PERSONAS),
    }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Interview Generate Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
