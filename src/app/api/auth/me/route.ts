import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerSession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
