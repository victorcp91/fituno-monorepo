import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/', '/clients', '/workouts', '/programs', '/analytics', '/settings'];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth/login', '/auth/register'];

// Public routes that don't require authentication
const publicRoutes = ['/auth/verify-email', '/auth/reset-password', '/api/auth', '/api/health'];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    route => pathname === route || (route !== '/' && pathname.startsWith(route))
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.nextUrl.origin;

  // Allow API routes and public routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    publicRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  try {
    // Check if user is authenticated
    const { data, error } = await AuthService.getCurrentUser();
    const isAuthenticated = !error && data?.user;

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect unauthenticated users to login for protected routes
    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth check failed:', error);

    // If protected route and auth check failed, redirect to login
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
