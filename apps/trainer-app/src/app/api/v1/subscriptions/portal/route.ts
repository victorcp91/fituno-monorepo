import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '../../../../../lib/services/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    // Validate required fields
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Get the base URL for return URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create billing portal session
    const session = await stripeService.createBillingPortalSession({
      customerId,
      returnUrl: `${baseUrl}/dashboard/subscription`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);

    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 });
  }
}
