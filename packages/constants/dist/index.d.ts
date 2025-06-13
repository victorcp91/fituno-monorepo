export declare const API_CONFIG: {
    readonly BASE_URL: string;
    readonly TIMEOUT: 30000;
    readonly RETRY_ATTEMPTS: 3;
};
export declare const SUPABASE_CONFIG: {
    readonly URL: string;
    readonly ANON_KEY: string;
};
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
export declare const MEASUREMENT_SYSTEMS: {
    readonly METRIC: "METRIC";
    readonly IMPERIAL: "IMPERIAL";
};
export declare const SUPPORTED_LANGUAGES: {
    readonly PT_BR: "pt-BR";
    readonly EN_US: "en-US";
    readonly ES_ES: "es-ES";
};
export declare const SUPPORTED_TIMEZONES: {
    readonly SAO_PAULO: "America/Sao_Paulo";
    readonly NEW_YORK: "America/New_York";
    readonly LONDON: "Europe/London";
    readonly MADRID: "Europe/Madrid";
};
export declare const BILLING_PERIOD: {
    readonly MONTHLY: "MONTHLY";
    readonly YEARLY: "YEARLY";
};
export declare const SUBSCRIPTION_PLANS: {
    readonly FREE: {
        readonly name: "Free";
        readonly max_clients: 2;
        readonly price_monthly_cents: 0;
        readonly price_yearly_cents: 0;
    };
    readonly PRO: {
        readonly name: "PRO";
        readonly max_clients: -1;
        readonly price_monthly_cents: 4900;
        readonly price_yearly_cents: 49000;
    };
};
export declare const SUPPORTED_CURRENCIES: {
    readonly BRL: "BRL";
    readonly USD: "USD";
    readonly EUR: "EUR";
};
export declare const VALIDATION_RULES: {
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly PASSWORD_MAX_LENGTH: 128;
    readonly NAME_MIN_LENGTH: 2;
    readonly NAME_MAX_LENGTH: 255;
    readonly EMAIL_MAX_LENGTH: 255;
    readonly WORKOUT_NAME_MAX_LENGTH: 255;
    readonly EXERCISE_NAME_MAX_LENGTH: 255;
    readonly NOTES_MAX_LENGTH: 2000;
    readonly DESCRIPTION_MAX_LENGTH: 1000;
    readonly MAX_SETS: 50;
    readonly MAX_REPS: 999;
    readonly MAX_LOAD_KG: 2000;
    readonly MAX_DURATION_SECONDS: 7200;
    readonly MAX_REST_SECONDS: 1800;
    readonly MAX_CLIENTS_FREE: 2;
    readonly MIN_RPE: 1;
    readonly MAX_RPE: 10;
    readonly INVITATION_EXPIRES_DAYS: 7;
};
export declare const FILE_UPLOAD: {
    readonly MAX_SIZE_MB: 10;
    readonly MAX_SIZE_BYTES: number;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly ALLOWED_VIDEO_TYPES: readonly ["video/mp4", "video/webm", "video/quicktime"];
    readonly PROGRESS_PHOTOS_BUCKET: "progress-photos";
    readonly EXERCISE_ANIMATIONS_BUCKET: "exercise-animations";
    readonly AVATARS_BUCKET: "avatars";
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const CACHE_KEYS: {
    readonly USER_PROFILE: "user_profile";
    readonly WORKOUT_TEMPLATES: "workout_templates";
    readonly EXERCISES: "exercises";
    readonly CLIENTS: "clients";
    readonly CONVERSATIONS: "conversations";
    readonly PROGRESS_RECORDS: "progress_records";
    readonly SUBSCRIPTION: "subscription";
};
export declare const CACHE_TTL: {
    readonly SHORT: 300;
    readonly MEDIUM: 1800;
    readonly LONG: 3600;
    readonly VERY_LONG: 86400;
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const ERROR_MESSAGES: {
    readonly PT_BR: {
        readonly UNAUTHORIZED: "Não autorizado";
        readonly FORBIDDEN: "Acesso negado";
        readonly NOT_FOUND: "Recurso não encontrado";
        readonly VALIDATION_ERROR: "Erro de validação";
        readonly INTERNAL_ERROR: "Erro interno do servidor";
        readonly NETWORK_ERROR: "Erro de conexão";
        readonly TIMEOUT_ERROR: "Tempo limite excedido";
        readonly CLIENT_LIMIT_REACHED: "Limite de clientes atingido";
        readonly INVITATION_EXPIRED: "Convite expirado";
        readonly SUBSCRIPTION_REQUIRED: "Assinatura necessária";
    };
    readonly EN_US: {
        readonly UNAUTHORIZED: "Unauthorized";
        readonly FORBIDDEN: "Access denied";
        readonly NOT_FOUND: "Resource not found";
        readonly VALIDATION_ERROR: "Validation error";
        readonly INTERNAL_ERROR: "Internal server error";
        readonly NETWORK_ERROR: "Network error";
        readonly TIMEOUT_ERROR: "Request timeout";
        readonly CLIENT_LIMIT_REACHED: "Client limit reached";
        readonly INVITATION_EXPIRED: "Invitation expired";
        readonly SUBSCRIPTION_REQUIRED: "Subscription required";
    };
    readonly ES_ES: {
        readonly UNAUTHORIZED: "No autorizado";
        readonly FORBIDDEN: "Acceso denegado";
        readonly NOT_FOUND: "Recurso no encontrado";
        readonly VALIDATION_ERROR: "Error de validación";
        readonly INTERNAL_ERROR: "Error interno del servidor";
        readonly NETWORK_ERROR: "Error de conexión";
        readonly TIMEOUT_ERROR: "Tiempo límite excedido";
        readonly CLIENT_LIMIT_REACHED: "Límite de clientes alcanzado";
        readonly INVITATION_EXPIRED: "Invitación expirada";
        readonly SUBSCRIPTION_REQUIRED: "Suscripción requerida";
    };
};
export declare const SUCCESS_MESSAGES: {
    readonly PT_BR: {
        readonly CREATED: "Criado com sucesso";
        readonly UPDATED: "Atualizado com sucesso";
        readonly DELETED: "Removido com sucesso";
        readonly SAVED: "Salvo com sucesso";
        readonly SENT: "Enviado com sucesso";
        readonly COMPLETED: "Concluído com sucesso";
        readonly INVITED: "Convite enviado com sucesso";
        readonly ACCEPTED: "Aceito com sucesso";
    };
    readonly EN_US: {
        readonly CREATED: "Created successfully";
        readonly UPDATED: "Updated successfully";
        readonly DELETED: "Deleted successfully";
        readonly SAVED: "Saved successfully";
        readonly SENT: "Sent successfully";
        readonly COMPLETED: "Completed successfully";
        readonly INVITED: "Invitation sent successfully";
        readonly ACCEPTED: "Accepted successfully";
    };
    readonly ES_ES: {
        readonly CREATED: "Creado exitosamente";
        readonly UPDATED: "Actualizado exitosamente";
        readonly DELETED: "Eliminado exitosamente";
        readonly SAVED: "Guardado exitosamente";
        readonly SENT: "Enviado exitosamente";
        readonly COMPLETED: "Completado exitosamente";
        readonly INVITED: "Invitación enviada exitosamente";
        readonly ACCEPTED: "Aceptado exitosamente";
    };
};
export declare const FITNESS_CONSTANTS: {
    readonly RPE_TO_PERCENTAGE: {
        readonly 6: 60;
        readonly 7: 70;
        readonly 8: 80;
        readonly 9: 90;
        readonly 10: 100;
    };
    readonly RECOMMENDED_REST: {
        readonly STRENGTH: 180;
        readonly CARDIO_STEADY: 60;
        readonly CARDIO_INTERVAL: 120;
        readonly MOBILITY: 30;
        readonly CIRCUIT: 60;
        readonly ISOMETRIC: 120;
        readonly PLYOMETRIC: 180;
    };
    readonly BMI_CATEGORIES: {
        readonly UNDERWEIGHT: {
            readonly min: 0;
            readonly max: 18.5;
        };
        readonly NORMAL: {
            readonly min: 18.5;
            readonly max: 25;
        };
        readonly OVERWEIGHT: {
            readonly min: 25;
            readonly max: 30;
        };
        readonly OBESE: {
            readonly min: 30;
            readonly max: 999;
        };
    };
};
export declare const ANIMATION_DURATION: {
    readonly FAST: 150;
    readonly NORMAL: 300;
    readonly SLOW: 500;
};
export declare const BREAKPOINTS: {
    readonly SM: 640;
    readonly MD: 768;
    readonly LG: 1024;
    readonly XL: 1280;
    readonly '2XL': 1536;
};
export declare const DAYS_OF_WEEK: {
    readonly SUNDAY: 0;
    readonly MONDAY: 1;
    readonly TUESDAY: 2;
    readonly WEDNESDAY: 3;
    readonly THURSDAY: 4;
    readonly FRIDAY: 5;
    readonly SATURDAY: 6;
};
export declare const DAY_NAMES: {
    readonly PT_BR: readonly ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    readonly EN_US: readonly ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    readonly ES_ES: readonly ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
};
export declare const MONTH_NAMES: {
    readonly PT_BR: readonly ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    readonly EN_US: readonly ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    readonly ES_ES: readonly ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
};
export declare const REALTIME_CHANNELS: {
    readonly MESSAGES: "messages";
    readonly WORKOUTS: "workouts";
    readonly PROGRESS: "progress";
};
export declare const FEATURE_FLAGS: {
    readonly ENABLE_CHAT: true;
    readonly ENABLE_PROGRESS_PHOTOS: true;
    readonly ENABLE_EXERCISE_VIDEOS: true;
    readonly ENABLE_OFFLINE_MODE: true;
    readonly ENABLE_SUBSCRIPTION: true;
    readonly ENABLE_MULTIPLE_LANGUAGES: true;
};
export declare const DEFAULT_VALUES: {
    readonly LANGUAGE: "pt-BR";
    readonly TIMEZONE: "America/Sao_Paulo";
    readonly MEASUREMENT_SYSTEM: "METRIC";
    readonly REST_SECONDS: 60;
    readonly SETS: 3;
    readonly REPS: 12;
    readonly WORKOUT_DURATION_MINUTES: 60;
    readonly MAX_CLIENTS_FREE: 2;
};
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
//# sourceMappingURL=index.d.ts.map