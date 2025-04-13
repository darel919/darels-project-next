import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedPaths = ['/profile'];
  const adminPaths = ['/manage'];
  const isProtected = protectedPaths.some(protectedPath => path.startsWith(protectedPath));
  const isAdminPath = adminPaths.some(adminPath => path.startsWith(adminPath));

  const userSession = request.cookies.get('user-session');
  
  if (isProtected || isAdminPath) {
    if (!userSession || !userSession.value) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminPath) {
      try {
        const userData = JSON.parse(userSession.value);
        if (userData.provider_id !== process.env.NEXT_PUBLIC_SUPERADMIN) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      } catch (e) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
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