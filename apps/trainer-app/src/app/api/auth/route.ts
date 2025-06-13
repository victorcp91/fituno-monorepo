import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Authentication endpoints',
      endpoints: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        profile: '/api/auth/profile',
        'refresh-token': '/api/auth/refresh-token',
      },
    },
    { status: 200 }
  );
}
