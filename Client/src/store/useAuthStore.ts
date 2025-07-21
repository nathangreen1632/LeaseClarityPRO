import { create } from 'zustand';
import type { AuthCredentials, AuthResponse } from '../types/auth.js';
import {useLeaseStore} from "./useLeaseStore.ts";

function getStoredAuth(): { token: string | null; user: AuthResponse['user'] | null } {
  const token: string | null = localStorage.getItem('token');
  const userRaw: string | null = localStorage.getItem('user');
  let user: any = null;
  try {
    if (userRaw) user = JSON.parse(userRaw);
  } catch {}
  return { token, user };
}

interface AuthStoreState {
  user: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (creds: AuthCredentials) => Promise<void>;
  register: (creds: AuthCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...getStoredAuth(),
  loading: false,
  error: null,

  login: async (creds: AuthCredentials): Promise<void> => {
    set({ loading: true, error: null });
    try {
      const res: Response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data: any = await res.json();
      if (!res.ok || !data?.token || !data?.user) {
        set({ error: data?.error ?? 'Login failed.', loading: false });
        return;
      }
      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        },
        token: data.token,
        loading: false,
        error: null,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Login failed.',
        loading: false,
      });
    }
  },

  register: async (creds: AuthCredentials): Promise<void> => {
    set({ loading: true, error: null });
    try {
      const res: Response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data: any = await res.json();
      if (!res.ok || !data?.token || !data?.user) {
        set({ error: data?.error ?? 'Registration failed.', loading: false });
        return;
      }
      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        },
        token: data.token,
        loading: false,
        error: null,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Registration failed.',
        loading: false,
      });
    }
  },

  logout: (): void => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    useLeaseStore.getState().reset();
  },
}));
