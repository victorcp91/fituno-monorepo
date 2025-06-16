import { STRIPE_CONFIG, type StripePlan } from '../config/stripe';

// Feature definitions with plan requirements
export const FEATURES = {
  // Client Management
  CLIENT_MANAGEMENT: {
    ADD_CLIENT: 'add_client',
    UNLIMITED_CLIENTS: 'unlimited_clients',
    CLIENT_BULK_OPERATIONS: 'client_bulk_operations',
  },

  // Workout Planning
  WORKOUT_BUILDER: {
    BASIC_WORKOUTS: 'basic_workouts',
    ADVANCED_WORKOUTS: 'advanced_workouts',
    WORKOUT_TEMPLATES: 'workout_templates',
    CUSTOM_EXERCISES: 'custom_exercises',
  },

  // Analytics & Reporting
  ANALYTICS: {
    BASIC_ANALYTICS: 'basic_analytics',
    ADVANCED_ANALYTICS: 'advanced_analytics',
    CUSTOM_REPORTS: 'custom_reports',
    DATA_EXPORT: 'data_export',
  },

  // Branding & Customization
  BRANDING: {
    CUSTOM_BRANDING: 'custom_branding',
    WHITE_LABEL: 'white_label',
    CUSTOM_DOMAIN: 'custom_domain',
  },

  // Team & Collaboration
  TEAM: {
    TEAM_MANAGEMENT: 'team_management',
    ROLE_PERMISSIONS: 'role_permissions',
    COLLABORATION: 'collaboration',
  },

  // Integration & API
  INTEGRATIONS: {
    API_ACCESS: 'api_access',
    WEBHOOKS: 'webhooks',
    THIRD_PARTY_INTEGRATIONS: 'third_party_integrations',
  },

  // Support
  SUPPORT: {
    EMAIL_SUPPORT: 'email_support',
    PRIORITY_SUPPORT: 'priority_support',
    DEDICATED_SUPPORT: 'dedicated_support',
    PHONE_SUPPORT: 'phone_support',
  },
} as const;

// Type helpers - using string for simplicity to avoid complex type inference issues
export type Feature = string;
export type FeatureCategory = keyof typeof FEATURES;

// Client limits by plan
export const CLIENT_LIMITS: Record<StripePlan, number> = {
  BASIC: 3,
  PRO: -1, // Unlimited
  ENTERPRISE: -1, // Unlimited
};

// Plan feature mappings
const PLAN_FEATURES: Record<StripePlan, Feature[]> = {
  BASIC: [
    FEATURES.CLIENT_MANAGEMENT.ADD_CLIENT,
    FEATURES.WORKOUT_BUILDER.BASIC_WORKOUTS,
    FEATURES.ANALYTICS.BASIC_ANALYTICS,
    FEATURES.SUPPORT.EMAIL_SUPPORT,
  ],
  PRO: [],
  ENTERPRISE: [],
};

// Build PRO features (includes all Basic features)
PLAN_FEATURES.PRO = [
  ...PLAN_FEATURES.BASIC,
  FEATURES.CLIENT_MANAGEMENT.UNLIMITED_CLIENTS,
  FEATURES.CLIENT_MANAGEMENT.CLIENT_BULK_OPERATIONS,
  FEATURES.WORKOUT_BUILDER.ADVANCED_WORKOUTS,
  FEATURES.WORKOUT_BUILDER.WORKOUT_TEMPLATES,
  FEATURES.WORKOUT_BUILDER.CUSTOM_EXERCISES,
  FEATURES.ANALYTICS.ADVANCED_ANALYTICS,
  FEATURES.BRANDING.CUSTOM_BRANDING,
  FEATURES.SUPPORT.PRIORITY_SUPPORT,
];

// Build ENTERPRISE features (includes all Pro features)
PLAN_FEATURES.ENTERPRISE = [
  ...PLAN_FEATURES.PRO,
  FEATURES.ANALYTICS.CUSTOM_REPORTS,
  FEATURES.ANALYTICS.DATA_EXPORT,
  FEATURES.BRANDING.WHITE_LABEL,
  FEATURES.BRANDING.CUSTOM_DOMAIN,
  FEATURES.TEAM.TEAM_MANAGEMENT,
  FEATURES.TEAM.ROLE_PERMISSIONS,
  FEATURES.TEAM.COLLABORATION,
  FEATURES.INTEGRATIONS.API_ACCESS,
  FEATURES.INTEGRATIONS.WEBHOOKS,
  FEATURES.INTEGRATIONS.THIRD_PARTY_INTEGRATIONS,
  FEATURES.SUPPORT.DEDICATED_SUPPORT,
  FEATURES.SUPPORT.PHONE_SUPPORT,
];

// Feature access checker
export class FeatureAccessService {
  /**
   * Check if a plan has access to a specific feature
   */
  static hasFeatureAccess(plan: StripePlan | null, feature: Feature): boolean {
    if (!plan) return false;

    const planFeatures = PLAN_FEATURES[plan] || [];
    return planFeatures.includes(feature);
  }

