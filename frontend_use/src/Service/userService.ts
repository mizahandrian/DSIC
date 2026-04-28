// src/Service/userService.ts
import api from './api';

export const userService = {
  // Récupérer tous les utilisateurs
  getAll: () => api.get('/users'),
  
  // Récupérer un utilisateur par ID
  getById: (id: number) => api.get(`/users/${id}`),
  
  // Créer un utilisateur
  create: (data: any) => api.post('/users', data),
  
  // Modifier un utilisateur
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  
  // Supprimer un utilisateur
  delete: (id: number) => api.delete(`/users/${id}`),
  
  // Changer le mot de passe
  changePassword: (id: number, password: string) => api.post(`/users/${id}/change-password`, { password }),
  
  // Changer le statut (actif/inactif)
  changeStatus: (id: number, status: string) => api.patch(`/users/${id}/status`, { status }),
};