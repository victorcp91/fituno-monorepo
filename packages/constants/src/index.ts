// Fituno Constants Package
// Shared constants for the Fituno monorepo

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

// User Types
export const USER_TYPES = {
  TRAINER: 'trainer',
  CLIENT: 'client',
} as const;

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  FREE: 'free',
  PRO: 'pro',
  EXPIRED: 'expired',
} as const;

// Client Status
export const CLIENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Exercise Types
export const EXERCISE_TYPES = {
  STRENGTH: 'strength',
  ISOMETRIC: 'isometric',
  PLYOMETRIC: 'plyometric',
  CARDIO_STEADY: 'cardio_steady',
  CARDIO_INTERVAL: 'cardio_interval',
  MOBILITY: 'mobility',
  CIRCUIT: 'circuit',
} as const;

// Workout Plan Status
export const WORKOUT_PLAN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Measurement Systems
export const MEASUREMENT_SYSTEMS = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
} as const;

// Languages
export const LANGUAGES = {
  PT_BR: 'pt-BR',
  EN_US: 'en-US',
  ES_ES: 'es-ES',
} as const;

// Timezones (principais do Brasil)
export const TIMEZONES = {
  SAO_PAULO: 'America/Sao_Paulo',
  MANAUS: 'America/Manaus',
  FORTALEZA: 'America/Fortaleza',
  RECIFE: 'America/Recife',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Question Types for Anamnesis
export const QUESTION_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  BOOLEAN: 'boolean',
} as const;

// Muscle Groups
export const MUSCLE_GROUPS = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  ARMS: 'arms',
  LEGS: 'legs',
  CORE: 'core',
  CARDIO: 'cardio',
  FULL_BODY: 'full_body',
} as const;

// Equipment Types
export const EQUIPMENT_TYPES = {
  BODYWEIGHT: 'bodyweight',
  DUMBBELLS: 'dumbbells',
  BARBELL: 'barbell',
  RESISTANCE_BANDS: 'resistance_bands',
  KETTLEBELL: 'kettlebell',
  CABLE_MACHINE: 'cable_machine',
  SMITH_MACHINE: 'smith_machine',
  CARDIO_MACHINE: 'cardio_machine',
  SUSPENSION_TRAINER: 'suspension_trainer',
  MEDICINE_BALL: 'medicine_ball',
  FOAM_ROLLER: 'foam_roller',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  WORKOUT_NAME_MAX_LENGTH: 100,
  EXERCISE_NAME_MAX_LENGTH: 100,
  NOTES_MAX_LENGTH: 1000,
  MAX_SETS: 20,
  MAX_REPS: 999,
  MAX_LOAD_KG: 1000,
  MAX_DURATION_SEC: 7200, // 2 hours
  MAX_REST_SEC: 1800, // 30 minutes
} as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUT_PLANS: 'workout_plans',
  EXERCISES: 'exercises',
  CLIENTS: 'clients',
  MESSAGES: 'messages',
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// HTTP Status Codes
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

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Recurso não encontrado',
  VALIDATION_ERROR: 'Erro de validação',
  INTERNAL_ERROR: 'Erro interno do servidor',
  NETWORK_ERROR: 'Erro de conexão',
  TIMEOUT_ERROR: 'Tempo limite excedido',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Criado com sucesso',
  UPDATED: 'Atualizado com sucesso',
  DELETED: 'Removido com sucesso',
  SAVED: 'Salvo com sucesso',
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY_DATE: 'DD/MM/YYYY',
  DISPLAY_DATETIME: 'DD/MM/YYYY HH:mm',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fituno_auth_token',
  USER_PREFERENCES: 'fituno_user_preferences',
  WORKOUT_DRAFT: 'fituno_workout_draft',
  OFFLINE_DATA: 'fituno_offline_data',
} as const;
