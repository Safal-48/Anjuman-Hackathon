import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getCandidateContext } from "@/lib/ai/career-context";
import { getAICareerResponse } from "@/lib/ai/ai-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, targetRoleId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message prompt is required" }, { status: 400 });
    }

    const context = await getCandidateContext(session.id, targetRoleId);
    if (!context) {
      return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    }

    const response = await getAICareerResponse(message, context);

    return NextResponse.json(
      {
        reply: response.text,
        suggestedPrompts: response.suggestedPrompts,
        contextBadges: response.contextBadges,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
