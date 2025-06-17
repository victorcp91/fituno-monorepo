'use client';

import { PricingPlans } from '../../../../components/subscription/PricingPlans';
import { SubscriptionStatusCard } from '../../../../components/subscription/SubscriptionStatusCard';
import { useSubscription } from '../../../../hooks/useSubscription';

export default function SubscriptionPlansPage() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
        <p className="text-lg text-gray-600">
          Choose the plan that best fits your personal training business needs.
        </p>
      </div>

      {/* Current Subscription Status (if exists) */}
      {subscription?.isActive && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
          <SubscriptionStatusCard />
        </div>
      )}

      {/* Pricing Plans */}
      <PricingPlans currentPlanId={subscription?.plan || undefined} />

      {/* Additional Information */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose Fituno?</h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">
                Built for speed and efficiency. Spend less time on admin and more time training
                clients.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Reliable & Secure</h4>
              <p className="text-sm text-gray-600">
                Your data is protected with enterprise-grade security. 99.9% uptime guaranteed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                Get help when you need it. Our support team is available around the clock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-green-50 text-green-800 px-4 py-2 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">30-Day Money Back Guarantee</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Not satisfied? Get a full refund within 30 days, no questions asked.
        </p>
      </div>
    </div>
  );
}
