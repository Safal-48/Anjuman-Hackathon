import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { addCertification, deleteCertification } from "@/lib/db/profile-repository";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.issuingOrganization) {
      return NextResponse.json({ error: "Title and Issuing Organization are required" }, { status: 400 });
    }

    const cert = await addCertification(session.id, {
      title: body.title,
      issuingOrganization: body.issuingOrganization,
      credentialId: body.credentialId,
      credentialUrl: body.credentialUrl,
      issueDate: body.issueDate,
    });

    return NextResponse.json({ message: "Certification added successfully", certification: cert }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const certId = searchParams.get("id");
    if (!certId) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 });
    }

    const deleted = await deleteCertification(session.id, certId);
    if (!deleted) {
      return NextResponse.json({ error: "Certification not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ message: "Certification deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
