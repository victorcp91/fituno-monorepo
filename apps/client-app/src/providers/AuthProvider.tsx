import { Session, User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BiometricAuthService } from '../services/BiometricAuthService';
import { SupabaseService } from '../services/SupabaseService';

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthError {
  message: string;
}

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
  signIn: (_email: string, _password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    _email: string,
    _password: string,
    _metadata?: Record<string, any>
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (_email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (_newPassword: string) => Promise<{ success: boolean; error?: string }>;

  // Social authentication
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithFacebook: () => Promise<{ success: boolean; error?: string }>;

  // Biometric authentication
  enableBiometric: (_credentials: {
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
    } catch {

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
    } catch {

      setAuthState(prev => ({
        ...prev,
        user,
        session,
        isAuthenticated: !!user,
        isLoading: false,
      }));
    }
  };

  const signIn = async (_email: string, _password: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabaseService.signIn(_email, _password);
      if (error) {
        return { success: false, error: (error as AuthError).message || 'Sign in failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signUp = async (
    _email: string,
    _password: string,
    _metadata?: { [key: string]: any }
  ): Promise<AuthResponse> => {
    try {
      const { error } = await supabaseService.signUp(_email, _password, _metadata);
      if (error) {
        return { success: false, error: (error as AuthError).message || 'Sign up failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabaseService.signOut();
      // Auth state will be updated by the listener
    } catch {

      throw error;
    }
  };

  const resetPassword = async (_email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabaseService.resetPassword(_email);
      if (error) {
        return { success: false, error: (error as AuthError).message || 'Password reset failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Password reset failed' };
    }
  };

  const updatePassword = async (_newPassword: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabaseService.updatePassword(_newPassword);
      if (error) {
        return { success: false, error: (error as AuthError).message || 'Password update failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Password update failed' };
    }
  };

  const signInWithGoogle = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabaseService.signInWithGoogle();
      if (error) {
        return { success: false, error: (error as AuthError).message || 'Google sign in failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Google sign in failed' };
    }
  };

  const signInWithFacebook = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabaseService.signInWithFacebook();
      if (error) {
        return { success: false, error: (error as AuthError).message || 'Facebook sign in failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Facebook sign in failed' };
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
    } catch {

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
    } catch {

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
    } catch {

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      await supabaseService.refreshSession();
    } catch {

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
