import { NextRequest, NextResponse } from "next/server";
import { removeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      removeSessionToken(token);
    }

    const response = NextResponse.json({ message: "Successfully logged out" });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
