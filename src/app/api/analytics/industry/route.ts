import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getIndustryAnalytics } from "@/lib/analytics/role-analytics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const recruiterId = session ? session.id : "usr-demo-industry-01";
    const analytics = await getIndustryAnalytics(recruiterId);
    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
