import type Stripe from 'stripe';
import { STRIPE_CONFIG, type StripePlan } from '../config/stripe';
import { stripeService } from './stripe';

export interface SubscriptionStatus {
  isActive: boolean;
  plan: StripePlan | null;
  subscription: Stripe.Subscription | null;
  customerId: string | null;
  clientLimit: number;
  currentClientCount: number;
  isWithinLimits: boolean;
  daysUntilExpiry: number | null;
  needsUpgrade: boolean;
}

export interface PlanLimits {
  maxClients: number;
  features: string[];
}

export class SubscriptionService {
  /**
   * Get plan limits for each subscription tier
   */
  private getPlanLimits(): Record<StripePlan, PlanLimits> {
    return {
      BASIC: {
        maxClients: 3,
        features: ['basic_workout_plans', 'progress_tracking', 'email_support'],
      },
      PRO: {
        maxClients: Infinity, // Unlimited
        features: [
          'unlimited_clients',
          'advanced_workout_plans',
          'progress_tracking',
          'nutrition_tracking',
          'custom_branding',
          'priority_support',
        ],
      },
      ENTERPRISE: {
        maxClients: Infinity, // Unlimited
        features: [
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
      },
    };
  }

  /**
   * Get subscription status for a customer
   */
  async getSubscriptionStatus(
    customerId: string,
    currentClientCount: number = 0
  ): Promise<SubscriptionStatus> {
    try {
      const activeSubscription = await stripeService.getActiveSubscription(customerId);

      if (!activeSubscription) {
        return {
          isActive: false,
          plan: null,
          subscription: null,
          customerId,
          clientLimit: 0,
          currentClientCount,
          isWithinLimits: false,
          daysUntilExpiry: null,
          needsUpgrade: true,
        };
      }

      // Determine plan from subscription metadata or price
      const plan = this.determinePlanFromSubscription(activeSubscription);
      const planLimits = this.getPlanLimits();
      const limits = plan ? planLimits[plan] : null;

      const clientLimit = limits?.maxClients ?? 0;
      const isWithinLimits = currentClientCount <= clientLimit;

      // Calculate days until expiry
      const periodEnd = (activeSubscription as any).current_period_end;
      const daysUntilExpiry = periodEnd
        ? Math.ceil((periodEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        isActive: activeSubscription.status === 'active',
        plan,
        subscription: activeSubscription,
        customerId,
        clientLimit,
        currentClientCount,
        isWithinLimits,
        daysUntilExpiry,
        needsUpgrade: !isWithinLimits || !plan,
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);

      // Return safe defaults on error
      return {
        isActive: false,
        plan: null,
        subscription: null,
        customerId,
        clientLimit: 0,
        currentClientCount,
        isWithinLimits: false,
        daysUntilExpiry: null,
        needsUpgrade: true,
      };
    }
  }

  /**
   * Determine plan from subscription metadata or price
   */
  private determinePlanFromSubscription(subscription: Stripe.Subscription): StripePlan | null {
    // Try to get plan from metadata first
    if (subscription.metadata?.plan) {
      const plan = subscription.metadata.plan as StripePlan;
      if (Object.keys(STRIPE_CONFIG.PLANS).includes(plan)) {
        return plan;
      }
    }

    // Try to determine from price metadata
    const priceItem = subscription.items.data[0];
    if (priceItem?.price.metadata?.plan) {
      const plan = priceItem.price.metadata.plan as StripePlan;
      if (Object.keys(STRIPE_CONFIG.PLANS).includes(plan)) {
        return plan;
      }
    }

    // Fallback: try to determine from price amount
    const amount = priceItem?.price.unit_amount;
    if (amount) {
      const planEntries = Object.entries(STRIPE_CONFIG.PLANS);
      const matchingPlan = planEntries.find(([_, config]) => config.price === amount);
      if (matchingPlan) {
        return matchingPlan[0] as StripePlan;
      }
    }

    return null;
  }

  /**
   * Check if user can add more clients
   */
  async canAddClient(
    customerId: string,
    currentClientCount: number
  ): Promise<{
    canAdd: boolean;
    reason?: string;
    suggestedPlan?: StripePlan;
  }> {
    const status = await this.getSubscriptionStatus(customerId, currentClientCount);

    if (!status.isActive) {
      return {
        canAdd: false,
        reason: 'No active subscription',
        suggestedPlan: 'BASIC',
      };
    }

    if (status.isWithinLimits && currentClientCount < status.clientLimit) {
      return { canAdd: true };
    }

    // Suggest upgrade path
    let suggestedPlan: StripePlan | undefined;
    if (status.plan === 'BASIC') {
      suggestedPlan = 'PRO';
    } else if (!status.plan) {
      suggestedPlan = 'BASIC';
    }

    return {
      canAdd: false,
      reason: `Client limit reached (${status.clientLimit})`,
      suggestedPlan,
    };
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeatureAccess(customerId: string, feature: string): Promise<boolean> {
    const status = await this.getSubscriptionStatus(customerId);

    if (!status.isActive || !status.plan) {
      return false;
    }

    const planLimits = this.getPlanLimits();
    const features = planLimits[status.plan]?.features ?? [];

    return features.includes(feature);
  }

  /**
   * Get upgrade suggestions based on current usage
   */
  getUpgradeSuggestions(status: SubscriptionStatus): {
    shouldUpgrade: boolean;
    suggestedPlan?: StripePlan;
    reasons: string[];
  } {
    const reasons: string[] = [];
    let suggestedPlan: StripePlan | undefined;

    if (!status.isActive) {
      reasons.push('No active subscription');
      suggestedPlan = 'BASIC';
    } else if (!status.isWithinLimits) {
      reasons.push(`Client limit exceeded (${status.currentClientCount}/${status.clientLimit})`);

      if (status.plan === 'BASIC') {
        suggestedPlan = 'PRO';
        reasons.push('Upgrade to Pro for unlimited clients');
      }
    } else if (status.daysUntilExpiry && status.daysUntilExpiry <= 7) {
      reasons.push(`Subscription expires in ${status.daysUntilExpiry} days`);
    }

    return {
      shouldUpgrade: reasons.length > 0,
      suggestedPlan,
      reasons,
    };
  }

  /**
   * Format subscription status for display
   */
  formatSubscriptionDisplay(status: SubscriptionStatus): {
    statusText: string;
    statusColor: 'green' | 'yellow' | 'red' | 'gray';
    planName: string;
    clientUsage: string;
    expiryText?: string;
  } {
    let statusText: string;
    let statusColor: 'green' | 'yellow' | 'red' | 'gray';
    let planName: string;

    if (!status.isActive) {
      statusText = 'Inactive';
      statusColor = 'red';
      planName = 'No Plan';
    } else if (!status.isWithinLimits) {
      statusText = 'Limit Exceeded';
      statusColor = 'red';
      planName = status.plan ? STRIPE_CONFIG.PLANS[status.plan].name : 'Unknown';
    } else if (status.daysUntilExpiry && status.daysUntilExpiry <= 7) {
      statusText = 'Expiring Soon';
      statusColor = 'yellow';
      planName = status.plan ? STRIPE_CONFIG.PLANS[status.plan].name : 'Unknown';
    } else {
      statusText = 'Active';
      statusColor = 'green';
      planName = status.plan ? STRIPE_CONFIG.PLANS[status.plan].name : 'Unknown';
    }

    const clientUsage =
      status.clientLimit === Infinity
        ? `${status.currentClientCount} clients`
        : `${status.currentClientCount}/${status.clientLimit} clients`;

    const expiryText = status.daysUntilExpiry
      ? `Expires in ${status.daysUntilExpiry} days`
      : undefined;

    return {
      statusText,
      statusColor,
      planName,
      clientUsage,
      expiryText,
    };
  }
}

export const subscriptionService = new SubscriptionService();
