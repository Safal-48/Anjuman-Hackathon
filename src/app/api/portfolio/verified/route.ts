import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getVerifiedDigitalPortfolio,
  addStudentInternship,
} from "@/lib/employability/portfolio-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId") || session.id;

    const portfolio = await getVerifiedDigitalPortfolio(targetUserId);
    return NextResponse.json({ portfolio }, { status: 200 });
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
    const { companyName, roleTitle, location, duration, description, technologies, proofUrl } = body;

    if (!companyName || !roleTitle || !location || !duration || !description) {
      return NextResponse.json({ error: "Missing required internship fields" }, { status: 400 });
    }

    const internship = await addStudentInternship(session.id, {
      companyName,
      roleTitle,
      location,
      duration,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      proofUrl: proofUrl || undefined,
      isVerified: false, // Self-declared until verified by institution
    });

    return NextResponse.json(
      { message: "Internship added to portfolio successfully", internship },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
