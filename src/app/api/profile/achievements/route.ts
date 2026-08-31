import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { addAchievement, deleteAchievement } from "@/lib/db/profile-repository";
import { AchievementCategory } from "@/lib/supabase/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Title and Description are required" }, { status: 400 });
    }

    const achievement = await addAchievement(session.id, {
      title: body.title,
      category: (body.category as AchievementCategory) || "hackathon",
      description: body.description,
      proofUrl: body.proofUrl,
    });

    return NextResponse.json({ message: "Achievement added successfully", achievement }, { status: 201 });
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
    const achievementId = searchParams.get("id");
    if (!achievementId) {
      return NextResponse.json({ error: "Achievement ID is required" }, { status: 400 });
    }

    const deleted = await deleteAchievement(session.id, achievementId);
    if (!deleted) {
      return NextResponse.json({ error: "Achievement not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ message: "Achievement deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
