import { NextRequest, NextResponse } from "next/server";
import { getCareerReadinessProfile } from "@/lib/analytics/career-readiness-engine";

export async function GET(req: NextRequest) {
  try {
    const profile = getCareerReadinessProfile();
    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
