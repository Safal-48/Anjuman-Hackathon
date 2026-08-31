import { NextRequest, NextResponse } from "next/server";
import { getServerSession, saveUser } from "@/lib/auth/session";
import {
  studentOnboardingSchema,
  industryOnboardingSchema,
  academicianOnboardingSchema,
  institutionOnboardingSchema,
} from "@/lib/auth/schemas";
import { RoleOnboardingData, StudentProfileData, IndustryProfileData, AcademicianProfileData, InstitutionProfileData } from "@/lib/auth/types";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please login to complete onboarding" }, { status: 401 });
    }

    const payload = (await req.json()) as RoleOnboardingData;

    // Enforce role consistency server-side
    if (payload.role !== user.role && user.role !== "admin") {
      return NextResponse.json(
        { error: `Forbidden: Mismatched role submission. Account role is '${user.role}'` },
        { status: 403 }
      );
    }

    // Role-specific schema validation
    switch (user.role) {
      case "student": {
        const val = studentOnboardingSchema.safeParse(payload.data);
        if (!val.success) {
          const errs = val.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
          return NextResponse.json({ error: `Validation error: ${errs}` }, { status: 400 });
        }
        user.studentProfile = val.data as StudentProfileData;
        user.fullName = val.data.fullName;
        break;
      }
      case "industry": {
        const val = industryOnboardingSchema.safeParse(payload.data);
        if (!val.success) {
          const errs = val.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
          return NextResponse.json({ error: `Validation error: ${errs}` }, { status: 400 });
        }
        user.industryProfile = val.data as IndustryProfileData;
        break;
      }
      case "academician": {
        const val = academicianOnboardingSchema.safeParse(payload.data);
        if (!val.success) {
          const errs = val.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
          return NextResponse.json({ error: `Validation error: ${errs}` }, { status: 400 });
        }
        user.academicianProfile = val.data as AcademicianProfileData;
        break;
      }
      case "institution": {
        const val = institutionOnboardingSchema.safeParse(payload.data);
        if (!val.success) {
          const errs = val.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
          return NextResponse.json({ error: `Validation error: ${errs}` }, { status: 400 });
        }
        user.institutionProfile = val.data as InstitutionProfileData;
        break;
      }
      default:
        break;
    }

    user.isOnboarded = true;
    user.updatedAt = new Date().toISOString();

    saveUser(user);

    return NextResponse.json({
      message: "Onboarding completed successfully",
      user,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
