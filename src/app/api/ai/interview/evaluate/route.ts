import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { evaluateInterviewResponse } from "@/lib/ai/interview-engine";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, answerText } = body;

    if (!questionId || !answerText || typeof answerText !== "string") {
      return NextResponse.json({ error: "Missing required questionId and answerText" }, { status: 400 });
    }

    const evaluation = await evaluateInterviewResponse(questionId, answerText);
    return NextResponse.json({ evaluation }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
