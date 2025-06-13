import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Initiate Facebook OAuth flow
    const result = await AuthService.signInWithFacebook();

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || 'Failed to initiate Facebook OAuth' },
        { status: 400 }
      );
    }

    // For OAuth flows, the result typically contains a redirect URL
    // If successful, client should redirect to OAuth provider
    return NextResponse.json({
      success: true,
      message: 'Facebook OAuth initiated. Redirecting to Facebook...',
      provider: 'facebook',
    });
  } catch (error) {
    console.error('Facebook OAuth initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
