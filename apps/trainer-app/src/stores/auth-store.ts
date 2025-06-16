import { AuthService } from '@fituno/services';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    user_type?: 'trainer' | 'client' | 'admin';
    full_name?: string;
    avatar_url?: string;
    trainer_profile?: {
      phone?: string;
      location?: string;
      specialization?: string;
      bio?: string;
      experience?: string;
    };
    onboarding_completed?: boolean;
  };
  email_confirmed_at?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: isLoading => set({ isLoading }),

      setError: error => set({ error }),

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await AuthService.signIn({ email, password });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          if (data?.user) {
            set({
              user: data.user as User,
              isAuthenticated: true,
              error: null,
              isLoading: false,
            });
            return { success: true };
          }

          set({ error: 'Invalid response from server', isLoading: false });
          return { success: false, error: 'Invalid response from server' };
        } catch {
          const errorMessage = 'An unexpected error occurred';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      signOut: async () => {
        set({ isLoading: true });

        try {
          await AuthService.signOut();
        } catch {
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        }
      },

      updateProfile: async (profileData: any) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await AuthService.updateProfile({
            data: profileData,
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          if (data?.user) {
            set({
              user: data.user as User,
              error: null,
              isLoading: false,
            });
            return { success: true };
          }

          set({ error: 'Failed to update profile', isLoading: false });
          return { success: false, error: 'Failed to update profile' };
        } catch {
          set({ error: 'Failed to update profile', isLoading: false });
          return { success: false, error: 'Failed to update profile' };
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const { data, error } = await AuthService.getCurrentUser();

          if (error || !data?.user) {
            set({
              user: null,
              isAuthenticated: false,
              error: null,
              isLoading: false,
            });
            return;
          }

          set({
            user: data.user as User,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        }
      },

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        }),
    }),
    {
      name: 'fituno-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
