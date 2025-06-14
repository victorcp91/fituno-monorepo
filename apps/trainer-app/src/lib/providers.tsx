'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { AuthErrorBoundary, ErrorBoundary } from '../components/error-boundary';
import { AuthProvider } from '../contexts/auth-context';
import { queryClient } from './query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary level="page">
      <QueryClientProvider client={queryClient}>
        <AuthErrorBoundary>
          <AuthProvider>
            {children}
            {/* Show React Query devtools in development */}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
          </AuthProvider>
        </AuthErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
