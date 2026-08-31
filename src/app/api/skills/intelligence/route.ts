import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getSkillIntelligenceReport, getTargetRoles } from "@/lib/skills/assessment-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetRoleId = searchParams.get("role") || undefined;

    const report = await getSkillIntelligenceReport(session.id, targetRoleId);
    const availableRoles = await getTargetRoles();

    return NextResponse.json({ report, availableRoles }, { status: 200 });
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
    const { targetRoleId } = body;

    if (!targetRoleId) {
      return NextResponse.json({ error: "targetRoleId is required" }, { status: 400 });
    }

    const report = await getSkillIntelligenceReport(session.id, targetRoleId);
    const availableRoles = await getTargetRoles();

    return NextResponse.json({ message: "Target role updated", report, availableRoles }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
