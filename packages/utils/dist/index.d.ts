import { type ClassValue } from 'clsx';
/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Format date values with locale support
 */
export declare function formatDate(date: Date | string, locale?: string): string;
/**
 * Format short date (DD/MM/YYYY or MM/DD/YYYY)
 */
export declare function formatShortDate(date: Date | string, locale?: string): string;
/**
 * Format time (HH:MM)
 */
export declare function formatTime(date: Date | string, locale?: string): string;
/**
 * Format relative time (e.g., "2 hours ago")
 */
export declare function formatRelativeTime(date: Date | string, locale?: string): string;
/**
 * Format duration in seconds to readable format (e.g., "2:30")
 */
export declare function formatDuration(seconds: number): string;
/**
 * Get today's date in YYYY-MM-DD format
 */
export declare function getTodayDate(): string;
/**
 * Format currency values with locale support
 */
export declare function formatCurrency(value: number, currency?: string, locale?: string): string;
/**
 * Format number with locale support
 */
export declare function formatNumber(value: number, locale?: string, decimals?: number): string;
/**
 * Round number to specified decimal places
 */
export declare function roundToDecimals(value: number, decimals?: number): number;
/**
 * Calculate 1RM using Brzycki formula
 * 1RM = weight × (36 / (37 - reps))
 */
export declare function calculate1RM(weight: number, reps: number): number;
/**
 * Calculate workout volume (sets × reps × weight)
 */
export declare function calculateVolume(sets: number, reps: number, weight: number): number;
/**
 * Calculate BMI (Body Mass Index)
 */
export declare function calculateBMI(weightKg: number, heightCm: number): number;
/**
 * Convert weight units
 */
export declare function convertWeight(value: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number;
/**
 * Safely parse JSON with fallback
 */
export declare function safeJsonParse<T>(str: string, fallback: T): T;
/**
 * Remove undefined and null values from object
 */
export declare function removeEmptyValues(obj: Record<string, any>): Record<string, any>;
/**
 * Group array by key
 */
export declare function groupBy<T>(array: T[], key: keyof T): Record<string, T[]>;
/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export declare function isEmpty(value: any): boolean;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate password strength
 */
export declare function validatePasswordStrength(password: string): {
    score: number;
    feedback: string[];
};
/**
 * Capitalize first letter of each word
 */
export declare function titleCase(str: string): string;
/**
 * Truncate string with ellipsis
 */
export declare function truncate(str: string, length: number, suffix?: string): string;
/**
 * Generate slug from string
 */
export declare function generateSlug(str: string): string;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Sleep utility
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Retry async function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, maxAttempts?: number, baseDelay?: number): Promise<T>;
/**
 * Generate random ID
 */
export declare function generateId(length?: number): string;
/**
 * Generate UUID v4 (basic implementation)
 */
export declare function generateUUID(): string;
/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export declare function shuffleArray<T>(array: T[]): T[];
/**
 * Get random item from array
 */
export declare function randomFromArray<T>(array: T[]): T | undefined;
/**
 * Safe async wrapper that catches errors
 */
export declare function safeAsync<T>(fn: () => Promise<T>): Promise<[T | null, Error | null]>;
/**
 * Check if running in browser
 */
export declare function isBrowser(): boolean;
/**
 * Check if running on mobile device (basic)
 */
export declare function isMobile(): boolean;
//# sourceMappingURL=index.d.ts.map