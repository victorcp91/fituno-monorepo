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
    } catch {

      throw error;
    }
  }

  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch {

      return null;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {

      throw error;
    }
  }

  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {

      throw error;
    }
  }

  public async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch {

      return [];
    }
  }

  public async multiGet(keys: string[]): Promise<readonly (readonly [string, string | null])[]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch {

      return [];
    }
  }

  public async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch {

      throw error;
    }
  }

  public async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch {

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
