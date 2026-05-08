// Mirrors backend's unified response shape
export interface ApiResponse<T = unknown> {
  success: boolean;
  data:    T | null;
  message: string;
}

export class AppError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}