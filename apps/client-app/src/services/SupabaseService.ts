import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { storageService } from './StorageService';

// These would normally come from environment variables
// For now, using placeholder values - these should be configured in app.json or expo constants
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient;

  private constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: {
          getItem: async (key: string) => {
            // Map specific Supabase keys to our secure storage
            switch (key) {
              case 'sb-access-token':
                return await storageService.getSecureItem('ACCESS_TOKEN');
              case 'sb-refresh-token':
                return await storageService.getSecureItem('REFRESH_TOKEN');
              case 'sb-provider-token':
                return await storageService.getSecureItem('ID_TOKEN');
              case 'sb-auth-session':
                return await storageService.getSecureItem('USER_CREDENTIALS');
              case 'sb-user':
                return await storageService.getPreference('USER_PROFILE_CACHE');
              default:

                return null;
            }
          },
          setItem: async (key: string, value: string) => {
            // Map specific Supabase keys to our secure storage
            switch (key) {
              case 'sb-access-token':
                await storageService.setSecureItem('ACCESS_TOKEN', value);
                break;
              case 'sb-refresh-token':
                await storageService.setSecureItem('REFRESH_TOKEN', value);
                break;
              case 'sb-provider-token':
                await storageService.setSecureItem('ID_TOKEN', value);
                break;
              case 'sb-auth-session':
                await storageService.setSecureItem('USER_CREDENTIALS', value);
                break;
              case 'sb-user':
                await storageService.setPreference('USER_PROFILE_CACHE', value);
                break;
              default:

            }
          },
          removeItem: async (key: string) => {
            // Map specific Supabase keys to our secure storage
            switch (key) {
              case 'sb-access-token':
                await storageService.removeSecureItem('ACCESS_TOKEN');
                break;
              case 'sb-refresh-token':
                await storageService.removeSecureItem('REFRESH_TOKEN');
                break;
              case 'sb-provider-token':
                await storageService.removeSecureItem('ID_TOKEN');
                break;
              case 'sb-auth-session':
                await storageService.removeSecureItem('USER_CREDENTIALS');
                break;
              case 'sb-user':
                await storageService.removePreference('USER_PROFILE_CACHE');
                break;
              default:

            }
          },
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public get supabase(): SupabaseClient {
    return this.client;
  }

  // Authentication methods
  public async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      // Store user data locally if signup successful
      if (data.user) {
        await this.storeUserData(data.user);
      }

      return { data, error: null };
    } catch {

      return { data: null, error };
    }
  }

  public async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Store user data and tokens locally
      if (data.user && data.session) {
        await this.storeUserData(data.user);
        await this.storeSession(data.session);
      }

      return { data, error: null };
    } catch {

      return { data: null, error };
    }
  }

  public async signOut() {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) throw error;

      // Clear local storage
      await this.clearUserData();

      return { error: null };
    } catch {

      return { error };
    }
  }

  public async resetPassword(email: string) {
    try {
      const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: 'fituno://reset-password',
      });

      return { data, error };
    } catch {

      return { data: null, error };
    }
  }

  public async updatePassword(newPassword: string) {
    try {
      const { data, error } = await this.client.auth.updateUser({
        password: newPassword,
      });

      return { data, error };
    } catch {

      return { data: null, error };
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser();

      if (error) {

        return null;
      }

      return user;
    } catch {

      return null;
    }
  }

  public async getCurrentSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await this.client.auth.getSession();

      if (error) {

        return null;
      }

      return session;
    } catch {

      return null;
    }
  }

  public async refreshSession() {
    try {
      const { data, error } = await this.client.auth.refreshSession();

      if (error) throw error;

      if (data.session) {
        await this.storeSession(data.session);
      }

      return { data, error: null };
    } catch {

      return { data: null, error };
    }
  }

  // Social authentication
  public async signInWithGoogle() {
    try {
      const { data, error } = await this.client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'fituno://auth/callback',
        },
      });

      return { data, error };
    } catch {

      return { data: null, error };
    }
  }

  public async signInWithFacebook() {
    try {
      const { data, error } = await this.client.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: 'fituno://auth/callback',
        },
      });

      return { data, error };
    } catch {

      return { data: null, error };
    }
  }

  // Auth state listener
  public onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // Private helper methods
  private async storeUserData(user: User) {
    try {
      const userData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      };

      // Store in database
      await storageService.database.insert('user_profile', {
        ...userData,
        synced_at: new Date().toISOString(),
      });

      // Store in cache
      await storageService.setPreference('USER_PROFILE_CACHE', userData);
    } catch {

    }
  }

  private async storeSession(session: Session) {
    try {
      await storageService.setSecureItem('ACCESS_TOKEN', session.access_token);
      await storageService.setSecureItem('REFRESH_TOKEN', session.refresh_token);

      if (session.provider_token) {
        await storageService.setSecureItem('ID_TOKEN', session.provider_token);
      }
    } catch {

    }
  }

  private async clearUserData() {
    try {
      await Promise.all([
        storageService.clearAuthTokens(),
        storageService.removePreference('USER_PROFILE_CACHE'),
        storageService.database.clearTable('user_profile'),
      ]);
    } catch {

    }
  }

  // Database operations (using RLS policies)
  public async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return { data, error };
    } catch {

      return { data: null, error };
    }
  }

  public async updateUserProfile(userId: string, updates: Record<string, any>) {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (data) {
        await this.storeUserData(data as User);
      }

      return { data, error };
    } catch {

      return { data: null, error };
    }
  }
}
