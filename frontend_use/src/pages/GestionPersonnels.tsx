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
  faPen, faSpinner, faTag, faLayerGroup, faGraduationCap, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

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
  // Nouveaux champs
  corps_code?: string | null;
  indice?: string | null;
  grade_code?: string | null;
  region_code?: string | null;
  region_libelle?: string | null;
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

  // Infinite scroll observer
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
        corps_code: p.corps_code ?? null,
        indice: p.indice ?? null,
        grade_code: p.grade_code ?? null,
        region_code: p.region_code ?? null,
        region_libelle: p.region_libelle ?? null,
      }));
      setPersonnels(mappedData);
      setHasMore(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
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
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numero_cin.includes(searchTerm) ||
        p.id.toString().includes(searchTerm) ||
        (p.corps_code && p.corps_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.grade_code && p.grade_code.toLowerCase().includes(searchTerm.toLowerCase()))
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
      corps_code: personnel.corps_code || '',
      indice: personnel.indice || '',
      grade_code: personnel.grade_code || '',
      region_code: personnel.region_code || '',
      region_libelle: personnel.region_libelle || '',
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
    const headers = ['ID', 'Nom', 'Prénom', 'CIN', 'Téléphone', 'Genre', 'Direction', 'Service', 'Poste', 'Date entrée', 'Statut', 'Code Corps', 'Indice', 'Grade', 'Région'];
    const csvData = filteredPersonnels.map(p => [
      p.id, p.nom, p.prenom, p.numero_cin, p.tel, p.genre === 'M' ? 'Masculin' : 'Féminin',
      p.direction || '-', p.service || '-', p.poste || '-',
      new Date(p.date_entree).toLocaleDateString('fr-FR'), p.etat || 'Actif',
      p.corps_code || '-', p.indice || '-', p.grade_code || '-', p.region_libelle || p.region_code || '-'
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

  return (
    <div className="gestion-personnels">
      {/* Header */}
      <div className="gestion-header">
        <div>
          <h1><FontAwesomeIcon icon={faUsers} /> Gestion des personnels</h1>
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
            placeholder="Rechercher par nom, prénom, CIN, corps, grade..."
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
                    <th onClick={() => handleSort('id')}>Matricule {getSortIcon('id')}</th>
                    <th onClick={() => handleSort('nom')}>Nom complet {getSortIcon('nom')}</th>
                    <th onClick={() => handleSort('numero_cin')}>CIN {getSortIcon('numero_cin')}</th>
                    <th>Téléphone</th>
                    <th onClick={() => handleSort('genre')}>Genre {getSortIcon('genre')}</th>
                    <th>Direction</th>
                    <th>Service</th>
                    <th>Poste</th>
                    <th>Code Corps</th>
                    <th>Indice</th>
                    <th>Grade</th>
                    <th>Région</th>
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
                      <td className="matricule">{personnel.matricule || personnel.id || '-'}</td>
                      <td className="name">{personnel.nom} {personnel.prenom}</td>
                      <td>{personnel.numero_cin}</td>
                      <td>{personnel.tel || '-'}</td>
                      <td>{personnel.genre === 'M' ? 'Masculin' : 'Féminin'}</td>
                      <td>{personnel.direction || '-'}</td>
                      <td>{personnel.service || '-'}</td>
                      <td>{personnel.poste || '-'}</td>
                      <td><span className="badge-code">{personnel.corps_code || '-'}</span></td>
                      <td>{personnel.indice || '-'}</td>
                      <td>{personnel.grade_code || '-'}</td>
                      <td>{personnel.region_libelle || personnel.region_code || '-'}</td>
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

      {/* View/Edit Modal */}
      {showViewModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => { setShowViewModal(false); setIsEditing(false); }}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={isEditing ? faPen : faUserTie} />
                {isEditing ? 'Modifier le personnel' : 'Détails du personnel'}
              </h3>
              <button className="modal-close" onClick={() => { setShowViewModal(false); setIsEditing(false); }}>✕</button>
            </div>
            
            <div className="modal-body">
              {!isEditing ? (
                <>
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
                      <label><FontAwesomeIcon icon={faTag} /> Code Corps</label>
                      <span>{selectedPersonnel.corps_code || '-'}</span>
                    </div>
                    <div className="detail">
                      <label><FontAwesomeIcon icon={faLayerGroup} /> Indice</label>
                      <span>{selectedPersonnel.indice || '-'}</span>
                    </div>
                    <div className="detail">
                      <label><FontAwesomeIcon icon={faGraduationCap} /> Grade</label>
                      <span>{selectedPersonnel.grade_code || '-'}</span>
                    </div>
                    <div className="detail">
                      <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Région</label>
                      <span>{selectedPersonnel.region_libelle || selectedPersonnel.region_code || '-'}</span>
                    </div>
                    <div className="detail">
                      <label>Motif entrée</label>
                      <span>{selectedPersonnel.motif_entree || '-'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom *</label>
                      <input type="text" name="nom" value={editFormData.nom || ''} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Prénom *</label>
                      <input type="text" name="prenom" value={editFormData.prenom || ''} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>CIN *</label>
                      <input type="text" name="numero_cin" value={editFormData.numero_cin || ''} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input type="tel" name="tel" value={editFormData.tel || ''} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Genre *</label>
                      <select name="genre" value={editFormData.genre || 'M'} onChange={handleEditChange}>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date naissance *</label>
                      <input type="date" name="date_naissance" value={editFormData.date_naissance || ''} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date entrée *</label>
                      <input type="date" name="date_entree" value={editFormData.date_entree || ''} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Motif entrée</label>
                      <input type="text" name="motif_entree" value={editFormData.motif_entree || ''} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Direction *</label>
                      <select name="id_direction" value={editFormData.id_direction || ''} onChange={handleEditChange}>
                        <option value="">Sélectionner</option>
                        {directions.map(d => <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Service *</label>
                      <select name="id_service" value={editFormData.id_service || ''} onChange={handleEditChange}>
                        <option value="">Sélectionner</option>
                        {services.map(s => <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Poste *</label>
                      <input type="text" name="poste" value={editFormData.poste || ''} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>État *</label>
                      <select name="etat" value={editFormData.etat || 'Actif'} onChange={handleEditChange}>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                      </select>
                    </div>
                  </div>
                  {/* Nouveaux champs pour Corps, Indice, Grade, Région */}
                  <div className="form-row">
                    <div className="form-group">
                      <label><FontAwesomeIcon icon={faTag} /> Code Corps</label>
                      <input type="text" name="corps_code" value={editFormData.corps_code || ''} onChange={handleEditChange} placeholder="Ex: 01, 02..." />
                    </div>
                    <div className="form-group">
                      <label><FontAwesomeIcon icon={faLayerGroup} /> Indice</label>
                      <input type="text" name="indice" value={editFormData.indice || ''} onChange={handleEditChange} placeholder="Ex: 450, 430..." />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FontAwesomeIcon icon={faGraduationCap} /> Grade Code</label>
                      <input type="text" name="grade_code" value={editFormData.grade_code || ''} onChange={handleEditChange} placeholder="Ex: ING-PR, TECH-SUP..." />
                    </div>
                    <div className="form-group">
                      <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Région Code</label>
                      <input type="text" name="region_code" value={editFormData.region_code || ''} onChange={handleEditChange} placeholder="Ex: 01, 02, 03..." />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Région Libellé</label>
                      <input type="text" name="region_libelle" value={editFormData.region_libelle || ''} onChange={handleEditChange} placeholder="Ex: Analamanga, Atsinanana..." />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {!isEditing ? (
                <>
                  <button className="btn-edit" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPen} /> Modifier
                  </button>
                  <button className="btn-cancel" onClick={() => { setShowViewModal(false); setIsEditing(false); }}>Fermer</button>
                </>
              ) : (
                <>
                  <button className="btn-cancel" onClick={handleCancelEdit}>
                    <FontAwesomeIcon icon={faTimes} /> Annuler
                  </button>
                  <button className="btn-save" onClick={handleSaveEdit}>
                    <FontAwesomeIcon icon={faSave} /> Enregistrer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPersonnels;