'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SubscriptionStatus } from '../lib/services/subscription';

interface UseSubscriptionResult {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  canAddClient: (currentCount: number) => Promise<{
    canAdd: boolean;
    reason?: string;
    suggestedPlan?: string;
  }>;
  hasFeatureAccess: (feature: string) => boolean;
  createCheckoutSession: (plan: string) => Promise<{ url: string }>;
  openBillingPortal: () => Promise<{ url: string }>;
}

export function useSubscription(customerId?: string): UseSubscriptionResult {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/subscriptions/info?customerId=${customerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();

      // Transform the API response to match our SubscriptionStatus interface
      const subscriptionStatus: SubscriptionStatus = {
        isActive: data.hasActiveSubscription,
        plan: data.activeSubscription?.metadata?.plan || null,
        subscription: data.activeSubscription,
        customerId,
        clientLimit: 0, // Will be calculated on the server
        currentClientCount: 0, // Will be passed separately
        isWithinLimits: true, // Will be calculated
        daysUntilExpiry: null, // Will be calculated on the server
        needsUpgrade: false, // Will be calculated
      };

      setStatus(subscriptionStatus);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const canAddClient = useCallback(
    async (currentCount: number) => {
      if (!customerId) {
        return {
          canAdd: false,
          reason: 'No customer ID',
        };
      }

      try {
        const response = await fetch('/api/v1/subscriptions/can-add-client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId,
            currentClientCount: currentCount,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to check client limit');
        }

        return await response.json();
      } catch {

        return {
          canAdd: false,
          reason: 'Error checking limit',
        };
      }
    },
    [customerId]
  );

  const hasFeatureAccess = useCallback(
    (feature: string): boolean => {
      if (!status?.isActive || !status?.plan) {
        return false;
      }

      // Basic feature access logic - should match server-side logic
      const planFeatures = {
        BASIC: ['basic_workout_plans', 'progress_tracking', 'email_support'],
        PRO: [
          'unlimited_clients',
          'advanced_workout_plans',
          'progress_tracking',
          'nutrition_tracking',
          'custom_branding',
          'priority_support',
        ],
        ENTERPRISE: [
          'unlimited_clients',
          'advanced_workout_plans',
          'progress_tracking',
          'nutrition_tracking',
          'custom_branding',
          'team_management',
          'advanced_analytics',
          'api_access',
          'dedicated_support',
        ],
      };

      const features = planFeatures[status.plan as keyof typeof planFeatures] || [];
      return features.includes(feature);
    },
    [status]
  );

  const createCheckoutSession = useCallback(
    async (plan: string) => {
      if (!customerId) {
        throw new Error('No customer ID');
      }

      const response = await fetch('/api/v1/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return { url: data.url };
    },
    [customerId]
  );

  const openBillingPortal = useCallback(async () => {
    if (!customerId) {
      throw new Error('No customer ID');
    }

    const response = await fetch('/api/v1/subscriptions/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create billing portal session');
    }

    const data = await response.json();
    return { url: data.url };
  }, [customerId]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchSubscriptionStatus,
    canAddClient,
    hasFeatureAccess,
    createCheckoutSession,
    openBillingPortal,
  };
}
