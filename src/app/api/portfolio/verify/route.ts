import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { verifyStudentCredential } from "@/lib/employability/portfolio-repository";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only institution, academician, or admin can verify credentials
    if (!["institution", "academician", "admin"].includes(session.role)) {
      return NextResponse.json(
        { error: "Forbidden: Only institution-authorized users can verify credentials" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { studentId, credentialType, credentialId, verificationBadge, verifierNotes } = body;

    if (!studentId || !credentialType || !credentialId) {
      return NextResponse.json({ error: "Missing required verification fields" }, { status: 400 });
    }

    const verification = await verifyStudentCredential(session.id, session.role, {
      studentId,
      credentialType,
      credentialId,
      verificationBadge,
      verifierNotes,
    });

    return NextResponse.json(
      { message: "Credential verified and stamped with cryptographic hash", verification },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
