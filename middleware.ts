import { verifyToken } from "@/lib/auth/session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware to handle authentication and redirects.
// 1. Validates session tokens and clears invalid ones to prevent redirect loops
// 2. Redirects authenticated users from "/" to "/dashboard/memories"
// 3. Protects dashboard routes by redirecting unauthenticated users to "/sign-in"
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const sessionCookie = req.cookies.get("session")?.value;

  // Validate session token if present
  let isValidSession = false;
  if (sessionCookie) {
    try {
      await verifyToken(sessionCookie);
      isValidSession = true;
    } catch (e) {
      // Invalid token: clear the cookie to prevent redirect loops
      console.warn("Invalid session token:", e);
      const res = NextResponse.next();
      res.cookies.set("session", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  // Protect dashboard routes - redirect to sign-in if not authenticated
  if (pathname.startsWith("/dashboard")) {
    if (!isValidSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users from home to dashboard
  if (pathname === "/" && isValidSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/memories";
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware for root path and all dashboard routes
  matcher: ["/", "/dashboard/:path*"],
};
