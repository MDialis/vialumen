import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth"; 

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only run this logic if the user is trying to access the admin workspace
  if (path.startsWith("/admin")) {
    
    // Fetch the session from your backend API
    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", 
      },
    });
    
    // If no session exists, boot them to the login page
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If they are logged in but NOT an admin, boot them to the homepage
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// only run on specific paths
export const config = {
  matcher: [
    "/admin/:path*", // Protects admin routes
  ],
};