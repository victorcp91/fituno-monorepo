import { z } from 'zod';
export declare const USER_ROLE: {
    readonly TRAINER: "TRAINER";
    readonly CLIENT: "CLIENT";
};
export declare const SUBSCRIPTION_STATUS: {
    readonly FREE: "FREE";
    readonly PRO: "PRO";
    readonly EXPIRED: "EXPIRED";
};
export declare const CLIENT_STATUS: {
    readonly PENDING: "PENDING";
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
export declare const INVITATION_STATUS: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export declare const WORKOUT_STATUS: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly SKIPPED: "SKIPPED";
};
export declare const SET_TYPE: {
    readonly WORKING: "WORKING";
    readonly WARMUP: "WARMUP";
    readonly DROP: "DROP";
    readonly FAILURE: "FAILURE";
};
export declare const MESSAGE_TYPE: {
    readonly TEXT: "TEXT";
    readonly EXERCISE: "EXERCISE";
    readonly WORKOUT: "WORKOUT";
    readonly SYSTEM: "SYSTEM";
};
export declare const QUESTION_TYPE: {
    readonly TEXT: "TEXT";
    readonly NUMBER: "NUMBER";
    readonly SELECT: "SELECT";
    readonly MULTISELECT: "MULTISELECT";
    readonly BOOLEAN: "BOOLEAN";
    readonly DATE: "DATE";
};
export declare const EXERCISE_TYPE: {
    readonly STRENGTH: "STRENGTH";
    readonly CARDIO_STEADY: "CARDIO_STEADY";
    readonly CARDIO_INTERVAL: "CARDIO_INTERVAL";
    readonly MOBILITY: "MOBILITY";
    readonly CIRCUIT: "CIRCUIT";
    readonly ISOMETRIC: "ISOMETRIC";
    readonly PLYOMETRIC: "PLYOMETRIC";
};
export declare const MUSCLE_GROUP: {
    readonly CHEST: "CHEST";
    readonly BACK: "BACK";
    readonly SHOULDERS: "SHOULDERS";
    readonly ARMS: "ARMS";
    readonly LEGS: "LEGS";
    readonly GLUTES: "GLUTES";
    readonly CORE: "CORE";
    readonly FULL_BODY: "FULL_BODY";
    readonly CARDIO: "CARDIO";
};
export declare const EQUIPMENT: {
    readonly BODYWEIGHT: "BODYWEIGHT";
    readonly DUMBBELLS: "DUMBBELLS";
    readonly BARBELL: "BARBELL";
    readonly KETTLEBELL: "KETTLEBELL";
    readonly RESISTANCE_BANDS: "RESISTANCE_BANDS";
    readonly CABLE_MACHINE: "CABLE_MACHINE";
    readonly MACHINE: "MACHINE";
    readonly PULL_UP_BAR: "PULL_UP_BAR";
    readonly BENCH: "BENCH";
    readonly STABILITY_BALL: "STABILITY_BALL";
    readonly BOSU_BALL: "BOSU_BALL";
    readonly TRX: "TRX";
    readonly MEDICINE_BALL: "MEDICINE_BALL";
    readonly FOAM_ROLLER: "FOAM_ROLLER";
    readonly YOGA_MAT: "YOGA_MAT";
    readonly CARDIO_MACHINE: "CARDIO_MACHINE";
};
export declare const uuidSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const dateTimeSchema: z.ZodString;
export declare const urlSchema: z.ZodOptional<z.ZodString>;
export declare const userRoleSchema: z.ZodNativeEnum<{
    readonly TRAINER: "TRAINER";
    readonly CLIENT: "CLIENT";
}>;
export declare const subscriptionStatusSchema: z.ZodNativeEnum<{
    readonly FREE: "FREE";
    readonly PRO: "PRO";
    readonly EXPIRED: "EXPIRED";
}>;
export declare const clientStatusSchema: z.ZodNativeEnum<{
    readonly PENDING: "PENDING";
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
}>;
export declare const invitationStatusSchema: z.ZodNativeEnum<{
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
}>;
export declare const workoutStatusSchema: z.ZodNativeEnum<{
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly SKIPPED: "SKIPPED";
}>;
export declare const setTypeSchema: z.ZodNativeEnum<{
    readonly WORKING: "WORKING";
    readonly WARMUP: "WARMUP";
    readonly DROP: "DROP";
    readonly FAILURE: "FAILURE";
}>;
export declare const messageTypeSchema: z.ZodNativeEnum<{
    readonly TEXT: "TEXT";
    readonly EXERCISE: "EXERCISE";
    readonly WORKOUT: "WORKOUT";
    readonly SYSTEM: "SYSTEM";
}>;
export declare const questionTypeSchema: z.ZodNativeEnum<{
    readonly TEXT: "TEXT";
    readonly NUMBER: "NUMBER";
    readonly SELECT: "SELECT";
    readonly MULTISELECT: "MULTISELECT";
    readonly BOOLEAN: "BOOLEAN";
    readonly DATE: "DATE";
}>;
export declare const exerciseTypeSchema: z.ZodNativeEnum<{
    readonly STRENGTH: "STRENGTH";
    readonly CARDIO_STEADY: "CARDIO_STEADY";
    readonly CARDIO_INTERVAL: "CARDIO_INTERVAL";
    readonly MOBILITY: "MOBILITY";
    readonly CIRCUIT: "CIRCUIT";
    readonly ISOMETRIC: "ISOMETRIC";
    readonly PLYOMETRIC: "PLYOMETRIC";
}>;
export declare const muscleGroupSchema: z.ZodNativeEnum<{
    readonly CHEST: "CHEST";
    readonly BACK: "BACK";
    readonly SHOULDERS: "SHOULDERS";
    readonly ARMS: "ARMS";
    readonly LEGS: "LEGS";
    readonly GLUTES: "GLUTES";
    readonly CORE: "CORE";
    readonly FULL_BODY: "FULL_BODY";
    readonly CARDIO: "CARDIO";
}>;
export declare const equipmentSchema: z.ZodNativeEnum<{
    readonly BODYWEIGHT: "BODYWEIGHT";
    readonly DUMBBELLS: "DUMBBELLS";
    readonly BARBELL: "BARBELL";
    readonly KETTLEBELL: "KETTLEBELL";
    readonly RESISTANCE_BANDS: "RESISTANCE_BANDS";
    readonly CABLE_MACHINE: "CABLE_MACHINE";
    readonly MACHINE: "MACHINE";
    readonly PULL_UP_BAR: "PULL_UP_BAR";
    readonly BENCH: "BENCH";
    readonly STABILITY_BALL: "STABILITY_BALL";
    readonly BOSU_BALL: "BOSU_BALL";
    readonly TRX: "TRX";
    readonly MEDICINE_BALL: "MEDICINE_BALL";
    readonly FOAM_ROLLER: "FOAM_ROLLER";
    readonly YOGA_MAT: "YOGA_MAT";
    readonly CARDIO_MACHINE: "CARDIO_MACHINE";
}>;
export declare const trainerSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    full_name: z.ZodString;
    avatar_url: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    language: z.ZodDefault<z.ZodString>;
    subscription_status: z.ZodDefault<z.ZodNativeEnum<{
        readonly FREE: "FREE";
        readonly PRO: "PRO";
        readonly EXPIRED: "EXPIRED";
    }>>;
    subscription_expires_at: z.ZodOptional<z.ZodString>;
    stripe_customer_id: z.ZodOptional<z.ZodString>;
    max_clients: z.ZodDefault<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    full_name: string;
    timezone: string;
    language: string;
    subscription_status: "FREE" | "PRO" | "EXPIRED";
    max_clients: number;
    created_at: string;
    updated_at: string;
    avatar_url?: string | undefined;
    subscription_expires_at?: string | undefined;
    stripe_customer_id?: string | undefined;
}, {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    updated_at: string;
    avatar_url?: string | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    subscription_status?: "FREE" | "PRO" | "EXPIRED" | undefined;
    subscription_expires_at?: string | undefined;
    stripe_customer_id?: string | undefined;
    max_clients?: number | undefined;
}>;
export declare const clientSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    full_name: z.ZodString;
    avatar_url: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    language: z.ZodDefault<z.ZodString>;
    current_trainer_id: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly ACTIVE: "ACTIVE";
        readonly INACTIVE: "INACTIVE";
    }>>;
    latest_anamnesis_id: z.ZodOptional<z.ZodString>;
    measurement_system: z.ZodDefault<z.ZodEnum<["METRIC", "IMPERIAL"]>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    full_name: string;
    timezone: string;
    language: string;
    created_at: string;
    updated_at: string;
    status: "PENDING" | "ACTIVE" | "INACTIVE";
    measurement_system: "METRIC" | "IMPERIAL";
    avatar_url?: string | undefined;
    current_trainer_id?: string | undefined;
    latest_anamnesis_id?: string | undefined;
}, {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    updated_at: string;
    avatar_url?: string | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    status?: "PENDING" | "ACTIVE" | "INACTIVE" | undefined;
    current_trainer_id?: string | undefined;
    latest_anamnesis_id?: string | undefined;
    measurement_system?: "METRIC" | "IMPERIAL" | undefined;
}>;
export declare const clientInvitationSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    email: z.ZodString;
    token: z.ZodString;
    status: z.ZodDefault<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly ACCEPTED: "ACCEPTED";
        readonly EXPIRED: "EXPIRED";
        readonly CANCELLED: "CANCELLED";
    }>>;
    expires_at: z.ZodString;
    accepted_at: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
    status: "EXPIRED" | "PENDING" | "ACCEPTED" | "CANCELLED";
    trainer_id: string;
    token: string;
    expires_at: string;
    accepted_at?: string | undefined;
}, {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    token: string;
    expires_at: string;
    status?: "EXPIRED" | "PENDING" | "ACCEPTED" | "CANCELLED" | undefined;
    accepted_at?: string | undefined;
}>;
export declare const exerciseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    name_translations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    description_translations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    type: z.ZodNativeEnum<{
        readonly STRENGTH: "STRENGTH";
        readonly CARDIO_STEADY: "CARDIO_STEADY";
        readonly CARDIO_INTERVAL: "CARDIO_INTERVAL";
        readonly MOBILITY: "MOBILITY";
        readonly CIRCUIT: "CIRCUIT";
        readonly ISOMETRIC: "ISOMETRIC";
        readonly PLYOMETRIC: "PLYOMETRIC";
    }>;
    muscle_group: z.ZodNativeEnum<{
        readonly CHEST: "CHEST";
        readonly BACK: "BACK";
        readonly SHOULDERS: "SHOULDERS";
        readonly ARMS: "ARMS";
        readonly LEGS: "LEGS";
        readonly GLUTES: "GLUTES";
        readonly CORE: "CORE";
        readonly FULL_BODY: "FULL_BODY";
        readonly CARDIO: "CARDIO";
    }>;
    sub_muscle_group: z.ZodOptional<z.ZodString>;
    equipment: z.ZodArray<z.ZodNativeEnum<{
        readonly BODYWEIGHT: "BODYWEIGHT";
        readonly DUMBBELLS: "DUMBBELLS";
        readonly BARBELL: "BARBELL";
        readonly KETTLEBELL: "KETTLEBELL";
        readonly RESISTANCE_BANDS: "RESISTANCE_BANDS";
        readonly CABLE_MACHINE: "CABLE_MACHINE";
        readonly MACHINE: "MACHINE";
        readonly PULL_UP_BAR: "PULL_UP_BAR";
        readonly BENCH: "BENCH";
        readonly STABILITY_BALL: "STABILITY_BALL";
        readonly BOSU_BALL: "BOSU_BALL";
        readonly TRX: "TRX";
        readonly MEDICINE_BALL: "MEDICINE_BALL";
        readonly FOAM_ROLLER: "FOAM_ROLLER";
        readonly YOGA_MAT: "YOGA_MAT";
        readonly CARDIO_MACHINE: "CARDIO_MACHINE";
    }>, "many">;
    animation_url: z.ZodOptional<z.ZodString>;
    thumbnail_url: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    instructions_translations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
    is_verified: z.ZodDefault<z.ZodBoolean>;
    created_by: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    type: "STRENGTH" | "CARDIO_STEADY" | "CARDIO_INTERVAL" | "MOBILITY" | "CIRCUIT" | "ISOMETRIC" | "PLYOMETRIC";
    name: string;
    muscle_group: "CHEST" | "BACK" | "SHOULDERS" | "ARMS" | "LEGS" | "GLUTES" | "CORE" | "FULL_BODY" | "CARDIO";
    equipment: ("BODYWEIGHT" | "DUMBBELLS" | "BARBELL" | "KETTLEBELL" | "RESISTANCE_BANDS" | "CABLE_MACHINE" | "MACHINE" | "PULL_UP_BAR" | "BENCH" | "STABILITY_BALL" | "BOSU_BALL" | "TRX" | "MEDICINE_BALL" | "FOAM_ROLLER" | "YOGA_MAT" | "CARDIO_MACHINE")[];
    is_verified: boolean;
    name_translations?: Record<string, string> | undefined;
    description?: string | undefined;
    description_translations?: Record<string, string> | undefined;
    sub_muscle_group?: string | undefined;
    animation_url?: string | undefined;
    thumbnail_url?: string | undefined;
    instructions?: string[] | undefined;
    instructions_translations?: Record<string, string[]> | undefined;
    created_by?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    type: "STRENGTH" | "CARDIO_STEADY" | "CARDIO_INTERVAL" | "MOBILITY" | "CIRCUIT" | "ISOMETRIC" | "PLYOMETRIC";
    name: string;
    muscle_group: "CHEST" | "BACK" | "SHOULDERS" | "ARMS" | "LEGS" | "GLUTES" | "CORE" | "FULL_BODY" | "CARDIO";
    equipment: ("BODYWEIGHT" | "DUMBBELLS" | "BARBELL" | "KETTLEBELL" | "RESISTANCE_BANDS" | "CABLE_MACHINE" | "MACHINE" | "PULL_UP_BAR" | "BENCH" | "STABILITY_BALL" | "BOSU_BALL" | "TRX" | "MEDICINE_BALL" | "FOAM_ROLLER" | "YOGA_MAT" | "CARDIO_MACHINE")[];
    name_translations?: Record<string, string> | undefined;
    description?: string | undefined;
    description_translations?: Record<string, string> | undefined;
    sub_muscle_group?: string | undefined;
    animation_url?: string | undefined;
    thumbnail_url?: string | undefined;
    instructions?: string[] | undefined;
    instructions_translations?: Record<string, string[]> | undefined;
    is_verified?: boolean | undefined;
    created_by?: string | undefined;
}>;
export declare const workoutTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    estimated_duration_minutes: z.ZodOptional<z.ZodNumber>;
    equipment_needed: z.ZodDefault<z.ZodArray<z.ZodNativeEnum<{
        readonly BODYWEIGHT: "BODYWEIGHT";
        readonly DUMBBELLS: "DUMBBELLS";
        readonly BARBELL: "BARBELL";
        readonly KETTLEBELL: "KETTLEBELL";
        readonly RESISTANCE_BANDS: "RESISTANCE_BANDS";
        readonly CABLE_MACHINE: "CABLE_MACHINE";
        readonly MACHINE: "MACHINE";
        readonly PULL_UP_BAR: "PULL_UP_BAR";
        readonly BENCH: "BENCH";
        readonly STABILITY_BALL: "STABILITY_BALL";
        readonly BOSU_BALL: "BOSU_BALL";
        readonly TRX: "TRX";
        readonly MEDICINE_BALL: "MEDICINE_BALL";
        readonly FOAM_ROLLER: "FOAM_ROLLER";
        readonly YOGA_MAT: "YOGA_MAT";
        readonly CARDIO_MACHINE: "CARDIO_MACHINE";
    }>, "many">>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    name: string;
    equipment_needed: ("BODYWEIGHT" | "DUMBBELLS" | "BARBELL" | "KETTLEBELL" | "RESISTANCE_BANDS" | "CABLE_MACHINE" | "MACHINE" | "PULL_UP_BAR" | "BENCH" | "STABILITY_BALL" | "BOSU_BALL" | "TRX" | "MEDICINE_BALL" | "FOAM_ROLLER" | "YOGA_MAT" | "CARDIO_MACHINE")[];
    description?: string | undefined;
    estimated_duration_minutes?: number | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    name: string;
    description?: string | undefined;
    estimated_duration_minutes?: number | undefined;
    equipment_needed?: ("BODYWEIGHT" | "DUMBBELLS" | "BARBELL" | "KETTLEBELL" | "RESISTANCE_BANDS" | "CABLE_MACHINE" | "MACHINE" | "PULL_UP_BAR" | "BENCH" | "STABILITY_BALL" | "BOSU_BALL" | "TRX" | "MEDICINE_BALL" | "FOAM_ROLLER" | "YOGA_MAT" | "CARDIO_MACHINE")[] | undefined;
}>;
export declare const workoutTemplateExerciseSchema: z.ZodObject<{
    id: z.ZodString;
    template_id: z.ZodString;
    exercise_id: z.ZodString;
    order_index: z.ZodNumber;
    superset_group: z.ZodOptional<z.ZodString>;
    sets: z.ZodDefault<z.ZodNumber>;
    reps_min: z.ZodOptional<z.ZodNumber>;
    reps_max: z.ZodOptional<z.ZodNumber>;
    duration_seconds: z.ZodOptional<z.ZodNumber>;
    rest_seconds: z.ZodDefault<z.ZodNumber>;
    load_kg: z.ZodOptional<z.ZodNumber>;
    rpe_target: z.ZodOptional<z.ZodNumber>;
    tempo: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    template_id: string;
    exercise_id: string;
    order_index: number;
    sets: number;
    rest_seconds: number;
    superset_group?: string | undefined;
    reps_min?: number | undefined;
    reps_max?: number | undefined;
    duration_seconds?: number | undefined;
    load_kg?: number | undefined;
    rpe_target?: number | undefined;
    tempo?: string | undefined;
    notes?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    template_id: string;
    exercise_id: string;
    order_index: number;
    superset_group?: string | undefined;
    sets?: number | undefined;
    reps_min?: number | undefined;
    reps_max?: number | undefined;
    duration_seconds?: number | undefined;
    rest_seconds?: number | undefined;
    load_kg?: number | undefined;
    rpe_target?: number | undefined;
    tempo?: string | undefined;
    notes?: string | undefined;
}>;
export declare const workoutScheduleSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    client_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    start_date: z.ZodString;
    end_date: z.ZodOptional<z.ZodString>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    name: string;
    client_id: string;
    start_date: string;
    is_active: boolean;
    description?: string | undefined;
    end_date?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    name: string;
    client_id: string;
    start_date: string;
    description?: string | undefined;
    end_date?: string | undefined;
    is_active?: boolean | undefined;
}>;
export declare const workoutScheduleDaySchema: z.ZodObject<{
    id: z.ZodString;
    schedule_id: z.ZodString;
    day_of_week: z.ZodNumber;
    template_id: z.ZodString;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    template_id: string;
    schedule_id: string;
    day_of_week: number;
}, {
    id: string;
    created_at: string;
    template_id: string;
    schedule_id: string;
    day_of_week: number;
}>;
export declare const workoutSessionSchema: z.ZodObject<{
    id: z.ZodString;
    schedule_id: z.ZodString;
    client_id: z.ZodString;
    template_id: z.ZodString;
    scheduled_date: z.ZodString;
    started_at: z.ZodOptional<z.ZodString>;
    completed_at: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly COMPLETED: "COMPLETED";
        readonly SKIPPED: "SKIPPED";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
    template_id: string;
    client_id: string;
    schedule_id: string;
    scheduled_date: string;
    notes?: string | undefined;
    started_at?: string | undefined;
    completed_at?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    template_id: string;
    client_id: string;
    schedule_id: string;
    scheduled_date: string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED" | undefined;
    notes?: string | undefined;
    started_at?: string | undefined;
    completed_at?: string | undefined;
}>;
export declare const workoutSessionExerciseSchema: z.ZodObject<{
    id: z.ZodString;
    session_id: z.ZodString;
    exercise_id: z.ZodString;
    order_index: z.ZodNumber;
    superset_group: z.ZodOptional<z.ZodString>;
    target_sets: z.ZodDefault<z.ZodNumber>;
    target_reps_min: z.ZodOptional<z.ZodNumber>;
    target_reps_max: z.ZodOptional<z.ZodNumber>;
    target_duration_seconds: z.ZodOptional<z.ZodNumber>;
    target_rest_seconds: z.ZodDefault<z.ZodNumber>;
    target_load_kg: z.ZodOptional<z.ZodNumber>;
    target_rpe: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    exercise_id: string;
    order_index: number;
    session_id: string;
    target_sets: number;
    target_rest_seconds: number;
    superset_group?: string | undefined;
    notes?: string | undefined;
    target_reps_min?: number | undefined;
    target_reps_max?: number | undefined;
    target_duration_seconds?: number | undefined;
    target_load_kg?: number | undefined;
    target_rpe?: number | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    exercise_id: string;
    order_index: number;
    session_id: string;
    superset_group?: string | undefined;
    notes?: string | undefined;
    target_sets?: number | undefined;
    target_reps_min?: number | undefined;
    target_reps_max?: number | undefined;
    target_duration_seconds?: number | undefined;
    target_rest_seconds?: number | undefined;
    target_load_kg?: number | undefined;
    target_rpe?: number | undefined;
}>;
export declare const workoutSetSchema: z.ZodObject<{
    id: z.ZodString;
    session_exercise_id: z.ZodString;
    set_number: z.ZodNumber;
    type: z.ZodDefault<z.ZodNativeEnum<{
        readonly WORKING: "WORKING";
        readonly WARMUP: "WARMUP";
        readonly DROP: "DROP";
        readonly FAILURE: "FAILURE";
    }>>;
    reps: z.ZodOptional<z.ZodNumber>;
    load_kg: z.ZodOptional<z.ZodNumber>;
    duration_seconds: z.ZodOptional<z.ZodNumber>;
    rpe: z.ZodOptional<z.ZodNumber>;
    rest_seconds: z.ZodOptional<z.ZodNumber>;
    is_completed: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    type: "WORKING" | "WARMUP" | "DROP" | "FAILURE";
    session_exercise_id: string;
    set_number: number;
    is_completed: boolean;
    duration_seconds?: number | undefined;
    rest_seconds?: number | undefined;
    load_kg?: number | undefined;
    notes?: string | undefined;
    reps?: number | undefined;
    rpe?: number | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    session_exercise_id: string;
    set_number: number;
    type?: "WORKING" | "WARMUP" | "DROP" | "FAILURE" | undefined;
    duration_seconds?: number | undefined;
    rest_seconds?: number | undefined;
    load_kg?: number | undefined;
    notes?: string | undefined;
    reps?: number | undefined;
    rpe?: number | undefined;
    is_completed?: boolean | undefined;
}>;
export declare const subscriptionPlanSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    max_clients: z.ZodNumber;
    price_monthly_cents: z.ZodNumber;
    price_yearly_cents: z.ZodNumber;
    stripe_price_monthly_id: z.ZodOptional<z.ZodString>;
    stripe_price_yearly_id: z.ZodOptional<z.ZodString>;
    features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    max_clients: number;
    created_at: string;
    updated_at: string;
    name: string;
    is_active: boolean;
    price_monthly_cents: number;
    price_yearly_cents: number;
    features: string[];
    description?: string | undefined;
    stripe_price_monthly_id?: string | undefined;
    stripe_price_yearly_id?: string | undefined;
}, {
    id: string;
    max_clients: number;
    created_at: string;
    updated_at: string;
    name: string;
    price_monthly_cents: number;
    price_yearly_cents: number;
    description?: string | undefined;
    is_active?: boolean | undefined;
    stripe_price_monthly_id?: string | undefined;
    stripe_price_yearly_id?: string | undefined;
    features?: string[] | undefined;
}>;
export declare const paymentSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    stripe_payment_intent_id: z.ZodString;
    amount_cents: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    status: z.ZodString;
    plan_id: z.ZodOptional<z.ZodString>;
    billing_period: z.ZodOptional<z.ZodEnum<["MONTHLY", "YEARLY"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    trainer_id: string;
    stripe_payment_intent_id: string;
    amount_cents: number;
    currency: string;
    plan_id?: string | undefined;
    billing_period?: "MONTHLY" | "YEARLY" | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    trainer_id: string;
    stripe_payment_intent_id: string;
    amount_cents: number;
    currency?: string | undefined;
    plan_id?: string | undefined;
    billing_period?: "MONTHLY" | "YEARLY" | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export declare const trainerSubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    plan_id: z.ZodString;
    stripe_subscription_id: z.ZodOptional<z.ZodString>;
    status: z.ZodString;
    current_period_start: z.ZodString;
    current_period_end: z.ZodString;
    canceled_at: z.ZodOptional<z.ZodString>;
    ended_at: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    trainer_id: string;
    plan_id: string;
    current_period_start: string;
    current_period_end: string;
    stripe_subscription_id?: string | undefined;
    canceled_at?: string | undefined;
    ended_at?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    trainer_id: string;
    plan_id: string;
    current_period_start: string;
    current_period_end: string;
    stripe_subscription_id?: string | undefined;
    canceled_at?: string | undefined;
    ended_at?: string | undefined;
}>;
export declare const billingInformationSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    company_name: z.ZodOptional<z.ZodString>;
    tax_id: z.ZodOptional<z.ZodString>;
    address_line1: z.ZodString;
    address_line2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postal_code: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    company_name?: string | undefined;
    tax_id?: string | undefined;
    address_line2?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    company_name?: string | undefined;
    tax_id?: string | undefined;
    address_line2?: string | undefined;
    country?: string | undefined;
}>;
export declare const webhookEventSchema: z.ZodObject<{
    id: z.ZodString;
    stripe_event_id: z.ZodString;
    event_type: z.ZodString;
    processed: z.ZodDefault<z.ZodBoolean>;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    stripe_event_id: string;
    event_type: string;
    processed: boolean;
    data: Record<string, any>;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    stripe_event_id: string;
    event_type: string;
    data: Record<string, any>;
    processed?: boolean | undefined;
}>;
export declare const anamnesisTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    is_default: z.ZodDefault<z.ZodBoolean>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    questions: z.ZodArray<z.ZodAny, "many">;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    name: string;
    is_active: boolean;
    is_default: boolean;
    questions: any[];
    description?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    name: string;
    questions: any[];
    description?: string | undefined;
    is_active?: boolean | undefined;
    is_default?: boolean | undefined;
}>;
export declare const anamnesisQuestionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<{
        readonly TEXT: "TEXT";
        readonly NUMBER: "NUMBER";
        readonly SELECT: "SELECT";
        readonly MULTISELECT: "MULTISELECT";
        readonly BOOLEAN: "BOOLEAN";
        readonly DATE: "DATE";
    }>;
    text: z.ZodString;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    required: z.ZodDefault<z.ZodBoolean>;
    order_index: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "TEXT" | "NUMBER" | "SELECT" | "MULTISELECT" | "BOOLEAN" | "DATE";
    order_index: number;
    text: string;
    required: boolean;
    options?: string[] | undefined;
}, {
    id: string;
    type: "TEXT" | "NUMBER" | "SELECT" | "MULTISELECT" | "BOOLEAN" | "DATE";
    order_index: number;
    text: string;
    options?: string[] | undefined;
    required?: boolean | undefined;
}>;
export declare const clientAnamnesisSchema: z.ZodObject<{
    id: z.ZodString;
    client_id: z.ZodString;
    trainer_id: z.ZodString;
    template_id: z.ZodString;
    answers: z.ZodRecord<z.ZodString, z.ZodAny>;
    completed_at: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    template_id: string;
    client_id: string;
    answers: Record<string, any>;
    completed_at?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    template_id: string;
    client_id: string;
    answers: Record<string, any>;
    completed_at?: string | undefined;
}>;
export declare const progressRecordSchema: z.ZodObject<{
    id: z.ZodString;
    client_id: z.ZodString;
    trainer_id: z.ZodString;
    date: z.ZodString;
    weight_kg: z.ZodOptional<z.ZodNumber>;
    body_fat_percentage: z.ZodOptional<z.ZodNumber>;
    muscle_mass_kg: z.ZodOptional<z.ZodNumber>;
    measurements: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    photos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    date: string;
    client_id: string;
    photos: string[];
    notes?: string | undefined;
    weight_kg?: number | undefined;
    body_fat_percentage?: number | undefined;
    muscle_mass_kg?: number | undefined;
    measurements?: Record<string, number> | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    date: string;
    client_id: string;
    notes?: string | undefined;
    weight_kg?: number | undefined;
    body_fat_percentage?: number | undefined;
    muscle_mass_kg?: number | undefined;
    measurements?: Record<string, number> | undefined;
    photos?: string[] | undefined;
}>;
export declare const exerciseProgressSchema: z.ZodObject<{
    id: z.ZodString;
    client_id: z.ZodString;
    exercise_id: z.ZodString;
    date: z.ZodString;
    best_set_reps: z.ZodOptional<z.ZodNumber>;
    best_set_load_kg: z.ZodOptional<z.ZodNumber>;
    best_set_duration_seconds: z.ZodOptional<z.ZodNumber>;
    estimated_1rm_kg: z.ZodOptional<z.ZodNumber>;
    volume_kg: z.ZodOptional<z.ZodNumber>;
    total_reps: z.ZodOptional<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    date: string;
    exercise_id: string;
    client_id: string;
    best_set_reps?: number | undefined;
    best_set_load_kg?: number | undefined;
    best_set_duration_seconds?: number | undefined;
    estimated_1rm_kg?: number | undefined;
    volume_kg?: number | undefined;
    total_reps?: number | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    date: string;
    exercise_id: string;
    client_id: string;
    best_set_reps?: number | undefined;
    best_set_load_kg?: number | undefined;
    best_set_duration_seconds?: number | undefined;
    estimated_1rm_kg?: number | undefined;
    volume_kg?: number | undefined;
    total_reps?: number | undefined;
}>;
export declare const chatConversationSchema: z.ZodObject<{
    id: z.ZodString;
    trainer_id: z.ZodString;
    client_id: z.ZodString;
    last_message_at: z.ZodOptional<z.ZodString>;
    trainer_unread_count: z.ZodDefault<z.ZodNumber>;
    client_unread_count: z.ZodDefault<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    client_id: string;
    trainer_unread_count: number;
    client_unread_count: number;
    last_message_at?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    client_id: string;
    last_message_at?: string | undefined;
    trainer_unread_count?: number | undefined;
    client_unread_count?: number | undefined;
}>;
export declare const chatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    conversation_id: z.ZodString;
    sender_id: z.ZodString;
    message_type: z.ZodDefault<z.ZodNativeEnum<{
        readonly TEXT: "TEXT";
        readonly EXERCISE: "EXERCISE";
        readonly WORKOUT: "WORKOUT";
        readonly SYSTEM: "SYSTEM";
    }>>;
    content: z.ZodOptional<z.ZodString>;
    exercise_id: z.ZodOptional<z.ZodString>;
    workout_id: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    read_at: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    conversation_id: string;
    sender_id: string;
    message_type: "TEXT" | "EXERCISE" | "WORKOUT" | "SYSTEM";
    exercise_id?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    workout_id?: string | undefined;
    read_at?: string | undefined;
}, {
    id: string;
    created_at: string;
    conversation_id: string;
    sender_id: string;
    exercise_id?: string | undefined;
    metadata?: Record<string, any> | undefined;
    message_type?: "TEXT" | "EXERCISE" | "WORKOUT" | "SYSTEM" | undefined;
    content?: string | undefined;
    workout_id?: string | undefined;
    read_at?: string | undefined;
}>;
export declare const termsAcceptanceSchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodString;
    terms_version: z.ZodString;
    accepted_at: z.ZodString;
    ip_address: z.ZodOptional<z.ZodString>;
    user_agent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    accepted_at: string;
    user_id: string;
    terms_version: string;
    ip_address?: string | undefined;
    user_agent?: string | undefined;
}, {
    id: string;
    accepted_at: string;
    user_id: string;
    terms_version: string;
    ip_address?: string | undefined;
    user_agent?: string | undefined;
}>;
export declare const loginFormSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerFormSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    full_name: z.ZodString;
    user_type: z.ZodNativeEnum<{
        readonly TRAINER: "TRAINER";
        readonly CLIENT: "CLIENT";
    }>;
    terms_accepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    full_name: string;
    password: string;
    user_type: "TRAINER" | "CLIENT";
    terms_accepted: boolean;
}, {
    email: string;
    full_name: string;
    password: string;
    user_type: "TRAINER" | "CLIENT";
    terms_accepted: boolean;
}>;
export declare const inviteClientFormSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordFormSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const changePasswordFormSchema: z.ZodEffects<z.ZodObject<{
    current_password: z.ZodString;
    new_password: z.ZodString;
    confirm_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    current_password: string;
    new_password: string;
    confirm_password: string;
}, {
    current_password: string;
    new_password: string;
    confirm_password: string;
}>, {
    current_password: string;
    new_password: string;
    confirm_password: string;
}, {
    current_password: string;
    new_password: string;
    confirm_password: string;
}>;
export declare const apiResponseSchema: z.ZodObject<{
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message?: string | undefined;
    data?: any;
    error?: string | undefined;
}, {
    message?: string | undefined;
    data?: any;
    error?: string | undefined;
}>;
export declare const paginatedResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodAny, "many">;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}, {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
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
export type LoginForm = z.infer<typeof loginFormSchema>;
export type RegisterForm = z.infer<typeof registerFormSchema>;
export type InviteClientForm = z.infer<typeof inviteClientFormSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>;
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
export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>;
export type TrainerInsert = CreateInput<Trainer>;
export type TrainerUpdate = UpdateInput<Trainer>;
export type ClientInsert = CreateInput<Client>;
export type ClientUpdate = UpdateInput<Client>;
export type ExerciseInsert = CreateInput<Exercise>;
export type ExerciseUpdate = UpdateInput<Exercise>;
export type WorkoutTemplateInsert = CreateInput<WorkoutTemplate>;
export type WorkoutTemplateUpdate = UpdateInput<WorkoutTemplate>;
export type PaginationParams = {
    page?: number;
    limit?: number;
};
export type SortParams = {
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
};
export type FilterParams = PaginationParams & SortParams;
export declare const DEFAULT_PAGINATION: {
    readonly page: 1;
    readonly limit: 20;
};
export declare const MAX_PAGINATION_LIMIT = 100;
export declare const SUPPORTED_LANGUAGES: readonly ["pt-BR", "en-US", "es-ES"];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export declare const SUPPORTED_TIMEZONES: readonly ["America/Sao_Paulo", "America/New_York", "Europe/London", "Europe/Madrid"];
export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];
export declare const MEASUREMENT_SYSTEMS: {
    readonly METRIC: "METRIC";
    readonly IMPERIAL: "IMPERIAL";
};
export type MeasurementSystem = keyof typeof MEASUREMENT_SYSTEMS;
//# sourceMappingURL=index.d.ts.map