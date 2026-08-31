import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { analyzeResumeText } from "@/lib/ai/resume-analyzer";
import { getCandidateContext } from "@/lib/ai/career-context";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { resumeText, targetRoleId } = body;

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "Resume text content is required" }, { status: 400 });
    }

    const context = await getCandidateContext(session.id, targetRoleId);
    const targetTitle = context?.intelligence.targetRole.title || "AI Systems & LLM Platform Engineer";
    const targetSkills = context?.intelligence.targetRole.requiredSkills.map((s) => s.skillName) || [
      "Python", "PyTorch", "Distributed Systems", "Next.js", "Docker", "Algorithms"
    ];

    const extracted = analyzeResumeText(resumeText, targetTitle, targetSkills);

    return NextResponse.json({ analysis: extracted }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
