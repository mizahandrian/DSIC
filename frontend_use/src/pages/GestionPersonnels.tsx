// src/pages/GestionPersonnels.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faSearch, faEdit, faTrashAlt, faEye, faPlus,
  faArrowUp, faArrowDown, faDownload, faSyncAlt,
  faUserCheck, faUserTimes, faVenusMars,
  faIdCard, faPhone, faCalendarAlt,
  faBuilding, faBriefcase, faUserTie, faSave, faTimes,
  faPen, faSpinner, faTag, faLayerGroup, faGraduationCap,
  faHistory, faExchangeAlt, faHome, faArrowRight, faClock,
  faInfoCircle, faCalendar, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import { triggerNotification } from '../components/NotificationBell';

interface Personnel {
  id: number;
  matricule: string | null;
  nom: string;
  prenom: string;
  tel: string;
  genre: 'M' | 'F';
  numero_cin: string;
  date_naissance: string;
  date_entree: string;
  motif_entree: string;
  id_direction: number | null;
  id_service: number | null;
  id_poste: number | null;
  id_etat: number | null;
  direction?: string | null;
  service?: string | null;
  poste?: string | null;
  etat?: string | null;
  categorie?: string | null;
  corps?: string | null;
  indice?: string | null;
  grade?: string | null;
}

interface HistoriqueMobilite {
  id_disposition: number;
  type_mobilite: string;
  provenance: string;
  destination: string;
  date_debut: string;
  date_fin: string;
  statut: string;
}

interface Direction {
  id_direction: number;
  nom_direction: string;
}

interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
}

