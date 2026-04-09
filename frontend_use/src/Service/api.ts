// Nouveau (corrigé)
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_URL: string = 'http://127.0.0.1:8000/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token: string | null = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> => api.post('/login', data),
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> => api.post('/register', data),
  logout: (): Promise<AxiosResponse<void>> => api.post('/logout'),
  getUser: (): Promise<AxiosResponse<AuthResponse['user']>> => api.get('/user'),
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;