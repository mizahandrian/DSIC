// src/pages/SituationPersonnels.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExchangeAlt, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave, faSyncAlt, faCalendarAlt, faBuilding, faComment,
  faChevronLeft, faChevronRight, faSpinner, faUserCheck,
  faExclamationTriangle, faClock, faCheckCircle, faBell,
  faUndoAlt, faArrowRight, faHome, faUniversity, faUsers,
  faBriefcase, faChartLine, faDatabase, faUserTag, faBriefcase as faBriefcaseIcon
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/situation-personnels.css';

interface SituationPersonnel {
  id_disposition: number;
  id_personnel: number;
  personnel_nom?: string;
  personnel_prenom?: string;
  statut_administratif: 'fonctionnaire' | 'prive';
  provenance: string;
  destination: string;
  date_debut: string;
  date_fin: string;
  type_mobilite: 'formation' | 'mission' | 'detachement' | 'stage';
  commentaire: string;
  statut: 'en_cours' | 'termine' | 'depasse';
}

const SituationPersonnels: React.FC = () => {
  const [situations, setSituations] = useState<SituationPersonnel[]>([]);
  const [filteredSituations, setFilteredSituations] = useState<SituationPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingSituation, setEditingSituation] = useState<SituationPersonnel | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<SituationPersonnel | null>(null);
  const [personnels, setPersonnels] = useState<{ id: number; nom: string; prenom: string; statut_administratif?: string }[]>([]);
  
  // États pour les notifications popup
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [expiredSituations, setExpiredSituations] = useState<SituationPersonnel[]>([]);
  const [nearExpirySituations, setNearExpirySituations] = useState<SituationPersonnel[]>([]);
  const [notificationChecked, setNotificationChecked] = useState(false);

  const [formData, setFormData] = useState({
    id_personnel: '',
    statut_administratif: 'fonctionnaire',
    provenance: '',
    destination: '',
    date_debut: '',
    date_fin: '',
    type_mobilite: 'formation',
    commentaire: ''
  });

  useEffect(() => {
    fetchSituations();
    fetchPersonnels();
  }, []);

  useEffect(() => {
    filterSituations();
    checkNotifications();
  }, [situations, searchTerm]);

  const checkNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expired: SituationPersonnel[] = [];
    const nearExpiry: SituationPersonnel[] = [];
    
    situations.forEach(s => {
      if (!s.date_fin) return;
      
      const finDate = new Date(s.date_fin);
      finDate.setHours(0, 0, 0, 0);
      const diffTime = finDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        expired.push({ ...s, statut: 'depasse' });
      } else if (diffDays <= 7) {
        nearExpiry.push(s);
      }
    });
    
    setExpiredSituations(expired);
    setNearExpirySituations(nearExpiry);
    
    if ((expired.length > 0 || nearExpiry.length > 0) && !notificationChecked) {
      setShowNotificationModal(true);
    }
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setNotificationChecked(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getDaysRemaining = (dateString: string): number => {
    if (!dateString) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isDateExpired = (dateString: string): boolean => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateNearExpiry = (dateString: string): boolean => {
    if (!dateString) return false;
    const diffDays = getDaysRemaining(dateString);
    return diffDays <= 7 && diffDays > 0;
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'formation': return 'Formation';
      case 'mission': return 'Mission';
      case 'detachement': return 'Détachement';
      case 'stage': return 'Stage';
      default: return type;
    }
  };

  const getTypeClass = (type: string) => {
    switch(type) {
      case 'formation': return 'type-formation';
      case 'mission': return 'type-mission';
      case 'detachement': return 'type-detachement';
      case 'stage': return 'type-stage';
      default: return '';
    }
  };

  const getStatutAdminLabel = (statut: string) => {
    return statut === 'fonctionnaire' ? 'Fonctionnaire' : 'Privé';
  };

  const getStatutAdminClass = (statut: string) => {
    return statut === 'fonctionnaire' ? 'statut-fonctionnaire' : 'statut-prive';
  };

  const getStatutLabel = (statut: string) => {
    switch(statut) {
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'depasse': return 'Dépassé';
      default: return statut;
    }
  };

  const getStatutClass = (statut: string) => {
    switch(statut) {
      case 'en_cours': return 'statut-en-cours';
      case 'termine': return 'statut-termine';
      case 'depasse': return 'statut-depasse';
      default: return '';
    }
  };

  const fetchSituations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/situation-personnels');
      setSituations(response.data);
      setNotificationChecked(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonnels = async () => {
    try {
      const response = await api.get('/personnels');
      setPersonnels(response.data.map((p: any) => ({
        id: p.id,
        nom: p.nom,
        prenom: p.prenom,
        statut_administratif: p.statut_administratif || 'fonctionnaire'
      })));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filterSituations = () => {
    let filtered = [...situations];
    if (searchTerm) {
      filtered = filtered.filter(s => 
        (s.personnel_nom && s.personnel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.personnel_prenom && s.personnel_prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.provenance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type_mobilite.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSituations(filtered);
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
      if (editingSituation) {
        await api.put(`/situation-personnels/${editingSituation.id_disposition}`, formData);
      } else {
        await api.post('/situation-personnels', formData);
      }
      await fetchSituations();
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
      await api.delete(`/situation-personnels/${deleteConfirm.id_disposition}`);
      await fetchSituations();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingSituation(null);
    setFormData({
      id_personnel: '',
      statut_administratif: 'fonctionnaire',
      provenance: '',
      destination: '',
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: '',
      type_mobilite: 'formation',
      commentaire: ''
    });
    setShowModal(true);
  };

  const openEditModal = (situation: SituationPersonnel) => {
    setEditingSituation(situation);
    setFormData({
      id_personnel: situation.id_personnel.toString(),
      statut_administratif: situation.statut_administratif || 'fonctionnaire',
      provenance: situation.provenance || '',
      destination: situation.destination || '',
      date_debut: situation.date_debut,
      date_fin: situation.date_fin || '',
      type_mobilite: situation.type_mobilite,
      commentaire: situation.commentaire || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSituation(null);
  };

  const totalPages = Math.ceil(filteredSituations.length / itemsPerPage);
  const paginatedSituations = filteredSituations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: situations.length,
    enCours: situations.filter(s => !isDateExpired(s.date_fin) && s.date_fin).length,
    fonctionnaire: situations.filter(s => s.statut_administratif === 'fonctionnaire').length,
    prive: situations.filter(s => s.statut_administratif === 'prive').length,
    expired: expiredSituations.length,
    nearExpiry: nearExpirySituations.length
  };

  return (
    <div className="situation-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <FontAwesomeIcon icon={faExchangeAlt} />
            Mobilité des personnels
          </h1>
          <p>Gestion des formations, missions, détachements et stages (provenance → destination)</p>
        </div>
        <div className="header-actions">
          {(stats.expired > 0 || stats.nearExpiry > 0) && (
            <button className="btn-notification" onClick={() => setShowNotificationModal(true)}>
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-badge">{stats.expired + stats.nearExpiry}</span>
            </button>
          )}
          <button className="btn-primary" onClick={openAddModal}>
            <FontAwesomeIcon icon={faPlus} />
            Nouvelle mobilité
          </button>
        </div>
      </div>

      {/* Popup Modal de notification */}
      {showNotificationModal && (
        <div className="modal-overlay" onClick={closeNotificationModal}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <FontAwesomeIcon icon={faBell} />
              <h3>Alertes - Retour de mobilité</h3>
              <button className="notification-close" onClick={closeNotificationModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="notification-modal-body">
              {expiredSituations.length > 0 && (
                <div className="notification-section expired">
                  <div className="notification-section-title">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Retour urgent ({expiredSituations.length})</span>
                  </div>
                  {expiredSituations.map(s => (
                    <div key={s.id_disposition} className="notification-item expired">
                      <div className="notification-item-info">
                        <strong>{s.personnel_prenom} {s.personnel_nom}</strong>
                        <span>Type: {getTypeLabel(s.type_mobilite)}</span>
                        <span className="mobility-path">
                          <span className="origin">{s.provenance}</span>
                          <FontAwesomeIcon icon={faArrowRight} />
                          <span className="destination">{s.destination}</span>
                        </span>
                        <span>Date de retour prévue: {formatDate(s.date_fin)}</span>
                      </div>
                      <div className="notification-item-action">
                        <span className="expired-label">RETOUR IMMÉDIAT</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {nearExpirySituations.length > 0 && (
                <div className="notification-section warning">
                  <div className="notification-section-title">
                    <FontAwesomeIcon icon={faClock} />
                    <span>Retour prochain ({nearExpirySituations.length})</span>
                  </div>
                  {nearExpirySituations.map(s => {
                    const daysLeft = getDaysRemaining(s.date_fin);
                    return (
                      <div key={s.id_disposition} className="notification-item warning">
                        <div className="notification-item-info">
                          <strong>{s.personnel_prenom} {s.personnel_nom}</strong>
                          <span>Type: {getTypeLabel(s.type_mobilite)}</span>
                          <span className="mobility-path">
                            <span className="origin">{s.provenance}</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                            <span className="destination">{s.destination}</span>
                          </span>
                          <span>Retour prévu le: {formatDate(s.date_fin)}</span>
                        </div>
                        <div className="notification-item-action">
                          <span className="warning-label">Retour dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}</span>
                          <FontAwesomeIcon icon={faUndoAlt} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="notification-modal-footer">
              <button className="btn-primary" onClick={closeNotificationModal}>
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon situ-active">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total mobilités</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon situ-mission">
            <FontAwesomeIcon icon={faBriefcaseIcon} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.enCours}</span>
            <span className="stat-label">En cours</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon situ-fonctionnaire">
            <FontAwesomeIcon icon={faUserTag} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.fonctionnaire}</span>
            <span className="stat-label">Fonctionnaires</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon situ-prive">
            <FontAwesomeIcon icon={faBriefcaseIcon} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.prive}</span>
            <span className="stat-label">Privés</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, provenance, destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions-group">
          <button className="btn-outline" onClick={fetchSituations}>
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
            <p>Chargement des mobilités...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Personnel</th>
                    <th>Statut</th>
                    <th>Provenance</th>
                    <th>Destination</th>
                    <th>Type</th>
                    <th>Statut mobilité</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSituations.map((situation) => {
                    const isExpired = isDateExpired(situation.date_fin);
                    const isNearExpiry = isDateNearExpiry(situation.date_fin);
                    const daysLeft = getDaysRemaining(situation.date_fin);
                    
                    let statutMobilite = 'en_cours';
                    if (isExpired) statutMobilite = 'depasse';
                    else if (situation.date_fin && !isExpired) statutMobilite = 'en_cours';
                    
                    return (
                      <tr key={situation.id_disposition} className={isExpired ? 'expired-row' : isNearExpiry ? 'near-expiry-row' : ''}>
                        <td className="id-cell">#{situation.id_disposition}</td>
                        <td className="name-cell">
                          {situation.personnel_prenom} {situation.personnel_nom}
                        </td>
                        <td>
                          <span className={`statut-admin-badge ${getStatutAdminClass(situation.statut_administratif)}`}>
                            {getStatutAdminLabel(situation.statut_administratif)}
                          </span>
                        </td>
                        <td>
                          <div className="location-cell">
                            <FontAwesomeIcon icon={faHome} className="location-icon" />
                            {situation.provenance}
                          </div>
                        </td>
                        <td>
                          <div className="location-cell">
                            <FontAwesomeIcon icon={faBuilding} className="location-icon" />
                            {situation.destination}
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge ${getTypeClass(situation.type_mobilite)}`}>
                            {getTypeLabel(situation.type_mobilite)}
                          </span>
                        </td>
                        <td>
                          <div className="period-cell">
                            <div>{formatDate(situation.date_debut)} → {formatDate(situation.date_fin)}</div>
                            {situation.date_fin && (
                              <div className="date-status-badge">
                                {isExpired && <span className="badge-expired">Dépassé</span>}
                                {isNearExpiry && !isExpired && <span className="badge-warning">J-{daysLeft}</span>}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`statut-badge ${getStatutClass(statutMobilite)}`}>
                            {statutMobilite === 'en_cours' && <FontAwesomeIcon icon={faCheckCircle} />}
                            {statutMobilite === 'depasse' && <FontAwesomeIcon icon={faExclamationTriangle} />}
                            {getStatutLabel(statutMobilite)}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="action-edit" onClick={() => openEditModal(situation)}>
                            <FontAwesomeIcon icon={faEdit} />
                            Modifier
                          </button>
                          <button className="action-delete" onClick={() => setDeleteConfirm(situation)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="page-btn">
                  <FontAwesomeIcon icon={faChevronLeft} /> <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="page-btn">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="page-info">Page {currentPage} sur {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="page-btn">
                  <FontAwesomeIcon icon={faChevronRight} /> <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}

            {filteredSituations.length === 0 && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faExchangeAlt} />
                <p>Aucune mobilité trouvée</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal - Agrandi */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faExchangeAlt} />
                {editingSituation ? 'Modifier la mobilité' : 'Nouvelle mobilité'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faUsers} /> Personnel *</label>
                    <select name="id_personnel" value={formData.id_personnel} onChange={handleInputChange} required>
                      <option value="">Sélectionner un personnel</option>
                      {personnels.map(p => (
                        <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faUserTag} /> Statut administratif *</label>
                    <select name="statut_administratif" value={formData.statut_administratif} onChange={handleInputChange} required>
                      <option value="fonctionnaire">Fonctionnaire</option>
                      <option value="prive">Privé</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faHome} /> Provenance (d'où vient-il?) *</label>
                    <input 
                      type="text" 
                      name="provenance" 
                      value={formData.provenance} 
                      onChange={handleInputChange} 
                      placeholder="Ex: INSTAT, Université d'Antananarivo, Ministère..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faBuilding} /> Destination (où va-t-il?) *</label>
                    <input 
                      type="text" 
                      name="destination" 
                      value={formData.destination} 
                      onChange={handleInputChange} 
                      placeholder="Ex: Université de Paris, Banque Mondiale, Ministère..."
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faCalendarAlt} /> Date de début *</label>
                    <input 
                      type="date" 
                      name="date_debut" 
                      value={formData.date_debut} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faCalendarAlt} /> Date de fin (retour) *</label>
                    <input 
                      type="date" 
                      name="date_fin" 
                      value={formData.date_fin} 
                      onChange={handleInputChange} 
                      required
                    />
                    <small>Date à laquelle la personne doit revenir</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faBriefcaseIcon} />Situation</label>
                    <select name="type_mobilite" value={formData.type_mobilite} onChange={handleInputChange} required>
                      <option value="formation">Mise à la disposition</option>
                      <option value="mission">Mission</option>
                      <option value="detachement">Détachement</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label><FontAwesomeIcon icon={faComment} /> Commentaire</label>
                  <textarea
                    name="commentaire"
                    value={formData.commentaire}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Informations complémentaires sur la mobilité..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn-save">
                  <FontAwesomeIcon icon={faSave} />
                  {editingSituation ? 'Modifier' : 'Ajouter'}
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
              <p>Supprimer la mobilité de :</p>
              <div className="delete-preview">
                <strong>{deleteConfirm.personnel_prenom} {deleteConfirm.personnel_nom}</strong>
                <span>{deleteConfirm.provenance} → {deleteConfirm.destination}</span>
                <span>{getTypeLabel(deleteConfirm.type_mobilite)}</span>
              </div>
              <p className="warning-text">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="btn-danger" onClick={handleDelete}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SituationPersonnels;