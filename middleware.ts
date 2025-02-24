import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/admin/dashboard",
  "/admin/add-car",
  "/admin/create-admin",
  "/admin/create-category",
];

const publicPaths = ["/admin/login"];

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const token = request.cookies.get('authFruition');

  // If user is not authenticated and tries to access protected route
  if (!token && protectedPaths.includes(currentPath)) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and tries to access login page
  if (token && publicPaths.includes(currentPath)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths under /admin except _next/static, _next/image, favicon.ico
     */
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};