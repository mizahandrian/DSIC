// src/types/User.ts
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'dg' | 'rh' | 'chef_dsic' | 'super_admin';
    roleLabel: string;
    phone?: string;
    last_login?: string;
    created_at: string;
    status: 'actif' | 'inactif';
  }
  
  export interface CreateUserData {
    name: string;
    email: string;
    role: 'dg' | 'rh' | 'chef_dsic';
    phone?: string;
    password: string;
  }
  
  export interface UpdateUserData {
    name?: string;
    email?: string;
    role?: 'dg' | 'rh' | 'chef_dsic';
    phone?: string;
    password?: string;
    status?: 'actif' | 'inactif';
  }