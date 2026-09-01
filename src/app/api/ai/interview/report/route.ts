import { NextRequest, NextResponse } from "next/server";
import {
  generateFinalInterviewReport,
  saveInterviewReport,
  InterviewConfig,
  SingleQuestionEvaluation,
} from "@/lib/ai/interview-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      config,
      evaluations,
      attentionSummary,
    }: {
      sessionId: string;
      config: InterviewConfig;
      evaluations: SingleQuestionEvaluation[];
      attentionSummary?: any;
    } = body;

    if (!sessionId || !config || !evaluations || !evaluations.length) {
      return NextResponse.json(
        { error: "Missing required sessionId, config, or evaluated questions list" },
        { status: 400 }
      );
    }

    const report = generateFinalInterviewReport(sessionId, config, evaluations);
    if (attentionSummary) {
      report.attentionSummary = attentionSummary;
    }
    // Save to global in-memory persistence store
    saveInterviewReport(report);

    return NextResponse.json(
      {
        success: true,
        reportId: report.sessionId,
        report,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Interview Report Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
