import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { updateApplicationStatus } from "@/lib/marketplace/opportunity-repository";
import { ApplicationStatus } from "@/lib/supabase/types";

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
    const { status } = body;

    const validStatuses: ApplicationStatus[] = [
      "applied",
      "under_review",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid application status. Allowed: [${validStatuses.join(", ")}]` }, { status: 400 });
    }

    const updated = await updateApplicationStatus(id, status, session.id);
    if (!updated) {
      return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: `Application status updated to ${status}`, application: updated }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
