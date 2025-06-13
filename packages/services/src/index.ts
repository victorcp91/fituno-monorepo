// Fituno Services Package
// Shared services for the Fituno monorepo

/* eslint-disable no-console */

import { API_CONFIG, AUTH_CONFIG, SUPABASE_CONFIG } from '@fituno/constants';
import type { AuthError, AuthResponse, Session, User, UserResponse } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Supabase Client
export const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

// ========================================
// API CLIENT
// ========================================

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { data: null, error: `HTTP ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { data: null, error: error.message };
      }
      return { data: null, error: 'Unknown error occurred' };
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Global API client instance
export const apiClient = new ApiClient();

// ========================================
// AUTHENTICATION SERVICE
// ========================================

export interface AuthUserMetadata {
  full_name?: string;
  avatar_url?: string;
  user_type?: 'trainer' | 'client';
  timezone?: string;
  language?: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  metadata?: AuthUserMetadata;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface PasswordResetCredentials {
  email: string;
  redirectTo?: string;
}

export interface UpdatePasswordCredentials {
  password: string;
  currentPassword?: string;
}

export interface UpdateProfileCredentials {
  email?: string;
  password?: string;
  data?: Partial<AuthUserMetadata>;
}

export class AuthService {
  private static rateLimitTracker = new Map<string, { attempts: number; lastAttempt: number }>();

  // ========================================
  // UTILITY METHODS FOR URL CONSTRUCTION
  // ========================================

  private static getBaseUrl(): string {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }

    // Server-side fallback - check common environment variables
    if (typeof process !== 'undefined' && process.env) {
      // Next.js and Vercel
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }

      // Custom base URL environment variable
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
      }

      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000';
      }
    }

    // Ultimate fallback - this should be replaced with your actual domain
    console.warn(
      'Could not determine base URL, using fallback. Consider setting NEXT_PUBLIC_BASE_URL environment variable.'
    );
    return 'https://your-domain.com';
  }

  // ========================================
  // RATE LIMITING
  // ========================================

  private static checkRateLimit(key: string, maxAttempts: number): boolean {
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(key);

    if (!tracker) {
      this.rateLimitTracker.set(key, { attempts: 1, lastAttempt: now });
      return true;
    }

    // Reset if cooldown period has passed
    if (now - tracker.lastAttempt > AUTH_CONFIG.RATE_LIMITS.cooldownPeriod) {
      this.rateLimitTracker.set(key, { attempts: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (tracker.attempts >= maxAttempts) {
      return false;
    }

    // Increment attempts
    tracker.attempts += 1;
    tracker.lastAttempt = now;
    return true;
  }

  // ========================================
  // EMAIL/PASSWORD AUTHENTICATION
  // ========================================

  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const rateLimitKey = `signup:${credentials.email}`;

    if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.signupAttempts)) {
      return {
        data: { user: null, session: null },
        error: {
          message: 'Too many signup attempts. Please try again later.',
          status: 429,
        } as AuthError,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata || {},
          emailRedirectTo: `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.emailVerification}`,
        },
      });

      if (error) {
        console.error('SignUp error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('SignUp unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred during signup',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const rateLimitKey = `signin:${credentials.email}`;

    if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.loginAttempts)) {
      return {
        data: { user: null, session: null },
        error: {
          message: 'Too many login attempts. Please try again later.',
          status: 429,
        } as AuthError,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('SignIn error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('SignIn unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred during signin',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('SignOut error:', error);
      }

      // Clear any local storage or cache here if needed

      return { error };
    } catch (error) {
      console.error('SignOut unexpected error:', error);
      return {
        error: {
          message: 'An unexpected error occurred during signout',
          status: 500,
        } as AuthError,
      };
    }
  }

  // ========================================
  // SOCIAL AUTHENTICATION (OAuth)
  // ========================================

  static async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.googleCallback}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: AUTH_CONFIG.OAUTH_PROVIDERS.GOOGLE.scopes,
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Google OAuth unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred during Google authentication',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async signInWithFacebook(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.facebookCallback}`,
          scopes: AUTH_CONFIG.OAUTH_PROVIDERS.FACEBOOK.scopes,
        },
      });

      if (error) {
        console.error('Facebook OAuth error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Facebook OAuth unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred during Facebook authentication',
          status: 500,
        } as AuthError,
      };
    }
  }

  // ========================================
  // PASSWORD RESET & EMAIL VERIFICATION
  // ========================================

  static async resetPassword(
    credentials: PasswordResetCredentials
  ): Promise<{ data: any; error: AuthError | null }> {
    const rateLimitKey = `reset:${credentials.email}`;

    if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.passwordResetAttempts)) {
      return {
        data: null,
        error: {
          message: 'Too many password reset attempts. Please try again later.',
          status: 429,
        } as AuthError,
      };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(credentials.email, {
        redirectTo:
          credentials.redirectTo ||
          `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.passwordReset}`,
      });

      if (error) {
        console.error('Password reset error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Password reset unexpected error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred during password reset',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async updatePassword(credentials: UpdatePasswordCredentials): Promise<UserResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: credentials.password,
      });

      if (error) {
        console.error('Update password error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Update password unexpected error:', error);
      return {
        data: { user: null },
        error: {
          message: 'An unexpected error occurred during password update',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async resendEmailVerification(): Promise<{ data: any; error: AuthError | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        return {
          data: null,
          error: {
            message: 'No authenticated user found',
            status: 401,
          } as AuthError,
        };
      }

      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.emailVerification}`,
        },
      });

      if (error) {
        console.error('Resend verification error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Resend verification unexpected error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred while resending verification email',
          status: 500,
        } as AuthError,
      };
    }
  }

  // ========================================
  // SESSION MANAGEMENT
  // ========================================

  static async getCurrentUser(): Promise<UserResponse> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Get current user error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Get current user unexpected error:', error);
      return {
        data: { user: null },
        error: {
          message: 'An unexpected error occurred while fetching user',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async getCurrentSession(): Promise<{
    data: { session: Session | null };
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Get current session error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Get current session unexpected error:', error);
      return {
        data: { session: null },
        error: {
          message: 'An unexpected error occurred while fetching session',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Refresh session error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Refresh session unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred while refreshing session',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async updateProfile(credentials: UpdateProfileCredentials): Promise<UserResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser(credentials);

      if (error) {
        console.error('Update profile error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Update profile unexpected error:', error);
      return {
        data: { user: null },
        error: {
          message: 'An unexpected error occurred while updating profile',
          status: 500,
        } as AuthError,
      };
    }
  }

  // ========================================
  // AUTH STATE MANAGEMENT
  // ========================================

  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      callback(event, session);
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  static isEmailVerified(user: User | null): boolean {
    return user?.email_confirmed_at !== null;
  }

  static isSessionExpired(session: Session | null): boolean {
    if (!session) return true;

    const expiresAt = session.expires_at;
    if (!expiresAt) return true;

    return Date.now() / 1000 > expiresAt;
  }

  static shouldRefreshSession(session: Session | null): boolean {
    if (!session) return false;

    const expiresAt = session.expires_at;
    if (!expiresAt) return false;

    const refreshThreshold = AUTH_CONFIG.REFRESH_THRESHOLD / 1000; // Convert to seconds
    return Date.now() / 1000 > expiresAt - refreshThreshold;
  }

  static async signInAnonymously(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('Anonymous signin error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Anonymous signin unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred during anonymous signin',
          status: 500,
        } as AuthError,
      };
    }
  }

  // Clear rate limiting data (useful for testing or admin actions)
  static clearRateLimitData(key?: string): void {
    if (key) {
      this.rateLimitTracker.delete(key);
    } else {
      this.rateLimitTracker.clear();
    }
  }
}

// ========================================
// STORAGE SERVICE
// ========================================

export class StorageService {
  static async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { cacheControl?: string; contentType?: string }
  ): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: false,
        ...options,
      });

      if (error) {
        console.error('File upload error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('File upload unexpected error:', error);
      return {
        data: null,
        error: { message: 'An unexpected error occurred during file upload' },
      };
    }
  }

  static async downloadFile(
    bucket: string,
    path: string
  ): Promise<{ data: Blob | null; error: any }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(path);

      if (error) {
        console.error('File download error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('File download unexpected error:', error);
      return {
        data: null,
        error: { message: 'An unexpected error occurred during file download' },
      };
    }
  }

  static getPublicUrl(bucket: string, path: string): { data: { publicUrl: string } } {
    return supabase.storage.from(bucket).getPublicUrl(path);
  }

  static async deleteFile(bucket: string, paths: string[]): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).remove(paths);

      if (error) {
        console.error('File delete error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('File delete unexpected error:', error);
      return {
        data: null,
        error: { message: 'An unexpected error occurred during file deletion' },
      };
    }
  }
}

// ========================================
// VALIDATION SERVICE
// ========================================

export class ValidationService {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = AUTH_CONFIG.PASSWORD_REQUIREMENTS;

    if (password.length < config.minLength) {
      errors.push(`Password must be at least ${config.minLength} characters long`);
    }

    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 100;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}

// ========================================
// ADDITIONAL SERVICES (placeholder implementations)
// ========================================

// Export existing services for backward compatibility
export class TrainerService {
  // Implementation will be added as needed
}

export class ClientService {
  // Implementation will be added as needed
}

export class ExerciseService {
  // Implementation will be added as needed
}

export class WorkoutService {
  // Implementation will be added as needed
}

export class ProgressService {
  // Implementation will be added as needed
}

export class ChatService {
  // Implementation will be added as needed
}

export class AnamnesisService {
  // Implementation will be added as needed
}

export class SubscriptionService {
  // Implementation will be added as needed
}
