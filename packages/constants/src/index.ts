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
} as const;

// ========================================
// USER & AUTHENTICATION CONSTANTS
// ========================================

export const USER_ROLE = {
  TRAINER: 'TRAINER',
  CLIENT: 'CLIENT',
} as const;

export const SUBSCRIPTION_STATUS = {
  FREE: 'FREE',
  PRO: 'PRO',
  EXPIRED: 'EXPIRED',
} as const;

export const CLIENT_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;

// ========================================
// WORKOUT & EXERCISE CONSTANTS
// ========================================

export const EXERCISE_TYPE = {
  STRENGTH: 'STRENGTH',
  CARDIO_STEADY: 'CARDIO_STEADY',
  CARDIO_INTERVAL: 'CARDIO_INTERVAL',
  MOBILITY: 'MOBILITY',
  CIRCUIT: 'CIRCUIT',
  ISOMETRIC: 'ISOMETRIC',
  PLYOMETRIC: 'PLYOMETRIC',
} as const;

export const MUSCLE_GROUP = {
  CHEST: 'CHEST',
  BACK: 'BACK',
  SHOULDERS: 'SHOULDERS',
  ARMS: 'ARMS',
  LEGS: 'LEGS',
  GLUTES: 'GLUTES',
  CORE: 'CORE',
  FULL_BODY: 'FULL_BODY',
  CARDIO: 'CARDIO',
} as const;

export const EQUIPMENT = {
  BODYWEIGHT: 'BODYWEIGHT',
  DUMBBELLS: 'DUMBBELLS',
  BARBELL: 'BARBELL',
  KETTLEBELL: 'KETTLEBELL',
  RESISTANCE_BANDS: 'RESISTANCE_BANDS',
  CABLE_MACHINE: 'CABLE_MACHINE',
  MACHINE: 'MACHINE',
  PULL_UP_BAR: 'PULL_UP_BAR',
  BENCH: 'BENCH',
  STABILITY_BALL: 'STABILITY_BALL',
  BOSU_BALL: 'BOSU_BALL',
  TRX: 'TRX',
  MEDICINE_BALL: 'MEDICINE_BALL',
  FOAM_ROLLER: 'FOAM_ROLLER',
  YOGA_MAT: 'YOGA_MAT',
  CARDIO_MACHINE: 'CARDIO_MACHINE',
} as const;

export const WORKOUT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
} as const;

export const SET_TYPE = {
  WORKING: 'WORKING',
  WARMUP: 'WARMUP',
  DROP: 'DROP',
  FAILURE: 'FAILURE',
} as const;

// ========================================
// COMMUNICATION CONSTANTS
// ========================================

export const MESSAGE_TYPE = {
  TEXT: 'TEXT',
  EXERCISE: 'EXERCISE',
  WORKOUT: 'WORKOUT',
  SYSTEM: 'SYSTEM',
} as const;

// ========================================
// ANAMNESIS CONSTANTS
// ========================================

export const QUESTION_TYPE = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  MULTISELECT: 'MULTISELECT',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
} as const;

// ========================================
// MEASUREMENT & LOCALIZATION
// ========================================

export const MEASUREMENT_SYSTEMS = {
  METRIC: 'METRIC',
  IMPERIAL: 'IMPERIAL',
} as const;

export const SUPPORTED_LANGUAGES = {
  PT_BR: 'pt-BR',
  EN_US: 'en-US',
  ES_ES: 'es-ES',
} as const;

export const SUPPORTED_TIMEZONES = {
  SAO_PAULO: 'America/Sao_Paulo',
  NEW_YORK: 'America/New_York',
  LONDON: 'Europe/London',
  MADRID: 'Europe/Madrid',
} as const;

// ========================================
// SUBSCRIPTION & BILLING
// ========================================

