import { NextRequest, NextResponse } from 'next/server';
import { STRIPE_CONFIG } from '../../../../../lib/config/stripe';
import { stripeService } from '../../../../../lib/services/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, customerEmail, customerId } = body;

    // Validate required fields
    if (!plan) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 });
    }

    if (!customerEmail && !customerId) {
      return NextResponse.json(
        { error: 'Either customerEmail or customerId is required' },
        { status: 400 }
      );
    }

    // Validate plan exists
    if (!STRIPE_CONFIG.PLANS[plan as keyof typeof STRIPE_CONFIG.PLANS]) {
      return NextResponse.json({ error: 'Invalid plan specified' }, { status: 400 });
    }

    // For now, we'll use hardcoded price IDs
    // In production, these should be stored in environment variables or database
    const priceIds = {
      BASIC: process.env.STRIPE_PRICE_ID_BASIC,
      PRO: process.env.STRIPE_PRICE_ID_PRO,
      ENTERPRISE: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    };

    const priceId = priceIds[plan as keyof typeof priceIds];

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured for this plan' }, { status: 500 });
    }

    // Get the base URL for success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      priceId,
      customerId,
      customerEmail,
      successUrl: `${baseUrl}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/dashboard/subscription/canceled`,
      metadata: {
        plan,
        userId: customerId || '', // Will be populated from auth in the future
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
