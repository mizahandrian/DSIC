// src/pages/BaseRohi.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDatabase, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave, faSyncAlt, faChevronLeft, faChevronRight, faSpinner,
  faBuilding, faBriefcase, faUserTie, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/base-rohi.css';
import { triggerNotification } from '../components/NotificationBell';

interface BaseRohi {
  id_rohi: number;
  immatricule: string;
  nom: string;
  prenom: string;
  poste: string;
  porte: string;
  telephone: string;
  direction: string;
  service: string;
  statut?: string;
}

interface Direction {
  id_direction: number;
  nom_direction: string;
  type: string;
}

interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
}

interface Poste {
  id_poste: number;
  titre_poste: string;
  id_service: number;
  id_direction: number;
}

const BaseRohi: React.FC = () => {
  const [items, setItems] = useState<BaseRohi[]>([]);
  const [filteredItems, setFilteredItems] = useState<BaseRohi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseRohi | null>(null);
  
  // Données pour les sélecteurs
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [filteredPostes, setFilteredPostes] = useState<Poste[]>([]);

  const [formData, setFormData] = useState({
    immatricule: '',
    nom: '',
    prenom: '',
    poste: '',
    porte: '',
    telephone: '',
    direction: '',
    service: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<BaseRohi | null>(null);

  useEffect(() => {
    fetchItems();
    fetchDirections();
    fetchServices();
    fetchPostes();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  // Filtrer les services par direction
  useEffect(() => {
    if (formData.direction) {
      const filtered = services.filter(s => s.id_direction === parseInt(formData.direction));
      setFilteredServices(filtered);
      // Réinitialiser le service si le service sélectionné n'est plus dans la direction
      if (formData.service && !filtered.some(s => s.id_service === parseInt(formData.service))) {
        setFormData(prev => ({ ...prev, service: '' }));
      }
    } else {
      setFilteredServices([]);
    }
  }, [formData.direction, services]);

  // Filtrer les postes par service
  useEffect(() => {
    if (formData.service) {
      const filtered = postes.filter(p => p.id_service === parseInt(formData.service));
      setFilteredPostes(filtered);
      // Réinitialiser le poste si le poste sélectionné n'est plus dans le service
      if (formData.poste && !filtered.some(p => p.titre_poste === formData.poste)) {
        setFormData(prev => ({ ...prev, poste: '' }));
      }
    } else if (formData.direction) {
      // Si direction sélectionnée mais pas service, filtrer par direction
      const filtered = postes.filter(p => p.id_direction === parseInt(formData.direction));
      setFilteredPostes(filtered);
    } else {
      setFilteredPostes([]);
    }
  }, [formData.service, formData.direction, postes]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/base-rohi');
      setItems(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      triggerNotification('error', '❌ Erreur', 'Impossible de charger les données ROHI');
    } finally {
      setLoading(false);
    }
  };

  const fetchDirections = async () => {
    try {
      const response = await api.get('/directions');
      setDirections(response.data);
    } catch (error) {
      console.error('Erreur chargement directions:', error);
      triggerNotification('error', '❌ Erreur', 'Impossible de charger les directions');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erreur chargement services:', error);
      triggerNotification('error', '❌ Erreur', 'Impossible de charger les services');
    }
  };

  const fetchPostes = async () => {
    try {
      const response = await api.get('/postes');
      setPostes(response.data);
    } catch (error) {
      console.error('Erreur chargement postes:', error);
      triggerNotification('error', '❌ Erreur', 'Impossible de charger les postes');
    }
  };

  const filterItems = () => {
    let filtered = [...items];
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.immatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.direction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si direction change, réinitialiser service et poste
    if (name === 'direction') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        service: '',
        poste: '' 
      }));
    } else if (name === 'service') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        poste: '' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        await api.put(`/base-rohi/${editingItem.id_rohi}`, formData);
        triggerNotification('success', '✅ Succès', `Entrée ROHI "${formData.nom} ${formData.prenom}" modifiée avec succès`);
      } else {
        await api.post('/base-rohi', formData);
        triggerNotification('success', '✅ Succès', `Entrée ROHI "${formData.nom} ${formData.prenom}" ajoutée avec succès`);
      }
      await fetchItems();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      triggerNotification('error', '❌ Erreur', 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/base-rohi/${deleteConfirm.id_rohi}`);
      triggerNotification('success', '✅ Succès', `Entrée ROHI "${deleteConfirm.nom} ${deleteConfirm.prenom}" supprimée avec succès`);
      await fetchItems();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur:', error);
      triggerNotification('error', '❌ Erreur', 'Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      immatricule: '', nom: '', prenom: '', poste: '', porte: '', telephone: '', direction: '', service: ''
    });
    setShowModal(true);
  };

  const openEditModal = (item: BaseRohi) => {
    setEditingItem(item);
    
    // Trouver les IDs correspondants
    const directionFound = directions.find(d => d.nom_direction === item.direction);
    const serviceFound = services.find(s => s.nom_service === item.service);
    
    setFormData({
      immatricule: item.immatricule,
      nom: item.nom,
      prenom: item.prenom,
      poste: item.poste || '',
      porte: item.porte || '',
      telephone: item.telephone || '',
      direction: directionFound ? directionFound.id_direction.toString() : '',
      service: serviceFound ? serviceFound.id_service.toString() : '',
    });
    
    // Charger les services filtrés pour la direction
    if (directionFound) {
      const filtered = services.filter(s => s.id_direction === directionFound.id_direction);
      setFilteredServices(filtered);
    }
    
    // Charger les postes filtrés
    if (serviceFound) {
      const filtered = postes.filter(p => p.id_service === serviceFound.id_service);
      setFilteredPostes(filtered);
    } else if (directionFound) {
      const filtered = postes.filter(p => p.id_direction === directionFound.id_direction);
      setFilteredPostes(filtered);
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFilteredServices([]);
    setFilteredPostes([]);
  };

  const getDirectionName = (id: string) => {
    const dir = directions.find(d => d.id_direction === parseInt(id));
    return dir ? dir.nom_direction : '';
  };

  const getServiceName = (id: string) => {
    const serv = services.find(s => s.id_service === parseInt(id));
    return serv ? serv.nom_service : '';
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="base-rohi-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><FontAwesomeIcon icon={faDatabase} /> Base ROHI</h1>
          <p>Registre des Opérations Harmonisé et Intégré</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} />
          Nouvelle entrée
        </button>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par matricule, nom, prénom ou direction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions-group">
          <button className="btn-outline" onClick={fetchItems}>
            <FontAwesomeIcon icon={faSyncAlt} />
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Chargement des données...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom complet</th>
                    <th>Poste</th>
                    <th>Porte/Bureau</th>
                    <th>Téléphone</th>
                    <th>Direction</th>
                    <th>Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item) => (
                    <tr key={item.id_rohi}>
                      <td className="matricule-cell">{item.immatricule}</td>
                      <td className="name-cell">{item.nom} {item.prenom}</td>
                      <td>{item.poste || '-'}</td>
                      <td>{item.porte || '-'}</td>
                      <td>{item.telephone || '-'}</td>
                      <td>{item.direction || '-'}</td>
                      <td>{item.service || '-'}</td>
                      <td className="actions-cell">
                        <button className="action-edit" onClick={() => openEditModal(item)}>
                          <FontAwesomeIcon icon={faEdit} />
                          Modifier
                        </button>
                        <button className="action-delete" onClick={() => setDeleteConfirm(item)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Supprimer
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
                <button 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="page-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} /> <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faDatabase} />
                <p>Aucune entrée ROHI trouvée</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal avec sélecteurs */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Modifier l\'entrée ROHI' : 'Nouvelle entrée ROHI'}</h3>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Matricule *</label>
                    <input type="text" name="immatricule" value={formData.immatricule} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Porte / Bureau</label>
                    <input type="text" name="porte" value={formData.porte} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faBuilding} /> Direction *</label>
                    <select 
                      name="direction" 
                      value={formData.direction} 
                      onChange={handleInputChange} 
                      required
                    >
                      <option value="">Sélectionner une direction</option>
                      {directions.map(d => (
                        <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faBriefcase} /> Service</label>
                    <select 
                      name="service" 
                      value={formData.service} 
                      onChange={handleInputChange}
                      disabled={!formData.direction}
                    >
                      <option value="">
                        {formData.direction ? "Sélectionner un service" : "Choisissez d'abord une direction"}
                      </option>
                      {filteredServices.map(s => (
                        <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faUserTie} /> Poste</label>
                    <select 
                      name="poste" 
                      value={formData.poste} 
                      onChange={handleInputChange}
                      disabled={!formData.direction}
                    >
                      <option value="">
                        {formData.direction ? "Sélectionner un poste" : "Choisissez d'abord une direction"}
                      </option>
                      {filteredPostes.map(p => (
                        <option key={p.id_poste} value={p.titre_poste}>{p.titre_poste}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="info-box">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Les champs Direction, Service et Poste sont synchronisés avec les données existantes</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  <FontAwesomeIcon icon={faSave} />
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <p>Supprimer l'entrée :</p>
              <div className="delete-preview">
                <strong>{deleteConfirm.immatricule} - {deleteConfirm.nom} {deleteConfirm.prenom}</strong>
              </div>
              <p className="warning-text">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Annuler
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseRohi;