// middleware.js
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Define protected paths
  const isProtectedPath = path.startsWith('/app') || 
                          path.startsWith('/dashboard') || 
                          path.startsWith('/admin');
  
  if (isProtectedPath) {
    // Check for auth cookie
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const authToken = cookies['auth-token']; // Use your actual cookie name
    
    if (!authToken) {
      // Redirect to login if no token found
      const url = new URL('/auth/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(req.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};