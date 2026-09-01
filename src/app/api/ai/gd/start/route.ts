import { NextRequest, NextResponse } from "next/server";
import { initializeGDSession, GDConfig } from "@/lib/ai/gd-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      topicId = "gd-ai-jobs",
      customTopicTitle,
      category = "tech_ai",
      difficulty = "standard_campus",
      durationMinutes = 10,
      language = "en",
      participantIds = ["arjun_analytical", "priya_counter", "vikram_assertive", "ananya_facts"],
    }: Partial<GDConfig> = body;

    const config: GDConfig = {
      topicId,
      customTopicTitle,
      category,
      difficulty,
      durationMinutes: (durationMinutes as 5 | 10 | 15) || 10,
      language,
      participantIds,
    };

    const sessionData = initializeGDSession(config);

    return NextResponse.json(
      {
        success: true,
        sessionId: sessionData.sessionId,
        config,
        topic: sessionData.topic,
        participants: sessionData.participants,
        initialMessages: sessionData.initialMessages,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("GD Start Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
