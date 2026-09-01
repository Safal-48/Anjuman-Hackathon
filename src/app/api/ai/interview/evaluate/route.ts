import { NextRequest, NextResponse } from "next/server";
import {
  evaluateAnswerDeterministically,
  ROLE_INTERVIEW_BANKS,
  InterviewQuestion,
} from "@/lib/ai/interview-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, answerText, responseTimeSeconds = 60 } = body;

    if (!questionId || !answerText || typeof answerText !== "string") {
      return NextResponse.json(
        { error: "Missing required questionId and answerText" },
        { status: 400 }
      );
    }

    // Search question across all banks
    let question: InterviewQuestion | undefined;
    for (const bank of Object.values(ROLE_INTERVIEW_BANKS)) {
      const found = bank.questions.find((q) => q.id === questionId);
      if (found) {
        question = found;
        break;
      }
    }

    if (!question) {
      question = ROLE_INTERVIEW_BANKS.ai_systems_engineer.questions[0];
    }

    const evaluation = evaluateAnswerDeterministically(
      question,
      answerText,
      responseTimeSeconds
    );

    return NextResponse.json({ evaluation }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
