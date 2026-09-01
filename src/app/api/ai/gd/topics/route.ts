import { NextRequest, NextResponse } from "next/server";
import { GD_TOPICS, GD_PARTICIPANTS } from "@/lib/ai/gd-engine";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: true,
        topics: GD_TOPICS,
        participants: GD_PARTICIPANTS,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
