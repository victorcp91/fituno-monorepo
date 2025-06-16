import { AuthService } from '@fituno/services';
import type { User } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Route configurations with role requirements
const routeConfig = {
  // Public routes - no authentication required
  public: [
    '/', // Landing page
    '/auth/verify-email',
    '/auth/reset-password',
    '/api/auth',
    '/api/health',
    '/api/auth/callback',
    '/terms',
    '/privacy',
  ],

  // Auth routes - redirect if already authenticated
  auth: ['/auth/login', '/auth/register'],

  // Protected routes - require authentication
  protected: {
    // Trainer-only routes
    trainer: [
      '/dashboard',
      '/clients',
      '/workouts',
      '/programs',
      '/analytics',
      '/settings',
      '/api/v1',
    ],

    // Admin-only routes (future use)
    admin: ['/admin'],
  },
};

interface AuthResult {
  isAuthenticated: boolean;
  user: User | null;
  userType: 'trainer' | 'client' | 'admin' | null;
  error?: string;
}

async function validateAuthentication(): Promise<AuthResult> {
  try {
    const { data, error } = await AuthService.getCurrentUser();

    // Check if user exists (AuthService now silently handles missing session)
    if (!data?.user) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
        error: error?.message || 'No user found',
      };
    }

    // If we have a user, consider them authenticated
    const user = data.user;
    const userType = user.user_metadata?.user_type || null;

    return {
      isAuthenticated: true,
      user,
      userType: userType as 'trainer' | 'client' | 'admin' | null,
    };
  } catch (error) {
    console.error('Auth validation error:', error);
    return {
      isAuthenticated: false,
      user: null,
      userType: null,
      error: 'Authentication check failed',
    };
  }
}

function isPublicRoute(pathname: string): boolean {
  return routeConfig.public.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthRoute(pathname: string): boolean {
  return routeConfig.auth.some(route => pathname.startsWith(route));
}

function checkRouteAccess(
  pathname: string,
  userType: 'trainer' | 'client' | 'admin' | null
): {
  hasAccess: boolean;
  requiredRole?: string;
} {
  // Check trainer routes
  if (
    routeConfig.protected.trainer.some(
      route => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return {
      hasAccess: userType === 'trainer',
      requiredRole: 'trainer',
    };
  }

  // Check admin routes
  if (
    routeConfig.protected.admin.some(
      route => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return {
      hasAccess: userType === 'admin',
      requiredRole: 'admin',
    };
  }

  // Default: allow access
  return { hasAccess: true };
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add comprehensive security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add cache control for protected pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if it's a public route
  if (isPublicRoute(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Validate authentication
  const { isAuthenticated, userType } = await validateAuthentication();

  // Handle auth routes (login/register)
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // Redirect authenticated users away from auth routes
      const redirectUrl = new URL('/dashboard', request.url);
      return addSecurityHeaders(NextResponse.redirect(redirectUrl));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // Handle protected routes
  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return addSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  // Check role-based access
  const { hasAccess, requiredRole } = checkRouteAccess(pathname, userType);
  if (!hasAccess) {
    // Redirect to appropriate error page or dashboard based on role
    const redirectUrl = new URL(userType ? '/dashboard' : '/auth/login', request.url);
    if (requiredRole) {
      redirectUrl.searchParams.set('error', `requires_${requiredRole}_role`);
    }
    return addSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).)*',
  ],
};
