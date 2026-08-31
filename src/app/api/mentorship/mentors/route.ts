import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getMentorsCatalog,
  getCollaborationEvents,
} from "@/lib/employability/portfolio-repository";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const expertise = searchParams.get("expertise") || undefined;

    const mentors = await getMentorsCatalog(expertise);
    const collaborationEvents = await getCollaborationEvents();

    return NextResponse.json({ mentors, collaborationEvents }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
