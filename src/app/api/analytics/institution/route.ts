import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getInstitutionAnalytics } from "@/lib/analytics/role-analytics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department") || undefined;
    const academicYear = searchParams.get("academicYear") || undefined;
    const dateRange = searchParams.get("dateRange") || undefined;

    const analytics = await getInstitutionAnalytics({
      department,
      academicYear,
      dateRange,
    });

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
