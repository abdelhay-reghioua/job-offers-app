import { create } from 'zustand';
import { Config } from '../../../core/constants/config';
import { SecureStorage } from '../../../core/storage/secure_storage';
import { AppError } from '../../../core/api/types';
import { AuthService } from '../services/auth_service';
import { LoginPayload, RegisterPayload, User } from '../types';

interface AuthState {
  user:    User   | null;
  token:   string | null;
  loading: boolean;
  error:   string | null;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  register:   (payload: RegisterPayload) => Promise<boolean>;
  login:      (payload: LoginPayload)    => Promise<boolean>;
  logout:     () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:        null,
  token:       null,
  loading:     false,
  error:       null,
  initialized: false,

  initialize: async () => {
    try {
      const token = await SecureStorage.get(Config.STORAGE_KEYS.TOKEN);
      if (token) {
        set({ token, loading: true });
        const user = await AuthService.me();
        set({ user, loading: false, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch {
      await SecureStorage.delete(Config.STORAGE_KEYS.TOKEN);
      set({ user: null, token: null, loading: false, initialized: true });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await AuthService.register(payload);
      await SecureStorage.set(Config.STORAGE_KEYS.TOKEN, token);
      set({ user, token, loading: false });
      return true;
    } catch (e) {
      const err = e as AppError;
      set({ loading: false, error: err.message });
      return false;
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await AuthService.login(payload);
      await SecureStorage.set(Config.STORAGE_KEYS.TOKEN, token);
      set({ user, token, loading: false });
      return true;
    } catch (e) {
      const err = e as AppError;
      set({ loading: false, error: err.message });
      return false;
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch { /* ignore */ }
    await SecureStorage.delete(Config.STORAGE_KEYS.TOKEN);
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),
}));