'use client';

import { AuthService } from '@fituno/services';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { invalidateQueries, queryClient } from '../lib/query-client';
import { useAuthStore } from '../stores/auth-store';

interface AuthContextType {
  // State from Zustand store
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: (_email: string, _password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (_data: any) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
  clearError: () => void;

  // Helper states
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Get state and actions from Zustand store
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setError,
    signIn: storeSignIn,
    signOut: storeSignOut,
    updateProfile: storeUpdateProfile,
    checkAuth: storeCheckAuth,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await storeCheckAuth();
      } catch {

      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [storeCheckAuth]);

  // Listen to auth state changes from Supabase
  useEffect(() => {
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {


      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user as any);
            // Invalidate auth queries when user signs in
            invalidateQueries.auth();
          }
          break;

        case 'SIGNED_OUT':
          setUser(null);
          // Clear all cached data when user signs out
          queryClient.clear();
          break;

        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user as any);
          }
          break;

        case 'USER_UPDATED':
          if (session?.user) {
            setUser(session.user as any);
            // Invalidate auth queries when user is updated
            invalidateQueries.auth();
          }
          break;

        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  // Enhanced sign in with query invalidation
  const signIn = async (_email: string, _password: string) => {
    const result = await storeSignIn(_email, _password);

    if (result.success) {
      // Invalidate and refetch auth-related queries
      invalidateQueries.auth();
    }

    return result;
  };

  // Enhanced sign out with query cleanup
  const signOut = async () => {
    await storeSignOut();

    // Clear all cached data
    queryClient.clear();
  };

  // Enhanced profile update with query invalidation
  const updateProfile = async (_data: any) => {
    const result = await storeUpdateProfile(_data);

    if (result.success) {
      // Invalidate auth and related queries
      invalidateQueries.auth();
    }

    return result;
  };

  // Enhanced auth check
  const checkAuth = async () => {
    await storeCheckAuth();

    if (isAuthenticated) {
      // Invalidate auth queries to ensure fresh data
      invalidateQueries.auth();
    }
  };

  // Clear error helper
  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
    updateProfile,
    checkAuth,
    clearError,
    isInitialized,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requiredRole?: 'trainer' | 'client' | 'admin';
    loadingComponent?: React.ComponentType;
    unauthorizedComponent?: React.ComponentType;
  } = {}
) {
  const {
    redirectTo = '/auth/login',
    requiredRole,
    loadingComponent: LoadingComponent,
    unauthorizedComponent: UnauthorizedComponent,
  } = options;

  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated, isLoading, isInitialized } = useAuth();

    // Show loading while initializing or checking auth
    if (!isInitialized || isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="fitness-gradient h-12 w-12 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = `${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      }
      return null;
    }

    // Check role requirements
    if (requiredRole && user?.user_metadata?.user_type !== requiredRole) {
      if (UnauthorizedComponent) {
        return <UnauthorizedComponent />;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook for checking specific permissions
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role: 'trainer' | 'client' | 'admin') => {
    return isAuthenticated && user?.user_metadata?.user_type === role;
  };

  const isTrainer = () => hasRole('trainer');
  const isClient = () => hasRole('client');
  const isAdmin = () => hasRole('admin');

  const hasCompletedOnboarding = () => {
    return isAuthenticated && user?.user_metadata?.onboarding_completed === true;
  };

  const isEmailVerified = () => {
    return user?.email_confirmed_at != null;
  };

  return {
    hasRole,
    isTrainer,
    isClient,
    isAdmin,
    hasCompletedOnboarding,
    isEmailVerified,
  };
}
