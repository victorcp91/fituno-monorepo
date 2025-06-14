import * as SecureStore from 'expo-secure-store';

export class SecureStorageService {
  private static instance: SecureStorageService;

  private constructor() {}

  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  public async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error storing secure item with key ${key}:`, error);
      throw error;
    }
  }

  public async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving secure item with key ${key}:`, error);
      return null;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure item with key ${key}:`, error);
      throw error;
    }
  }

  // Convenience methods for JSON data
  public async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing secure object with key ${key}:`, error);
      throw error;
    }
  }

  public async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving secure object with key ${key}:`, error);
      return null;
    }
  }

  // Check if item exists
  public async hasItem(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking secure item with key ${key}:`, error);
      return false;
    }
  }
}

// Secure storage keys constants
export const SECURE_STORAGE_KEYS = {
  // Authentication tokens
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  ID_TOKEN: 'id_token',

  // User credentials (if needed for offline auth)
  USER_CREDENTIALS: 'user_credentials',

  // Biometric authentication
  BIOMETRIC_KEY: 'biometric_key',

  // API keys and secrets
  API_KEY: 'api_key',
  ENCRYPTION_KEY: 'encryption_key',

  // OAuth tokens
  OAUTH_STATE: 'oauth_state',
  OAUTH_CODE_VERIFIER: 'oauth_code_verifier',

  // Device identification
  DEVICE_ID: 'device_id',
  PUSH_TOKEN: 'push_token',
} as const;
