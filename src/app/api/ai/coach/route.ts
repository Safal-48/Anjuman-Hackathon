import { NextRequest, NextResponse } from "next/server";
import {
  generateCoachResponse,
  DEFAULT_STUDENT_CAREER_CONTEXT,
  INITIAL_COACH_CONVERSATION,
} from "@/lib/ai/career-coach-engine";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: true,
        context: DEFAULT_STUDENT_CAREER_CONTEXT,
        initialConversation: INITIAL_COACH_CONVERSATION,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context = DEFAULT_STUDENT_CAREER_CONTEXT } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A non-empty message string is required." },
        { status: 400 }
      );
    }

    const response = generateCoachResponse(message, context);

    return NextResponse.json(
      {
        success: true,
        message: {
          id: `msg_coach_${Date.now()}`,
          sender: "coach",
          text: response.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          groundedContextTags: response.groundedContextTags,
          recommendedActions: response.recommendedActions,
          suggestedFollowUps: response.suggestedFollowUps,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Coach API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
