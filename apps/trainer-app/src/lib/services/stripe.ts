import type Stripe from 'stripe';
import { getStripe, STRIPE_CONFIG, type StripePlan } from '../config/stripe';

export class StripeService {
  private stripe: Stripe | null = null;

  private getStripeInstance(): Stripe {
    if (!this.stripe) {
      this.stripe = getStripe();
    }
    return this.stripe;
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    return this.getStripeInstance().customers.create({
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

    return this.getStripeInstance().checkout.sessions.create(sessionParams);
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    return this.getStripeInstance().billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  /**
   * Get customer subscriptions
   */
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await this.getStripeInstance().subscriptions.list({
      customer: customerId,
      status: 'all',
    });

    return subscriptions.data;
  }

  /**
   * Get active subscription for customer
   */
  async getActiveSubscription(customerId: string): Promise<Stripe.Subscription | null> {
    const subscriptions = await this.getStripeInstance().subscriptions.list({
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
    return this.getStripeInstance().subscriptions.update(subscriptionId, {
      cancel_at_period_end: atPeriodEnd,
    });
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.getStripeInstance().subscriptions.update(subscriptionId, {
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
    const product = await this.getStripeInstance().products.create({
      name: planConfig.name,
      description: `${planConfig.name} - ${planConfig.features.join(', ')}`,
      metadata: {
        plan,
      },
    });

    // Create price
    const price = await this.getStripeInstance().prices.create({
      product: product.id,
      unit_amount: planConfig.price,
      currency: STRIPE_CONFIG.CURRENCY,
      recurring: {
        interval: planConfig.interval,
      },
      metadata: {
        plan,
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
    return this.getStripeInstance().webhooks.constructEvent(payload, signature, endpointSecret);
  }

  /**
   * Handle subscription created webhook
   */
  async handleSubscriptionCreated(_subscription: Stripe.Subscription): Promise<void> {
    // This will be implemented when we integrate with the database
    // TODO: Store subscription data in database
  }

  /**
   * Handle subscription updated webhook
   */
  async handleSubscriptionUpdated(_subscription: Stripe.Subscription): Promise<void> {
    // This will be implemented when we integrate with the database
    // TODO: Update subscription data in database
  }

  /**
   * Handle subscription deleted webhook
   */
  async handleSubscriptionDeleted(_subscription: Stripe.Subscription): Promise<void> {
    // This will be implemented when we integrate with the database
    // TODO: Remove or mark subscription as deleted in database
  }

  /**
   * Handle invoice payment succeeded webhook
   */
  async handleInvoicePaymentSucceeded(_invoice: Stripe.Invoice): Promise<void> {
    // This will be implemented when we integrate with the database
    // TODO: Update payment status in database
  }

  /**
   * Handle invoice payment failed webhook
   */
  async handleInvoicePaymentFailed(_invoice: Stripe.Invoice): Promise<void> {
    // This will be implemented when we integrate with the database
    // TODO: Handle failed payment, notify user, update status
  }

  /**
   * Get customer invoices
   */
  async getCustomerInvoices(customerId: string): Promise<Stripe.Invoice[]> {
    const invoices = await this.getStripeInstance().invoices.list({
      customer: customerId,
      limit: 100,
    });

    return invoices.data;
  }

  /**
   * Get a specific invoice
   */
  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return this.getStripeInstance().invoices.retrieve(invoiceId);
  }
}

export const stripeService = new StripeService();
