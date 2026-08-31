import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { generateNexoraRAGResponse } from "@/lib/ai/nexora-rag";
import { getCandidateContext } from "@/lib/ai/career-context";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, targetRoleId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let userProfile;

    try {
      const session = await getServerSession();
      if (session) {
        try {
          const candidateContext = await getCandidateContext(session.id, targetRoleId);
          if (candidateContext) {
            userProfile = {
              fullName: session.fullName,
              role: session.role,
              targetRole: candidateContext.intelligence.targetRole.title,
              readinessScore: candidateContext.intelligence.overallReadinessScore,
              skills: candidateContext.intelligence.strongSkills.map((s) => s.skillName),
            };
          }
        } catch {
          userProfile = {
            fullName: session.fullName,
            role: session.role,
          };
        }
      }
    } catch {
      // Unauthenticated request, proceed as visitor
      userProfile = undefined;
    }

    // Generate RAG Response
    const response = generateNexoraRAGResponse(message.trim(), userProfile);

    return NextResponse.json(
      {
        reply: response.reply,
        citations: response.citations,
        suggestedPrompts: response.suggestedPrompts,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Nexora API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
