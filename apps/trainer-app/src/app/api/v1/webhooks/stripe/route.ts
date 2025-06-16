import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripeService } from '../../../../../lib/services/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripeService.verifyWebhookSignature(body, signature, endpointSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
        await stripeService.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await stripeService.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await stripeService.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await stripeService.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await stripeService.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);

    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
