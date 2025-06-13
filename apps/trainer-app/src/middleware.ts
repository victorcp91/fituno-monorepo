import { AUTH_CONFIG } from '@fituno/constants';
import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/clients',
  '/workouts',
  '/exercises',
  '/profile',
  '/settings',
  '/billing',
  '/api/v1',
];

// Define auth routes that redirect authenticated users
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/reset-password'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/about', '/pricing', '/contact', '/terms', '/privacy', '/auth'];

// API routes that require authentication
const PROTECTED_API_ROUTES = ['/api/v1', '/api/auth/profile', '/api/auth/logout'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    route => pathname === route || (route !== '/' && pathname.startsWith(route))
  );
}

function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.nextUrl.origin;

  // Skip middleware for static files and favicon
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  try {
    // Get the current session
    const { data: session, error } = await AuthService.getCurrentSession();
    const isAuthenticated = !error && session?.session?.access_token;

    // Handle protected API routes
    if (isProtectedApiRoute(pathname)) {
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // Add security headers for API routes
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return response;
    }

    // Handle auth flow routes (login, register, etc.)
    if (isAuthRoute(pathname)) {
      if (isAuthenticated) {
        // Redirect authenticated users away from auth pages
        return NextResponse.redirect(new URL(AUTH_CONFIG.REDIRECT_URLS.signIn, origin));
      }
      return NextResponse.next();
    }

    // Handle protected routes
    if (isProtectedRoute(pathname)) {
      if (!isAuthenticated) {
        // Store the intended destination
        const loginUrl = new URL('/auth/login', origin);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user profile is complete
      const { data: user } = await AuthService.getCurrentUser();
      if (user?.user && !user.user.user_metadata?.user_type) {
        // Redirect to profile completion
        const completeProfileUrl = new URL('/auth/complete-profile', origin);
        completeProfileUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(completeProfileUrl);
      }

      // Add security headers for protected pages
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

      return response;
    }

    // Handle public routes and root
    if (isPublicRoute(pathname) || pathname === '/') {
      // Add basic security headers
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return response;
    }

    // Default: allow the request
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);

    // On middleware error, redirect to login for protected routes
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL('/auth/login', origin);
      loginUrl.searchParams.set('error', 'session_error');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/callback (OAuth callbacks handled separately)
     * - api/auth/login, api/auth/register, api/auth/oauth (auth flow routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth/callback|api/auth/login|api/auth/register|api/auth/oauth|api/auth/reset-password|api/auth/verify-email|_next/static|_next/image|favicon.ico|.*\\..*).)*',
  ],
};
