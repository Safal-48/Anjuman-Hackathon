import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth/schemas";
import {
  getUserByEmail,
  saveUser,
  createSessionToken,
  SESSION_COOKIE_NAME,
  DEMO_USERS,
} from "@/lib/auth/session";
import { UserProfile } from "@/lib/auth/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email } = validation.data;
    let user = getUserByEmail(email);

    if (!user) {
      // Auto-provision user account on the fly for 24/7 universal access
      const username = email.split("@")[0] || "User";
      const formattedName = username
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();

      user = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: email.toLowerCase().trim(),
        fullName: formattedName || "New User",
        role: "student",
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveUser(user);
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
    console.error("Login API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
