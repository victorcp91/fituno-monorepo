import { AuthService, ValidationService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name too long'),
    userType: z.enum(['trainer', 'client'], { required_error: 'User type is required' }),
    timezone: z.string().optional(),
    language: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, fullName, userType, timezone, language } = validation.data;

    // Additional validations
    if (!ValidationService.validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!ValidationService.validateName(fullName)) {
      return NextResponse.json({ error: 'Invalid name format' }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = ValidationService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Prepare user metadata
    const metadata = {
      full_name: ValidationService.sanitizeInput(fullName),
      user_type: userType,
      timezone: timezone || 'America/Sao_Paulo',
      language: language || 'pt-BR',
    };

    // Attempt to sign up
    const { data, error } = await AuthService.signUp({
      email,
      password,
      metadata,
    });

    if (error) {
      // Handle rate limiting
      if (error.status === 429) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }

      // Handle specific signup errors
      if (error.message?.includes('already registered')) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      if (error.message?.includes('weak password')) {
        return NextResponse.json({ error: 'Password is too weak' }, { status: 400 });
      }

      // Handle other auth errors
      return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }

    // Successful registration response
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email for verification.',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailVerified: AuthService.isEmailVerified(data.user),
        metadata: data.user.user_metadata,
      },
      requiresVerification: !AuthService.isEmailVerified(data.user),
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
