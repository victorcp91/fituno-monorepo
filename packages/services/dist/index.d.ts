import type { AuthError, AuthResponse, Session, User, UserResponse } from '@supabase/supabase-js';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
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
    static signUp(credentials: SignUpCredentials): Promise<AuthResponse>;
    static signIn(credentials: SignInCredentials): Promise<AuthResponse>;
    static signOut(): Promise<{
        error: AuthError | null;
    }>;
    static signInWithGoogle(): Promise<AuthResponse>;
    static signInWithFacebook(): Promise<AuthResponse>;
    static resetPassword(credentials: PasswordResetCredentials): Promise<{
        data: any;
        error: AuthError | null;
    }>;
    static updatePassword(credentials: UpdatePasswordCredentials): Promise<UserResponse>;
    static resendEmailVerification(): Promise<{
        data: any;
        error: AuthError | null;
    }>;
    static getCurrentUser(): Promise<UserResponse>;
    static getCurrentSession(): Promise<{
        data: {
            session: Session | null;
        };
        error: AuthError | null;
    }>;
    static refreshSession(): Promise<AuthResponse>;
    static updateProfile(credentials: UpdateProfileCredentials): Promise<UserResponse>;
    static onAuthStateChange(callback: (event: string, session: Session | null) => void): {
        data: {
            subscription: import("@supabase/auth-js").Subscription;
        };
    };
    static isEmailVerified(user: User | null): boolean;
    static isSessionExpired(session: Session | null): boolean;
    static shouldRefreshSession(session: Session | null): boolean;
    static signInAnonymously(): Promise<AuthResponse>;
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
//# sourceMappingURL=index.d.ts.map