import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    // Initiate Google OAuth flow
    const { data, error } = await AuthService.signInWithGoogle();

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to initiate Google OAuth' },
        { status: 400 }
      );
    }

    // Return the OAuth URL for client-side redirect
    return NextResponse.json({
      success: true,
      url: (data as any)?.url || (data as any)?.provider?.url,
      provider: 'google',
    });
  } catch {

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
