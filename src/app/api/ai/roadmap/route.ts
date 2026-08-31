import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getCandidateContext } from "@/lib/ai/career-context";
import { generatePersonalizedRoadmap } from "@/lib/ai/roadmap-generator";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetRoleId = searchParams.get("role") || undefined;

    const context = await getCandidateContext(session.id, targetRoleId);
    if (!context) {
      return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    }

    const roadmap = generatePersonalizedRoadmap(context);

    return NextResponse.json({ roadmap }, { status: 200 });
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

    const context = await getCandidateContext(session.id, targetRoleId);
    if (!context) {
      return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    }

    const roadmap = generatePersonalizedRoadmap(context);

    return NextResponse.json({ roadmap }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
