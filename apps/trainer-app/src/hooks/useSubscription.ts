'use client';

import { useEffect, useState } from 'react';
import type { SubscriptionStatus } from '../lib/services/subscription';

interface UseSubscriptionResult {
  subscription: SubscriptionStatus | null;
  canAddClient: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionResult {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/subscriptions/info');

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Set default free plan status if fetch fails (no active subscription)
      setSubscription({
        isActive: false,
        plan: null, // No paid plan means free tier
        subscription: null,
        customerId: null,
        clientLimit: 2, // Free tier allows 2 clients
        currentClientCount: 0,
        isWithinLimits: true,
        daysUntilExpiry: null,
        needsUpgrade: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  // For free tier (no active subscription), allow up to 2 clients
  // For paid plans, check the subscription limits
  const canAddClient = subscription
    ? subscription.plan === null
      ? subscription.currentClientCount < 2 // Free tier logic
      : subscription.isWithinLimits // Paid plan logic
    : false;

  const refresh = async () => {
    await fetchSubscriptionStatus();
  };

  return {
    subscription,
    canAddClient,
    loading,
    error,
    refresh,
  };
}
