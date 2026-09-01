import { NextRequest, NextResponse } from "next/server";
import { getSingleCandidateEvaluation } from "@/lib/analytics/candidate-intelligence-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;
    const { searchParams } = new URL(req.url);
    const reqId = searchParams.get("reqId") || "req-cloud-ai";

    const evaluation = getSingleCandidateEvaluation(candidateId, reqId);
    if (!evaluation) {
      return NextResponse.json({ error: "Candidate evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, evaluation }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
