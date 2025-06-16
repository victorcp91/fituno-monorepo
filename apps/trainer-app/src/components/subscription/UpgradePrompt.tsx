'use client';

import { ArrowUpIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { STRIPE_CONFIG, type StripePlan } from '../../lib/config/stripe';
import { FeatureAccessService } from '../../lib/services/feature-access';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface UpgradePromptProps {
  currentPlan?: StripePlan | null;
  suggestedPlan: StripePlan;
  reason: string;
  feature?: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  variant?: 'card' | 'banner' | 'modal';
  showFeatures?: boolean;
  className?: string;
}

export default function UpgradePrompt({
  currentPlan,
  suggestedPlan,
  reason,
  feature: _feature,
  onUpgrade,
  onDismiss,
  variant = 'card',
  showFeatures = true,
  className = '',
}: UpgradePromptProps) {
  const suggestedPlanConfig = STRIPE_CONFIG.PLANS[suggestedPlan];
  const currentPlanConfig = currentPlan ? STRIPE_CONFIG.PLANS[currentPlan] : null;

  const missingFeatures = currentPlan
    ? FeatureAccessService.getMissingFeatures(currentPlan, suggestedPlan)
    : FeatureAccessService.getPlanFeatures(suggestedPlan);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default behavior - redirect to pricing page
      window.location.href = '/dashboard/subscription/plans';
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  if (variant === 'banner') {
    return (
      <div
        className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ArrowUpIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{reason}</p>
              <p className="text-sm text-blue-700">
                Upgrade to <strong>{suggestedPlanConfig.name}</strong> for{' '}
                {formatPrice(suggestedPlanConfig.price)}/month
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleUpgrade} size="sm" className="bg-blue-600 hover:bg-blue-700">
              Upgrade Now
            </Button>
            {onDismiss && (
              <Button onClick={onDismiss} variant="ghost" size="sm">
                <XMarkIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className={`w-full max-w-md ${className}`}>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <ArrowUpIcon className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Upgrade Required</CardTitle>
            <CardDescription>{reason}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{suggestedPlanConfig.name}</div>
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(suggestedPlanConfig.price)}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              {currentPlanConfig && (
                <div className="text-sm text-gray-500 mt-1">
                  Currently on {currentPlanConfig.name} - {formatPrice(currentPlanConfig.price)}
                  /month
                </div>
              )}
            </div>

            {showFeatures && missingFeatures.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">What you'll get:</h4>
                <ul className="space-y-1">
                  {missingFeatures.slice(0, 3).map(feature => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                      {FeatureAccessService.getFeatureDescription(feature)}
                    </li>
                  ))}
                  {missingFeatures.length > 3 && (
                    <li className="text-sm text-gray-500 ml-6">
                      +{missingFeatures.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex space-x-3">
              <Button onClick={handleUpgrade} className="flex-1">
                Upgrade to {suggestedPlanConfig.name}
              </Button>
              {onDismiss && (
                <Button onClick={onDismiss} variant="outline">
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <ArrowUpIcon className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">Upgrade Required</CardTitle>
          </div>
          {onDismiss && (
            <Button onClick={onDismiss} variant="ghost" size="sm" className="h-6 w-6 p-0">
              <XMarkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className="text-blue-700">{reason}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-900">{suggestedPlanConfig.name}</div>
            <div className="text-sm text-blue-700">
              {formatPrice(suggestedPlanConfig.price)}/month
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Recommended
          </Badge>
        </div>

        {showFeatures && missingFeatures.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {missingFeatures.slice(0, 3).map(feature => (
                <li key={feature} className="flex items-center text-sm text-blue-700">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                  {FeatureAccessService.getFeatureDescription(feature)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleUpgrade} className="w-full bg-blue-600 hover:bg-blue-700">
          Upgrade to {suggestedPlanConfig.name}
        </Button>
      </CardContent>
    </Card>
  );
}
