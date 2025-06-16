'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>We encountered an unexpected error. Please try again.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="text-sm font-mono text-red-600 dark:text-red-400">{error.message}</p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                    Stack trace
                  </summary>
                  <pre className="text-xs mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChunkErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 rounded-lg p-4 m-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h3 className="font-semibold text-red-900 dark:text-red-100">Component Error</h3>
      </div>
      <p className="text-sm text-red-700 dark:text-red-200 mb-3">
        This component failed to load. You can try refreshing it or continue using other parts of
        the app.
      </p>
      <Button size="sm" onClick={resetErrorBoundary} variant="outline">
        <RefreshCw className="mr-2 h-3 w-3" />
        Retry
      </Button>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (_error: Error, _errorInfo: React.ErrorInfo) => void;
  level?: 'page' | 'component';
}

export function ErrorBoundary({ children, fallback, onError, level = 'page' }: ErrorBoundaryProps) {
  const FallbackComponent = fallback || (level === 'page' ? ErrorFallback : ChunkErrorFallback);

  const handleError = (_error: Error, _errorInfo: React.ErrorInfo) => {
    console.error('Error caught by boundary:', _error, _errorInfo);

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service (e.g., Sentry)
      // logErrorToService(_error, _errorInfo);
    }

    // Call custom error handler if provided
    onError?.(_error, _errorInfo);
  };

  const handleReset = () => {
    // Clear any error state in stores if needed
    window.location.reload();
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent as any}
      onError={handleError}
      onReset={handleReset}
    >
      {children as any}
    </ReactErrorBoundary>
  );
}

// Specialized error boundaries for different parts of the app

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      onError={_error => {
        console.error('Query error:', _error);
        // Could invalidate related queries here
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      level="page"
      onError={_error => {
        console.error('Auth error:', _error);
        // Could trigger auth state reset here
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary level="component">{children}</ErrorBoundary>;
}

// Hook for manually triggering error boundaries (useful for async errors)
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
