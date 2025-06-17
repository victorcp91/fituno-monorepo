import type { AuthError, Session, User } from '@supabase/supabase-js';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export interface FitunoAuthResponse {
    data: {
        user: User | null;
        session: Session | null;
    } | {
        user: null;
        session: null;
    };
    error: AuthError | null;
}
export interface FitunoUserResponse {
    data: {
        user: User | null;
    };
    error: AuthError | null;
}
export interface FitunoOAuthResponse {
    data: {
        provider?: string;
        url?: string;
    } | {
        user: User | null;
        session: Session | null;
    };
    error: AuthError | null;
}
export declare class ApiClient {
    private baseURL;
    private timeout;
    constructor(baseURL?: string, timeout?: number);
    private request;
    get<T>(endpoint: string, headers?: Record<string, string>): Promise<{
        data: T | null;
        error: string | null;
    }>;
    post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<{
        data: T | null;
        error: string | null;
    }>;
    put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<{
        data: T | null;
        error: string | null;
    }>;
    delete<T>(endpoint: string, headers?: Record<string, string>): Promise<{
        data: T | null;
        error: string | null;
    }>;
}
export declare const apiClient: ApiClient;
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
export declare class AuthService {
    private static rateLimitTracker;
    private static getBaseUrl;
    private static checkRateLimit;
    static signUp(credentials: SignUpCredentials): Promise<FitunoAuthResponse>;
    static signIn(credentials: SignInCredentials): Promise<FitunoAuthResponse>;
    static signOut(): Promise<{
        error: AuthError | null;
    }>;
    static signInWithGoogle(): Promise<FitunoOAuthResponse>;
    static signInWithFacebook(): Promise<FitunoOAuthResponse>;
    static resetPassword(credentials: PasswordResetCredentials): Promise<{
        data: any;
        error: AuthError | null;
    }>;
    static updatePassword(credentials: UpdatePasswordCredentials): Promise<FitunoUserResponse>;
    static resendEmailVerification(): Promise<{
        data: any;
        error: AuthError | null;
    }>;
    static getCurrentUser(): Promise<FitunoUserResponse>;
    static getCurrentSession(): Promise<{
        data: {
            session: Session | null;
        };
        error: AuthError | null;
    }>;
    static refreshSession(): Promise<FitunoAuthResponse>;
    static updateProfile(credentials: UpdateProfileCredentials): Promise<FitunoUserResponse>;
    static onAuthStateChange(callback: (event: string, session: Session | null) => void): {
        data: {
            subscription: import("@supabase/auth-js").Subscription;
        };
    };
    static isEmailVerified(user: User | null): boolean;
    static isSessionExpired(session: Session | null): boolean;
    static shouldRefreshSession(session: Session | null): boolean;
    static signInAnonymously(): Promise<FitunoAuthResponse>;
    static clearRateLimitData(key?: string): void;
}
export declare class StorageService {
    static uploadFile(bucket: string, path: string, file: File, options?: {
        cacheControl?: string;
        contentType?: string;
    }): Promise<{
        data: any;
        error: any;
    }>;
    static downloadFile(bucket: string, path: string): Promise<{
        data: Blob | null;
        error: any;
    }>;
    static getPublicUrl(bucket: string, path: string): {
        data: {
            publicUrl: string;
        };
    };
    static deleteFile(bucket: string, paths: string[]): Promise<{
        data: any;
        error: any;
    }>;
}
export declare class ValidationService {
    static validateEmail(email: string): boolean;
    static validatePassword(password: string): {
        isValid: boolean;
        errors: string[];
    };
    static validateName(name: string): boolean;
    static sanitizeInput(input: string): string;
}
export declare class TrainerService {
}
export declare class ClientService {
}
export declare class ExerciseService {
}
export declare class WorkoutService {
}
export declare class ProgressService {
}
export declare class ChatService {
}
export declare class AnamnesisService {
}
export declare class SubscriptionService {
}
export interface InvitationEmailData {
    trainerName: string;
    clientEmail: string;
    invitationUrl: string;
    expirationDate: string;
}
export declare class EmailService {
    /**
     * Send client invitation email
     * This would typically use a service like SendGrid, Resend, or similar
     */
    static sendClientInvitation(data: InvitationEmailData): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Generate HTML template for invitation email
     */
    private static generateInvitationEmailTemplate;
    /**
     * Send welcome email to new clients
     */
    static sendWelcomeEmail(clientEmail: string, clientName: string): Promise<{
        success: boolean;
        error?: string;
    }>;
}
//# sourceMappingURL=index.d.ts.map