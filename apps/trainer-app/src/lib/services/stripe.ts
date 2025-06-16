import type Stripe from 'stripe';
import { getStripe, STRIPE_CONFIG, type StripePlan } from '../config/stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = getStripe();
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    });
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(params: {
    priceId: string;
    customerId?: string;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    };

    if (params.customerId) {
      sessionParams.customer = params.customerId;
    } else if (params.customerEmail) {
      sessionParams.customer_email = params.customerEmail;
    }

    return this.stripe.checkout.sessions.create(sessionParams);
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    return this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  /**
   * Get customer subscriptions
   */
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });

    return subscriptions.data;
  }

  /**
   * Get active subscription for customer
   */
  async getActiveSubscription(customerId: string): Promise<Stripe.Subscription | null> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    atPeriodEnd = true
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: atPeriodEnd,
    });
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  }

  /**
   * Create a product and price for a plan
   */
  async createPlanProduct(plan: StripePlan): Promise<{
    product: Stripe.Product;
    price: Stripe.Price;
  }> {
    const planConfig = STRIPE_CONFIG.PLANS[plan];

    // Create product
    const product = await this.stripe.products.create({
      name: planConfig.name,
      description: `${planConfig.name} - ${planConfig.features.join(', ')}`,
      metadata: {
        plan: plan,
      },
    });

    // Create price
    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: planConfig.price,
      currency: STRIPE_CONFIG.CURRENCY,
      recurring: {
        interval: planConfig.interval,
      },
      metadata: {
        plan: plan,
      },
    });

    return { product, price };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    endpointSecret: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  }

  /**
   * Handle subscription created webhook
   */
  async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    // This will be implemented when we integrate with the database
    console.log('Subscription created:', subscription.id);
  }

  /**
   * Handle subscription updated webhook
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    // This will be implemented when we integrate with the database
    console.log('Subscription updated:', subscription.id);
  }

  /**
   * Handle subscription deleted webhook
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // This will be implemented when we integrate with the database
    console.log('Subscription deleted:', subscription.id);
  }

  /**
   * Handle invoice payment succeeded webhook
   */
  async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    // This will be implemented when we integrate with the database
    console.log('Invoice payment succeeded:', invoice.id);
  }

  /**
   * Handle invoice payment failed webhook
   */
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // This will be implemented when we integrate with the database
    console.log('Invoice payment failed:', invoice.id);
  }
}

export const stripeService = new StripeService();
