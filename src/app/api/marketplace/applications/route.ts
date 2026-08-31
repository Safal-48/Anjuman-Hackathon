import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getStudentApplications,
  getRecruiterApplications,
} from "@/lib/marketplace/opportunity-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "industry" || session.role === "institution" || session.role === "admin") {
      const applications = await getRecruiterApplications(session.id);
      return NextResponse.json({ applications, role: session.role }, { status: 200 });
    } else {
      const applications = await getStudentApplications(session.id);
      return NextResponse.json({ applications, role: "student" }, { status: 200 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
