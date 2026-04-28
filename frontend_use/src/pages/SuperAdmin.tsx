// src/pages/SuperAdmin.tsx
import React, { useState } from 'react';
import '../style/superadmin.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'dg' | 'rh' | 'chef_dsic';
  phone: string;
  status: 'actif' | 'inactif';
}

// Données mockées
const mockUsers: User[] = [
  { id: 1, name: 'Rakoto Jean', email: 'jean.rakoto@instat.mg', role: 'dg', phone: '032 12 345 67', status: 'actif' },
  { id: 2, name: 'Rabe Marie', email: 'marie.rabe@instat.mg', role: 'rh', phone: '033 23 456 78', status: 'actif' },
  { id: 3, name: 'Andria Paul', email: 'paul.andria@instat.mg', role: 'chef_dsic', phone: '034 34 567 89', status: 'inactif' },
];

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'rh' as 'dg' | 'rh' | 'chef_dsic',
    phone: '',
    password: '',
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'rh', phone: '', password: '' });
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      password: '',
    });
    setShowForm(true);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'actif' ? 'inactif' : 'actif' } : u
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { 
          ...u, 
          name: formData.name, 
          email: formData.email, 
          role: formData.role, 
          phone: formData.phone 
        } : u
      ));
    } else {
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        status: 'actif',
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'dg': return 'Directeur Général';
      case 'rh': return 'RH';
      case 'chef_dsic': return 'Chef DSIC';
      default: return role;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="superadmin-container">
      {/* En-tête */}
      <div className="superadmin-header">
        <div>
          <h1>Super Admin</h1>
          <p>Gestion des utilisateurs du système</p>
        </div>
        <button className="btn-primary" onClick={handleAddUser}>
          + Nouvel utilisateur
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">Tous les rôles</option>
          <option value="dg">Directeur Général</option>
          <option value="rh">RH</option>
          <option value="chef_dsic">Chef DSIC</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="user-name-cell">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'actif' ? 'status-active' : 'status-inactive'}`}>
                    {user.status === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => handleEditUser(user)}>Modifier</button>
                  <button className="btn-status" onClick={() => handleToggleStatus(user.id)}>
                    {user.status === 'actif' ? 'Désactiver' : 'Activer'}
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="empty-state">Aucun utilisateur trouvé</div>
        )}
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Rôle *</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}>
                    <option value="dg">Directeur Général</option>
                    <option value="rh">RH</option>
                    <option value="chef_dsic">Chef DSIC</option>
                  </select>
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Mot de passe *</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <small>Minimum 6 caractères</small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn-save">{editingUser ? 'Modifier' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;