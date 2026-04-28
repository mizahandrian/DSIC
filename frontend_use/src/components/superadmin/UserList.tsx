// src/components/superadmin/UserList.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faTrashAlt, faKey, faUserCheck, faUserTimes,
   faSearch, faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types/User';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onChangePassword: (user: User) => void;
  onToggleStatus: (id: number, status: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const UserList: React.FC<UserListProps> = ({ 
  users, onEdit, onDelete, onChangePassword, onToggleStatus, onRefresh, loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'dg': return '👑';
      case 'rh': return '📋';
      case 'chef_dsic': return '💻';
      case 'super_admin': return '⚡';
      default: return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'dg': return 'Directeur Général';
      case 'rh': return 'RH';
      case 'chef_dsic': return 'Chef DSIC';
      case 'super_admin': return 'Super Admin';
      default: return role;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-left">
          <h3><span className="title-icon">👥</span> Utilisateurs du système</h3>
          <span className="user-count">{users.length} utilisateur(s)</span>
        </div>
        
        <div className="filters">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}>
            <option value="all">Tous les rôles</option>
            <option value="dg">Directeur Général</option>
            <option value="rh">RH</option>
            <option value="chef_dsic">Chef DSIC</option>
          </select>
          
          <button className="btn-refresh" onClick={onRefresh}>
            <FontAwesomeIcon icon={faSyncAlt} /> Rafraîchir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div><p>Chargement...</p></div>
      ) : (
        <>
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Contact</th>
                  <th>Rôle</th>
                  <th>Dernière connexion</th>
                  <th>Statut</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {getRoleIcon(user.role)} {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>{user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}</td>
                    <td>
                      <span className={`status-badge ${user.status === 'actif' ? 'status-active' : 'status-inactive'}`}>
                        {user.status === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => onEdit(user)} title="Modifier">
                        <FontAwesomeIcon icon={faEdit} /> Modifier
                      </button>
                      <button className="action-btn password" onClick={() => onChangePassword(user)} title="Changer mot de passe">
                        <FontAwesomeIcon icon={faKey} /> Mot de passe
                      </button>
                      <button className="action-btn status" onClick={() => onToggleStatus(user.id, user.status === 'actif' ? 'inactif' : 'actif')} title={user.status === 'actif' ? 'Désactiver' : 'Activer'}>
                        <FontAwesomeIcon icon={user.status === 'actif' ? faUserTimes : faUserCheck} />
                        {user.status === 'actif' ? 'Désactiver' : 'Activer'}
                      </button>
                      <button className="action-btn delete" onClick={() => onDelete(user.id)} title="Supprimer">
                        <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
            </div>
          )}

          {filteredUsers.length === 0 && (
            <div className="empty-state">Aucun utilisateur trouvé</div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;