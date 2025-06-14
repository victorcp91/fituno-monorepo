import { AuthService } from '@fituno/services';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Route configurations with role requirements
const routeConfig = {
  // Public routes - no authentication required
  public: [
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
    trainer: ['/', '/clients', '/workouts', '/programs', '/analytics', '/settings', '/api/v1'],

    // Admin-only routes (future use)
    admin: ['/admin'],
  },
};

interface User {
  id: string;
  email: string;
  user_metadata?: {
    user_type?: 'trainer' | 'client' | 'admin';
    full_name?: string;
  };
}

interface AuthResult {
  isAuthenticated: boolean;
  user: User | null;
  userType: 'trainer' | 'client' | 'admin' | null;
  error?: string;
}

async function validateAuthentication(): Promise<AuthResult> {
  try {
    const { data, error } = await AuthService.getCurrentUser();

    if (error || !data?.user) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
        error: error?.message || 'No user found',
      };
    }

    const user = data.user as User;
    const userType = user.user_metadata?.user_type || null;

    return {
      isAuthenticated: true,
      user,
      userType,
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
  return routeConfig.public.some(route => pathname === route || pathname.startsWith(route + '/'));
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
      route => pathname === route || pathname.startsWith(route + '/')
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
      route => pathname === route || pathname.startsWith(route + '/')
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

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  try {
    // Validate authentication
    const authResult = await validateAuthentication();

    // Handle auth routes
    if (isAuthRoute(pathname)) {
      if (authResult.isAuthenticated) {
        // Redirect authenticated users away from auth pages
        const redirectUrl = new URL('/', request.url);
        const response = NextResponse.redirect(redirectUrl);
        return addSecurityHeaders(response);
      }
      // Allow unauthenticated users to access auth pages
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }

    // Handle protected routes
    if (!authResult.isAuthenticated) {
      // Redirect unauthenticated users to login
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      redirectUrl.searchParams.set('error', 'authentication_required');
      const response = NextResponse.redirect(redirectUrl);
      return addSecurityHeaders(response);
    }

    // Check role-based access
    const accessCheck = checkRouteAccess(pathname, authResult.userType);

    if (!accessCheck.hasAccess) {
      // User doesn't have required role
      console.warn(
        `Access denied: User ${authResult.user?.email} (${authResult.userType}) tried to access ${pathname} (requires ${accessCheck.requiredRole})`
      );

      // Redirect to appropriate page based on user type
      let redirectPath = '/auth/login';
      if (authResult.userType === 'client') {
        redirectPath = '/client/dashboard'; // Future client dashboard
      } else if (authResult.userType === 'trainer') {
        redirectPath = '/';
      }

      const redirectUrl = new URL(redirectPath, request.url);
      redirectUrl.searchParams.set('error', 'insufficient_permissions');
      const response = NextResponse.redirect(redirectUrl);
      return addSecurityHeaders(response);
    }

    // Check if trainer profile is complete
    if (authResult.userType === 'trainer' && authResult.user) {
      const hasCompleteProfile = authResult.user.user_metadata?.user_type === 'trainer';

      if (!hasCompleteProfile && pathname !== '/onboarding') {
        // Redirect to profile completion
        const redirectUrl = new URL('/onboarding', request.url);
        redirectUrl.searchParams.set('redirectTo', pathname);
        const response = NextResponse.redirect(redirectUrl);
        return addSecurityHeaders(response);
      }
    }

    // Allow access with security headers
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Middleware error:', error);

    // On error, redirect to login for protected routes
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('error', 'session_error');
    redirectUrl.searchParams.set('redirectTo', pathname);
    const response = NextResponse.redirect(redirectUrl);
    return addSecurityHeaders(response);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (handled separately)
     * - Static files (_next/static, images, etc.)
     * - Favicon and other assets
     */
    '/((?!api/auth/callback|api/health|_next/static|_next/image|favicon.ico|.*\\..*).)*',
  ],
};