export const BILLING_PERIOD = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    max_clients: 2,
    price_monthly_cents: 0,
    price_yearly_cents: 0,
  },
  PRO: {
    name: 'PRO',
    max_clients: -1, // Unlimited
    price_monthly_cents: 4900, // R$ 49,00
    price_yearly_cents: 49000, // R$ 490,00 (2 months free)
  },
} as const;

export const SUPPORTED_CURRENCIES = {
  BRL: 'BRL',
  USD: 'USD',
  EUR: 'EUR',
} as const;

// ========================================
// VALIDATION RULES
// ========================================

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
  EMAIL_MAX_LENGTH: 255,
  WORKOUT_NAME_MAX_LENGTH: 255,
  EXERCISE_NAME_MAX_LENGTH: 255,
  NOTES_MAX_LENGTH: 2000,
  DESCRIPTION_MAX_LENGTH: 1000,
  MAX_SETS: 50,
  MAX_REPS: 999,
  MAX_LOAD_KG: 2000,
  MAX_DURATION_SECONDS: 7200, // 2 hours
  MAX_REST_SECONDS: 1800, // 30 minutes
  MAX_CLIENTS_FREE: 2,
  MIN_RPE: 1,
  MAX_RPE: 10,
  INVITATION_EXPIRES_DAYS: 7,
} as const;

// ========================================
// FILE UPLOAD CONFIGURATION
// ========================================

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  PROGRESS_PHOTOS_BUCKET: 'progress-photos',
  EXERCISE_ANIMATIONS_BUCKET: 'exercise-animations',
  AVATARS_BUCKET: 'avatars',
} as const;

// ========================================
// PAGINATION & CACHING
// ========================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUT_TEMPLATES: 'workout_templates',
  EXERCISES: 'exercises',
  CLIENTS: 'clients',
  CONVERSATIONS: 'conversations',
  PROGRESS_RECORDS: 'progress_records',
  SUBSCRIPTION: 'subscription',
} as const;

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// ========================================
// HTTP & API CONSTANTS
// ========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ========================================
// LOCALIZED MESSAGES
// ========================================

export const ERROR_MESSAGES = {
  PT_BR: {
    UNAUTHORIZED: 'Não autorizado',
    FORBIDDEN: 'Acesso negado',
    NOT_FOUND: 'Recurso não encontrado',
    VALIDATION_ERROR: 'Erro de validação',
    INTERNAL_ERROR: 'Erro interno do servidor',
    NETWORK_ERROR: 'Erro de conexão',
    TIMEOUT_ERROR: 'Tempo limite excedido',
    CLIENT_LIMIT_REACHED: 'Limite de clientes atingido',
    INVITATION_EXPIRED: 'Convite expirado',
    SUBSCRIPTION_REQUIRED: 'Assinatura necessária',
  },
  EN_US: {
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
    NETWORK_ERROR: 'Network error',
    TIMEOUT_ERROR: 'Request timeout',
    CLIENT_LIMIT_REACHED: 'Client limit reached',
    INVITATION_EXPIRED: 'Invitation expired',
    SUBSCRIPTION_REQUIRED: 'Subscription required',
  },
  ES_ES: {
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION_ERROR: 'Error de validación',
    INTERNAL_ERROR: 'Error interno del servidor',
    NETWORK_ERROR: 'Error de conexión',
    TIMEOUT_ERROR: 'Tiempo límite excedido',
    CLIENT_LIMIT_REACHED: 'Límite de clientes alcanzado',
    INVITATION_EXPIRED: 'Invitación expirada',
    SUBSCRIPTION_REQUIRED: 'Suscripción requerida',
  },
} as const;

