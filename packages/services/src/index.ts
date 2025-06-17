// Fituno Services Package
// Shared services for the Fituno monorepo

/* eslint-disable no-console */

import { API_CONFIG, AUTH_CONFIG, SUPABASE_CONFIG } from '@fituno/constants';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Environment validation
const isSupabaseConfigured = () => {
  return (
    SUPABASE_CONFIG.URL &&
    SUPABASE_CONFIG.URL !== '' &&
    !SUPABASE_CONFIG.URL.includes('placeholder') &&
    SUPABASE_CONFIG.ANON_KEY &&
    SUPABASE_CONFIG.ANON_KEY !== '' &&
    !SUPABASE_CONFIG.ANON_KEY.includes('placeholder')
  );
};

// Supabase Client with proper validation
export const supabase = createClient(
  SUPABASE_CONFIG.URL || 'https://placeholder.supabase.co',
  SUPABASE_CONFIG.ANON_KEY || 'placeholder-key'
);

// Helper function to create a consistent error for missing configuration
const createConfigurationError = (): AuthError =>
  ({
    message:
      'Supabase is not properly configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
    status: 400,
    name: 'ConfigurationError',
  }) as AuthError;

// ========================================
// CUSTOM TYPE DEFINITIONS
// ========================================

export interface FitunoAuthResponse {
  data: { user: User | null; session: Session | null } | { user: null; session: null };
  error: AuthError | null;
}

export interface FitunoUserResponse {
  data: { user: User | null };
  error: AuthError | null;
}

