import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { submitMentorshipFeedback } from "@/lib/employability/portfolio-repository";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, rating, comment } = body;

    if (!sessionId || typeof rating !== "number" || !comment) {
      return NextResponse.json({ error: "Missing required feedback fields" }, { status: 400 });
    }

    const updated = await submitMentorshipFeedback(sessionId, rating, comment);
    if (!updated) {
      return NextResponse.json({ error: "Mentorship session not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Mentorship feedback submitted successfully", session: updated },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