export const SUCCESS_MESSAGES = {
  PT_BR: {
    CREATED: 'Criado com sucesso',
    UPDATED: 'Atualizado com sucesso',
    DELETED: 'Removido com sucesso',
    SAVED: 'Salvo com sucesso',
    SENT: 'Enviado com sucesso',
    COMPLETED: 'Concluído com sucesso',
    INVITED: 'Convite enviado com sucesso',
    ACCEPTED: 'Aceito com sucesso',
  },
  EN_US: {
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    SAVED: 'Saved successfully',
    SENT: 'Sent successfully',
    COMPLETED: 'Completed successfully',
    INVITED: 'Invitation sent successfully',
    ACCEPTED: 'Accepted successfully',
  },
  ES_ES: {
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado exitosamente',
    DELETED: 'Eliminado exitosamente',
    SAVED: 'Guardado exitosamente',
    SENT: 'Enviado exitosamente',
    COMPLETED: 'Completado exitosamente',
    INVITED: 'Invitación enviada exitosamente',
    ACCEPTED: 'Aceptado exitosamente',
  },
} as const;

// ========================================
// FITNESS CALCULATION CONSTANTS
// ========================================

export const FITNESS_CONSTANTS = {
  // RPE to percentage mapping (approximate)
  RPE_TO_PERCENTAGE: {
    6: 60,
    7: 70,
    8: 80,
    9: 90,
    10: 100,
  },
  // Rest time recommendations by exercise type (seconds)
  RECOMMENDED_REST: {
    STRENGTH: 180, // 3 minutes
    CARDIO_STEADY: 60, // 1 minute
    CARDIO_INTERVAL: 120, // 2 minutes
    MOBILITY: 30, // 30 seconds
    CIRCUIT: 60, // 1 minute
    ISOMETRIC: 120, // 2 minutes
    PLYOMETRIC: 180, // 3 minutes
  },
  // BMI categories
  BMI_CATEGORIES: {
    UNDERWEIGHT: { min: 0, max: 18.5 },
    NORMAL: { min: 18.5, max: 25 },
    OVERWEIGHT: { min: 25, max: 30 },
    OBESE: { min: 30, max: 999 },
  },
} as const;

// ========================================
// ANIMATION & UI CONSTANTS
// ========================================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ========================================
// WORKOUT CONSTANTS
// ========================================

export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export const DAY_NAMES = {
  PT_BR: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  EN_US: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ES_ES: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
} as const;

export const MONTH_NAMES = {
  PT_BR: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  EN_US: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ES_ES: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
} as const;

// ========================================
// REALTIME SUBSCRIPTIONS
// ========================================

export const REALTIME_CHANNELS = {
  MESSAGES: 'messages',
  WORKOUTS: 'workouts',
  PROGRESS: 'progress',
} as const;

// ========================================
// FEATURE FLAGS
// ========================================

export const FEATURE_FLAGS = {
  ENABLE_CHAT: true,
  ENABLE_PROGRESS_PHOTOS: true,
  ENABLE_EXERCISE_VIDEOS: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_SUBSCRIPTION: true,
  ENABLE_MULTIPLE_LANGUAGES: true,
} as const;

// ========================================
// DEFAULT VALUES
// ========================================

export const DEFAULT_VALUES = {
  LANGUAGE: 'pt-BR',
  TIMEZONE: 'America/Sao_Paulo',
  MEASUREMENT_SYSTEM: 'METRIC',
  REST_SECONDS: 60,
  SETS: 3,
  REPS: 12,
  WORKOUT_DURATION_MINUTES: 60,
  MAX_CLIENTS_FREE: 2,
} as const;

// Type exports for convenience
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
export type ClientStatus = (typeof CLIENT_STATUS)[keyof typeof CLIENT_STATUS];
export type ExerciseType = (typeof EXERCISE_TYPE)[keyof typeof EXERCISE_TYPE];
export type MuscleGroup = (typeof MUSCLE_GROUP)[keyof typeof MUSCLE_GROUP];
export type Equipment = (typeof EQUIPMENT)[keyof typeof EQUIPMENT];
export type WorkoutStatus = (typeof WORKOUT_STATUS)[keyof typeof WORKOUT_STATUS];
export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
export type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];
export type MeasurementSystem = (typeof MEASUREMENT_SYSTEMS)[keyof typeof MEASUREMENT_SYSTEMS];
