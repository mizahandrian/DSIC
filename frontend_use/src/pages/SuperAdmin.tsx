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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    age: '',
    sexe: 'homme' as 'homme' | 'femme',
    email: '',
    role: 'user' as User['role'],
    phone: '',
    password: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole, filterStatus]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }
    
    setFilteredUsers(filtered);
  };

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
    if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      await api.put(`/users/${id}`, {
        ...user,
        status: user.status === 'actif' ? 'inactif' : 'actif',
      });
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      prenom: formData.prenom,
      age: Number(formData.age),
      sexe: formData.sexe,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };

    try {
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
      handleCancel();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
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

  const getRoleLabel = (role: User['role']) => {
    return role === 'superadmin' ? 'Super Admin' : 'Utilisateur';
  };

  return (
    <div className="superadmin-container">
      <div className="superadmin-header">
        <h1>Super Admin</h1>
        <p>Gestion des utilisateurs du système</p>
      </div>

      {/* Formulaire d'ajout/modification - PLEINE LARGEUR CENTRÉ */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>NOM *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
                placeholder="Entrez le nom"
              />
            </div>
            <div className="form-group">
              <label>PRÉNOM *</label>
              <input 
                type="text" 
                value={formData.prenom} 
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} 
                required 
                placeholder="Entrez le prénom"
              />
            </div>
            <div className="form-group">
              <label>ÂGE *</label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                required 
                placeholder="Âge"
                min="18"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>SEXE *</label>
              <select value={formData.sexe} onChange={(e) => setFormData({ ...formData, sexe: e.target.value as any })}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div className="form-group">
              <label>TÉLÉPHONE</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="032 12 345 67"
              />
            </div>
            <div className="form-group">
              <label>RÔLE *</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}>
                <option value="superadmin">Super Admin</option>
                <option value="user">Utilisateur</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>EMAIL *</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
                placeholder="exemple@instat.mg"
              />
            </div>
            {!editingUser && (
              <div className="form-group full-width">
                <label>MOT DE PASSE PROVISOIRE *</label>
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
          </div>
          
          <div className="form-actions">
            {editingUser && (
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Annuler
              </button>
            )}
            <button type="submit" className="btn-save" disabled={submitting}>
              {editingUser ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters-group">
          <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tous les rôles</option>
            <option value="superadmin">Super Admin</option>
            <option value="user">Utilisateur</option>
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-section">
        <div className="users-header">
          <h3>Liste des utilisateurs</h3>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Âge</th>
                  <th>Sexe</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-name-cell">{user.prenom} {user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age} ans</td>
                    <td>{user.sexe === 'homme' ? 'Homme' : 'Femme'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'superadmin' ? 'badge-admin' : 'badge-user'}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status === 'actif' ? 'badge-active' : 'badge-inactive'}`}>
                        {user.status === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => handleEditUser(user)}>
                        Modifier
                      </button>
                      <button className="action-btn status" onClick={() => handleToggleStatus(user.id)}>
                        {user.status === 'actif' ? 'Désactiver' : 'Activer'}
                      </button>
                      <button className="action-btn delete" onClick={() => handleDeleteUser(user.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;