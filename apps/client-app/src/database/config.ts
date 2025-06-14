export const DATABASE_NAME = 'fituno.db';
export const DATABASE_VERSION = 1;

// Table schemas
export const TABLES = {
  // User data cache
  USER_PROFILE: 'user_profile',

  // Workout data for offline access
  WORKOUTS: 'workouts',
  WORKOUT_EXERCISES: 'workout_exercises',
  WORKOUT_SESSIONS: 'workout_sessions',
  EXERCISE_SETS: 'exercise_sets',

  // Exercise library cache
  EXERCISES: 'exercises',
  EXERCISE_CATEGORIES: 'exercise_categories',

  // Progress tracking
  PROGRESS_PHOTOS: 'progress_photos',
  BODY_MEASUREMENTS: 'body_measurements',

  // Sync queue for offline operations
  SYNC_QUEUE: 'sync_queue',

  // App settings
  APP_SETTINGS: 'app_settings',
} as const;

// SQL statements for table creation
export const CREATE_TABLES = {
  USER_PROFILE: `
    CREATE TABLE IF NOT EXISTS ${TABLES.USER_PROFILE} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      trainer_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT
    );
  `,

  WORKOUTS: `
    CREATE TABLE IF NOT EXISTS ${TABLES.WORKOUTS} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      trainer_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      scheduled_date TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT
    );
  `,

  WORKOUT_EXERCISES: `
    CREATE TABLE IF NOT EXISTS ${TABLES.WORKOUT_EXERCISES} (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      reps TEXT,
      weight TEXT,
      duration TEXT,
      rest_time INTEGER,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES ${TABLES.WORKOUTS} (id) ON DELETE CASCADE
    );
  `,

  WORKOUT_SESSIONS: `
    CREATE TABLE IF NOT EXISTS ${TABLES.WORKOUT_SESSIONS} (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      status TEXT DEFAULT 'in_progress',
      notes TEXT,
      rating INTEGER,
      synced_at TEXT,
      FOREIGN KEY (workout_id) REFERENCES ${TABLES.WORKOUTS} (id)
    );
  `,

  EXERCISE_SETS: `
    CREATE TABLE IF NOT EXISTS ${TABLES.EXERCISE_SETS} (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      workout_exercise_id TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      reps INTEGER,
      weight REAL,
      duration INTEGER,
      completed BOOLEAN DEFAULT FALSE,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES ${TABLES.WORKOUT_SESSIONS} (id) ON DELETE CASCADE,
      FOREIGN KEY (workout_exercise_id) REFERENCES ${TABLES.WORKOUT_EXERCISES} (id)
    );
  `,

  EXERCISES: `
    CREATE TABLE IF NOT EXISTS ${TABLES.EXERCISES} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category_id TEXT,
      muscle_groups TEXT,
      equipment TEXT,
      difficulty_level TEXT,
      instructions TEXT,
      animation_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT
    );
  `,

  EXERCISE_CATEGORIES: `
    CREATE TABLE IF NOT EXISTS ${TABLES.EXERCISE_CATEGORIES} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      created_at TEXT NOT NULL,
      synced_at TEXT
    );
  `,

  PROGRESS_PHOTOS: `
    CREATE TABLE IF NOT EXISTS ${TABLES.PROGRESS_PHOTOS} (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      local_path TEXT,
      photo_type TEXT,
      taken_at TEXT NOT NULL,
      notes TEXT,
      synced_at TEXT
    );
  `,

  BODY_MEASUREMENTS: `
    CREATE TABLE IF NOT EXISTS ${TABLES.BODY_MEASUREMENTS} (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      measurement_type TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      measured_at TEXT NOT NULL,
      notes TEXT,
      synced_at TEXT
    );
  `,

  SYNC_QUEUE: `
    CREATE TABLE IF NOT EXISTS ${TABLES.SYNC_QUEUE} (
      id TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      retry_count INTEGER DEFAULT 0,
      last_error TEXT
    );
  `,

  APP_SETTINGS: `
    CREATE TABLE IF NOT EXISTS ${TABLES.APP_SETTINGS} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `,
} as const;
