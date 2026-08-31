import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { generateBilingualVoiceGuidance } from "@/lib/ai/voice-assistant";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { language, targetRole } = body;

    const guidance = await generateBilingualVoiceGuidance(language || "en", {
      fullName: session.fullName,
      targetRole: targetRole || "AI Systems Engineer",
      strongSkills: ["React / Next.js", "PyTorch", "TypeScript"],
      skillGaps: ["Distributed Concurrency", "TensorRT"],
      readinessScore: 88,
    });

    return NextResponse.json({ guidance }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
