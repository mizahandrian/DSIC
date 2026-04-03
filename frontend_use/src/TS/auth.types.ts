// src/TS/auth.types.ts
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface FormErrors {
  [key: string]: string;
}