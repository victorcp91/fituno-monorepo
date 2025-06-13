// Fituno Types Package
// Comprehensive TypeScript types and Zod schemas matching our Supabase database

import { z } from 'zod';

// ========================================
// DATABASE ENUMS (matching our custom types)
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

export const MESSAGE_TYPE = {
  TEXT: 'TEXT',
  EXERCISE: 'EXERCISE',
  WORKOUT: 'WORKOUT',
  SYSTEM: 'SYSTEM',
} as const;

export const QUESTION_TYPE = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  MULTISELECT: 'MULTISELECT',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
} as const;

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

// ========================================
// ZOD SCHEMAS
// ========================================

// Base schemas
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const dateTimeSchema = z.string().datetime();
export const urlSchema = z.string().url().optional();

// Enum schemas
export const userRoleSchema = z.nativeEnum(USER_ROLE);
export const subscriptionStatusSchema = z.nativeEnum(SUBSCRIPTION_STATUS);
export const clientStatusSchema = z.nativeEnum(CLIENT_STATUS);
export const invitationStatusSchema = z.nativeEnum(INVITATION_STATUS);
export const workoutStatusSchema = z.nativeEnum(WORKOUT_STATUS);
export const setTypeSchema = z.nativeEnum(SET_TYPE);
export const messageTypeSchema = z.nativeEnum(MESSAGE_TYPE);
export const questionTypeSchema = z.nativeEnum(QUESTION_TYPE);
export const exerciseTypeSchema = z.nativeEnum(EXERCISE_TYPE);
export const muscleGroupSchema = z.nativeEnum(MUSCLE_GROUP);
export const equipmentSchema = z.nativeEnum(EQUIPMENT);

// ========================================
// TRAINER SCHEMAS
// ========================================

export const trainerSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  full_name: z.string().min(1).max(255),
  avatar_url: urlSchema,
  timezone: z.string().default('America/Sao_Paulo'),
  language: z.string().default('pt-BR'),
  subscription_status: subscriptionStatusSchema.default('FREE'),
  subscription_expires_at: dateTimeSchema.optional(),
  stripe_customer_id: z.string().optional(),
  max_clients: z.number().int().positive().default(2),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// CLIENT SCHEMAS
// ========================================

export const clientSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  full_name: z.string().min(1).max(255),
  avatar_url: urlSchema,
  timezone: z.string().default('America/Sao_Paulo'),
  language: z.string().default('pt-BR'),
  current_trainer_id: uuidSchema.optional(),
  status: clientStatusSchema.default('PENDING'),
  latest_anamnesis_id: uuidSchema.optional(),
  measurement_system: z.enum(['METRIC', 'IMPERIAL']).default('METRIC'),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const clientInvitationSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  email: emailSchema,
  token: z.string().uuid(),
  status: invitationStatusSchema.default('PENDING'),
  expires_at: dateTimeSchema,
  accepted_at: dateTimeSchema.optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// EXERCISE SCHEMAS
// ========================================

export const exerciseSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(255),
  name_translations: z.record(z.string(), z.string()).optional(),
  description: z.string().optional(),
  description_translations: z.record(z.string(), z.string()).optional(),
  type: exerciseTypeSchema,
  muscle_group: muscleGroupSchema,
  sub_muscle_group: z.string().max(100).optional(),
  equipment: z.array(equipmentSchema),
  animation_url: urlSchema,
  thumbnail_url: urlSchema,
  instructions: z.array(z.string()).optional(),
  instructions_translations: z.record(z.string(), z.array(z.string())).optional(),
  is_verified: z.boolean().default(false),
  created_by: uuidSchema.optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// WORKOUT SCHEMAS
// ========================================

