import { NextRequest, NextResponse } from "next/server";
import {
  evaluateAnswerDeterministically,
  generateNextInterviewQuestion,
  InterviewConfig,
  InterviewQuestion,
  SingleQuestionEvaluation,
} from "@/lib/ai/interview-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      config,
      currentQuestion,
      answerText,
      responseTimeSeconds = 60,
      currentQuestionIndex = 0,
      previousEvaluations = [],
    }: {
      config: InterviewConfig;
      currentQuestion: InterviewQuestion;
      answerText: string;
      responseTimeSeconds: number;
      currentQuestionIndex: number;
      previousEvaluations: SingleQuestionEvaluation[];
    } = body;

    if (!currentQuestion || !answerText) {
      return NextResponse.json(
        { error: "Missing required fields: currentQuestion and answerText" },
        { status: 400 }
      );
    }

    // 1. Evaluate current answer deterministically (without leaking score to client in active state)
    const evaluation = evaluateAnswerDeterministically(
      currentQuestion,
      answerText,
      responseTimeSeconds,
      config
    );

    const updatedEvaluations = [...previousEvaluations, evaluation];

    // 2. Generate next contextual follow-up question
    const nextQuestion = await generateNextInterviewQuestion(
      config,
      currentQuestionIndex,
      updatedEvaluations
    );

    const isComplete = !nextQuestion;

    return NextResponse.json(
      {
        success: true,
        evaluation, // sent to client store for final report collation
        nextQuestion,
        isComplete,
        currentQuestionIndex: currentQuestionIndex + 1,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Interview Next Question Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
