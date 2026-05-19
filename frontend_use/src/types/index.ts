// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  is_initialized?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}