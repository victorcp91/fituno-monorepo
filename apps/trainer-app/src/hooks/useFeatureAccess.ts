'use client';

import { useCallback, useState } from 'react';
import type { StripePlan } from '../lib/config/stripe';
import { FeatureAccessService, FEATURES, type Feature } from '../lib/services/feature-access';
import { useSubscription } from './useSubscription';

export interface FeatureCheckResult {
  hasAccess: boolean;
  reason?: string;
  suggestedPlan?: StripePlan;
  needsUpgrade: boolean;
}

export interface ClientLimitResult {
  canAdd: boolean;
  reason?: string;
  suggestedPlan?: StripePlan;
  currentCount: number;
  limit: string;
}

export function useFeatureAccess() {
  const { status, loading } = useSubscription();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState<{
    feature: Feature;
    reason: string;
    suggestedPlan: StripePlan;
  } | null>(null);

  /**
   * Check if current subscription has access to a feature
   */
  const checkFeatureAccess = useCallback(
    (feature: Feature): FeatureCheckResult => {
      if (loading) {
        return {
          hasAccess: false,
          needsUpgrade: false,
          reason: 'Loading subscription status...',
        };
      }

      if (!status || !status.isActive) {
        return {
          hasAccess: false,
          needsUpgrade: true,
          reason: 'Active subscription required',
          suggestedPlan: 'BASIC',
        };
      }

      const hasAccess = FeatureAccessService.hasFeatureAccess(status.plan, feature);

      if (hasAccess) {
        return {
          hasAccess: true,
          needsUpgrade: false,
        };
      }

      const upgrade = FeatureAccessService.needsUpgrade(status.plan, feature);

      return {
        hasAccess: false,
        needsUpgrade: upgrade.needsUpgrade,
        reason: upgrade.needsUpgrade
          ? `This feature requires ${upgrade.planName || 'a higher plan'}`
          : 'Feature not available',
        suggestedPlan: upgrade.recommendedPlan,
      };
    },
    [status, loading]
  );

  /**
   * Check client limits for adding new clients
   */
  const checkClientLimit = useCallback(
    (currentClientCount: number): ClientLimitResult => {
      if (loading) {
        return {
          canAdd: false,
          reason: 'Loading subscription status...',
          currentCount: currentClientCount,
          limit: '...',
        };
      }

      if (!status || !status.isActive) {
        return {
          canAdd: false,
          reason: 'Active subscription required to add clients',
          suggestedPlan: 'BASIC',
          currentCount: currentClientCount,
          limit: '0',
        };
      }

      const result = FeatureAccessService.canAddClient(status.plan, currentClientCount);
      const limit = FeatureAccessService.formatClientLimit(status.plan);

      return {
        canAdd: result.canAdd,
        reason: result.reason,
        suggestedPlan: result.suggestedPlan,
        currentCount: currentClientCount,
        limit,
      };
    },
    [status, loading]
  );

  /**
   * Require feature access and show upgrade prompt if needed
   */
  const requireFeatureAccess = useCallback(
    (feature: Feature): boolean => {
      const result = checkFeatureAccess(feature);

      if (!result.hasAccess && result.needsUpgrade && result.suggestedPlan) {
        setUpgradeContext({
          feature,
          reason: result.reason || 'Upgrade required',
          suggestedPlan: result.suggestedPlan,
        });
        setShowUpgradePrompt(true);
        return false;
      }

      return result.hasAccess;
    },
    [checkFeatureAccess]
  );

  /**
   * Require client limit and show upgrade prompt if needed
   */
  const requireClientLimit = useCallback(
    (currentClientCount: number): boolean => {
      const result = checkClientLimit(currentClientCount);

      if (!result.canAdd && result.suggestedPlan) {
        setUpgradeContext({
          feature: FEATURES.CLIENT_MANAGEMENT.UNLIMITED_CLIENTS,
          reason: result.reason || 'Client limit reached',
          suggestedPlan: result.suggestedPlan,
        });
        setShowUpgradePrompt(true);
        return false;
      }

      return result.canAdd;
    },
    [checkClientLimit]
  );

  /**
   * Get all features available for current plan
   */
  const getPlanFeatures = useCallback((): Feature[] => {
    return FeatureAccessService.getPlanFeatures(status?.plan || null);
  }, [status?.plan]);

  /**
   * Get missing features compared to a target plan
   */
  const getMissingFeatures = useCallback(
    (targetPlan: StripePlan): Feature[] => {
      return FeatureAccessService.getMissingFeatures(status?.plan || null, targetPlan);
    },
    [status?.plan]
  );

  /**
   * Format client limit for display
   */
  const formatClientLimit = useCallback((): string => {
    return FeatureAccessService.formatClientLimit(status?.plan || null);
  }, [status?.plan]);

  /**
   * Check if plan needs upgrade for specific feature
   */
  const needsUpgradeForFeature = useCallback(
    (feature: Feature) => {
      return FeatureAccessService.needsUpgrade(status?.plan || null, feature);
    },
    [status?.plan]
  );

  /**
   * Hide upgrade prompt
   */
  const hideUpgradePrompt = useCallback(() => {
    setShowUpgradePrompt(false);
    setUpgradeContext(null);
  }, []);

  /**
   * Trigger checkout for upgrade
   */
  const triggerUpgrade = useCallback(
    async (planId?: StripePlan) => {
      const targetPlan = planId || upgradeContext?.suggestedPlan;
      if (!targetPlan) return;

      try {
        const response = await fetch('/api/v1/subscriptions/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: targetPlan,
            successUrl: `${window.location.origin}/dashboard/subscription/success`,
            cancelUrl: `${window.location.origin}/dashboard/subscription/canceled`,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error('Error triggering upgrade:', error);
        // You might want to show an error toast here
      }
    },
    [upgradeContext]
  );

  return {
    // Status
    loading,
    isActive: status?.isActive || false,
    currentPlan: status?.plan || null,

    // Feature checking
    checkFeatureAccess,
    checkClientLimit,
    requireFeatureAccess,
    requireClientLimit,

    // Plan features
    getPlanFeatures,
    getMissingFeatures,
    formatClientLimit,
    needsUpgradeForFeature,

    // Upgrade prompt
    showUpgradePrompt,
    upgradeContext,
    hideUpgradePrompt,
    triggerUpgrade,

    // Subscription details
    status,
  };
}

// Re-export useful constants and types
export type { Feature } from '../lib/services/feature-access';
export { FeatureAccessService, FEATURES };
