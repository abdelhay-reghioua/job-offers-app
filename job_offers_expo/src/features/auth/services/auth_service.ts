import { apiClient } from '../../../core/api/client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const AuthService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/register', payload);
    return data.data as AuthResponse;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', payload);
    return data.data as AuthResponse;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get('/auth/me');
    return data.data as User;
  },
};