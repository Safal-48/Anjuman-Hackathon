import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getUserMentorshipSessions,
  requestMentorshipSession,
} from "@/lib/employability/portfolio-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await getUserMentorshipSessions(session.id);
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mentorId, topic, goalDescription, preferredSlot } = body;

    if (!mentorId || !topic || !goalDescription) {
      return NextResponse.json({ error: "Missing required mentorship fields" }, { status: 400 });
    }

    const mentorshipSession = await requestMentorshipSession(
      session.id,
      session.fullName || "Titan Candidate",
      {
        mentorId,
        topic,
        goalDescription,
        preferredSlot,
      }
    );

    return NextResponse.json(
      { message: "Mentorship request submitted successfully", session: mentorshipSession },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
