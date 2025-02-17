import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that need protection
const protectedPaths = [
  "/admin/dashboard",
  "/admin/add-car",
  "/admin/create-admin",
  "/admin/create-category",
];

export function  middleware (request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const token = request.cookies.get('auth')
  
  // Only check auth for protected paths
  // if (protectedPaths.includes(currentPath)) {
  //   // Use Next.js built-in cookie methods for middleware

  //   if (!token) {
  //     // Redirect to login page with callback URL
  //     const loginUrl = new URL('/admin/login', request.url)
  //     loginUrl.searchParams.set('callbackUrl', currentPath)
  //     return NextResponse.redirect(loginUrl)
  //   }
  // }

  if (!token && protectedPaths.includes(currentPath)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // If user is authenticated and trying to access login page
  if (token && !protectedPaths.includes(currentPath)) {
    return NextResponse.redirect(new URL("admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Optionally, you can specify which paths the middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
