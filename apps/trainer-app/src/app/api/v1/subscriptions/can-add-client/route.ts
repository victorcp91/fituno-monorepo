import { NextRequest, NextResponse } from 'next/server';
import { subscriptionService } from '../../../../../lib/services/subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, currentClientCount } = body;

    // Validate required fields
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    if (typeof currentClientCount !== 'number' || currentClientCount < 0) {
      return NextResponse.json(
        { error: 'Valid current client count is required' },
        { status: 400 }
      );
    }

    // Check if user can add more clients
    const result = await subscriptionService.canAddClient(customerId, currentClientCount);

    return NextResponse.json(result);
  } catch {


    return NextResponse.json({ error: 'Failed to check client add capability' }, { status: 500 });
  }
}
