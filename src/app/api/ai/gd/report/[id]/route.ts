import { NextRequest, NextResponse } from "next/server";
import { getGDReportById } from "@/lib/ai/gd-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const report = getGDReportById(reportId);
    if (!report) {
      return NextResponse.json({ error: "GD Performance report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
