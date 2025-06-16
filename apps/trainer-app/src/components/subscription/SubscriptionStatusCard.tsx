'use client';

import { AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SubscriptionStatusCardProps {
  customerId?: string;
  currentClientCount?: number;
  onUpgrade?: (plan: string) => void;
  onManageBilling?: () => void;
}

export function SubscriptionStatusCard({
  customerId,
  currentClientCount = 0,
  onUpgrade,
  onManageBilling,
}: SubscriptionStatusCardProps) {
  const { status, loading, error, createCheckoutSession, openBillingPortal } =
    useSubscription(customerId);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-red-600">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
            <p>Failed to load subscription status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">No subscription information available</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadgeVariant = () => {
    if (!status.isActive) return 'destructive';
    if (!status.isWithinLimits) return 'destructive';
    if (status.daysUntilExpiry && status.daysUntilExpiry <= 7) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!status.isActive) return <AlertTriangle className="h-4 w-4" />;
    if (!status.isWithinLimits) return <AlertTriangle className="h-4 w-4" />;
    if (status.daysUntilExpiry && status.daysUntilExpiry <= 7) return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const handleUpgrade = async (plan: string) => {
    try {
      if (onUpgrade) {
        onUpgrade(plan);
      } else {
        const { url } = await createCheckoutSession(plan);
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error starting upgrade:', error);
    }
  };

  const handleManageBilling = async () => {
    try {
      if (onManageBilling) {
        onManageBilling();
      } else {
        const { url } = await openBillingPortal();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  const getPlanName = () => {
    if (!status.plan) return 'No Plan';
    const planNames = {
      BASIC: 'Basic Plan',
      PRO: 'Pro Plan',
      ENTERPRISE: 'Enterprise Plan',
    };
    return planNames[status.plan] || 'Unknown Plan';
  };

  const getClientUsageText = () => {
    if (status.clientLimit === Infinity) {
      return `${currentClientCount} clients`;
    }
    return `${currentClientCount}/${status.clientLimit} clients`;
  };

  const shouldShowUpgrade = () => {
    return (
      !status.isActive ||
      !status.isWithinLimits ||
      (status.plan === 'BASIC' && currentClientCount >= status.clientLimit)
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
        <Badge variant={getStatusBadgeVariant()} className="flex items-center gap-1">
          {getStatusIcon()}
          {status.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Plan Information */}
          <div>
            <p className="text-2xl font-bold">{getPlanName()}</p>
            <p className="text-xs text-muted-foreground">Current subscription plan</p>
          </div>

          {/* Client Usage */}
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{getClientUsageText()}</span>
            {!status.isWithinLimits && (
              <Badge variant="destructive" className="text-xs">
                Limit Exceeded
              </Badge>
            )}
          </div>

          {/* Expiry Information */}
          {status.daysUntilExpiry && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {status.daysUntilExpiry > 0
                  ? `Expires in ${status.daysUntilExpiry} days`
                  : 'Expired'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            {shouldShowUpgrade() && (
              <div className="space-y-2">
                {!status.isActive && (
                  <Button
                    onClick={() => handleUpgrade('BASIC')}
                    className="w-full"
                    variant="default"
                  >
                    Subscribe to Basic Plan
                  </Button>
                )}

                {status.isActive && status.plan === 'BASIC' && !status.isWithinLimits && (
                  <Button onClick={() => handleUpgrade('PRO')} className="w-full" variant="default">
                    Upgrade to Pro Plan
                  </Button>
                )}

                {status.isActive && status.plan === 'BASIC' && status.isWithinLimits && (
                  <Button onClick={() => handleUpgrade('PRO')} className="w-full" variant="outline">
                    Upgrade for Unlimited Clients
                  </Button>
                )}
              </div>
            )}

            {status.isActive && (
              <Button onClick={handleManageBilling} variant="outline" className="w-full">
                Manage Billing
              </Button>
            )}
          </div>

          {/* Warning Messages */}
          {!status.isWithinLimits && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">Client limit exceeded</p>
                  <p className="text-xs text-red-600">
                    You have {currentClientCount} clients but your plan allows {status.clientLimit}.
                    {status.plan === 'BASIC' && ' Upgrade to Pro for unlimited clients.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {status.daysUntilExpiry && status.daysUntilExpiry <= 7 && status.daysUntilExpiry > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Subscription expiring soon</p>
                  <p className="text-xs text-yellow-600">
                    Your subscription will expire in {status.daysUntilExpiry} days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
