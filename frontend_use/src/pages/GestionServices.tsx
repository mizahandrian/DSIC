// src/pages/GestionServices.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave, faSyncAlt, faBuilding
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/gestion-services.css';

interface Direction {
  id_direction: number;
  nom_direction: string;
}

interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
  direction_nom?: string;
  nombre_postes?: number;
  nombre_personnels?: number;
  description?: string;
}

const GestionServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    nom_service: '',
    id_direction: '',
    description: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
    fetchDirections();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, filterDirection]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDirections = async () => {
    try {
      const response = await api.get('/directions');
      setDirections(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filterServices = () => {
    let filtered = [...services];
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.nom_service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterDirection !== 'all') {
      filtered = filtered.filter(s => s.id_direction === parseInt(filterDirection));
    }
    
    setFilteredServices(filtered);
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
      const serviceData = {
        nom_service: formData.nom_service,
        id_direction: parseInt(formData.id_direction),
        description: formData.description
      };
      if (editingService) {
        await api.put(`/services/${editingService.id_service}`, serviceData);
      } else {
        await api.post('/services', serviceData);
        //  IMPORTANT : refresh global
          await fetchServices();
      }
      await fetchServices();
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
      await api.delete(`/services/${deleteConfirm.id_service}`);
      await fetchServices();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ nom_service: '', id_direction: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      nom_service: service.nom_service,
      id_direction: service.id_direction.toString(),
      description: service.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const getDirectionName = (id: number) => {
    const dir = directions.find(d => d.id_direction === id);
    return dir ? dir.nom_direction : '-';
  };

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="services-container">
      {/* En-tête */}
      <div className="services-header">
        <div className="services-title">
          <h1><FontAwesomeIcon icon={faBriefcase} /> Services</h1>
          <p>Gestion des services par direction</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Nouveau service
        </button>
      </div>

      {/* Filtres */}
      <div className="services-filters">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filterDirection}
          onChange={(e) => setFilterDirection(e.target.value)}
        >
          <option value="all">Toutes les directions</option>
          {directions.map(d => (
            <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>
          ))}
        </select>
        <button className="btn-refresh" onClick={fetchServices}>
          <FontAwesomeIcon icon={faSyncAlt} /> Rafraîchir
        </button>
      </div>

      {/* Tableau des services */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Direction</th>
                  <th>Postes</th>
                  <th>Personnels</th>
                  <th>Description</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((service) => (
                  <tr key={service.id_service}>
                    <td className="name-cell">
                      <strong>{service.nom_service}</strong>
                    </td>
                    <td>
                      <span className="direction-badge">
                        <FontAwesomeIcon icon={faBuilding} /> {getDirectionName(service.id_direction)}
                      </span>
                    </td>
                    <td className="stats-cell">{service.nombre_postes || 0}</td>
                    <td className="stats-cell">{service.nombre_personnels || 0}</td>
                    <td className="desc-cell">{service.description || '-'}</td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => openEditModal(service)}>
                        <FontAwesomeIcon icon={faEdit} /> Modifier
                      </button>
                      <button className="action-btn delete" onClick={() => setDeleteConfirm(service)}>
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

          {filteredServices.length === 0 && (
            <div className="empty-state">
              <p>Aucun service trouvé</p>
            </div>
          )}
        </>
      )}

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? 'Modifier le service' : 'Nouveau service'}</h3>
              <button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Direction *</label>
                  <select name="id_direction" value={formData.id_direction} onChange={handleInputChange} required>
                    <option value="">Sélectionner une direction</option>
                    {directions.map(d => (
                      <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nom du service *</label>
                  <input
                    type="text"
                    name="nom_service"
                    value={formData.nom_service}
                    onChange={handleInputChange}
                    placeholder="Ex: Infrastructure, Développement..."
                    required
                  />
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
                  <FontAwesomeIcon icon={faSave} /> {editingService ? 'Modifier' : 'Ajouter'}
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
              <p>Supprimer le service :</p>
              <p className="confirm-name"><strong>{deleteConfirm.nom_service}</strong></p>
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

export default GestionServices;