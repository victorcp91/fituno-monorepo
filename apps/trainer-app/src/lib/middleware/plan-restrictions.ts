import { NextRequest, NextResponse } from 'next/server';
import type { StripePlan } from '../config/stripe';
import { FeatureAccessService, FEATURES, type Feature } from '../services/feature-access';
import { SubscriptionService } from '../services/subscription';

export interface PlanRestrictionOptions {
  feature?: Feature;
  requiresActiveSubscription?: boolean;
  allowedPlans?: StripePlan[];
  redirectOnFailure?: string;
  jsonResponse?: boolean;
}

export interface PlanCheckResult {
  allowed: boolean;
  reason?: string;
  suggestedPlan?: StripePlan;
  currentPlan?: StripePlan | null;
  response?: NextResponse;
}

/**
 * Middleware to check plan restrictions
 */
export class PlanRestrictionMiddleware {
  /**
   * Check if user has access to a feature based on their subscription
   */
  static async checkFeatureAccess(
    customerId: string,
    feature: Feature,
    options: PlanRestrictionOptions = {}
  ): Promise<PlanCheckResult> {
    try {
      const subscriptionService = new SubscriptionService();
      const status = await subscriptionService.getSubscriptionStatus(customerId);

      // Check if subscription is required and active
      if (options.requiresActiveSubscription !== false && !status.isActive) {
        return {
          allowed: false,
          reason: 'Active subscription required',
          suggestedPlan: 'BASIC',
          currentPlan: null,
        };
      }

      // Check feature access
      const hasAccess = FeatureAccessService.hasFeatureAccess(status.plan, feature);

      if (!hasAccess) {
        const upgrade = FeatureAccessService.needsUpgrade(status.plan, feature);

        return {
          allowed: false,
          reason: `This feature requires ${upgrade.planName || 'a higher plan'}`,
          suggestedPlan: upgrade.recommendedPlan,
          currentPlan: status.plan,
        };
      }

      return {
        allowed: true,
        currentPlan: status.plan,
      };
    } catch (error) {
      console.error('Error checking feature access:', error);
      return {
        allowed: false,
        reason: 'Unable to verify subscription status',
        currentPlan: null,
      };
    }
  }

  /**
   * Check client limit for adding new clients
   */
  static async checkClientLimit(
    customerId: string,
    currentClientCount: number
  ): Promise<PlanCheckResult> {
    try {
      const subscriptionService = new SubscriptionService();
      const status = await subscriptionService.getSubscriptionStatus(customerId);

      if (!status.isActive) {
        return {
          allowed: false,
          reason: 'Active subscription required to add clients',
          suggestedPlan: 'BASIC',
          currentPlan: null,
        };
      }

      const canAdd = FeatureAccessService.canAddClient(status.plan, currentClientCount);

      return {
        allowed: canAdd.canAdd,
        reason: canAdd.reason,
        suggestedPlan: canAdd.suggestedPlan,
        currentPlan: status.plan,
      };
    } catch (error) {
      console.error('Error checking client limit:', error);
      return {
        allowed: false,
        reason: 'Unable to verify client limit',
        currentPlan: null,
      };
    }
  }

  /**
   * Check if user's plan is in allowed plans list
   */
  static async checkAllowedPlans(
    customerId: string,
    allowedPlans: StripePlan[]
  ): Promise<PlanCheckResult> {
    try {
      const subscriptionService = new SubscriptionService();
      const status = await subscriptionService.getSubscriptionStatus(customerId);

      if (!status.isActive) {
        return {
          allowed: false,
          reason: 'Active subscription required',
          suggestedPlan: allowedPlans[0] || 'BASIC',
          currentPlan: null,
        };
      }

      if (!status.plan || !allowedPlans.includes(status.plan)) {
        // Find the minimum required plan
        const suggestedPlan = allowedPlans[0];

        return {
          allowed: false,
          reason: `This feature requires ${allowedPlans.join(' or ')} plan`,
          suggestedPlan,
          currentPlan: status.plan,
        };
      }

      return {
        allowed: true,
        currentPlan: status.plan,
      };
    } catch (error) {
      console.error('Error checking allowed plans:', error);
      return {
        allowed: false,
        reason: 'Unable to verify subscription status',
        currentPlan: null,
      };
    }
  }

  /**
   * Create a JSON response for plan restriction
   */
  static createJsonResponse(result: PlanCheckResult, status: number = 403): NextResponse {
    return NextResponse.json(
      {
        error: result.reason || 'Access denied',
        code: 'PLAN_RESTRICTION',
        currentPlan: result.currentPlan,
        suggestedPlan: result.suggestedPlan,
        upgradeRequired: !!result.suggestedPlan,
      },
      { status }
    );
  }

  /**
   * Create a redirect response for plan restriction
   */
  static createRedirectResponse(redirectUrl: string, result: PlanCheckResult): NextResponse {
    const url = new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL);

    // Add query parameters for context
    url.searchParams.set('reason', result.reason || 'upgrade_required');
    if (result.suggestedPlan) {
      url.searchParams.set('suggested_plan', result.suggestedPlan);
    }
    if (result.currentPlan) {
      url.searchParams.set('current_plan', result.currentPlan);
    }

    return NextResponse.redirect(url);
  }

  /**
   * Express-style middleware function for API routes
   */
  static withPlanRestriction(options: PlanRestrictionOptions) {
    return async (
      request: NextRequest,
      context: { params: any },
      next: () => Promise<NextResponse>
    ): Promise<NextResponse> => {
      try {
        // Extract customer ID from request (this would depend on your auth implementation)
        const customerId =
          request.headers.get('x-customer-id') || request.cookies.get('customer_id')?.value;

        if (!customerId) {
          return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        let result: PlanCheckResult;

        // Check based on options
        if (options.feature) {
          result = await this.checkFeatureAccess(customerId, options.feature, options);
        } else if (options.allowedPlans) {
          result = await this.checkAllowedPlans(customerId, options.allowedPlans);
        } else {
          // Default to checking for active subscription
          result = await this.checkFeatureAccess(
            customerId,
            FEATURES.CLIENT_MANAGEMENT.ADD_CLIENT,
            { requiresActiveSubscription: true }
          );
        }

        // Handle restriction
        if (!result.allowed) {
          if (options.redirectOnFailure) {
            return this.createRedirectResponse(options.redirectOnFailure, result);
          } else {
            return this.createJsonResponse(result);
          }
        }

        // Add plan info to headers for downstream use
        const response = await next();
        if (result.currentPlan) {
          response.headers.set('x-current-plan', result.currentPlan);
        }

        return response;
      } catch (error) {
        console.error('Plan restriction middleware error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    };
  }
}

/**
 * Utility function to check restrictions in API routes
 */
export async function requireFeatureAccess(
  customerId: string,
  feature: Feature,
  options: PlanRestrictionOptions = {}
): Promise<PlanCheckResult> {
  const result = await PlanRestrictionMiddleware.checkFeatureAccess(customerId, feature, options);

  if (!result.allowed && options.jsonResponse !== false) {
    result.response = PlanRestrictionMiddleware.createJsonResponse(result);
  }

  return result;
}

/**
 * Utility function to check client limits in API routes
 */
export async function requireClientLimit(
  customerId: string,
  currentClientCount: number,
  options: PlanRestrictionOptions = {}
): Promise<PlanCheckResult> {
  const result = await PlanRestrictionMiddleware.checkClientLimit(customerId, currentClientCount);

  if (!result.allowed && options.jsonResponse !== false) {
    result.response = PlanRestrictionMiddleware.createJsonResponse(result);
  }

  return result;
}

export default PlanRestrictionMiddleware;
