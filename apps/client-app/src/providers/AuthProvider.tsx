import { Session, User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BiometricAuthService } from '../services/BiometricAuthService';
import { SupabaseService } from '../services/SupabaseService';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBiometricAvailable: boolean;
  isBiometricEnabled: boolean;
}

export interface AuthContextType extends AuthState {
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;

  // Social authentication
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithFacebook: () => Promise<{ success: boolean; error?: string }>;

  // Biometric authentication
  enableBiometric: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  disableBiometric: () => Promise<void>;
  signInWithBiometric: () => Promise<{ success: boolean; error?: string }>;

  // Utility methods
  refreshSession: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isBiometricAvailable: false,
    isBiometricEnabled: false,
  });

  const supabaseService = SupabaseService.getInstance();
  const biometricService = BiometricAuthService.getInstance();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (session?.user) {
        await updateAuthState(session.user, session);
      } else {
        await updateAuthState(null, null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Check current session
      const session = await supabaseService.getCurrentSession();
      const user = session?.user || null;

      // Check biometric availability
      const biometricInfo = await biometricService.getBiometricInfo();

      setAuthState({
        user,
        session,
        isLoading: false,
        isAuthenticated: !!user,
        isBiometricAvailable: biometricInfo.isAvailable,
        isBiometricEnabled: biometricInfo.isEnabled,
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: null,
        session: null,
        isAuthenticated: false,
      }));
    }
  };

  const updateAuthState = async (user: User | null, session: Session | null) => {
    try {
      const biometricInfo = await biometricService.getBiometricInfo();

      setAuthState(prev => ({
        ...prev,
        user,
        session,
        isAuthenticated: !!user,
        isBiometricAvailable: biometricInfo.isAvailable,
        isBiometricEnabled: biometricInfo.isEnabled,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating auth state:', error);
      setAuthState(prev => ({
        ...prev,
        user,
        session,
        isAuthenticated: !!user,
        isLoading: false,
      }));
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabaseService.signIn(email, password);

      if (error) {
        return { success: false, error: (error as any)?.message || 'Sign in failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabaseService.signUp(email, password, metadata);

      if (error) {
        return { success: false, error: (error as any)?.message || 'Sign up failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabaseService.signOut();
      // Auth state will be updated by the listener
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabaseService.resetPassword(email);

      if (error) {
        return { success: false, error: (error as any)?.message || 'Password reset failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const updatePassword = async (
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabaseService.updatePassword(newPassword);

      if (error) {
        return { success: false, error: (error as any)?.message || 'Password update failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabaseService.signInWithGoogle();

      if (error) {
        return { success: false, error: (error as any)?.message || 'Google sign in failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const signInWithFacebook = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabaseService.signInWithFacebook();

      if (error) {
        return { success: false, error: error.message || 'Facebook sign in failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Facebook sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const enableBiometric = async (credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await biometricService.enableBiometric(credentials);

      if (result.success) {
        // Update biometric state
        setAuthState(prev => ({ ...prev, isBiometricEnabled: true }));
      }

      return result;
    } catch (error) {
      console.error('Enable biometric error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const disableBiometric = async (): Promise<void> => {
    try {
      await biometricService.disableBiometric();
      setAuthState(prev => ({ ...prev, isBiometricEnabled: false }));
    } catch (error) {
      console.error('Disable biometric error:', error);
      throw error;
    }
  };

  const signInWithBiometric = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await biometricService.authenticateWithBiometric();

      if (result.success) {
        // Get stored credentials and sign in
        const credentials = await biometricService.getStoredCredentials();
        if (credentials) {
          return await signIn(credentials.email, credentials.password);
        } else {
          return { success: false, error: 'Stored credentials not found' };
        }
      }

      return result;
    } catch (error) {
      console.error('Biometric sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      await supabaseService.refreshSession();
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  };

  const checkAuthState = async (): Promise<void> => {
    await initializeAuth();
  };

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    signInWithFacebook,
    enableBiometric,
    disableBiometric,
    signInWithBiometric,
    refreshSession,
    checkAuthState,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
