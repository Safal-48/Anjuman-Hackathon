import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { saveAssessmentAnswer } from "@/lib/skills/assessment-repository";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, optionId, questionIndex } = body;

    if (!questionId || !optionId) {
      return NextResponse.json({ error: "Question ID and Option ID are required" }, { status: 400 });
    }

    const updatedSession = await saveAssessmentAnswer(
      session.id,
      questionId,
      optionId,
      typeof questionIndex === "number" ? questionIndex : undefined
    );

    return NextResponse.json({ message: "Answer saved", session: updatedSession }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
