import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getAcademicianCollaborations,
  submitAcademicianProposal,
} from "@/lib/analytics/role-analytics";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || undefined;

    const collaborations = await getAcademicianCollaborations(format);
    return NextResponse.json({ collaborations }, { status: 200 });
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
    const { collaborationId, facultyName, department, institution, proposalSummary } = body;

    if (!collaborationId || !facultyName || !department || !proposalSummary) {
      return NextResponse.json({ error: "Missing required proposal fields" }, { status: 400 });
    }

    const proposal = await submitAcademicianProposal(session.id, {
      collaborationId,
      facultyName,
      department,
      institution: institution || "Accredited University",
      proposalSummary,
    });

    return NextResponse.json(
      { message: "Collaboration proposal submitted successfully", proposal },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
