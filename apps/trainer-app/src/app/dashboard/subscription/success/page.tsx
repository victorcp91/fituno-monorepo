'use client';

import { ArrowRight, CheckCircle, Home } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@fituno/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@fituno/ui';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    setSessionId(sessionIdParam);
  }, [searchParams]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewSubscription = () => {
    router.push('/dashboard/subscription');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Payment Successful!</CardTitle>
            <p className="text-gray-600 mt-2">
              Welcome to Fituno! Your subscription has been activated.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Session Information */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transaction ID:</span>
                </p>
                <p className="text-xs text-gray-500 font-mono break-all">{sessionId}</p>
              </div>
            )}

            {/* What's Next */}
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What's next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Your subscription is now active</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You can start adding clients immediately</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Access all features included in your plan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>A confirmation email has been sent</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleGoToDashboard} className="w-full" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>

              <Button
                onClick={handleViewSubscription}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                View Subscription Details
              </Button>
            </div>

            {/* Support Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Need help getting started?</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Check out our getting started guide or contact support for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
