import { NextRequest, NextResponse } from "next/server";
import { getAllInterviewAttempts } from "@/lib/ai/interview-engine";

export async function GET(req: NextRequest) {
  try {
    const attempts = getAllInterviewAttempts();
    return NextResponse.json({ success: true, attempts }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
