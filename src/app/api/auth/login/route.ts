import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth/schemas";
import {
  getUserByEmail,
  createSessionToken,
  SESSION_COOKIE_NAME,
  DEMO_USERS,
} from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email } = validation.data;
    const user = getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. No user profile was found matching this email." },
        { status: 401 }
      );
    }

    const sessionToken = createSessionToken(user.id);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
