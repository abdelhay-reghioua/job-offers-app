import axios, { AxiosError, AxiosInstance } from 'axios';
import { Config } from '../constants/config';
import { SecureStorage } from '../storage/secure_storage';
import { AppError } from './types';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: Config.API_BASE_URL,
      timeout: Config.TIMEOUT,
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor — attach JWT token
    this.instance.interceptors.request.use(async (config) => {
      const token = await SecureStorage.get(Config.STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor — normalize errors
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string }>) => {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred.';
        const status = error.response?.status;
        return Promise.reject(new AppError(message, status));
      },
    );
  }

  get axios(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient().axios;