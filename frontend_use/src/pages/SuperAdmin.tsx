// src/pages/SuperAdmin.tsx
import React, { useState, useEffect } from 'react';
import api from '../Service/api';
import '../style/superadmin.css';


interface User {
  id: number;
  name: string;
  prenom: string;
  age: number;
  sexe: 'homme' | 'femme';
  email: string;
  role: 'superadmin' | 'user';
  phone: string;
  status: 'actif' | 'inactif';
}

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

const [editingUser, setEditingUser] = useState<User | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [filterRole, setFilterRole] = useState('all');
const storedUser = localStorage.getItem('user');
const currentUser = storedUser ? (JSON.parse(storedUser) as { role: User['role'] }) : null;

  const [formData, setFormData] = useState<{
    name: string;
    prenom: string;
    age: string;
    sexe: 'homme' | 'femme';
    email: string;
    role: User['role'];
    phone: string;
    password: string;
  }>({
    name: '',
    prenom: '',
    age: '',
    sexe: 'homme',
    email: '',
    role: 'user',
    phone: '',
    password: '',
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      prenom: user.prenom,
      age: user.age.toString(),
      sexe: user.sexe,
      email: user.email,
      role: user.role,
      phone: user.phone,
      password: '',
    });
  };

 const handleDeleteUser = async (id: number) => {
  if (window.confirm('Supprimer cet utilisateur ?')) {
    await api.delete(`/users/${id}`);
    loadUsers();
  }
};

const handleToggleStatus = async (id: number) => {
  const user = users.find(u => u.id === id);
  if (!user) return;

  await api.put(`/users/${id}`, {
    ...user,
    status: user.status === 'actif' ? 'inactif' : 'actif',
  });

  loadUsers();
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    name: formData.name,
    prenom: formData.prenom,
    age: Number(formData.age),
    sexe: formData.sexe,
    email: formData.email,
    phone: formData.phone,
    role: formData.role,
  };

  if (editingUser) {
    await api.put(`/users/${editingUser.id}`, payload);
  } else {
    await api.post('/users', {
      ...payload,
      password: formData.password,
    });
  }

  setEditingUser(null);
  loadUsers();

  setFormData({
    name: '',
    prenom: '',
    age: '',
    sexe: 'homme',
    email: '',
    role: 'user',
    phone: '',
    password: '',
  });
};


  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', prenom: '', age: '', sexe: 'homme', email: '', role: 'user', phone: '', password: '' });
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'superadmin':
        return 'Super admin';
      case 'user':
        return 'Utilisateur';
      default:
        return role;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="superadmin-container">
      <h1>Super Admin</h1>
      <p>Gestion des utilisateurs du système</p>

      {/* Formulaire en carré */}
      <div className="form-card">
        <h3>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</h3>
        <form onSubmit={handleSubmit}>
          {/* Ligne 1: Nom et Prénom côte à côte */}
          <div className="form-row">
            <div className="form-group">
              <label>Nom *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
                placeholder="Entrez le nom"
              />
            </div>
            <div className="form-group">
              <label>Prénom *</label>
              <input 
                type="text" 
                value={formData.prenom} 
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} 
                required 
                placeholder="Entrez le prénom"
              />
            </div>
          </div>

          {/* Ligne 2: Âge et Sexe côte à côte */}
          <div className="form-row">
            <div className="form-group">
              <label>Âge *</label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                required 
                placeholder="Entrez l'âge"
                min="18"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Sexe *</label>
              <select value={formData.sexe} onChange={(e) => setFormData({ ...formData, sexe: e.target.value as any })}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>
          
           {/* Ligne 5: Rôle et Téléphone côte à côte */}
          <div className="form-row">
             <div className="form-group">
              <label>Téléphone</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="032 12 345 67"
              />
            </div>
            <div className="form-group">
              <label>Rôle *</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}>
                <option value="superadmin">Super Admin</option>
                <option value="user">Utilisateur</option>
              </select>
            </div>
           
          </div>

          {/* Ligne 3: Email */}
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              required 
              placeholder="exemple@instat.mg"
            />
          </div>

          {/* Ligne 4: Mot de passe provisoire */}
          {!editingUser && (
            <div className="form-group">
              <label>Mot de passe provisoire *</label>
              <input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
                placeholder="Mot de passe temporaire"
              />
              <small>L'utilisateur devra changer son mot de passe à la première connexion</small>
            </div>
          )}

         
          
          <div className="form-actions">
            {editingUser && (
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Annuler
              </button>
            )}
            <button type="submit" className="btn-save">
              {editingUser ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">Tous les rôles</option>
          <option value="superadmin">Super Admin</option>
          <option value="user">Utilisateur</option>
        </select>
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-list">
        <h2>Liste des utilisateurs</h2>
        {filteredUsers.length === 0 ? (
          <div className="empty-state">Aucun utilisateur trouvé</div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="user-row">
              <div className="user-summary">
                <div className="user-name">{user.name} {user.prenom}</div>
                <div className="user-meta">
                  <span>{getRoleLabel(user.role)}</span>
                  <span>{user.email}</span>
                  <span>{user.status === 'actif' ? 'Actif' : 'Inactif'}</span>
                </div>
              </div>
              <div className="actions-cell">
                {currentUser?.role === 'superadmin' ? (
                  <>
                    <button type="button" className="btn-edit" onClick={() => handleEditUser(user)}>Modifier</button>
                    <button type="button" className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                    <button type="button" className="btn-status" onClick={() => handleToggleStatus(user.id)}>
                      {user.status === 'actif' ? 'Désactiver' : 'Activer'}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn-view">Voir</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;