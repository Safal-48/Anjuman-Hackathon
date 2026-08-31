import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { updateMentorshipSessionStatus } from "@/lib/employability/portfolio-repository";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, scheduledAt, mentorNotes, meetingLink } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing required status" }, { status: 400 });
    }

    const updated = await updateMentorshipSessionStatus(id, status, {
      scheduledAt,
      mentorNotes,
      meetingLink,
    });

    if (!updated) {
      return NextResponse.json({ error: "Mentorship session not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: `Mentorship session updated to ${status}`, session: updated },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
