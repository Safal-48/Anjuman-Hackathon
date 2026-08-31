import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/auth/schemas";
import { getUserByEmail } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email } = validation.data;
    const user = getUserByEmail(email);

    // Generic response to prevent account enumeration attacks
    return NextResponse.json({
      message: `If an account with '${email}' exists in our registry, a password reset link has been dispatched to that address.`,
      found: Boolean(user),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
