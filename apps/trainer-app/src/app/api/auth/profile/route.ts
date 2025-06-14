import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Get current user
    const { data, error } = await AuthService.getCurrentUser();

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to get user profile' },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user profile
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        emailVerified: AuthService.isEmailVerified(data.user),
        metadata: data.user.user_metadata,
        createdAt: data.user.created_at,
        lastSignIn: data.user.last_sign_in_at,
      },
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
