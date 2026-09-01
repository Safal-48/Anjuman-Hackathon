import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getStudentApplications,
  getRecruiterApplications,
} from "@/lib/marketplace/opportunity-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = session?.id || "usr-demo-student-01";
    const role = session?.role || "student";

    if (role === "industry" || role === "institution" || role === "admin") {
      const applications = await getRecruiterApplications(userId);
      return NextResponse.json({ applications, role }, { status: 200 });
    } else {
      const applications = await getStudentApplications(userId);
      return NextResponse.json({ applications, role: "student" }, { status: 200 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