export const workoutTemplateSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  estimated_duration_minutes: z.number().int().positive().optional(),
  equipment_needed: z.array(equipmentSchema).default([]),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const workoutTemplateExerciseSchema = z.object({
  id: uuidSchema,
  template_id: uuidSchema,
  exercise_id: uuidSchema,
  order_index: z.number().int().min(0),
  superset_group: z.string().max(50).optional(),
  sets: z.number().int().positive().default(1),
  reps_min: z.number().int().positive().optional(),
  reps_max: z.number().int().positive().optional(),
  duration_seconds: z.number().int().positive().optional(),
  rest_seconds: z.number().int().min(0).default(60),
  load_kg: z.number().positive().optional(),
  rpe_target: z.number().int().min(1).max(10).optional(),
  tempo: z.string().max(20).optional(),
  notes: z.string().optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const workoutScheduleSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  client_id: uuidSchema,
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  start_date: z.string().date(),
  end_date: z.string().date().optional(),
  is_active: z.boolean().default(true),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const workoutScheduleDaySchema = z.object({
  id: uuidSchema,
  schedule_id: uuidSchema,
  day_of_week: z.number().int().min(0).max(6), // 0=Sunday, 6=Saturday
  template_id: uuidSchema,
  created_at: dateTimeSchema,
});

export const workoutSessionSchema = z.object({
  id: uuidSchema,
  schedule_id: uuidSchema,
  client_id: uuidSchema,
  template_id: uuidSchema,
  scheduled_date: z.string().date(),
  started_at: dateTimeSchema.optional(),
  completed_at: dateTimeSchema.optional(),
  status: workoutStatusSchema.default('PENDING'),
  notes: z.string().optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const workoutSessionExerciseSchema = z.object({
  id: uuidSchema,
  session_id: uuidSchema,
  exercise_id: uuidSchema,
  order_index: z.number().int().min(0),
  superset_group: z.string().max(50).optional(),
  target_sets: z.number().int().positive().default(1),
  target_reps_min: z.number().int().positive().optional(),
  target_reps_max: z.number().int().positive().optional(),
  target_duration_seconds: z.number().int().positive().optional(),
  target_rest_seconds: z.number().int().min(0).default(60),
  target_load_kg: z.number().positive().optional(),
  target_rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const workoutSetSchema = z.object({
  id: uuidSchema,
  session_exercise_id: uuidSchema,
  set_number: z.number().int().positive(),
  type: setTypeSchema.default('WORKING'),
  reps: z.number().int().min(0).optional(),
  load_kg: z.number().min(0).optional(),
  duration_seconds: z.number().int().min(0).optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  rest_seconds: z.number().int().min(0).optional(),
  is_completed: z.boolean().default(false),
  notes: z.string().optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// SUBSCRIPTION SCHEMAS
// ========================================

export const subscriptionPlanSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  max_clients: z.number().int().min(0),
  price_monthly_cents: z.number().int().min(0),
  price_yearly_cents: z.number().int().min(0),
  stripe_price_monthly_id: z.string().optional(),
  stripe_price_yearly_id: z.string().optional(),
  features: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const paymentSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  stripe_payment_intent_id: z.string(),
  amount_cents: z.number().int().positive(),
  currency: z.string().length(3).default('BRL'),
  status: z.string(),
  plan_id: uuidSchema.optional(),
  billing_period: z.enum(['MONTHLY', 'YEARLY']).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const trainerSubscriptionSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  plan_id: uuidSchema,
  stripe_subscription_id: z.string().optional(),
  status: z.string(),
  current_period_start: dateTimeSchema,
  current_period_end: dateTimeSchema,
  canceled_at: dateTimeSchema.optional(),
  ended_at: dateTimeSchema.optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const billingInformationSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  company_name: z.string().max(255).optional(),
  tax_id: z.string().max(50).optional(),
  address_line1: z.string().max(255),
  address_line2: z.string().max(255).optional(),
  city: z.string().max(100),
  state: z.string().max(100),
  postal_code: z.string().max(20),
  country: z.string().length(2).default('BR'),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const webhookEventSchema = z.object({
  id: uuidSchema,
  stripe_event_id: z.string(),
  event_type: z.string(),
  processed: z.boolean().default(false),
  data: z.record(z.string(), z.any()),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// ANAMNESIS SCHEMAS
// ========================================

export const anamnesisTemplateSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
  questions: z.array(z.any()), // Will be detailed in anamnesisQuestionSchema
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const anamnesisQuestionSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  text: z.string().min(1),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  order_index: z.number().int().min(0),
});

export const clientAnamnesisSchema = z.object({
  id: uuidSchema,
  client_id: uuidSchema,
  trainer_id: uuidSchema,
  template_id: uuidSchema,
  answers: z.record(z.string(), z.any()),
  completed_at: dateTimeSchema.optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// PROGRESS SCHEMAS
// ========================================

export const progressRecordSchema = z.object({
  id: uuidSchema,
  client_id: uuidSchema,
  trainer_id: uuidSchema,
  date: z.string().date(),
  weight_kg: z.number().positive().optional(),
  body_fat_percentage: z.number().min(0).max(100).optional(),
  muscle_mass_kg: z.number().positive().optional(),
  measurements: z.record(z.string(), z.number()).optional(),
  photos: z.array(z.string()).default([]),
  notes: z.string().optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const exerciseProgressSchema = z.object({
  id: uuidSchema,
  client_id: uuidSchema,
  exercise_id: uuidSchema,
  date: z.string().date(),
  best_set_reps: z.number().int().min(0).optional(),
  best_set_load_kg: z.number().min(0).optional(),
  best_set_duration_seconds: z.number().int().min(0).optional(),
  estimated_1rm_kg: z.number().positive().optional(),
  volume_kg: z.number().min(0).optional(),
  total_reps: z.number().int().min(0).optional(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

// ========================================
// CHAT SCHEMAS
// ========================================

export const chatConversationSchema = z.object({
  id: uuidSchema,
  trainer_id: uuidSchema,
  client_id: uuidSchema,
  last_message_at: dateTimeSchema.optional(),
  trainer_unread_count: z.number().int().min(0).default(0),
  client_unread_count: z.number().int().min(0).default(0),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const chatMessageSchema = z.object({
  id: uuidSchema,
  conversation_id: uuidSchema,
  sender_id: uuidSchema,
  message_type: messageTypeSchema.default('TEXT'),
  content: z.string().optional(),
  exercise_id: uuidSchema.optional(),
  workout_id: uuidSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  read_at: dateTimeSchema.optional(),
  created_at: dateTimeSchema,
});

// ========================================
// LEGAL SCHEMAS
// ========================================

export const termsAcceptanceSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  terms_version: z.string().min(1),
  accepted_at: dateTimeSchema,
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
});

// ========================================
// FORM SCHEMAS
// ========================================

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(6),
});

export const registerFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  full_name: z.string().min(1).max(255),
  user_type: userRoleSchema,
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'Terms must be accepted',
  }),
});

export const inviteClientFormSchema = z.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = z.object({
  email: emailSchema,
});

export const changePasswordFormSchema = z
  .object({
    current_password: z.string().min(6),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

// ========================================
// API RESPONSE SCHEMAS
// ========================================

export const apiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  }),
});

// ========================================
// TYPE EXPORTS (inferred from Zod schemas)
// ========================================

export type UserRole = z.infer<typeof userRoleSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type ClientStatus = z.infer<typeof clientStatusSchema>;
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;
export type WorkoutStatus = z.infer<typeof workoutStatusSchema>;
export type SetType = z.infer<typeof setTypeSchema>;
export type MessageType = z.infer<typeof messageTypeSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type ExerciseType = z.infer<typeof exerciseTypeSchema>;
export type MuscleGroup = z.infer<typeof muscleGroupSchema>;
export type Equipment = z.infer<typeof equipmentSchema>;

// Database table types
export type Trainer = z.infer<typeof trainerSchema>;
export type Client = z.infer<typeof clientSchema>;
export type ClientInvitation = z.infer<typeof clientInvitationSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutTemplate = z.infer<typeof workoutTemplateSchema>;
export type WorkoutTemplateExercise = z.infer<typeof workoutTemplateExerciseSchema>;
export type WorkoutSchedule = z.infer<typeof workoutScheduleSchema>;
export type WorkoutScheduleDay = z.infer<typeof workoutScheduleDaySchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
export type WorkoutSessionExercise = z.infer<typeof workoutSessionExerciseSchema>;
export type WorkoutSet = z.infer<typeof workoutSetSchema>;
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type TrainerSubscription = z.infer<typeof trainerSubscriptionSchema>;
export type BillingInformation = z.infer<typeof billingInformationSchema>;
export type WebhookEvent = z.infer<typeof webhookEventSchema>;
export type AnamnesisTemplate = z.infer<typeof anamnesisTemplateSchema>;
export type AnamnesisQuestion = z.infer<typeof anamnesisQuestionSchema>;
export type ClientAnamnesis = z.infer<typeof clientAnamnesisSchema>;
export type ProgressRecord = z.infer<typeof progressRecordSchema>;
export type ExerciseProgress = z.infer<typeof exerciseProgressSchema>;
export type ChatConversation = z.infer<typeof chatConversationSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type TermsAcceptance = z.infer<typeof termsAcceptanceSchema>;

// Form types
export type LoginForm = z.infer<typeof loginFormSchema>;
export type RegisterForm = z.infer<typeof registerFormSchema>;
export type InviteClientForm = z.infer<typeof inviteClientFormSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>;

// API types
export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ========================================
// UTILITY TYPES
// ========================================

export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>;

// Database insert/update helpers
export type TrainerInsert = CreateInput<Trainer>;
export type TrainerUpdate = UpdateInput<Trainer>;
export type ClientInsert = CreateInput<Client>;
export type ClientUpdate = UpdateInput<Client>;
export type ExerciseInsert = CreateInput<Exercise>;
export type ExerciseUpdate = UpdateInput<Exercise>;
export type WorkoutTemplateInsert = CreateInput<WorkoutTemplate>;
export type WorkoutTemplateUpdate = UpdateInput<WorkoutTemplate>;

// Common filter types
export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type SortParams = {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

export type FilterParams = PaginationParams & SortParams;

// ========================================
// CONSTANTS
// ========================================

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

export const MAX_PAGINATION_LIMIT = 100;

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US', 'es-ES'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const SUPPORTED_TIMEZONES = [
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Europe/Madrid',
] as const;
export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];

export const MEASUREMENT_SYSTEMS = {
  METRIC: 'METRIC',
  IMPERIAL: 'IMPERIAL',
} as const;
export type MeasurementSystem = keyof typeof MEASUREMENT_SYSTEMS;