  /**
   * Check if a plan can add more clients
   */
  static canAddClient(
    plan: StripePlan | null,
    currentClientCount: number
  ): {
    canAdd: boolean;
    reason?: string;
    suggestedPlan?: StripePlan;
  } {
    if (!plan) {
      return {
        canAdd: false,
        reason: 'No active subscription',
        suggestedPlan: 'BASIC',
      };
    }

    const limit = CLIENT_LIMITS[plan];

    // Unlimited plans
    if (limit === -1) {
      return { canAdd: true };
    }

    // Check if under limit
    if (currentClientCount < limit) {
      return { canAdd: true };
    }

    // Suggest upgrade
    const suggestedPlan = plan === 'BASIC' ? 'PRO' : 'ENTERPRISE';

    return {
      canAdd: false,
      reason: `You've reached your plan limit of ${limit} clients`,
      suggestedPlan,
    };
  }

  /**
   * Get all features available for a plan
   */
  static getPlanFeatures(plan: StripePlan | null): Feature[] {
    if (!plan) return [];
    return PLAN_FEATURES[plan] || [];
  }

  /**
   * Get missing features compared to a target plan
   */
  static getMissingFeatures(currentPlan: StripePlan | null, targetPlan: StripePlan): Feature[] {
    const currentFeatures = this.getPlanFeatures(currentPlan);
    const targetFeatures = this.getPlanFeatures(targetPlan);

    return targetFeatures.filter(feature => !currentFeatures.includes(feature));
  }

  /**
   * Get recommended plan for a feature
   */
  static getRecommendedPlan(feature: Feature): StripePlan | null {
    for (const [plan, features] of Object.entries(PLAN_FEATURES)) {
      if (features.includes(feature)) {
        return plan as StripePlan;
      }
    }
    return null;
  }

  /**
   * Check if current plan needs upgrade for feature
   */
  static needsUpgrade(
    currentPlan: StripePlan | null,
    feature: Feature
  ): {
    needsUpgrade: boolean;
    recommendedPlan?: StripePlan;
    planName?: string;
    planPrice?: number;
  } {
    if (this.hasFeatureAccess(currentPlan, feature)) {
      return { needsUpgrade: false };
    }

    const recommendedPlan = this.getRecommendedPlan(feature);

    if (!recommendedPlan) {
      return { needsUpgrade: false };
    }

    const planConfig = STRIPE_CONFIG.PLANS[recommendedPlan];

    return {
      needsUpgrade: true,
      recommendedPlan,
      planName: planConfig.name,
      planPrice: planConfig.price,
    };
  }

  /**
   * Get feature description
   */
  static getFeatureDescription(feature: Feature): string {
    const descriptions: Record<Feature, string> = {
      [FEATURES.CLIENT_MANAGEMENT.ADD_CLIENT]: 'Add and manage clients',
      [FEATURES.CLIENT_MANAGEMENT.UNLIMITED_CLIENTS]: 'Add unlimited clients',
      [FEATURES.CLIENT_MANAGEMENT.CLIENT_BULK_OPERATIONS]: 'Bulk operations on clients',
      [FEATURES.WORKOUT_BUILDER.BASIC_WORKOUTS]: 'Create basic workout plans',
      [FEATURES.WORKOUT_BUILDER.ADVANCED_WORKOUTS]: 'Advanced workout planning tools',
      [FEATURES.WORKOUT_BUILDER.WORKOUT_TEMPLATES]: 'Save and reuse workout templates',
      [FEATURES.WORKOUT_BUILDER.CUSTOM_EXERCISES]: 'Create custom exercises',
      [FEATURES.ANALYTICS.BASIC_ANALYTICS]: 'Basic progress tracking',
      [FEATURES.ANALYTICS.ADVANCED_ANALYTICS]: 'Advanced analytics and insights',
      [FEATURES.ANALYTICS.CUSTOM_REPORTS]: 'Generate custom reports',
      [FEATURES.ANALYTICS.DATA_EXPORT]: 'Export data to CSV/PDF',
      [FEATURES.BRANDING.CUSTOM_BRANDING]: 'Customize app appearance',
      [FEATURES.BRANDING.WHITE_LABEL]: 'Remove Fituno branding',
      [FEATURES.BRANDING.CUSTOM_DOMAIN]: 'Use your own domain',
      [FEATURES.TEAM.TEAM_MANAGEMENT]: 'Manage team members',
      [FEATURES.TEAM.ROLE_PERMISSIONS]: 'Set role-based permissions',
      [FEATURES.TEAM.COLLABORATION]: 'Team collaboration tools',
      [FEATURES.INTEGRATIONS.API_ACCESS]: 'API access for integrations',
      [FEATURES.INTEGRATIONS.WEBHOOKS]: 'Webhook notifications',
      [FEATURES.INTEGRATIONS.THIRD_PARTY_INTEGRATIONS]: 'Third-party app integrations',
      [FEATURES.SUPPORT.EMAIL_SUPPORT]: 'Email support',
      [FEATURES.SUPPORT.PRIORITY_SUPPORT]: 'Priority customer support',
      [FEATURES.SUPPORT.DEDICATED_SUPPORT]: 'Dedicated account manager',
      [FEATURES.SUPPORT.PHONE_SUPPORT]: 'Phone support',
    };

    return descriptions[feature] || 'Feature access';
  }

  /**
   * Format client limit for display
   */
  static formatClientLimit(plan: StripePlan | null): string {
    if (!plan) return '0';

    const limit = CLIENT_LIMITS[plan];
    return limit === -1 ? 'Unlimited' : limit.toString();
  }
}

export default FeatureAccessService;
