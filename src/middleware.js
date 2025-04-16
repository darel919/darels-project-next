import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedPaths = ['/profile'];
  const adminPaths = ['/manage'];
  const isProtected = protectedPaths.some(protectedPath => path.startsWith(protectedPath));
  const isAdminPath = adminPaths.some(adminPath => path.startsWith(adminPath));

  const userSession = request.cookies.get('user-session');
  const isValidSession = userSession?.value && userSession.value !== 'undefined';
  
  if (isProtected || isAdminPath) {
    if (!isValidSession) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const userData = JSON.parse(userSession.value);
      if (!userData?.id || !userData?.provider_id) {
        throw new Error('Invalid session data');
      }

      if (isAdminPath && userData.provider_id !== process.env.NEXT_PUBLIC_SUPERADMIN) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (e) {
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