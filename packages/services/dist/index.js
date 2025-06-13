// Fituno Services Package
// Shared services for the Fituno monorepo
import { API_CONFIG, SUPABASE_CONFIG } from '@fituno/constants';
import { createClient } from '@supabase/supabase-js';
// Supabase Client
export const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
// API Client Class
export class ApiClient {
    constructor(config = {}) {
        this.baseURL = config.baseURL || API_CONFIG.BASE_URL;
        this.timeout = config.timeout || API_CONFIG.TIMEOUT;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            if (!response.ok) {
                return {
                    error: data.error || 'Request failed',
                    status: response.status,
                };
            }
            return {
                data,
                status: response.status,
            };
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return {
                        error: 'Request timeout',
                        status: 408,
                    };
                }
                return {
                    error: error.message,
                    status: 0,
                };
            }
            return {
                error: 'Unknown error',
                status: 0,
            };
        }
    }
    async get(endpoint, headers) {
        return this.request(endpoint, {
            method: 'GET',
            headers,
        });
    }
    async post(endpoint, body, headers) {
        return this.request(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            headers,
        });
    }
    async put(endpoint, body, headers) {
        return this.request(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            headers,
        });
    }
    async patch(endpoint, body, headers) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
            headers,
        });
    }
    async delete(endpoint, headers) {
        return this.request(endpoint, {
            method: 'DELETE',
            headers,
        });
    }
    setAuthToken(token) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    removeAuthToken() {
        delete this.defaultHeaders['Authorization'];
    }
}
// Default API Client Instance
export const apiClient = new ApiClient();
// Auth Service
export class AuthService {
    static async signUp(email, password, metadata) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        return { data, error };
    }
    static async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }
    static async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    }
    static async getCurrentUser() {
        const { data: { user }, error, } = await supabase.auth.getUser();
        return { user, error };
    }
    static async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return { data, error };
    }
    static async updatePassword(password) {
        const { data, error } = await supabase.auth.updateUser({
            password,
        });
        return { data, error };
    }
    static onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
}
// Storage Service
export class StorageService {
    static get(key) {
        if (typeof window === 'undefined')
            return null;
        try {
            return localStorage.getItem(key);
        }
        catch {
            return null;
        }
    }
    static set(key, value) {
        if (typeof window === 'undefined')
            return false;
        try {
            localStorage.setItem(key, value);
            return true;
        }
        catch {
            return false;
        }
    }
    static remove(key) {
        if (typeof window === 'undefined')
            return false;
        try {
            localStorage.removeItem(key);
            return true;
        }
        catch {
            return false;
        }
    }
    static clear() {
        if (typeof window === 'undefined')
            return false;
        try {
            localStorage.clear();
            return true;
        }
        catch {
            return false;
        }
    }
    static getJSON(key) {
        const value = this.get(key);
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch {
            return null;
        }
    }
    static setJSON(key, value) {
        try {
            return this.set(key, JSON.stringify(value));
        }
        catch {
            return false;
        }
    }
}
// Validation Service
export class ValidationService {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isStrongPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
    static isValidName(name) {
        return name.trim().length >= 2 && name.trim().length <= 100;
    }
    static isValidPhoneNumber(phone) {
        // Brazilian phone number format
        const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
        return phoneRegex.test(phone);
    }
    static sanitizeString(str) {
        return str.trim().replace(/\s+/g, ' ');
    }
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
}
// Date Service
export class DateService {
    static formatDate(date, locale = 'pt-BR') {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(dateObj);
    }
    static formatDateTime(date, locale = 'pt-BR') {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(dateObj);
    }
    static getRelativeTime(date, locale = 'pt-BR') {
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
    static isToday(date) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        return dateObj.toDateString() === today.toDateString();
    }
    static addDays(date, days) {
        const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
        dateObj.setDate(dateObj.getDate() + days);
        return dateObj;
    }
}
// Error Handler Service
export class ErrorService {
    static handleApiError(error) {
        if (typeof error === 'string') {
            return error;
        }
        if (error?.message) {
            return error.message;
        }
        if (error?.error) {
            return error.error;
        }
        return 'Ocorreu um erro inesperado';
    }
    static logError(error, context) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(`[${context || 'Error'}]:`, error);
        }
        // In production, you might want to send to an error tracking service
        // like Sentry, LogRocket, etc.
    }
}
// All services are exported above
//# sourceMappingURL=index.js.map