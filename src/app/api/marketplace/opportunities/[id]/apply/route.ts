import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { applyForOpportunity } from "@/lib/marketplace/opportunity-repository";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    let coverNote = undefined;
    try {
      const body = await req.json();
      coverNote = body.coverNote;
    } catch {
      // Body may be empty
    }

    const application = await applyForOpportunity(session.id, id, coverNote);

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
