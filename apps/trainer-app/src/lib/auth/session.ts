import { AUTH_CONFIG } from '@fituno/constants';
import { AuthService } from '@fituno/services';

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    metadata: any;
  };
}

export class SessionManager {
  private static refreshPromise: Promise<any> | null = null;

  /**
   * Check if the current session is valid and not expired
   */
  static async isSessionValid(): Promise<boolean> {
    try {
      const { data, error } = await AuthService.getCurrentSession();

      if (error || !data.session) {
        return false;
      }

      // Check if token is expired or expires soon (within 5 minutes)
      const expiresAt = data.session.expires_at;
      if (!expiresAt) return false;

      const now = Math.floor(Date.now() / 1000);
      const bufferTime = 5 * 60; // 5 minutes buffer

      return expiresAt > now + bufferTime;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  /**
   * Refresh the session token if needed
   */
  static async refreshSession(): Promise<{ success: boolean; error?: string }> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    this.refreshPromise = this._performRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;

    return result;
  }

  private static async _performRefresh(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await AuthService.refreshSession();

      if (error) {
        console.error('Session refresh failed:', error);
        return { success: false, error: error.message };
      }

      if (!data.session) {
        return { success: false, error: 'No session returned' };
      }

      return { success: true };
    } catch (error) {
      console.error('Session refresh error:', error);
      return { success: false, error: 'Refresh failed' };
    }
  }

  /**
   * Get the current session data
   */
  static async getSessionData(): Promise<SessionData | null> {
    try {
      const { data, error } = await AuthService.getCurrentSession();

      if (error || !data.session || !data.user) {
        return null;
      }

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          emailVerified: AuthService.isEmailVerified(data.user),
          metadata: data.user.user_metadata || {},
        },
      };
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  /**
   * Clear the current session and logout
   */
  static async clearSession(): Promise<void> {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  /**
   * Check if the user needs to complete their profile
   */
  static async requiresProfileCompletion(): Promise<boolean> {
    const sessionData = await this.getSessionData();

    if (!sessionData) {
      return false;
    }

    return !sessionData.user.metadata?.user_type;
  }

  /**
   * Set up automatic session refresh
   */
  static setupAutoRefresh(): () => void {
    const interval = setInterval(async () => {
      const isValid = await this.isSessionValid();

      if (!isValid) {
        const { success } = await this.refreshSession();

        if (!success) {
          console.warn('Session auto-refresh failed');
          // Optional: redirect to login or show notification
        }
      }
    }, AUTH_CONFIG.SESSION_REFRESH_INTERVAL);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Handle session expiry and redirect appropriately
   */
  static handleSessionExpiry(currentPath?: string): void {
    const loginUrl = new URL('/auth/login', window.location.origin);

    if (currentPath && !currentPath.startsWith('/auth')) {
      loginUrl.searchParams.set('redirectTo', currentPath);
      loginUrl.searchParams.set('expired', 'true');
    }

    window.location.href = loginUrl.toString();
  }

  /**
   * Validate session and handle expiry automatically
   */
  static async validateAndRefresh(): Promise<boolean> {
    const isValid = await this.isSessionValid();

    if (isValid) {
      return true;
    }

    const { success } = await this.refreshSession();

    if (!success) {
      this.handleSessionExpiry();
      return false;
    }

    return true;
  }
}
