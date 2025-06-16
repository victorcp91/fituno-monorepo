import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// ========================================
// UI UTILITIES
// ========================================
/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
// ========================================
// DATE & TIME UTILITIES
// ========================================
/**
 * Format date values with locale support
 */
export function formatDate(date, locale = 'pt-BR') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
}
/**
 * Format short date (DD/MM/YYYY or MM/DD/YYYY)
 */
export function formatShortDate(date, locale = 'pt-BR') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(dateObj);
}
/**
 * Format time (HH:MM)
 */
export function formatTime(date, locale = 'pt-BR') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);
}
/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date, locale = 'pt-BR') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    }
    else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    }
    else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    }
    else {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }
}
/**
 * Format duration in seconds to readable format (e.g., "2:30")
 */
export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}
/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}
// ========================================
// NUMBER & CURRENCY UTILITIES
// ========================================
/**
 * Format currency values with locale support
 */
export function formatCurrency(value, currency = 'BRL', locale = 'pt-BR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(value);
}
/**
 * Format number with locale support
 */
export function formatNumber(value, locale = 'pt-BR', decimals) {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}
/**
 * Round number to specified decimal places
 */
export function roundToDecimals(value, decimals = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
// ========================================
// FITNESS CALCULATION UTILITIES
// ========================================
/**
 * Calculate 1RM using Brzycki formula
 * 1RM = weight × (36 / (37 - reps))
 */
export function calculate1RM(weight, reps) {
    if (reps <= 1)
        return weight;
    if (reps > 15)
        return weight; // Formula becomes less accurate above 15 reps
    return roundToDecimals(weight * (36 / (37 - reps)), 1);
}
/**
 * Calculate workout volume (sets × reps × weight)
 */
export function calculateVolume(sets, reps, weight) {
    return roundToDecimals(sets * reps * weight, 1);
}
/**
 * Calculate BMI (Body Mass Index)
 */
export function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return roundToDecimals(weightKg / (heightM * heightM), 1);
}
/**
 * Convert weight units
 */
export function convertWeight(value, from, to) {
    if (from === to)
        return value;
    if (from === 'kg' && to === 'lbs') {
        return roundToDecimals(value * 2.20462, 1);
    }
    else {
        return roundToDecimals(value / 2.20462, 1);
    }
}
// ========================================
// DATA TRANSFORMATION UTILITIES
// ========================================
/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse(str, fallback) {
    try {
        return JSON.parse(str);
    }
    catch {
        return fallback;
    }
}
/**
 * Remove undefined and null values from object
 */
export function removeEmptyValues(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null));
}
/**
 * Group array by key
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = String(item[key]);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}
// ========================================
// VALIDATION UTILITIES
// ========================================
/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate password strength
 */
export function validatePasswordStrength(password) {
    const feedback = [];
    let score = 0;
    if (password.length >= 8) {
        score += 25;
    }
    else {
        feedback.push('At least 8 characters');
    }
    if (/[a-z]/.test(password)) {
        score += 25;
    }
    else {
        feedback.push('Include lowercase letters');
    }
    if (/[A-Z]/.test(password)) {
        score += 25;
    }
    else {
        feedback.push('Include uppercase letters');
    }
    if (/\d/.test(password)) {
        score += 25;
    }
    else {
        feedback.push('Include numbers');
    }
    return { score: Math.min(score, 100), feedback };
}
// ========================================
// STRING UTILITIES
// ========================================
/**
 * Capitalize first letter of each word
 */
export function titleCase(str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
/**
 * Truncate string with ellipsis
 */
export function truncate(str, length, suffix = '...') {
    if (str.length <= length)
        return str;
    return str.substring(0, length - suffix.length) + suffix;
}
/**
 * Generate slug from string
 */
export function generateSlug(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens
        .trim();
}
// ========================================
// ASYNC UTILITIES
// ========================================
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Sleep utility
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry async function with exponential backoff
 */
export async function retry(fn, maxAttempts = 3, baseDelay = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxAttempts) {
                throw lastError;
            }
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await sleep(delay);
        }
    }
    throw lastError;
}
// ========================================
// ID UTILITIES
// ========================================
/**
 * Generate random ID
 */
export function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
/**
 * Generate UUID v4 (basic implementation)
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
// ========================================
// ARRAY UTILITIES
// ========================================
/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
/**
 * Get random item from array
 */
export function randomFromArray(array) {
    if (array.length === 0)
        return undefined;
    return array[Math.floor(Math.random() * array.length)];
}
// ========================================
// ERROR HANDLING UTILITIES
// ========================================
/**
 * Safe async wrapper that catches errors
 */
export async function safeAsync(fn) {
    try {
        const result = await fn();
        return [result, null];
    }
    catch (error) {
        return [null, error];
    }
}
// ========================================
// DEVICE UTILITIES
// ========================================
/**
 * Check if running in browser
 */
export function isBrowser() {
    return typeof window !== 'undefined';
}
/**
 * Check if running on mobile device (basic)
 */
export function isMobile() {
    if (!isBrowser())
        return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// ========================================
// LOGGING UTILITIES
// ========================================
export { logger, LogLevel } from './logger';
//# sourceMappingURL=index.js.map