import { DatabaseManager } from '../database/DatabaseManager';
import { AsyncStorageService, STORAGE_KEYS } from './AsyncStorageService';
import { SECURE_STORAGE_KEYS, SecureStorageService } from './SecureStorageService';

export class StorageService {
  private static instance: StorageService;
  private dbManager: DatabaseManager;
  private asyncStorage: AsyncStorageService;
  private secureStorage: SecureStorageService;

  private constructor() {
    this.dbManager = DatabaseManager.getInstance();
    this.asyncStorage = AsyncStorageService.getInstance();
    this.secureStorage = SecureStorageService.getInstance();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.dbManager.initialize();

    } catch {

      throw error;
    }
  }

  // Database operations (for structured data)
  public get database() {
    return this.dbManager;
  }

  // AsyncStorage operations (for app preferences and cache)
  public async setPreference<T>(key: keyof typeof STORAGE_KEYS, value: T): Promise<void> {
    return this.asyncStorage.setItem(STORAGE_KEYS[key], value);
  }

  public async getPreference<T>(key: keyof typeof STORAGE_KEYS): Promise<T | null> {
    return this.asyncStorage.getItem<T>(STORAGE_KEYS[key]);
  }

  public async removePreference(key: keyof typeof STORAGE_KEYS): Promise<void> {
    return this.asyncStorage.removeItem(STORAGE_KEYS[key]);
  }

  // SecureStore operations (for sensitive data)
  public async setSecureItem(key: keyof typeof SECURE_STORAGE_KEYS, value: string): Promise<void> {
    return this.secureStorage.setItem(SECURE_STORAGE_KEYS[key], value);
  }

  public async getSecureItem(key: keyof typeof SECURE_STORAGE_KEYS): Promise<string | null> {
    return this.secureStorage.getItem(SECURE_STORAGE_KEYS[key]);
  }

  public async setSecureObject<T>(key: keyof typeof SECURE_STORAGE_KEYS, value: T): Promise<void> {
    return this.secureStorage.setObject(SECURE_STORAGE_KEYS[key], value);
  }

  public async getSecureObject<T>(key: keyof typeof SECURE_STORAGE_KEYS): Promise<T | null> {
    return this.secureStorage.getObject<T>(SECURE_STORAGE_KEYS[key]);
  }

  public async removeSecureItem(key: keyof typeof SECURE_STORAGE_KEYS): Promise<void> {
    return this.secureStorage.removeItem(SECURE_STORAGE_KEYS[key]);
  }

  public async hasSecureItem(key: keyof typeof SECURE_STORAGE_KEYS): Promise<boolean> {
    return this.secureStorage.hasItem(SECURE_STORAGE_KEYS[key]);
  }

  // Convenience methods for common operations
  public async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getPreference<boolean>('ONBOARDING_COMPLETED');
    return completed === true;
  }

  public async setOnboardingCompleted(completed: boolean): Promise<void> {
    return this.setPreference('ONBOARDING_COMPLETED', completed);
  }

  public async getThemePreference(): Promise<'light' | 'dark' | 'system' | null> {
    return this.getPreference<'light' | 'dark' | 'system'>('THEME_PREFERENCE');
  }

  public async setThemePreference(theme: 'light' | 'dark' | 'system'): Promise<void> {
    return this.setPreference('THEME_PREFERENCE', theme);
  }

  public async getAccessToken(): Promise<string | null> {
    return this.getSecureItem('ACCESS_TOKEN');
  }

  public async setAccessToken(token: string): Promise<void> {
    return this.setSecureItem('ACCESS_TOKEN', token);
  }

  public async getRefreshToken(): Promise<string | null> {
    return this.getSecureItem('REFRESH_TOKEN');
  }

  public async setRefreshToken(token: string): Promise<void> {
    return this.setSecureItem('REFRESH_TOKEN', token);
  }

  public async clearAuthTokens(): Promise<void> {
    await Promise.all([
      this.removeSecureItem('ACCESS_TOKEN'),
      this.removeSecureItem('REFRESH_TOKEN'),
      this.removeSecureItem('ID_TOKEN'),
    ]);
  }

  public async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return accessToken !== null;
  }

  // Cache management
  public async clearCache(): Promise<void> {
    await Promise.all([
      this.removePreference('USER_PROFILE_CACHE'),
      this.removePreference('WORKOUT_CACHE'),
      this.removePreference('EXERCISE_CACHE'),
    ]);
  }

  // Sync management
  public async getLastSyncTime(): Promise<Date | null> {
    const timestamp = await this.getPreference<string>('LAST_SYNC_TIME');
    return timestamp ? new Date(timestamp) : null;
  }

  public async setLastSyncTime(date: Date): Promise<void> {
    return this.setPreference('LAST_SYNC_TIME', date.toISOString());
  }

  // Cleanup methods
  public async clearAllData(): Promise<void> {
    await Promise.all([this.asyncStorage.clear(), this.dbManager.dropAllTables()]);
    // Note: SecureStore items are not cleared for security reasons
    // They should be cleared individually if needed
  }

  public async close(): Promise<void> {
    await this.dbManager.close();
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
