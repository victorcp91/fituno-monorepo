'use client';

import { ArrowRight, CreditCard, Receipt, Settings, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { BillingHistory } from '../../../components/subscription/BillingHistory';
import { SubscriptionStatusCard } from '../../../components/subscription/SubscriptionStatusCard';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useSubscription } from '../../../hooks/useSubscription';

export default function SubscriptionPage() {
  const { status, loading, openBillingPortal } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleOpenBillingPortal = async () => {
    try {
      setPortalLoading(true);
      const { url } = await openBillingPortal();
      window.location.href = url;
    } catch {

    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-lg text-gray-600">
            Manage your Fituno subscription and billing information.
          </p>
        </div>

        {status?.isActive && (
          <Button onClick={handleOpenBillingPortal} disabled={portalLoading} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {portalLoading ? 'Loading...' : 'Manage Billing'}
          </Button>
        )}
      </div>

      {/* No Subscription State */}
      {!status?.isActive && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h2>

            <p className="text-gray-600 mb-8">
              Start your Fituno journey today! Choose a plan that fits your personal training
              business needs.
            </p>

            <div className="space-y-4">
              <Link href="/dashboard/subscription/plans">
                <Button size="lg" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  View Plans & Pricing
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>30-day guarantee</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Unlimited clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscription */}
      {status?.isActive && (
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Subscription */}
            <SubscriptionStatusCard />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/dashboard/subscription/plans">
                    <Button variant="outline" className="w-full h-auto p-4">
                      <div className="text-center">
                        <ArrowRight className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Change Plan</div>
                        <div className="text-xs text-gray-600">Upgrade or downgrade</div>
                      </div>
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full h-auto p-4"
                    onClick={handleOpenBillingPortal}
                    disabled={portalLoading}
                  >
                    <div className="text-center">
                      <CreditCard className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium">Payment Methods</div>
                      <div className="text-xs text-gray-600">Update payment info</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-auto p-4"
                    onClick={handleOpenBillingPortal}
                    disabled={portalLoading}
                  >
                    <div className="text-center">
                      <Receipt className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium">Download Invoices</div>
                      <div className="text-xs text-gray-600">View billing history</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <BillingHistory customerId={status.customerId || undefined} />
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage & Limits</CardTitle>
                <p className="text-sm text-gray-600">
                  Monitor your current usage against your plan limits.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Active Clients</span>
                      <span className="text-sm text-gray-600">
                        {status.currentClientCount} /{' '}
                        {status.clientLimit === -1 ? '∞' : status.clientLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status.isWithinLimits ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width:
                            status.clientLimit === -1
                              ? '0%'
                              : `${Math.min((status.currentClientCount / status.clientLimit) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {!status.isWithinLimits && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">
                          Client Limit Reached
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        You've reached your plan's client limit. Consider upgrading to add more
                        clients.
                      </p>
                      <Link href="/dashboard/subscription/plans" className="mt-2 inline-block">
                        <Button size="sm" variant="outline">
                          Upgrade Plan
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Plan Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Client management system</li>
                      <li>• Workout planning tools</li>
                      <li>• Progress tracking</li>
                      <li>• Mobile app access</li>
                      {status.plan === 'PRO' && (
                        <>
                          <li>• Custom branding</li>
                          <li>• Priority support</li>
                        </>
                      )}
                      {status.plan === 'ENTERPRISE' && (
                        <>
                          <li>• Team management</li>
                          <li>• Advanced analytics</li>
                          <li>• API access</li>
                          <li>• Dedicated support</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
