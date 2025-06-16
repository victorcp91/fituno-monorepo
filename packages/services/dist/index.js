// Fituno Services Package
// Shared services for the Fituno monorepo
/* eslint-disable no-console */
import { API_CONFIG, AUTH_CONFIG, SUPABASE_CONFIG } from '@fituno/constants';
import { createClient } from '@supabase/supabase-js';
// Supabase Client with build-time safety
export const supabase = createClient(SUPABASE_CONFIG.URL || 'https://placeholder.supabase.co', SUPABASE_CONFIG.ANON_KEY || 'placeholder-key');
// ========================================
// API CLIENT
// ========================================
export class ApiClient {
    constructor(baseURL = API_CONFIG.BASE_URL, timeout = API_CONFIG.TIMEOUT) {
        this.baseURL = baseURL;
        this.timeout = timeout;
    }
    async request(endpoint, options = {}) {
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
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                return { data: null, error: error.message };
            }
            return { data: null, error: 'Unknown error occurred' };
        }
    }
    async get(endpoint, headers) {
        return this.request(endpoint, { method: 'GET', headers });
    }
    async post(endpoint, body, headers) {
        return this.request(endpoint, {
            method: 'POST',
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers,
        });
    }
    async put(endpoint, body, headers) {
        return this.request(endpoint, {
            method: 'PUT',
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers,
        });
    }
    async delete(endpoint, headers) {
        return this.request(endpoint, { method: 'DELETE', headers });
    }
}
// Global API client instance
export const apiClient = new ApiClient();
export class AuthService {
    // ========================================
    // UTILITY METHODS FOR URL CONSTRUCTION
    // ========================================
    static getBaseUrl() {
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
        console.error('Could not determine base URL. Please set NEXT_PUBLIC_BASE_URL environment variable or ensure the application is running in a proper environment.');
        throw new Error('Base URL could not be determined. Please configure NEXT_PUBLIC_BASE_URL environment variable for production deployment.');
    }
    // ========================================
    // RATE LIMITING
    // ========================================
    static checkRateLimit(key, maxAttempts) {
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
    static async signUp(credentials) {
        const rateLimitKey = `signup:${credentials.email}`;
        if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.signupAttempts)) {
            return {
                data: { user: null, session: null },
                error: {
                    message: 'Too many signup attempts. Please try again later.',
                    status: 429,
                },
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
            return { data: data, error };
        }
        catch (error) {
            console.error('SignUp unexpected error:', error);
            return {
                data: { user: null, session: null },
                error: {
                    message: 'An unexpected error occurred during signup',
                    status: 500,
                },
            };
        }
    }
    static async signIn(credentials) {
        const rateLimitKey = `signin:${credentials.email}`;
        if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.loginAttempts)) {
            return {
                data: { user: null, session: null },
                error: {
                    message: 'Too many login attempts. Please try again later.',
                    status: 429,
                },
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
            return { data: data, error };
        }
        catch (error) {
            console.error('SignIn unexpected error:', error);
            return {
                data: { user: null, session: null },
                error: {
                    message: 'An unexpected error occurred during signin',
                    status: 500,
                },
            };
        }
    }
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('SignOut error:', error);
            }
            // Clear any local storage or cache here if needed
            return { error };
        }
        catch (error) {
            console.error('SignOut unexpected error:', error);
            return {
                error: {
                    message: 'An unexpected error occurred during signout',
                    status: 500,
                },
            };
        }
    }
    // ========================================
    // SOCIAL AUTHENTICATION (OAuth)
    // ========================================
    static async signInWithGoogle() {
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
            return { data: data, error };
        }
        catch (error) {
            console.error('Google OAuth unexpected error:', error);
            return {
                data: { user: null, session: null },
                error: {
                    message: 'An unexpected error occurred during Google authentication',
                    status: 500,
                },
            };
        }
    }
    static async signInWithFacebook() {
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
            return { data: data, error };
        }
        catch (error) {
            console.error('Facebook OAuth unexpected error:', error);
            return {
                data: { user: null, session: null },
                error: {
                    message: 'An unexpected error occurred during Facebook authentication',
                    status: 500,
                },
            };
        }
    }
    // ========================================
    // PASSWORD RESET & EMAIL VERIFICATION
    // ========================================
    static async resetPassword(credentials) {
        const rateLimitKey = `reset:${credentials.email}`;
        if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.passwordResetAttempts)) {
            return {
                data: null,
                error: {
                    message: 'Too many password reset attempts. Please try again later.',
                    status: 429,
                },
            };
        }
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(credentials.email, {
                redirectTo: credentials.redirectTo ||
                    `${this.getBaseUrl()}${AUTH_CONFIG.REDIRECT_URLS.passwordReset}`,
            });
            if (error) {
                console.error('Password reset error:', error);
            }
            return { data, error };
        }
        catch (error) {
            console.error('Password reset unexpected error:', error);
            return {
                data: null,
                error: {
                    message: 'An unexpected error occurred during password reset',
                    status: 500,
                },
            };
        }
    }
    static async updatePassword(credentials) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: credentials.password,
            });
            if (error) {
                console.error('Update password error:', error);
            }
            return { data: { user: data.user }, error };
        }
        catch (error) {
            console.error('Update password unexpected error:', error);
            return {
                data: { user: null },
                error: {
                    message: 'An unexpected error occurred during password update',
                    status: 500,
                },
            };
        }
    }
    static async resendEmailVerification() {
        try {
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user?.email) {
                return {
                    data: null,
                    error: {
                        message: 'No authenticated user found',
                        status: 401,
                    },
                };
            }
            const rateLimitKey = `resend:${user.email}`;
            if (!this.checkRateLimit(rateLimitKey, AUTH_CONFIG.RATE_LIMITS.signupAttempts)) {
                return {
                    data: null,
                    error: {
                        message: 'Too many email verification attempts. Please try again later.',
                        status: 429,
                    },
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
                console.error('Resend email verification error:', error);
            }
            return { data, error };
        }
        catch (error) {
            console.error('Resend email verification unexpected error:', error);
            return {
                data: null,
                error: {
                    message: 'An unexpected error occurred during email verification resend',
                    status: 500,
                },
            };
        }
    }
    // ========================================
    // USER INFORMATION & SESSION MANAGEMENT
    // ========================================
    static async getCurrentUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Get current user error:', error);
            }
            return { data: { user: data.user }, error };
        }
        catch (error) {
            console.error('Get current user unexpected error:', error);
            return {
                data: { user: null },
                error: {
                    message: 'An unexpected error occurred while fetching user data',
                    status: 500,
                },
            };
        }
    }
    static async getCurrentSession() {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Get current session error:', error);
            }
            return { data: { session: data.session }, error };
        }
        catch (error) {
            console.error('Get current session unexpected error:', error);
            return {
                data: { session: null },
                error: {
                    message: 'An unexpected error occurred while fetching session data',
                    status: 500,
                },
            };
        }
    }
    static async refreshSession() {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) {
                console.error('Refresh session error:', error);
            }
            return { data: data, error };
        }
        catch (error) {
            console.error('Refresh session unexpected error:', error);
            return {
                data: { user: null, session: null },
                error: {
                    message: 'An unexpected error occurred during session refresh',
                    status: 500,
                },
            };
        }
    }
    static async updateProfile(credentials) {
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
        }
        catch (error) {
            console.error('Update profile unexpected error:', error);
            return {
                data: { user: null },
                error: {
                    message: 'An unexpected error occurred during profile update',
                    status: 500,
                },
            };
        }
    }
    // ========================================
    // AUTH STATE MANAGEMENT
    // ========================================
    static onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
    static isEmailVerified(user) {
        return user?.email_confirmed_at != null;
    }
    static isSessionExpired(session) {
        if (!session?.expires_at)
            return true;
        return Date.now() >= session.expires_at * 1000;
    }
    static shouldRefreshSession(session) {
        if (!session?.expires_at)
            return false;
        const expirationTime = session.expires_at * 1000;
        const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiration
        return Date.now() >= expirationTime - refreshThreshold;
    }
    static async signInAnonymously() {
        try {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) {
                console.error('Anonymous signin error:', error);
            }
            return { data: data, error };
        }
        catch (error) {
            console.error('Anonymous signin unexpected error:', error);
            return {
                data: { user: null, session: null },
                error: {
                    message: 'An unexpected error occurred during anonymous signin',
                    status: 500,
                },
            };
        }
    }
    // ========================================
    // UTILITY METHODS
    // ========================================
    static clearRateLimitData(key) {
        if (key) {
            this.rateLimitTracker.delete(key);
        }
        else {
            this.rateLimitTracker.clear();
        }
    }
}
AuthService.rateLimitTracker = new Map();
// ========================================
// STORAGE SERVICE
// ========================================
export class StorageService {
    static async uploadFile(bucket, path, file, options) {
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
        }
        catch (error) {
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
    static async downloadFile(bucket, path) {
        try {
            const { data, error } = await supabase.storage.from(bucket).download(path);
            if (error) {
                console.error('File download error:', error);
            }
            return { data, error };
        }
        catch (error) {
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
    static getPublicUrl(bucket, path) {
        return supabase.storage.from(bucket).getPublicUrl(path);
    }
    static async deleteFile(bucket, paths) {
        try {
            const { data, error } = await supabase.storage.from(bucket).remove(paths);
            if (error) {
                console.error('File deletion error:', error);
            }
            return { data, error };
        }
        catch (error) {
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
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static validatePassword(password) {
        const errors = [];
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
    static validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    }
    static sanitizeInput(input) {
        return input
            .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
            .trim();
    }
}
// ========================================
// PLACEHOLDER SERVICES (TO BE IMPLEMENTED)
// ========================================
export class TrainerService {
}
export class ClientService {
}
export class ExerciseService {
}
export class WorkoutService {
}
export class ProgressService {
}
export class ChatService {
}
export class AnamnesisService {
}
export class SubscriptionService {
}
//# sourceMappingURL=index.js.map