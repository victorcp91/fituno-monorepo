import { loadStripe, Stripe as StripeJs } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Server-side Stripe instance
let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is required. Please add it to your environment variables.'
      );
    }

    stripe = new Stripe(secretKey, {
      apiVersion: '2025-05-28.basil', // Latest API version
      typescript: true,
    });
  }

  return stripe;
};

// Client-side Stripe instance
let stripePromise: Promise<StripeJs | null> | null = null;

export const getStripeJs = (): Promise<StripeJs | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required. Please add it to your environment variables.'
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

// Stripe configuration constants
export const STRIPE_CONFIG = {
  // Currency
  CURRENCY: 'usd',

  // Plan configuration
  PLANS: {
    BASIC: {
      name: 'Basic Plan',
      price: 1999, // $19.99 in cents
      interval: 'month' as const,
      features: ['Up to 3 clients', 'Basic workout plans', 'Progress tracking', 'Email support'],
    },
    PRO: {
      name: 'Pro Plan',
      price: 4999, // $49.99 in cents
      interval: 'month' as const,
      features: [
        'Unlimited clients',
        'Advanced workout plans',
        'Progress tracking',
        'Nutrition tracking',
        'Custom branding',
        'Priority support',
      ],
    },
    ENTERPRISE: {
      name: 'Enterprise Plan',
      price: 9999, // $99.99 in cents
      interval: 'month' as const,
      features: [
        'Unlimited clients',
        'All Pro features',
        'Team management',
        'Advanced analytics',
        'API access',
        'Dedicated support',
      ],
    },
  },

  // Webhook configuration
  WEBHOOK_EVENTS: [
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ] as const,
} as const;

export type StripePlan = keyof typeof STRIPE_CONFIG.PLANS;
export type StripeWebhookEvent = (typeof STRIPE_CONFIG.WEBHOOK_EVENTS)[number];
