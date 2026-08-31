import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getMarketplaceOpportunities,
  createOpportunity,
} from "@/lib/marketplace/opportunity-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") || undefined;
    const locationType = searchParams.get("locationType") || undefined;
    const search = searchParams.get("search") || undefined;
    const minMatch = searchParams.get("minMatch") ? Number(searchParams.get("minMatch")) : undefined;

    const opportunities = await getMarketplaceOpportunities(session?.id, {
      type,
      locationType,
      search,
      minMatch,
    });

    return NextResponse.json({ opportunities }, { status: 200 });
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

    if (session.role !== "industry" && session.role !== "admin" && session.role !== "institution") {
      return NextResponse.json({ error: "Only Industry, Institution, or Admin accounts can post opportunities" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      organizationName,
      opportunityType,
      description,
      requiredSkills,
      preferredSkills,
      eligibility,
      minGpa,
      experienceRequired,
      location,
      locationType,
      stipendSalary,
      duration,
      deadline,
      openingsCount,
    } = body;

    if (!title || !opportunityType || !description || !requiredSkills || !eligibility || !location || !stipendSalary || !duration || !deadline) {
      return NextResponse.json({ error: "Missing required opportunity fields" }, { status: 400 });
    }

    const newOpp = await createOpportunity(session.id, {
      title,
      organizationName: organizationName || session.industryProfile?.organizationName || "Industry Partner",
      opportunityType,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],
      eligibility,
      minGpa: minGpa ? Number(minGpa) : undefined,
      experienceRequired,
      location,
      locationType,
      stipendSalary,
      duration,
      deadline,
      openingsCount: openingsCount ? Number(openingsCount) : 1,
    });

    return NextResponse.json({ message: "Opportunity created successfully", opportunity: newOpp }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
