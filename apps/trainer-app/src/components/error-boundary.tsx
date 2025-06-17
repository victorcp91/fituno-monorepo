'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle, Button } from '@fituno/ui';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  level?: 'page' | 'component';
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPageLevel = this.props.level === 'page';

      return (
        <div
          className={`flex items-center justify-center ${isPageLevel ? 'min-h-screen' : 'min-h-[200px]'} p-4`}
        >
          <div className="w-full max-w-md">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{isPageLevel ? 'Something went wrong' : 'Component Error'}</AlertTitle>
              <AlertDescription className="mt-2">
                {isPageLevel
                  ? 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'
                  : 'This component failed to load. You can try refreshing or continue using other parts of the app.'}
              </AlertDescription>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
                {isPageLevel && (
                  <Button onClick={() => window.location.reload()} size="sm">
                    Refresh Page
                  </Button>
                )}
              </div>
            </Alert>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 overflow-auto">{this.state.error.stack}</pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 overflow-auto">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AuthErrorBoundaryProps {
  children: ReactNode;
}

export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    // Check if this is an authentication-related error
    const isAuthError =
      error.message.includes('auth') ||
      error.message.includes('unauthorized') ||
      error.message.includes('token') ||
      error.message.includes('session');

    return {
      hasError: isAuthError,
      error: isAuthError ? error : undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only handle auth-related errors
    const isAuthError =
      error.message.includes('auth') ||
      error.message.includes('unauthorized') ||
      error.message.includes('token') ||
      error.message.includes('session');

    if (isAuthError) {
      console.error('AuthErrorBoundary caught an auth error:', error, errorInfo);

      // Clear potentially corrupted auth state
      try {
        localStorage.removeItem('auth-token');
        sessionStorage.clear();
      } catch (e) {
        console.error('Error clearing auth state:', e);
      }
    } else {
      // Re-throw non-auth errors for parent error boundaries
      throw error;
    }
  }

  handleSignOut = () => {
    // Clear auth state and redirect to login
    try {
      localStorage.removeItem('auth-token');
      sessionStorage.clear();
      window.location.href = '/auth/login';
    } catch (e) {
      console.error('Error during sign out:', e);
      window.location.reload();
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription className="mt-2">
                We encountered an issue with your authentication. This might be due to an expired
                session or corrupted auth data.
              </AlertDescription>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
                <Button onClick={this.handleSignOut} size="sm">
                  Sign Out & Restart
                </Button>
              </div>
            </Alert>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 overflow-auto">{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
