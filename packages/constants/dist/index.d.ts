export declare const API_CONFIG: {
    readonly BASE_URL: string;
    readonly TIMEOUT: 30000;
    readonly RETRY_ATTEMPTS: 3;
};
export declare const SUPABASE_CONFIG: {
    readonly URL: string;
    readonly ANON_KEY: string;
    readonly SERVICE_ROLE_KEY: string;
};
export declare const AUTH_CONFIG: {
    readonly SESSION_TIMEOUT: number;
    readonly REFRESH_THRESHOLD: number;
    readonly OAUTH_PROVIDERS: {
        readonly GOOGLE: {
            readonly enabled: true;
            readonly scopes: "openid email profile";
        };
        readonly FACEBOOK: {
            readonly enabled: true;
            readonly scopes: "email";
        };
    };
    readonly EMAIL_VERIFICATION: {
        readonly required: true;
        readonly resendCooldown: 60000;
        readonly maxResendAttempts: 3;
    };
    readonly PASSWORD_REQUIREMENTS: {
        readonly minLength: 8;
        readonly requireUppercase: true;
        readonly requireLowercase: true;
        readonly requireNumbers: true;
        readonly requireSpecialChars: false;
    };
    readonly JWT: {
        readonly algorithm: "HS256";
        readonly issuer: "fituno";
        readonly audience: "fituno-users";
    };
    readonly REDIRECT_URLS: {
        readonly signIn: "/dashboard";
        readonly signUp: "/welcome";
        readonly signOut: "/login";
        readonly passwordReset: "/auth/reset-password";
        readonly emailVerification: "/auth/verify-email";
        readonly googleCallback: "/auth/callback/google";
        readonly facebookCallback: "/auth/callback/facebook";
    };
    readonly RATE_LIMITS: {
        readonly loginAttempts: 5;
        readonly signupAttempts: 3;
        readonly passwordResetAttempts: 3;
        readonly cooldownPeriod: number;
    };
};
export declare const USER_ROLE: {
    readonly TRAINER: "TRAINER";
    readonly CLIENT: "CLIENT";
};
export declare const USER_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly PENDING_VERIFICATION: "PENDING_VERIFICATION";
    readonly SUSPENDED: "SUSPENDED";
    readonly DELETED: "DELETED";
};
export declare const SUBSCRIPTION_STATUS: {
    readonly FREE: "FREE";
    readonly PRO: "PRO";
    readonly EXPIRED: "EXPIRED";
};
export declare const CLIENT_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly INVITED: "INVITED";
};
export declare const INVITATION_STATUS: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly EXPIRED: "EXPIRED";
    readonly REVOKED: "REVOKED";
};
export declare const EXERCISE_TYPE: {
    readonly STRENGTH: "STRENGTH";
    readonly CARDIO: "CARDIO";
    readonly FLEXIBILITY: "FLEXIBILITY";
    readonly ISOMETRIC: "ISOMETRIC";
    readonly PLYOMETRIC: "PLYOMETRIC";
    readonly CIRCUIT: "CIRCUIT";
};
export declare const WORKOUT_STATUS: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export declare const WORKOUT_SESSION_STATUS: {
    readonly SCHEDULED: "SCHEDULED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly SKIPPED: "SKIPPED";
};
export declare const SUPPORTED_LOCALES: {
    readonly 'pt-BR': "Português (Brasil)";
    readonly 'en-US': "English (US)";
    readonly 'es-ES': "Español (España)";
};
export declare const DEFAULT_LOCALE: "pt-BR";
export declare const MEASUREMENT_SYSTEM: {
    readonly METRIC: "METRIC";
    readonly IMPERIAL: "IMPERIAL";
};
export declare const FITNESS_CONSTANTS: {
    readonly BRZYCKI_COEFFICIENT: 36;
    readonly EPLEY_COEFFICIENT: 30;
    readonly BMI_CATEGORIES: {
        readonly UNDERWEIGHT: {
            readonly min: 0;
            readonly max: 18.5;
        };
        readonly NORMAL: {
            readonly min: 18.5;
            readonly max: 24.9;
        };
        readonly OVERWEIGHT: {
            readonly min: 25;
            readonly max: 29.9;
        };
        readonly OBESE: {
            readonly min: 30;
            readonly max: 50;
        };
    };
    readonly DEFAULT_REST_TIMES: {
        readonly STRENGTH: 180;
        readonly CARDIO: 60;
        readonly FLEXIBILITY: 30;
        readonly ISOMETRIC: 120;
        readonly PLYOMETRIC: 90;
        readonly CIRCUIT: 60;
    };
};
export declare const VALIDATION_RULES: {
    readonly EMAIL_REGEX: RegExp;
    readonly PHONE_REGEX: RegExp;
    readonly NAME_MIN_LENGTH: 2;
    readonly NAME_MAX_LENGTH: 100;
    readonly MESSAGE_MAX_LENGTH: 1000;
    readonly EXERCISE_NAME_MAX_LENGTH: 100;
    readonly WORKOUT_NAME_MAX_LENGTH: 100;
};
export declare const UPLOAD_CONFIG: {
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly ALLOWED_VIDEO_TYPES: readonly ["video/mp4", "video/quicktime"];
    readonly ALLOWED_AUDIO_TYPES: readonly ["audio/mpeg", "audio/wav"];
    readonly BUCKETS: {
        readonly AVATARS: "avatars";
        readonly EXERCISES: "exercises";
        readonly PROGRESS_PHOTOS: "progress-photos";
        readonly CHAT_MEDIA: "chat-media";
    };
};
export declare const FEATURE_FLAGS: {
    readonly ENABLE_BIOMETRIC_AUTH: true;
    readonly ENABLE_OFFLINE_MODE: true;
    readonly ENABLE_PUSH_NOTIFICATIONS: true;
    readonly ENABLE_CHAT: true;
    readonly ENABLE_VIDEO_CALLS: false;
    readonly ENABLE_NUTRITION_TRACKING: false;
    readonly ENABLE_SOCIAL_FEATURES: false;
};
export declare const DEFAULT_VALUES: {
    readonly TRAINER_MAX_CLIENTS_FREE: 2;
    readonly TRAINER_MAX_CLIENTS_PRO: 999;
    readonly INVITATION_EXPIRY_DAYS: 7;
    readonly SESSION_TIMEOUT_MINUTES: 30;
    readonly CHAT_MESSAGE_BATCH_SIZE: 50;
    readonly WORKOUT_HISTORY_DAYS: 90;
};
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
export type ClientStatus = (typeof CLIENT_STATUS)[keyof typeof CLIENT_STATUS];
export type InvitationStatus = (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];
export type ExerciseType = (typeof EXERCISE_TYPE)[keyof typeof EXERCISE_TYPE];
export type WorkoutStatus = (typeof WORKOUT_STATUS)[keyof typeof WORKOUT_STATUS];
export type WorkoutSessionStatus = (typeof WORKOUT_SESSION_STATUS)[keyof typeof WORKOUT_SESSION_STATUS];
export type MeasurementSystem = (typeof MEASUREMENT_SYSTEM)[keyof typeof MEASUREMENT_SYSTEM];
export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;
//# sourceMappingURL=index.d.ts.map