import { QueryClient } from '@tanstack/react-query';

// Create a query client with optimized caching strategies
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Background refetch strategies
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // Don't refetch on window focus for development
      ...(process.env.NODE_ENV === 'development' && {
        refetchOnWindowFocus: false,
      }),
    },
    mutations: {
      // Retry mutations on network errors
      retry: (failureCount, error: any) => {
        // Don't retry on client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Authentication
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },

  // Clients
  clients: {
    all: ['clients'] as const,
    list: (filters?: Record<string, any>) => ['clients', 'list', filters] as const,
    detail: (id: string) => ['clients', 'detail', id] as const,
    metrics: (id: string) => ['clients', 'metrics', id] as const,
    anamnesis: (id: string) => ['clients', 'anamnesis', id] as const,
  },

  // Workouts
  workouts: {
    all: ['workouts'] as const,
    list: (filters?: Record<string, any>) => ['workouts', 'list', filters] as const,
    detail: (id: string) => ['workouts', 'detail', id] as const,
    templates: ['workouts', 'templates'] as const,
    history: (clientId?: string) => ['workouts', 'history', clientId] as const,
  },

  // Programs
  programs: {
    all: ['programs'] as const,
    list: (filters?: Record<string, any>) => ['programs', 'list', filters] as const,
    detail: (id: string) => ['programs', 'detail', id] as const,
    client: (clientId: string) => ['programs', 'client', clientId] as const,
  },

  // Analytics
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
    revenue: (period?: string) => ['analytics', 'revenue', period] as const,
    clients: (period?: string) => ['analytics', 'clients', period] as const,
    workouts: (period?: string) => ['analytics', 'workouts', period] as const,
  },

  // Settings
  settings: {
    profile: ['settings', 'profile'] as const,
    notifications: ['settings', 'notifications'] as const,
    billing: ['settings', 'billing'] as const,
    subscription: ['settings', 'subscription'] as const,
  },
} as const;

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate all client-related queries
  clients: () => queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),

  // Invalidate specific client queries
  client: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.metrics(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.anamnesis(id) });
  },

  // Invalidate all workout-related queries
  workouts: () => queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all }),

  // Invalidate specific workout queries
  workout: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.workouts.detail(id) });
  },

  // Invalidate all program-related queries
  programs: () => queryClient.invalidateQueries({ queryKey: queryKeys.programs.all }),

  // Invalidate specific program queries
  program: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(id) });
  },

  // Invalidate analytics queries
  analytics: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard }),

  // Invalidate auth queries
  auth: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
  },
};

// Pre-fetch helpers for better UX
export const prefetchQueries = {
  // Pre-fetch client details when hovering over client cards
  clientDetails: (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.clients.detail(id),
      queryFn: () => fetch(`/api/v1/clients/${id}`).then(res => res.json()),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },

  // Pre-fetch workout templates
  workoutTemplates: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.workouts.templates,
      queryFn: () => fetch('/api/v1/workouts/templates').then(res => res.json()),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
};
