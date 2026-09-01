import { NextRequest, NextResponse } from "next/server";
import {
  generateNextGDRound,
  GDConfig,
  GDTopic,
  GDParticipantPersona,
  GDMessage,
} from "@/lib/ai/gd-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      config,
      topic,
      participants,
      allMessages,
      studentText,
      currentElapsedSeconds = 0,
    }: {
      config: GDConfig;
      topic: GDTopic;
      participants: GDParticipantPersona[];
      allMessages: GDMessage[];
      studentText: string;
      currentElapsedSeconds: number;
    } = body;

    if (!studentText || typeof studentText !== "string") {
      return NextResponse.json({ error: "Student response text is required" }, { status: 400 });
    }

    const roundData = generateNextGDRound(
      config,
      topic,
      participants,
      allMessages,
      studentText,
      currentElapsedSeconds
    );

    return NextResponse.json(
      {
        success: true,
        studentEvaluation: roundData.studentEvaluation,
        nextAIMessages: roundData.nextAIMessages,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("GD Next Round Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
