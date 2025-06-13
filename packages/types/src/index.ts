// Fituno Types Package
// Shared TypeScript types for the Fituno monorepo

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  measurement_system: 'metric' | 'imperial';
  terms_accepted_at?: string;
  terms_version?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends User {
  type: 'trainer' | 'client';
}

// Trainer Types
export interface Trainer extends Profile {
  type: 'trainer';
  subscription_status: 'free' | 'pro' | 'expired';
  subscription_id?: string;
  subscription_updated_at?: string;
  max_clients: number;
}

// Client Types
export interface Client extends Profile {
  type: 'client';
  current_trainer_id?: string;
  status: 'pending' | 'active' | 'inactive';
  latest_anamnesis_id?: string;
}

// Exercise Types
export type ExerciseType =
  | 'strength'
  | 'isometric'
  | 'plyometric'
  | 'cardio_steady'
  | 'cardio_interval'
  | 'mobility'
  | 'circuit';

export interface Exercise {
  id: string;
  name: string;
  name_translations?: Record<string, string>;
  description?: string;
  description_translations?: Record<string, string>;
  type: ExerciseType;
  muscle_group: string;
  sub_muscle_group?: string;
  equipment: string[];
  animation_url?: string;
  created_at: string;
  updated_at: string;
}

// Workout Types
export interface WorkoutPlan {
  id: string;
  trainer_id: string;
  client_id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  notes?: string;
  equipment_checklist: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  plan_id: string;
  day_index: number; // 0 = domingo, 1 = segunda, etc.
  name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  order_index: number;
  group_id?: string; // Para supersets/circuitos
  sets: number;
  reps_min?: number;
  reps_max?: number;
  load?: number;
  duration_sec?: number;
  rest_sec?: number;
  tempo?: string; // Ex: "3-0-2-0"
  rpe?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Exercise Log Types
export interface ExerciseLog {
  id: string;
  workout_exercise_id: string;
  client_id: string;
  set_number: number;
  reps_done?: number;
  load_done?: number;
  duration_sec?: number;
  completed: boolean;
  notes?: string;
  synced: boolean;
  performed_at: string;
  created_at: string;
}

// Message Types
export interface Message {
  id: string;
  client_id: string;
  trainer_id: string;
  sender_id: string;
  content: string;
  exercise_id?: string;
  read_at?: string;
  created_at: string;
}

// Anamnesis Types
export interface AnamnesisTemplate {
  id: string;
  trainer_id: string;
  name: string;
  is_default: boolean;
  questions: AnamnesisQuestion[];
  created_at: string;
  updated_at: string;
}

export interface AnamnesisQuestion {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  text: string;
  options?: string[];
  required?: boolean;
}

export interface AnamnesisResponse {
  id: string;
  client_id: string;
  trainer_id: string;
  template_id: string;
  answers: AnamnesisAnswer[];
  created_at: string;
}

export interface AnamnesisAnswer {
  question_id: string;
  answer: string | number | boolean | string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  type: 'trainer' | 'client';
}

// Common utility types
export type Status = 'pending' | 'in-progress' | 'done' | 'cancelled' | 'deferred';
export type Priority = 'low' | 'medium' | 'high';