export interface FitunoOAuthResponse {
  data: { provider?: string; url?: string } | { user: User | null; session: Session | null };
  error: AuthError | null;
}

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
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
      clearTimeout(timeoutId);
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

    // Ultimate fallback - throw error to ensure proper configuration
    console.error(
      'Could not determine base URL. Please set NEXT_PUBLIC_BASE_URL environment variable or ensure the application is running in a proper environment.'
    );
    throw new Error(
      'Base URL could not be determined. Please configure NEXT_PUBLIC_BASE_URL environment variable for production deployment.'
    );
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
  // AUTHENTICATION METHODS
  // ========================================

  static async signUp(credentials: SignUpCredentials): Promise<FitunoAuthResponse> {
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

      return { data: data as FitunoAuthResponse['data'], error };
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

  static async signIn(credentials: SignInCredentials): Promise<FitunoAuthResponse> {
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

      return { data: data as FitunoAuthResponse['data'], error };
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

  static async signInWithGoogle(): Promise<FitunoOAuthResponse> {
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

      return { data: data as FitunoOAuthResponse['data'], error };
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

  static async signInWithFacebook(): Promise<FitunoOAuthResponse> {
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

      return { data: data as FitunoOAuthResponse['data'], error };
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

  static async updatePassword(credentials: UpdatePasswordCredentials): Promise<FitunoUserResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: credentials.password,
      });

      if (error) {
        console.error('Update password error:', error);
      }

      return { data: { user: data.user }, error };
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

  static async resendEmailVerification(
    email?: string
  ): Promise<{ data: any; error: AuthError | null }> {
    try {
      let userEmail = email;

      // If no email provided, try to get it from current user
      if (!userEmail) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userEmail = user?.email;
      }

      if (!userEmail) {
        return {
          data: null,
          error: {
            message: 'Email address is required for resending verification',
            status: 400,
          } as AuthError,
        };
      }

      const rateLimitKey = `resend:${userEmail}`;

      if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.signupAttempts)) {
        return {
          data: null,
          error: {
            message: 'Too many email verification attempts. Please try again later.',
            status: 429,
          } as AuthError,
        };
      }

      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.emailVerification}`,
        },
      });

      if (error) {
        console.error('Resend email verification error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('Resend email verification unexpected error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred during email verification resend',
          status: 500,
        } as AuthError,
      };
    }
  }

  // ========================================
  // USER INFORMATION & SESSION MANAGEMENT
  // ========================================

  static async getCurrentUser(): Promise<FitunoUserResponse> {
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        return {
          data: { user: null },
          error: createConfigurationError(),
        };
      }

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        // Handle error silently
      }

      return { data: { user: data.user }, error };
    } catch {
      // Handle error silently
      return {
        data: { user: null },
        error: {
          message: 'An unexpected error occurred while fetching user data',
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

      return { data: { session: data.session }, error };
    } catch (error) {
      console.error('Get current session unexpected error:', error);
      return {
        data: { session: null },
        error: {
          message: 'An unexpected error occurred while fetching session data',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async refreshSession(): Promise<FitunoAuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Refresh session error:', error);
      }

      return { data: data as FitunoAuthResponse['data'], error };
    } catch (error) {
      console.error('Refresh session unexpected error:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: 'An unexpected error occurred during session refresh',
          status: 500,
        } as AuthError,
      };
    }
  }

  static async updateProfile(credentials: UpdateProfileCredentials): Promise<FitunoUserResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: credentials.email,
        password: credentials.password,
        data: credentials.data,
      });

      if (error) {
        console.error('Update profile error:', error);
      }

      return { data: { user: data.user }, error };
    } catch (error) {
      console.error('Update profile unexpected error:', error);
      return {
        data: { user: null },
        error: {
          message: 'An unexpected error occurred during profile update',
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
      callback(event, session);
    });
  }

  static isEmailVerified(user: User | null): boolean {
    return user?.email_confirmed_at != null;
  }

  static isSessionExpired(session: Session | null): boolean {
    if (!session?.expires_at) return true;
    return Date.now() >= session.expires_at * 1000;
  }

  static shouldRefreshSession(session: Session | null): boolean {
    if (!session?.expires_at) return false;
    const expirationTime = session.expires_at * 1000;
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiration
    return Date.now() >= expirationTime - refreshThreshold;
  }

  static async signInAnonymously(): Promise<FitunoAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('Anonymous signin error:', error);
      }

      return { data: data as FitunoAuthResponse['data'], error };
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

  // ========================================
  // UTILITY METHODS
  // ========================================

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
        contentType: options?.contentType,
      });

      if (error) {
        console.error('File upload error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('File upload unexpected error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred during file upload',
          status: 500,
        },
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
        error: {
          message: 'An unexpected error occurred during file download',
          status: 500,
        },
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
        console.error('File deletion error:', error);
      }

      return { data, error };
    } catch (error) {
      console.error('File deletion unexpected error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred during file deletion',
          status: 500,
        },
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

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateName(name: string): boolean {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
      .trim();
  }
}

// ========================================
// PLACEHOLDER SERVICES (TO BE IMPLEMENTED)
// ========================================

export class TrainerService {
  // TODO: Implement trainer-specific methods
}

export class ClientService {
  // TODO: Implement client-specific methods
}

export class ExerciseService {
  // TODO: Implement exercise-related methods
}

export class WorkoutService {
  // TODO: Implement workout-related methods
}

export class ProgressService {
  // TODO: Implement progress tracking methods
}

export class ChatService {
  // TODO: Implement chat/messaging methods
}

export class AnamnesisService {
  // TODO: Implement anamnesis/assessment methods
}

export class SubscriptionService {
  // TODO: Implement subscription/billing methods
}

// ========================================
// EMAIL SERVICE
// ========================================

export interface InvitationEmailData {
  trainerName: string;
  clientEmail: string;
  invitationUrl: string;
  expirationDate: string;
}

export class EmailService {
  /**
   * Send client invitation email
   * This would typically use a service like SendGrid, Resend, or similar
   */
  static async sendClientInvitation(
    data: InvitationEmailData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would use an email service
      // For now, we'll simulate the email sending
      console.log('📧 Sending client invitation email:', {
        to: data.clientEmail,
        subject: `Convite para ser cliente do ${data.trainerName} - Fituno`,
        trainerName: data.trainerName,
        invitationUrl: data.invitationUrl,
        expirationDate: data.expirationDate,
      });

      // TODO: Implement actual email sending using your preferred service
      // Example with Resend:
      // const response = await fetch('https://api.resend.com/emails', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     from: 'noreply@fituno.app',
      //     to: data.clientEmail,
      //     subject: `Convite para ser cliente do ${data.trainerName} - Fituno`,
      //     html: this.generateInvitationEmailTemplate(data),
      //   }),
      // });

      // For development/testing, we'll just return success
      // Log the generated template for debugging
      console.log('Generated email template:', this.generateInvitationEmailTemplate(data));
      return { success: true };
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate HTML template for invitation email
   */
  private static generateInvitationEmailTemplate(data: InvitationEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Convite - Fituno</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
            .expiration { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏋️ Fituno</h1>
              <h2>Você foi convidado para ser cliente!</h2>
            </div>
            <div class="content">
              <p>Olá!</p>
              <p><strong>${data.trainerName}</strong> te convidou para ser seu cliente no Fituno.</p>
              <p>Com o Fituno, você terá acesso a:</p>
              <ul>
                <li>📱 Treinos personalizados no seu celular</li>
                <li>📊 Acompanhamento de progresso</li>
                <li>💬 Comunicação direta com seu treinador</li>
                <li>📈 Relatórios detalhados de evolução</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${data.invitationUrl}" class="button">Aceitar Convite</a>
              </div>
              
              <div class="expiration">
                <strong>⚠️ Importante:</strong> Este convite expira em <strong>${data.expirationDate}</strong>
              </div>
              
              <p>Se você não conseguir clicar no botão, copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; color: #2563eb;">${data.invitationUrl}</p>
              
              <p>Atenciosamente,<br>Equipe Fituno</p>
            </div>
            <div class="footer">
              <p>Este é um email automático. Se você não solicitou este convite, pode ignorar esta mensagem.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send welcome email to new clients
   */
  static async sendWelcomeEmail(
    clientEmail: string,
    clientName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Sending welcome email:', {
        to: clientEmail,
        subject: `Bem-vindo ao Fituno, ${clientName}!`,
      });

      // TODO: Implement actual email sending
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
