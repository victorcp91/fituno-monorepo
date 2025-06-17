'use client';

import { ArrowLeft, MessageCircle, RefreshCw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@fituno/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@fituno/ui';

export default function SubscriptionCanceledPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/dashboard/subscription');
  };

  const handleTryAgain = () => {
    router.push('/dashboard/subscription/plans');
  };

  const handleContactSupport = () => {
    // This could open a chat widget or redirect to support
    window.open('mailto:support@fituno.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Checkout Canceled</CardTitle>
            <p className="text-gray-600 mt-2">
              Your subscription was not activated. No charges were made.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Information */}
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happened?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You canceled the checkout process</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No payment was processed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your account remains unchanged</span>
                </li>
              </ul>
            </div>

            {/* Reasons and Solutions */}
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-blue-900 mb-2">Having trouble with checkout?</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Payment method issues</li>
                <li>• Need to review plan details</li>
                <li>• Questions about features</li>
                <li>• Technical difficulties</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleTryAgain} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <Button onClick={handleGoBack} variant="outline" className="w-full" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Subscription
              </Button>

              <Button onClick={handleContactSupport} variant="outline" className="w-full" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Alternative Options */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Need more time to decide?</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                You can start your subscription at any time. All your data will be preserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
