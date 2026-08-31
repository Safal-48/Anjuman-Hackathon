import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { submitAssessmentSession } from "@/lib/skills/assessment-repository";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetRoleId = "ai_systems_engineer";
    try {
      const body = await req.json();
      if (body.targetRoleId) targetRoleId = body.targetRoleId;
    } catch {
      // Body may be empty, use default target role
    }

    const report = await submitAssessmentSession(session.id, targetRoleId);

    return NextResponse.json(
      {
        message: "Assessment submitted and evaluated successfully",
        report,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
