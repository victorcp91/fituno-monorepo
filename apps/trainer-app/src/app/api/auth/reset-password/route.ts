import { AuthService, ValidationService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  redirectTo: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, redirectTo } = validation.data;

    // Additional email validation
    if (!ValidationService.validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Construct fallback redirect URL with proper validation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_URL environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const fallbackRedirectTo = `${baseUrl}/auth/reset-password`;

    // Attempt to send password reset email
    const { error } = await AuthService.resetPassword({
      email,
      redirectTo: redirectTo || fallbackRedirectTo,
    });

    if (error) {
      // Handle rate limiting
      if (error.status === 429) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }

      // For security reasons, we don't reveal if the email exists or not
      // So we always return success, but log the actual error
      console.error('Password reset error:', error);
    }

    // Always return success for security reasons
    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('Reset password API error:', error);
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
