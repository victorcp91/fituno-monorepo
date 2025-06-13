import { AUTH_CONFIG } from '@fituno/constants';
import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth/login?error=missing_code', request.url));
    }

    // Exchange authorization code for session using Supabase directly
    const { supabase } = await import('@fituno/services');
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !data.session) {
      console.error('Session error after OAuth code exchange:', sessionError);
      return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
    }

    // Get user profile to check if it's complete
    const { data: userData, error: userError } = await AuthService.getCurrentUser();

    if (userError || !userData.user) {
      console.error('User error after OAuth:', userError);
      return NextResponse.redirect(new URL('/auth/login?error=user_fetch_failed', request.url));
    }

    // Check if this is a new user (needs profile completion)
    const isNewUser = !userData.user.user_metadata?.user_type;

    if (isNewUser) {
      // Redirect to profile completion for new OAuth users
      return NextResponse.redirect(new URL('/auth/complete-profile?provider=google', request.url));
    }

    // Existing user with complete profile
    return NextResponse.redirect(new URL(AUTH_CONFIG.REDIRECT_URLS.signIn, request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=internal_error', request.url));
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
