import { NextRequest, NextResponse } from "next/server";
import {
  generateFinalGDReport,
  saveGDReport,
  GDConfig,
  GDTopic,
  GDMessage,
  GDTurnEvaluation,
} from "@/lib/ai/gd-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      config,
      topic,
      allMessages,
      studentEvaluations,
    }: {
      sessionId: string;
      config: GDConfig;
      topic: GDTopic;
      allMessages: GDMessage[];
      studentEvaluations: GDTurnEvaluation[];
    } = body;

    if (!sessionId || !config || !topic || !allMessages) {
      return NextResponse.json(
        { error: "Missing required sessionId, config, topic, or message transcript" },
        { status: 400 }
      );
    }

    const report = generateFinalGDReport(
      sessionId,
      config,
      topic,
      allMessages,
      studentEvaluations || []
    );

    saveGDReport(report);

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
    console.error("GD Report Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
