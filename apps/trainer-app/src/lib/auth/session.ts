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
    } catch {

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

        return { success: false, error: error.message };
      }

      if (!data.session) {
        return { success: false, error: 'No session returned' };
      }

      return { success: true };
    } catch {

      return { success: false, error: 'Refresh failed' };
    }
  }

  /**
   * Get the current session data
   */
  static async getSessionData(): Promise<SessionData | null> {
    try {
      // Get session and user data separately
      const [sessionResponse, userResponse] = await Promise.all([
        AuthService.getCurrentSession(),
        AuthService.getCurrentUser(),
      ]);

      // Check session data
      if (sessionResponse.error || !sessionResponse.data.session) {
        return null;
      }

      // Check user data
      if (userResponse.error || !userResponse.data.user) {
        return null;
      }

      const session = sessionResponse.data.session;
      const user = userResponse.data.user;

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at || 0,
        user: {
          id: user.id,
          email: user.email || '',
          emailVerified: AuthService.isEmailVerified(user),
          metadata: user.user_metadata || {},
        },
      };
    } catch {

      return null;
    }
  }

  /**
   * Clear the current session and logout
   */
  static async clearSession(): Promise<void> {
    try {
      await AuthService.signOut();
    } catch {

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
    // Use 5 minutes as the refresh interval (same as REFRESH_THRESHOLD)
    const refreshInterval = AUTH_CONFIG.REFRESH_THRESHOLD;

    const interval = setInterval(async () => {
      const isValid = await this.isSessionValid();

      if (!isValid) {
        const { success } = await this.refreshSession();

        if (!success) {

          // Optional: redirect to login or show notification
        }
      }
    }, refreshInterval);

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
