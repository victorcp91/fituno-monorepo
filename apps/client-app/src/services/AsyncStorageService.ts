import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  private static instance: AsyncStorageService;

  private constructor() {}

  public static getInstance(): AsyncStorageService {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  // Generic storage methods
  public async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing item with key ${key}:`, error);
      throw error;
    }
  }

  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving item with key ${key}:`, error);
      return null;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key ${key}:`, error);
      throw error;
    }
  }

  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw error;
    }
  }

  public async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  public async multiGet(keys: string[]): Promise<readonly (readonly [string, string | null])[]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return [];
    }
  }

  public async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error setting multiple items:', error);
      throw error;
    }
  }

  public async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error removing multiple items:', error);
      throw error;
    }
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  // User preferences
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  NOTIFICATION_SETTINGS: 'notification_settings',

  // App state
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC_TIME: 'last_sync_time',
  OFFLINE_MODE: 'offline_mode',

  // Cache
  USER_PROFILE_CACHE: 'user_profile_cache',
  WORKOUT_CACHE: 'workout_cache',
  EXERCISE_CACHE: 'exercise_cache',

  // Session data
  CURRENT_WORKOUT_SESSION: 'current_workout_session',
  DRAFT_WORKOUTS: 'draft_workouts',

  // Settings
  MEASUREMENT_UNITS: 'measurement_units',
  REST_TIMER_SETTINGS: 'rest_timer_settings',
  WORKOUT_REMINDERS: 'workout_reminders',
} as const;
