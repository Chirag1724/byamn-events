import { auth } from '@/lib/auth/nextauth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Attendee protected routes (/my-events)
  // Guard with the attendee_token cookie (jose JWT, not NextAuth)
  if (pathname.startsWith('/my-events')) {
    const attendeeToken = request.cookies.get('attendee_token');
    if (!attendeeToken?.value) {
      const loginUrl = new URL('/attendee/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Host protected routes (/dashboard, /events/create)
  // Guard with NextAuth session
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/events/create')
  ) {
    const session = await auth();
    if (!session?.user?.hostId) {
      const loginUrl = new URL('/host/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/create/:path*',
    '/my-events/:path*',
  ],
};
