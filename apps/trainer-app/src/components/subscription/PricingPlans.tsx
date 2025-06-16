'use client';

import { Building2, Check, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { STRIPE_CONFIG } from '../../lib/config/stripe';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PricingPlansProps {
  customerId?: string;
  currentPlan?: string;
  onSelectPlan?: (plan: string) => void;
  showCurrentPlan?: boolean;
}

export function PricingPlans({
  customerId,
  currentPlan,
  onSelectPlan,
  showCurrentPlan = true,
}: PricingPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { createCheckoutSession } = useSubscription(customerId);

  const handleSelectPlan = async (planKey: string) => {
    if (onSelectPlan) {
      onSelectPlan(planKey);
      return;
    }

    try {
      setLoading(planKey);
      const { url } = await createCheckoutSession(planKey);
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case 'BASIC':
        return <Star className="h-6 w-6" />;
      case 'PRO':
        return <Zap className="h-6 w-6" />;
      case 'ENTERPRISE':
        return <Building2 className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planKey: string) => {
    switch (planKey) {
      case 'BASIC':
        return 'text-blue-600';
      case 'PRO':
        return 'text-purple-600';
      case 'ENTERPRISE':
        return 'text-gold-600';
      default:
        return 'text-blue-600';
    }
  };

  const getPlanGradient = (planKey: string) => {
    switch (planKey) {
      case 'BASIC':
        return 'from-blue-50 to-blue-100';
      case 'PRO':
        return 'from-purple-50 to-purple-100';
      case 'ENTERPRISE':
        return 'from-yellow-50 to-yellow-100';
      default:
        return 'from-blue-50 to-blue-100';
    }
  };

  const isCurrentPlan = (planKey: string) => {
    return currentPlan === planKey;
  };

  const getButtonText = (planKey: string) => {
    if (isCurrentPlan(planKey)) {
      return 'Current Plan';
    }
    if (currentPlan && planKey === 'BASIC') {
      return 'Downgrade';
    }
    if (currentPlan) {
      return 'Upgrade';
    }
    return 'Get Started';
  };

  const getButtonVariant = (planKey: string) => {
    if (isCurrentPlan(planKey)) {
      return 'outline';
    }
    if (planKey === 'PRO') {
      return 'default';
    }
    return 'outline';
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your personal training business. Upgrade or downgrade at any
          time.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {Object.entries(STRIPE_CONFIG.PLANS).map(([planKey, plan]) => (
          <Card
            key={planKey}
            className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
              planKey === 'PRO' ? 'ring-2 ring-purple-500 scale-105' : ''
            } ${isCurrentPlan(planKey) ? 'ring-2 ring-green-500' : ''}`}
          >
            {/* Popular Badge */}
            {planKey === 'PRO' && (
              <div className="absolute top-0 left-0 right-0">
                <div className="bg-purple-500 text-white text-center py-2 px-4">
                  <span className="text-sm font-medium">Most Popular</span>
                </div>
              </div>
            )}

            {/* Current Plan Badge */}
            {showCurrentPlan && isCurrentPlan(planKey) && (
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-green-500">
                  Current
                </Badge>
              </div>
            )}

            <CardHeader
              className={`bg-gradient-to-br ${getPlanGradient(planKey)} ${planKey === 'PRO' ? 'pt-12' : 'pt-6'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={getPlanColor(planKey)}>{getPlanIcon(planKey)}</div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.interval}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Additional Features for Higher Tiers */}
              {planKey === 'PRO' && (
                <div className="mb-6 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">Everything in Basic, plus:</p>
                  <ul className="text-sm text-purple-700 mt-1 space-y-1">
                    <li>• Unlimited clients</li>
                    <li>• Custom branding</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              )}

              {planKey === 'ENTERPRISE' && (
                <div className="mb-6 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">Everything in Pro, plus:</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Team management</li>
                    <li>• Advanced analytics</li>
                    <li>• API access</li>
                    <li>• Dedicated support</li>
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(planKey)}
                disabled={loading === planKey || isCurrentPlan(planKey)}
                variant={getButtonVariant(planKey)}
                className="w-full"
                size="lg"
              >
                {loading === planKey ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  getButtonText(planKey)
                )}
              </Button>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  {planKey === 'BASIC' && 'Perfect for getting started'}
                  {planKey === 'PRO' && 'Most popular choice for growing businesses'}
                  {planKey === 'ENTERPRISE' && 'For established training businesses'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-medium mb-2">Can I change plans anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                immediately, and billing is prorated.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">What happens to my data?</h4>
              <p className="text-sm text-gray-600">
                Your data is always safe. When downgrading, you'll retain access to existing data
                but be limited by your new plan's features.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Is there a free trial?</h4>
              <p className="text-sm text-gray-600">
                We offer a 14-day free trial for all new accounts. No credit card required to get
                started.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Need help choosing?</h4>
              <p className="text-sm text-gray-600">
                Contact our support team for personalized recommendations based on your specific
                business needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
