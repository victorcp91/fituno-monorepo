// Fituno Constants Package
// Comprehensive constants matching our database schema

// ========================================
// API & INFRASTRUCTURE CONFIGURATION
// ========================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
} as const;

// ========================================
// AUTHENTICATION CONFIGURATION
// ========================================

export const AUTH_CONFIG = {
  // Session configuration
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry

  // OAuth providers
  OAUTH_PROVIDERS: {
    GOOGLE: {
      enabled: true,
      scopes: 'openid email profile',
    },
    FACEBOOK: {
      enabled: true,
      scopes: 'email',
    },
  },

  // Email verification settings
  EMAIL_VERIFICATION: {
    required: true,
    resendCooldown: 60000, // 1 minute
    maxResendAttempts: 3,
  },

  // Password requirements
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },

  // JWT settings
  JWT: {
    algorithm: 'HS256',
    issuer: 'fituno',
    audience: 'fituno-users',
  },

  // Redirect URLs
  REDIRECT_URLS: {
    signIn: '/dashboard',
    signUp: '/welcome',
    signOut: '/login',
    passwordReset: '/auth/reset-password',
    emailVerification: '/auth/verify-email',

    // OAuth redirects
    googleCallback: '/auth/callback/google',
    facebookCallback: '/auth/callback/facebook',
  },

  // Rate limiting
  RATE_LIMITS: {
    loginAttempts: 5,
    signupAttempts: 3,
    passwordResetAttempts: 3,
    cooldownPeriod: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// ========================================
// USER & AUTH CONSTANTS
// ========================================

export const USER_ROLE = {
  TRAINER: 'TRAINER',
  CLIENT: 'CLIENT',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export const SUBSCRIPTION_STATUS = {
  FREE: 'FREE',
  PRO: 'PRO',
  EXPIRED: 'EXPIRED',
} as const;

export const CLIENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  INVITED: 'INVITED',
} as const;

export const INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
} as const;

// ========================================
// WORKOUT & EXERCISE CONSTANTS
// ========================================

export const EXERCISE_TYPE = {
  STRENGTH: 'STRENGTH',
  CARDIO: 'CARDIO',
  FLEXIBILITY: 'FLEXIBILITY',
  ISOMETRIC: 'ISOMETRIC',
  PLYOMETRIC: 'PLYOMETRIC',
  CIRCUIT: 'CIRCUIT',
} as const;

export const WORKOUT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

export const WORKOUT_SESSION_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
} as const;

// ========================================
// LOCALIZATION
// ========================================

export const SUPPORTED_LOCALES = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'es-ES': 'Español (España)',
} as const;

export const DEFAULT_LOCALE = 'pt-BR' as const;

// ========================================
// MEASUREMENT SYSTEMS
// ========================================

export const MEASUREMENT_SYSTEM = {
  METRIC: 'METRIC',
  IMPERIAL: 'IMPERIAL',
} as const;

// ========================================
// FITNESS CALCULATIONS
// ========================================

export const FITNESS_CONSTANTS = {
  // 1RM formulas coefficients
  BRZYCKI_COEFFICIENT: 36,
  EPLEY_COEFFICIENT: 30,

  // BMI categories
  BMI_CATEGORIES: {
    UNDERWEIGHT: { min: 0, max: 18.5 },
    NORMAL: { min: 18.5, max: 24.9 },
    OVERWEIGHT: { min: 25, max: 29.9 },
    OBESE: { min: 30, max: 50 },
  },

  // Default rest times (in seconds)
  DEFAULT_REST_TIMES: {
    STRENGTH: 180, // 3 minutes
    CARDIO: 60, // 1 minute
    FLEXIBILITY: 30, // 30 seconds
    ISOMETRIC: 120, // 2 minutes
    PLYOMETRIC: 90, // 1.5 minutes
    CIRCUIT: 60, // 1 minute
  },
} as const;

// ========================================
// VALIDATION RULES
// ========================================

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MAX_LENGTH: 1000,
  EXERCISE_NAME_MAX_LENGTH: 100,
  WORKOUT_NAME_MAX_LENGTH: 100,
} as const;

// ========================================
// FILE UPLOAD CONFIGURATION
// ========================================

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav'],

  // Storage buckets
  BUCKETS: {
    AVATARS: 'avatars',
    EXERCISES: 'exercises',
    PROGRESS_PHOTOS: 'progress-photos',
    CHAT_MEDIA: 'chat-media',
  },
} as const;

// ========================================
// FEATURE FLAGS
// ========================================

export const FEATURE_FLAGS = {
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_CHAT: true,
  ENABLE_VIDEO_CALLS: false,
  ENABLE_NUTRITION_TRACKING: false,
  ENABLE_SOCIAL_FEATURES: false,
} as const;

// ========================================
// DEFAULT VALUES
// ========================================

export const DEFAULT_VALUES = {
  TRAINER_MAX_CLIENTS_FREE: 2,
  TRAINER_MAX_CLIENTS_PRO: 999,
  INVITATION_EXPIRY_DAYS: 7,
  SESSION_TIMEOUT_MINUTES: 30,
  CHAT_MESSAGE_BATCH_SIZE: 50,
  WORKOUT_HISTORY_DAYS: 90,
} as const;

// ========================================
// TYPE EXPORTS
// ========================================

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
export type ClientStatus = (typeof CLIENT_STATUS)[keyof typeof CLIENT_STATUS];
export type InvitationStatus = (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];
export type ExerciseType = (typeof EXERCISE_TYPE)[keyof typeof EXERCISE_TYPE];
export type WorkoutStatus = (typeof WORKOUT_STATUS)[keyof typeof WORKOUT_STATUS];
export type WorkoutSessionStatus =
  (typeof WORKOUT_SESSION_STATUS)[keyof typeof WORKOUT_SESSION_STATUS];
export type MeasurementSystem = (typeof MEASUREMENT_SYSTEM)[keyof typeof MEASUREMENT_SYSTEM];
export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;
