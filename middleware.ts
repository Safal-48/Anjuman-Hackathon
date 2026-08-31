import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./src/lib/auth/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding") || pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password");

  // 1. If accessing protected routes without a session cookie, redirect to /login
  if (isProtectedPath && !sessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // 2. If user already has a session token and visits /login or /register, redirect to /dashboard
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
