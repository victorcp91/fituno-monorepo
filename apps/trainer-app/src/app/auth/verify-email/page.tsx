'use client';

import { AuthService } from '@fituno/services';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fituno/ui';
import { AlertCircle, Check, Loader2, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const ERROR_MESSAGES = {
  expired_token: 'This verification link has expired. Please request a new verification email.',
  invalid_token: 'This verification link is invalid. Please request a new verification email.',
  already_verified: 'Your email has already been verified. You can sign in now.',
  verification_failed: 'An error occurred during verification. Please try again.',
  default: 'An error occurred during verification. Please try again.',
};

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authListener: any;

    const handleVerification = async () => {
      try {
        // Check for immediate error parameters from Supabase redirect
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
          if (mounted) {
            if (errorParam === 'expired_token' || errorDescription?.includes('expired')) {
              setError(ERROR_MESSAGES.expired_token);
            } else if (errorParam === 'invalid_token' || errorDescription?.includes('invalid')) {
              setError(ERROR_MESSAGES.invalid_token);
            } else if (errorDescription?.includes('already')) {
              setError(ERROR_MESSAGES.already_verified);
            } else {
              setError(errorDescription || ERROR_MESSAGES.verification_failed);
            }
            setStatus('error');
          }
          return;
        }

        // Set up auth state listener to catch verification success
        authListener = AuthService.onAuthStateChange(async (event, session) => {
          console.log('Auth state change:', event, session?.user?.email_confirmed_at);

          if (!mounted) return;

          if (event === 'SIGNED_IN' && session?.user) {
            // Check if email is now verified
            if (session.user.email_confirmed_at) {
              localStorage.removeItem('pendingVerificationEmail');
              setStatus('success');

              // Redirect to dashboard after 3 seconds
              setTimeout(() => {
                if (mounted) {
                  router.push('/');
                }
              }, 3000);
            }
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Also check on token refresh
            if (session.user.email_confirmed_at) {
              localStorage.removeItem('pendingVerificationEmail');
              setStatus('success');

              setTimeout(() => {
                if (mounted) {
                  router.push('/');
                }
              }, 3000);
            }
          }
        });

        // Check current session status
        const { data: userData, error: _userError } = await AuthService.getCurrentUser();

        if (mounted) {
          if (userData.user?.email_confirmed_at) {
            // Already verified
            localStorage.removeItem('pendingVerificationEmail');
            setStatus('success');

            setTimeout(() => {
              if (mounted) {
                router.push('/');
              }
            }, 3000);
          } else {
            // Wait for potential auth state change or timeout
            setTimeout(() => {
              if (mounted && status === 'loading') {
                setError(ERROR_MESSAGES.verification_failed);
                setStatus('error');
              }
            }, 5000); // Give 5 seconds for verification to complete
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        if (mounted) {
          setError(ERROR_MESSAGES.default);
          setStatus('error');
        }
      }
    };

    handleVerification();

    // Cleanup function
    return () => {
      mounted = false;
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [searchParams, router, status]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError('');

    try {
      // Get email from localStorage or URL params
      const storedEmail = localStorage.getItem('pendingVerificationEmail');
      const emailParam = searchParams.get('email');
      const emailToUse = emailParam || storedEmail;

      const { data: _data, error } = await AuthService.resendEmailVerification(
        emailToUse || undefined
      );

      if (error) {
        setError(error.message || 'Failed to resend verification email.');
      } else {
        setResendSuccess(true);
      }
    } catch {
      setError('Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
                Fituno
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
                Fituno
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Welcome to Fituno!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <Check className="h-4 w-4" />
              <AlertDescription>
                You will be redirected to your dashboard shortly. You can now start using all Fituno
                features.
              </AlertDescription>
            </Alert>

            <Button className="w-full" onClick={() => router.push('/')}>
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
              Fituno
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
          <CardDescription>There was a problem verifying your email address</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          {/* Resend Success Alert */}
          {resendSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                A new verification email has been sent. Please check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Resend Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>

            {/* Navigation Links */}
            <div className="text-center space-y-2">
              <div>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Need help?{' '}
                  <Link href="/auth/register" className="font-medium text-primary hover:underline">
                    Create a new account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
