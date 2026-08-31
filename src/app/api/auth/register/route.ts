import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth/schemas";
import {
  getUserByEmail,
  saveUser,
  createSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import { UserProfile, UserRole } from "@/lib/auth/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // STRICT SERVER-SIDE ENFORCEMENT: Admin role can NEVER be registered publicly
    if (body.role === "admin") {
      return NextResponse.json(
        { error: "Security Violation: Administrative roles cannot be registered through public portals." },
        { status: 403 }
      );
    }

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, fullName, role } = validation.data;

    // Check if user already exists
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please login instead." },
        { status: 409 }
      );
    }

    // Create new profile with un-onboarded status
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      role: role as UserRole,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveUser(newUser);

    // Create session token and set secure HTTP-only cookie
    const sessionToken = createSessionToken(newUser.id);

    const response = NextResponse.json(
      {
        message: "Registration successful. Please complete your onboarding.",
        user: newUser,
      },
      { status: 201 }
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
