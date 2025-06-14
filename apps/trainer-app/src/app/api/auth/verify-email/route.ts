import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    // Attempt to resend email verification
    const { error } = await AuthService.resendEmailVerification();

    if (error) {
      // Handle authentication errors
      if (error.status === 401) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // Handle rate limiting
      if (error.status === 429) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }

      return NextResponse.json(
        { error: error.message || 'Failed to resend verification email' },
        { status: 400 }
      );
    }

    // Successful resend
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.',
    });
  } catch (error) {
    console.error('Verify email API error:', error);
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
