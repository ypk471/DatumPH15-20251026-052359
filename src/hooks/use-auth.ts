import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
import { toast } from 'sonner';
import { useDocumentsStore } from './use-documents';
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (username, password) => {
        try {
          const user = await api<User>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          });
          set({ user, isAuthenticated: true });
          toast.success(`Welcome back, ${user.username}!`);
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          toast.error(errorMessage);
          return false;
        }
      },
      register: async (username, password) => {
        try {
          const user = await api<User>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          });
          set({ user, isAuthenticated: true });
          toast.success(`Welcome, ${user.username}! Your account has been created.`);
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          toast.error(errorMessage);
          return false;
        }
      },
      logout: () => {
        useDocumentsStore.getState().clearDocuments();
        set({ user: null, isAuthenticated: false });
        toast.info("You have been logged out.");
      },
      checkAuth: () => {
        // This function is called on app load to transition from loading state
        const user = get().user;
        if (user) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Only persist the user object
    }
  )
);
// Initialize auth check on app load
useAuthStore.getState().checkAuth();