const GestionPersonnels: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [filteredPersonnels, setFilteredPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Personnel>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [historiqueMobilites, setHistoriqueMobilites] = useState<HistoriqueMobilite[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Personnel>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchPersonnels();
    fetchSelectData();
  }, []);

  useEffect(() => {
    filterAndSortPersonnels();
  }, [personnels, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && filteredPersonnels.length > 20) {
        loadMore();
      }
    }, { threshold: 0.5 });

    if (lastRowRef.current) {
      observerRef.current.observe(lastRowRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredPersonnels, hasMore, loadingMore]);

  const fetchPersonnels = async () => {
    setLoading(true);
    try {
      const response = await api.get('/personnels');
      const mappedData = response.data.map((p: any) => ({
        ...p,
        direction: p.direction?.nom_direction ?? null,
        service: p.service?.nom_service ?? null,
        etat: p.etat ?? null,
        categorie: p.categorie ?? null,
        corps: p.corps ?? null,
        indice: p.indice ?? null,
        grade: p.grade ?? null,
      }));
      setPersonnels(mappedData);
      setHasMore(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoriquePersonnel = async (personnelId: number) => {
    try {
      const response = await api.get(`/situation-personnels/personnel/${personnelId}`);
      setHistoriqueMobilites(response.data);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setHistoriqueMobilites([]);
    }
  };

  const openHistoriqueModal = async (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    await fetchHistoriquePersonnel(personnel.id);
    setShowHistoriqueModal(true);
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const fetchSelectData = async () => {
    try {
      const [directionsRes] = await Promise.all([
        api.get('/directions'),
      ]);
      setDirections(directionsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchServicesByDirection = async (directionId: number) => {
    try {
      const response = await api.get(`/services/direction/${directionId}`);
      setServices(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filterAndSortPersonnels = () => {
    let filtered = [...personnels];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numero_cin?.includes(searchTerm) ||
        p.id?.toString().includes(searchTerm) ||
        p.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.corps?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.grade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredPersonnels(filtered);
    setPage(1);
  };

  const handleSort = (field: keyof Personnel) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!selectedPersonnel) return;
    try {
      await api.delete(`/personnels/${selectedPersonnel.id}`);
      
      // === NOTIFICATION AJOUTÉE ===
      triggerNotification(
        'warning',
        '🗑️ Personnel supprimé',
        `${selectedPersonnel.prenom} ${selectedPersonnel.nom} a été supprimé de la base`,
        '/gestion-personnels'
      );
      // ==========================
      
      fetchPersonnels();
      setShowDeleteModal(false);
      setSelectedPersonnel(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleView = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setEditFormData({
      ...personnel,
      poste: personnel.poste || '',
      corps: personnel.corps || '',
      indice: personnel.indice || '',
      grade: personnel.grade || '',
    });
    setIsEditing(false);
    if (personnel.id_direction) {
      fetchServicesByDirection(personnel.id_direction);
    }
    setShowViewModal(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(selectedPersonnel!);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'id_direction') {
      fetchServicesByDirection(parseInt(value));
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedPersonnel) return;
    try {
      await api.put(`/personnels/${selectedPersonnel.id}`, editFormData);
      
      // === NOTIFICATION AJOUTÉE ===
      triggerNotification(
        'info',
        '✏️ Personnel modifié',
        `Les informations de ${editFormData.prenom} ${editFormData.nom} ont été mises à jour`,
        '/gestion-personnels'
      );
      // ==========================
      
      fetchPersonnels();
      setIsEditing(false);
      alert('Personnel modifié avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    }
  };

  const getSortIcon = (field: keyof Personnel) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faArrowDown} className="sort-icon-inactive" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon-active" />
      : <FontAwesomeIcon icon={faArrowDown} className="sort-icon-active" />;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Matricule', 'Nom', 'Prénom', 'CIN', 'Téléphone', 'Genre', 'Direction', 'Service', 'Poste', 'Corps', 'Indice', 'Grade', 'Date entrée', 'Statut'];
    const csvData = filteredPersonnels.map(p => [
      p.id, p.matricule || '-', p.nom, p.prenom, p.numero_cin, p.tel || '-', 
      p.genre === 'M' ? 'Masculin' : 'Féminin',
      p.direction || '-', p.service || '-', p.poste || '-',
      p.corps || '-', p.indice || '-', p.grade || '-',
      new Date(p.date_entree).toLocaleDateString('fr-FR'), p.etat || 'Actif'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personnels_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statsCards = [
    { title: 'Total personnels', value: personnels.length, icon: faUsers },
    { title: 'Actifs', value: personnels.filter(p => p.etat === 'Actif').length, icon: faUserCheck },
    { title: 'Hommes', value: personnels.filter(p => p.genre === 'M').length, icon: faVenusMars },
    { title: 'Femmes', value: personnels.filter(p => p.genre === 'F').length, icon: faVenusMars },
  ];

  const itemsPerPage = 20;
  const displayedPersonnels = filteredPersonnels.slice(0, page * itemsPerPage);

  const getTypeMobiliteLabel = (type: string) => {
    switch(type) {
      case 'formation': return 'Formation';
      case 'mission': return 'Mission';
      case 'detachement': return 'Détachement';
      case 'stage': return 'Stage';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="gestion-personnels">
      {/* Header */}
      <div className="gestion-header">
        <div>
          <h1><FontAwesomeIcon icon={faUsers} /> Liste des personnels</h1>
          <p>Liste complète des employés recrutés</p>
        </div>
        <Link to="/recrutement" className="btn-primary">
          <FontAwesomeIcon icon={faPlus} />
          Nouveau recrutement
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        {statsCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <FontAwesomeIcon icon={card.icon} className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, CIN, matricule, corps, grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions-group">
          <button className="btn-outline" onClick={exportToCSV}>
            <FontAwesomeIcon icon={faDownload} />
            Exporter
          </button>
          <button className="btn-outline" onClick={fetchPersonnels}>
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
            <p>Chargement des personnels...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('matricule')}>Matricule {getSortIcon('matricule')}</th>
                    <th onClick={() => handleSort('nom')}>Nom complet {getSortIcon('nom')}</th>
                    <th onClick={() => handleSort('numero_cin')}>CIN {getSortIcon('numero_cin')}</th>
                    <th>Téléphone</th>
                    <th onClick={() => handleSort('genre')}>Genre {getSortIcon('genre')}</th>
                    <th>Direction</th>
                    <th>Service</th>
                    <th>Poste</th>
                    <th>Corps</th>
                    <th>Indice</th>
                    <th>Grade</th>
                    <th onClick={() => handleSort('date_entree')}>Date entrée {getSortIcon('date_entree')}</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPersonnels.map((personnel, index) => (
                    <tr 
                      key={personnel.id} 
                      ref={index === displayedPersonnels.length - 1 ? lastRowRef : null}
                    >
                      <td className="matricule">{personnel.matricule || `#${personnel.id}`}</td>
                      <td className="name">{personnel.nom} {personnel.prenom}</td>
                      <td>{personnel.numero_cin}</td>
                      <td>{personnel.tel || '-'}</td>
                      <td>{personnel.genre === 'M' ? 'Masculin' : 'Féminin'}</td>
                      <td>{personnel.direction || '-'}</td>
                      <td>{personnel.service || '-'}</td>
                      <td>{personnel.poste || '-'}</td>
                      <td className="code-cell">{personnel.corps || '-'}</td>
                      <td className="code-cell">{personnel.indice || '-'}</td>
                      <td className="code-cell">{personnel.grade || '-'}</td>
                      <td>{new Date(personnel.date_entree).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <span className={`status ${personnel.etat === 'Actif' ? 'status-active' : 'status-inactive'}`}>
                          {personnel.etat || 'Actif'}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="action-view" onClick={() => handleView(personnel)}>
                          <FontAwesomeIcon icon={faEye} />
                          Voir
                        </button>
                        <button className="action-delete" onClick={() => { setSelectedPersonnel(personnel); setShowDeleteModal(true); }}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loadingMore && (
              <div className="loading-more">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Chargement...</span>
              </div>
            )}

            {displayedPersonnels.length === 0 && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faUsers} />
                <p>Aucun personnel trouvé</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer ce personnel ?</p>
              <div className="delete-info">
                <strong>{selectedPersonnel.nom} {selectedPersonnel.prenom}</strong>
                <span>CIN: {selectedPersonnel.numero_cin}</span>
                <span>Matricule: {selectedPersonnel.matricule || selectedPersonnel.id}</span>
              </div>
              <p className="warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={handleDelete}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPersonnel && !isEditing && (
        <div className="modal-overlay" onClick={() => { setShowViewModal(false); }}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faUserTie} />
                Détails du personnel
              </h3>
              <button className="modal-close" onClick={() => { setShowViewModal(false); }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="profile-summary">
                <div className="avatar">
                  <span>{selectedPersonnel.nom.charAt(0)}{selectedPersonnel.prenom.charAt(0)}</span>
                </div>
                <div>
                  <h4>{selectedPersonnel.nom} {selectedPersonnel.prenom}</h4>
                  <span className={`status ${selectedPersonnel.etat === 'Actif' ? 'status-active' : 'status-inactive'}`}>
                    {selectedPersonnel.etat || 'Actif'}
                  </span>
                </div>
              </div>
              <div className="details-grid">
                <div className="detail">
                  <label><FontAwesomeIcon icon={faIdCard} /> Matricule</label>
                  <span>{selectedPersonnel.matricule || selectedPersonnel.id}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faIdCard} /> CIN</label>
                  <span>{selectedPersonnel.numero_cin}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faPhone} /> Téléphone</label>
                  <span>{selectedPersonnel.tel || '-'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faVenusMars} /> Genre</label>
                  <span>{selectedPersonnel.genre === 'M' ? 'Masculin' : 'Féminin'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> Date naissance</label>
                  <span>{new Date(selectedPersonnel.date_naissance).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> Date entrée</label>
                  <span>{new Date(selectedPersonnel.date_entree).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faBuilding} /> Direction</label>
                  <span>{selectedPersonnel.direction || '-'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faBriefcase} /> Service</label>
                  <span>{selectedPersonnel.service || '-'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faUserTie} /> Poste</label>
                  <span>{selectedPersonnel.poste || '-'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faTag} /> Corps</label>
                  <span>{selectedPersonnel.corps || '-'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faLayerGroup} /> Indice</label>
                  <span>{selectedPersonnel.indice || '-'}</span>
                </div>
                <div className="detail">
                  <label><FontAwesomeIcon icon={faGraduationCap} /> Grade</label>
                  <span>{selectedPersonnel.grade || '-'}</span>
                </div>
                <div className="detail">
                  <label>Motif entrée</label>
                  <span>{selectedPersonnel.motif_entree || '-'}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-edit" onClick={handleEdit}>
                <FontAwesomeIcon icon={faPen} /> Modifier
              </button>
              <button className="btn-history" onClick={() => openHistoriqueModal(selectedPersonnel)}>
                <FontAwesomeIcon icon={faHistory} /> Historique
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showViewModal && selectedPersonnel && isEditing && (
        <div className="modal-overlay" onClick={() => { setIsEditing(false); }}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faPen} />
                Modifier le personnel
              </h3>
              <button className="modal-close" onClick={() => { setIsEditing(false); }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Matricule</label>
                    <input type="text" name="matricule" value={editFormData.matricule || ''} onChange={handleEditChange} placeholder="Ex: RH-001" />
                  </div>
                  <div className="form-group">
                    <label>Nom </label>
                    <input type="text" name="nom" value={editFormData.nom || ''} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom </label>
                    <input type="text" name="prenom" value={editFormData.prenom || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>CIN </label>
                    <input type="text" name="numero_cin" value={editFormData.numero_cin || ''} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="tel" value={editFormData.tel || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Genre </label>
                    <select name="genre" value={editFormData.genre || 'M'} onChange={handleEditChange}>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date naissance </label>
                    <input type="date" name="date_naissance" value={editFormData.date_naissance || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Date entrée </label>
                    <input type="date" name="date_entree" value={editFormData.date_entree || ''} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Motif entrée</label>
                    <input type="text" name="motif_entree" value={editFormData.motif_entree || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Direction </label>
                    <select name="id_direction" value={editFormData.id_direction || ''} onChange={handleEditChange}>
                      <option value="">Sélectionner</option>
                      {directions.map(d => <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Service </label>
                    <select name="id_service" value={editFormData.id_service || ''} onChange={handleEditChange}>
                      <option value="">Sélectionner</option>
                      {services.map(s => <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Poste *</label>
                    <input type="text" name="poste" value={editFormData.poste || ''} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faTag} /> Corps</label>
                    <input type="text" name="corps" value={editFormData.corps || ''} onChange={handleEditChange} placeholder="Ex: Ingénieur, Technicien..." />
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faLayerGroup} /> Indice</label>
                    <input type="text" name="indice" value={editFormData.indice || ''} onChange={handleEditChange} placeholder="Ex: 450, 430..." />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faGraduationCap} /> Grade</label>
                    <input type="text" name="grade" value={editFormData.grade || ''} onChange={handleEditChange} placeholder="Ex: Principal, Supérieur..." />
                  </div>
                  <div className="form-group">
                    <label>État </label>
                    <select name="etat" value={editFormData.etat || 'Actif'} onChange={handleEditChange}>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancelEdit}>
                <FontAwesomeIcon icon={faTimes} /> Annuler
              </button>
              <button className="btn-save" onClick={handleSaveEdit}>
                <FontAwesomeIcon icon={faSave} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historique Modal - Séparé */}
      {showHistoriqueModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowHistoriqueModal(false)}>
          <div className="modal modal-historique" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faHistory} />
                Historique complet - {selectedPersonnel.prenom} {selectedPersonnel.nom}
              </h3>
              <button className="modal-close" onClick={() => setShowHistoriqueModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body historique-body">
              {/* Section Informations générales du recrutement */}
              <div className="recrutement-info">
                <h4>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Informations du recrutement
                </h4>
                <div className="info-grid-historique">
                  <div className="info-item">
                    <label>Date d'entrée</label>
                    <span>{formatDate(selectedPersonnel.date_entree)}</span>
                  </div>
                  <div className="info-item">
                    <label>Motif d'entrée</label>
                    <span>{selectedPersonnel.motif_entree || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Direction</label>
                    <span>{selectedPersonnel.direction || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Service</label>
                    <span>{selectedPersonnel.service || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Poste</label>
                    <span>{selectedPersonnel.poste || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Catégorie</label>
                    <span>{selectedPersonnel.categorie || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Corps</label>
                    <span>{selectedPersonnel.corps || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Indice</label>
                    <span>{selectedPersonnel.indice || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Grade</label>
                    <span>{selectedPersonnel.grade || '-'}</span>
                  </div>
                  <div className="info-item">
                    <label>Statut actuel</label>
                    <span className={`status-badge ${selectedPersonnel.etat === 'Actif' ? 'status-active' : 'status-inactive'}`}>
                      {selectedPersonnel.etat || 'Actif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section Historique des mobilités */}
              <div className="mobilites-historique">
                <h4>
                  <FontAwesomeIcon icon={faExchangeAlt} />
                  Historique des mobilités
                </h4>
                {historiqueMobilites.length === 0 ? (
                  <div className="no-historique">
                    <FontAwesomeIcon icon={faHistory} />
                    <p>Aucune mobilité enregistrée pour ce personnel</p>
                  </div>
                ) : (
                  <div className="mobilites-list">
                    {historiqueMobilites.map((mob, index) => (
                      <div key={mob.id_disposition} className="mobilite-card">
                        <div className="mobilite-header">
                          <span className={`mobilite-type ${mob.type_mobilite}`}>
                            {getTypeMobiliteLabel(mob.type_mobilite)}
                          </span>
                          <span className="mobilite-periode">
                            <FontAwesomeIcon icon={faCalendar} />
                            {formatDate(mob.date_debut)} → {formatDate(mob.date_fin)}
                          </span>
                        </div>
                        <div className="mobilite-path">
                          <div className="path-origine">
                            <FontAwesomeIcon icon={faHome} />
                            <span>{mob.provenance}</span>
                          </div>
                          <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                          <div className="path-destination">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>{mob.destination}</span>
                          </div>
                        </div>
                        <div className="mobilite-footer">
                          <span className={`statut-mobilite ${mob.statut}`}>
                            {mob.statut === 'en_cours' ? 'En cours' : mob.statut === 'depasse' ? 'Dépassé' : 'Terminé'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowHistoriqueModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPersonnels;