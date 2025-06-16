import { AuthService, ValidationService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Additional email validation
    if (!ValidationService.validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Attempt to sign in
    const { data, error } = await AuthService.signIn({ email, password });

    if (error) {
      // Handle rate limiting
      if (error.status === 429) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }

      // Handle other auth errors
      return NextResponse.json(
        { error: error.message || 'Authentication failed' },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Check if email is verified (if required)
    if (!AuthService.isEmailVerified(data.user)) {
      return NextResponse.json(
        {
          error: 'Email verification required',
          requiresVerification: true,
          userId: data.user.id,
        },
        { status: 403 }
      );
    }

    // Successful login
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        emailVerified: AuthService.isEmailVerified(data.user),
        metadata: data.user.user_metadata,
      },
      session: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at,
      },
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
