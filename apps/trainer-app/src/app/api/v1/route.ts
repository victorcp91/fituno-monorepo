import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Fituno API v1',
      version: '1.0.0',
      documentation: '/api/v1/docs',
      endpoints: {
        auth: '/api/auth',
        users: '/api/v1/users',
        trainers: '/api/v1/trainers',
        clients: '/api/v1/clients',
        workouts: '/api/v1/workouts',
        exercises: '/api/v1/exercises',
        subscriptions: '/api/v1/subscriptions',
        health: '/api/health',
      },
      status: 'active',
    },
    { status: 200 }
  );
}
