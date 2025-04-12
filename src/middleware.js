import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const protectedPaths = ['/manage', '/profile'];
  const isProtected = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

  if (isProtected) {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('auth-token');

    if (!tokenCookie || !tokenCookie.value) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/manage/:path*',
  ],
};