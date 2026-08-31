import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { addStudentSkill, deleteStudentSkill } from "@/lib/db/profile-repository";
import { SkillLevel } from "@/lib/supabase/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.skillName || typeof body.skillName !== "string" || body.skillName.trim().length === 0) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    const skill = await addStudentSkill(session.id, {
      skillName: body.skillName,
      level: body.level as SkillLevel,
      proficiencyScore: typeof body.proficiencyScore === "number" ? body.proficiencyScore : 75,
      category: body.category || "Core Engineering",
    });

    return NextResponse.json({ message: "Skill added successfully", skill }, { status: 201 });
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
    const skillId = searchParams.get("id");
    if (!skillId) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const deleted = await deleteStudentSkill(session.id, skillId);
    if (!deleted) {
      return NextResponse.json({ error: "Skill not found or unauthorized to delete" }, { status: 403 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
