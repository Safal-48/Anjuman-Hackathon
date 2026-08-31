import { NextRequest, NextResponse } from "next/server";
import { getAssessmentQuestions } from "@/lib/skills/assessment-repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const questions = await getAssessmentQuestions(category);

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
