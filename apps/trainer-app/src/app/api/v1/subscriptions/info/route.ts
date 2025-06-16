import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '../../../../../lib/services/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    // Validate required fields
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Get customer's subscriptions
    const subscriptions = await stripeService.getCustomerSubscriptions(customerId);
    const activeSubscription = await stripeService.getActiveSubscription(customerId);

    return NextResponse.json({
      subscriptions,
      activeSubscription,
      hasActiveSubscription: !!activeSubscription,
    });
  } catch (error) {
    console.error('Error fetching subscription info:', error);

    return NextResponse.json({ error: 'Failed to fetch subscription info' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');
    const immediate = searchParams.get('immediate') === 'true';

    // Validate required fields
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Cancel subscription
    const subscription = await stripeService.cancelSubscription(
      subscriptionId,
      !immediate // atPeriodEnd
    );

    return NextResponse.json({
      subscription,
      message: immediate
        ? 'Subscription canceled immediately'
        : 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);

    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
