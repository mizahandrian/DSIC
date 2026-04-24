import { useState, useMemo } from "react";
import type { Admin } from "../types/Admin";

type Props = {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (id: number) => void;
  onView?: (admin: Admin) => void;
};

const AdminList = ({ admins, onEdit, onDelete, onView }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "super_admin">("all");
  const [sortBy, setSortBy] = useState<keyof Admin>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrage et recherche
  const filteredAdmins = useMemo(() => {
    let filtered = admins.filter(admin => {
      const matchesSearch = 
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === "all" || admin.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });

    // Tri avec gestion sécurisée des valeurs undefined
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Gestion des valeurs undefined/null
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";
      
      // Conversion en string pour comparaison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortOrder === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [admins, searchTerm, roleFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAdmins.slice(start, end);
  }, [filteredAdmins, currentPage]);

  // Gestion sélection multiple
  const toggleSelectAll = () => {
    if (selectedAdmins.length === paginatedAdmins.length && paginatedAdmins.length > 0) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(paginatedAdmins.map(admin => admin.id));
    }
  };

  const toggleSelectAdmin = (id: number) => {
    if (selectedAdmins.includes(id)) {
      setSelectedAdmins(selectedAdmins.filter(selectedId => selectedId !== id));
    } else {
      setSelectedAdmins([...selectedAdmins, id]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer ${selectedAdmins.length} administrateur(s) ?`)) {
      selectedAdmins.forEach(id => onDelete(id));
      setSelectedAdmins([]);
    }
  };

  const handleSort = (column: keyof Admin) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getRoleBadgeClass = (role: string) => {
    return role === "super_admin" ? "badge-super" : "badge-admin";
  };

  const getRoleIcon = (role: string) => {
    return role === "super_admin" ? "👑" : "📋";
  };

  const getRoleLabel = (role: string) => {
    return role === "super_admin" ? "Super Admin" : "Admin";
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "Non renseigné";
    // Formatage basique du numéro français
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  };

  return (
    <div className="admin-list-container">
      {/* Header avec statistiques */}
      <div className="list-header">
        <div className="header-title">
          <h3>
            <span className="title-icon">👥</span>
            Liste des administrateurs
          </h3>
          <div className="stats-badge">
            Total: {admins.length} | Affichés: {filteredAdmins.length}
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-group">
            <label>Rôle :</label>
            <select 
              value={roleFilter} 
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tous</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {selectedAdmins.length > 0 && (
            <button className="btn-bulk-delete" onClick={handleBulkDelete}>
              🗑️ Supprimer ({selectedAdmins.length})
            </button>
          )}
        </div>
      </div>

      {/* Tableau responsive */}
      <div className="table-responsive">
        {filteredAdmins.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Aucun administrateur trouvé</p>
            <small>Essayez de modifier vos critères de recherche</small>
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedAdmins.length === paginatedAdmins.length && paginatedAdmins.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th onClick={() => handleSort("name")} className="sortable">
                    Nom {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable">
                    Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Téléphone</th>
                  <th onClick={() => handleSort("role")} className="sortable">
                    Rôle {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdmins.map((admin) => (
                  <tr key={admin.id} className={selectedAdmins.includes(admin.id) ? "selected" : ""}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(admin.id)}
                        onChange={() => toggleSelectAdmin(admin.id)}
                      />
                    </td>
                    <td>
                      <div className="admin-name">
                        <div className="admin-avatar">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{admin.name}</strong>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${admin.email}`} className="email-link">
                        {admin.email}
                      </a>
                    </td>
                    <td>
                      {admin.phone ? (
                        <a href={`tel:${admin.phone}`} className="phone-link">
                          📞 {formatPhoneNumber(admin.phone)}
                        </a>
                      ) : (
                        <span className="no-phone">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(admin.role)}`}>
                        {getRoleIcon(admin.role)} {getRoleLabel(admin.role)}
                      </span>
                    </td>
                    <td className="actions">
                      {onView && (
                        <button
                          className="btn-view"
                          onClick={() => onView(admin)}
                          title="Voir détails"
                        >
                          👁️
                        </button>
                      )}
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(admin)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          if (window.confirm(`Supprimer ${admin.name} ?`)) {
                            onDelete(admin.id);
                          }
                        }}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  ‹
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`page-number ${currentPage === page ? "active" : ""}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .admin-list-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .list-header {
          margin-bottom: 24px;
        }

        .header-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-title h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          font-size: 24px;
        }

        .stats-badge {
          background: #edf2f7;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #4a5568;
        }

        .filters-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 12px;
          transition: all 0.2s ease;
        }

        .search-box:focus-within {
          border-color: #4299e1;
          background: white;
        }

        .search-icon {
          margin-right: 8px;
          opacity: 0.5;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 600;
          font-size: 14px;
          color: #4a5568;
        }

        .filter-group select {
          padding: 8px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .btn-bulk-delete {
          background: #fed7d7;
          color: #c53030;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-bulk-delete:hover {
          background: #feb2b2;
          transform: translateY(-1px);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          text-align: left;
          padding: 12px;
          background: #f7fafc;
          color: #4a5568;
          font-weight: 600;
          font-size: 13px;
          border-bottom: 2px solid #e2e8f0;
        }

        .admin-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #2d3748;
        }

        .admin-table tbody tr:hover {
          background: #f7fafc;
        }

        .admin-table tbody tr.selected {
          background: #ebf8ff;
        }

        .checkbox-col {
          width: 40px;
          text-align: center;
        }

        .sortable {
          cursor: pointer;
          user-select: none;
          transition: background 0.2s ease;
        }

        .sortable:hover {
          background: #edf2f7;
        }

        .admin-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .email-link, .phone-link {
          color: #4299e1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .email-link:hover, .phone-link:hover {
          color: #3182ce;
          text-decoration: underline;
        }

        .no-phone {
          color: #a0aec0;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-admin {
          background: #e9d8fd;
          color: #6b46c1;
        }

        .badge-super {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 16px;
        }

        .btn-view {
          color: #4299e1;
        }

        .btn-view:hover {
          background: #ebf8ff;
          transform: scale(1.1);
        }

        .btn-edit {
          color: #ed8936;
        }

        .btn-edit:hover {
          background: #fffaf0;
          transform: scale(1.1);
        }

        .btn-delete {
          color: #f56565;
        }

        .btn-delete:hover {
          background: #fff5f5;
          transform: scale(1.1);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #a0aec0;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .page-btn, .page-number {
          padding: 8px 12px;
          border: 2px solid #e2e8f0;
          background: white;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .page-btn:hover:not(:disabled), .page-number:hover:not(.active) {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .page-number.active {
          background: #4299e1;
          color: white;
          border-color: #4299e1;
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .admin-list-container {
            padding: 16px;
          }
          
          .filters-bar {
            flex-direction: column;
          }
          
          .search-box {
            width: 100%;
          }
          
          .filter-group {
            width: 100%;
          }
          
          .filter-group select {
            flex: 1;
          }
          
          .admin-table th, 
          .admin-table td {
            padding: 8px;
            font-size: 12px;
          }
          
          .actions button {
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminList;