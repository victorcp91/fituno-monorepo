export const API_CONFIG = {
  version: '1.0.0',
  prefix: '/api/v1',
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://fituno.com', 'https://app.fituno.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  auth: {
    jwtSecret: (() => {
      if (!process.env.JWT_SECRET) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('JWT_SECRET environment variable is required in production');
        }

        return 'insecure-development-secret-change-in-production';
      }
      return process.env.JWT_SECRET;
    })(),
    jwtExpiresIn: '24h',
    refreshTokenExpiresIn: '7d',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  database: {
    maxConnections: 10,
    connectionTimeoutMs: 30000,
  },
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
    uploadPath: '/uploads',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
