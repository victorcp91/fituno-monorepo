import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Modal {
  id: string;
  type: 'confirm' | 'form' | 'info';
  title: string;
  content?: React.ReactNode;
  props?: Record<string, any>;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;

  // Loading states
  globalLoading: boolean;
  loadingMessage?: string;

  // Notifications
  notifications: Notification[];

  // Modals
  modals: Modal[];

  // Theme
  theme: 'light' | 'dark' | 'system';

  // Mobile responsive
  isMobile: boolean;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  updateModal: (id: string, updates: Partial<Modal>) => void;
  closeAllModals: () => void;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  globalLoading: false,
  loadingMessage: undefined,
  notifications: [],
  modals: [],
  theme: 'system',
  isMobile: false,

  // Sidebar actions
  setSidebarOpen: open => set({ sidebarOpen: open }),

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  // Loading actions
  setGlobalLoading: (loading, message) =>
    set({
      globalLoading: loading,
      loadingMessage: message,
    }),

  // Notification actions
  addNotification: notification => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  },

  removeNotification: id =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  // Modal actions
  openModal: modal => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal: Modal = { ...modal, id };

    set(state => ({
      modals: [...state.modals, newModal],
    }));

    return id;
  },

  closeModal: id =>
    set(state => ({
      modals: state.modals.filter(m => m.id !== id),
    })),

  updateModal: (id, updates) =>
    set(state => ({
      modals: state.modals.map(modal => (modal.id === id ? { ...modal, ...updates } : modal)),
    })),

  closeAllModals: () => set({ modals: [] }),

  // Theme actions
  setTheme: theme => {
    set({ theme });

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  // Mobile state
  setIsMobile: isMobile => set({ isMobile }),
}));

// Notification helpers
export const notify = {
  success: (title: string, message?: string, action?: Notification['action']) => {
    return useUIStore.getState().addNotification({
      type: 'success',
      title,
      message,
      action,
    });
  },

  error: (title: string, message?: string, action?: Notification['action']) => {
    return useUIStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Longer duration for errors
      action,
    });
  },

  warning: (title: string, message?: string, action?: Notification['action']) => {
    return useUIStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      action,
    });
  },

  info: (title: string, message?: string, action?: Notification['action']) => {
    return useUIStore.getState().addNotification({
      type: 'info',
      title,
      message,
      action,
    });
  },
};

// Modal helpers
export const modal = {
  confirm: (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    return useUIStore.getState().openModal({
      type: 'confirm',
      title,
      content: message,
      onConfirm,
      confirmText,
      cancelText,
    });
  },

  info: (title: string, content: React.ReactNode) => {
    return useUIStore.getState().openModal({
      type: 'info',
      title,
      content,
    });
  },
};
