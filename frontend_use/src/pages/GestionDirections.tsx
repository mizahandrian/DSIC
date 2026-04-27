// src/pages/GestionDirections.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave, faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/gestion-directions.css';

interface Direction {
  id_direction: number;
  nom_direction: string;
  type: 'centrale' | 'regionale' | 'provinciale';
  description?: string;
  nombre_services?: number;
  nombre_personnels?: number;
}

const GestionDirections: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filteredDirections, setFilteredDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [formData, setFormData] = useState({
    nom_direction: '',
    type: 'centrale' as 'centrale' | 'regionale' | 'provinciale',
    description: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState<Direction | null>(null);

  useEffect(() => {
    fetchDirections();
  }, []);

  useEffect(() => {
    filterDirections();
  }, [directions, searchTerm, filterType]);

  const fetchDirections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/directions');
      setDirections(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDirections = () => {
    let filtered = [...directions];
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.nom_direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.type === filterType);
    }
    
    setFilteredDirections(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingDirection) {
        await api.put(`/directions/${editingDirection.id_direction}`, formData);
      } else {
        await api.post('/directions', formData);
      }
      await fetchDirections();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/directions/${deleteConfirm.id_direction}`);
      await fetchDirections();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingDirection(null);
    setFormData({ nom_direction: '', type: 'centrale', description: '' });
    setShowModal(true);
  };

  const openEditModal = (direction: Direction) => {
    setEditingDirection(direction);
    setFormData({
      nom_direction: direction.nom_direction,
      type: direction.type,
      description: direction.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDirection(null);
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'centrale': return 'Centrale';
      case 'regionale': return 'Régionale';
      case 'provinciale': return 'Provinciale';
      default: return type;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredDirections.length / itemsPerPage);
  const paginatedDirections = filteredDirections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="directions-container">
      {/* En-tête */}
      <div className="directions-header">
        <div className="directions-title">
          <h1><FontAwesomeIcon icon={faBuilding} /> Directions</h1>
          <p>Gestion des directions de l'INSTAT</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Nouvelle direction
        </button>
      </div>

      {/* Filtres */}
      <div className="directions-filters">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une direction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tous les types</option>
          <option value="centrale">Centrales</option>
          <option value="regionale">Régionales</option>
          <option value="provinciale">Provinciales</option>
        </select>
        <button className="btn-refresh" onClick={fetchDirections}>
          <FontAwesomeIcon icon={faSyncAlt} /> Rafraîchir
        </button>
      </div>

      {/* Tableau des directions */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="directions-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Services</th>
                  <th>Personnels</th>
                  <th>Description</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDirections.map((direction) => (
                  <tr key={direction.id_direction}>
                    <td className="name-cell">
                      <strong>{direction.nom_direction}</strong>
                    </td>
                    <td>
                      <span className={`type-badge type-${direction.type}`}>
                        {getTypeLabel(direction.type)}
                      </span>
                    </td>
                    <td className="stats-cell">{direction.nombre_services || 0}</td>
                    <td className="stats-cell">{direction.nombre_personnels || 0}</td>
                    <td className="desc-cell">{direction.description || '-'}</td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => openEditModal(direction)}>
                        <FontAwesomeIcon icon={faEdit} /> Modifier
                      </button>
                      <button className="action-btn delete" onClick={() => setDeleteConfirm(direction)}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="page-btn">«</button>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="page-btn">‹</button>
              <span className="page-info">Page {currentPage} sur {totalPages}</span>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">›</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="page-btn">»</button>
            </div>
          )}

          {filteredDirections.length === 0 && (
            <div className="empty-state">
              <p>Aucune direction trouvée</p>
            </div>
          )}
        </>
      )}

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDirection ? 'Modifier la direction' : 'Nouvelle direction'}</h3>
              <button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom de la direction *</label>
                  <input
                    type="text"
                    name="nom_direction"
                    value={formData.nom_direction}
                    onChange={handleInputChange}
                    placeholder="Ex: DSIC, DG, DR/Tana..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="centrale">Centrale</option>
                    <option value="regionale">Régionale</option>
                    <option value="provinciale">Provinciale</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Description facultative..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn-submit">
                  <FontAwesomeIcon icon={faSave} /> {editingDirection ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation suppression */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-container modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="modal-body">
              <p>Supprimer la direction :</p>
              <p className="confirm-name"><strong>{deleteConfirm.nom_direction}</strong></p>
              <p className="warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="btn-confirm" onClick={handleDelete}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDirections;