// src/pages/GestionPersonnels.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faSearch, faTrashAlt, faEye, faPlus,
  faArrowUp, faArrowDown, faDownload, faSyncAlt,
  faUserCheck, faMars, faIdCard, faPhone, faCalendarAlt, faVenus,
  faBuilding, faBriefcase, faUserTie, faSave, faTimes,
  faPen, faSpinner, faTag, faLayerGroup, faGraduationCap,
  faHistory, faExchangeAlt, faHome, faArrowRight,
  faFilter, faTimesCircle, faUserPlus, faChartLine, faCheckCircle
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

interface Anciennete {
  ancien_poste: string | null;
  ancien_direction: string | null;
  ancien_service: string | null;
  ancien_employeur: string | null;
  date_debut: string | null;
  date_fin: string | null;
  motif_depart: string | null;
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

const getCategorieRomaine = (categorie: string | null | undefined): string => {
  if (!categorie) return '-';
  const map: Record<string, string> = {
    'A1': 'I',
    'A2': 'II',
    'B1': 'III',
    'B2': 'IV',
    'C1': 'V',
    'C2': 'VI'
  };
  return map[categorie] || categorie;
};

const GestionPersonnels: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [filteredPersonnels, setFilteredPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ direction: 'all', service: 'all', statut: 'all', categorie: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Personnel>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [historiqueMobilites, setHistoriqueMobilites] = useState<HistoriqueMobilite[]>([]);
  const [anciennete, setAnciennete] = useState<Anciennete | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Personnel>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchPersonnels();
    fetchSelectData();
  }, []);

  useEffect(() => {
    filterAndSortPersonnels();
  }, [personnels, searchTerm, sortField, sortDirection, filters]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && filteredPersonnels.length > 20) loadMore();
    }, { threshold: 0.5 });
    if (lastRowRef.current) observerRef.current.observe(lastRowRef.current);
    return () => observerRef.current?.disconnect();
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
    } catch (error) { console.error('Erreur:', error); } 
    finally { setLoading(false); }
  };

  const fetchHistoriquePersonnel = async (personnelId: number) => {
    try {
      const response = await api.get(`/situation-personnels/personnel/${personnelId}`);
      setHistoriqueMobilites(response.data);
    } catch (error) { console.error('Erreur:', error); setHistoriqueMobilites([]); }
  };

  const fetchAnciennetePersonnel = async (personnelId: number) => {
    try {
      const response = await api.get(`/personnels/${personnelId}/anciennete`);
      setAnciennete(response.data);
    } catch (error) { console.error('Erreur:', error); setAnciennete(null); }
  };

  const openHistoriqueModal = async (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    await Promise.all([fetchHistoriquePersonnel(personnel.id), fetchAnciennetePersonnel(personnel.id)]);
    setShowHistoriqueModal(true);
  };

  const loadMore = () => { setLoadingMore(true); setTimeout(() => { setPage(prev => prev + 1); setLoadingMore(false); }, 500); };
  const fetchSelectData = async () => { try { const [directionsRes] = await Promise.all([api.get('/directions')]); setDirections(directionsRes.data); } catch (error) { console.error('Erreur:', error); } };
  const fetchServicesByDirection = async (directionId: number) => { try { const response = await api.get(`/services/direction/${directionId}`); setFilteredServices(response.data); } catch (error) { console.error('Erreur:', error); } };

  const compareValues = (a: unknown, b: unknown) => {
    if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
    if (b === null || b === undefined) return 1;
    if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b, 'fr', { numeric: true });
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), 'fr', { numeric: true });
  };

  const filterAndSortPersonnels = () => {
    let filtered = [...personnels];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(lowerSearch) ||
        p.prenom?.toLowerCase().includes(lowerSearch) ||
        p.numero_cin?.includes(searchTerm) ||
        p.id?.toString().includes(searchTerm) ||
        p.matricule?.toLowerCase().includes(lowerSearch) ||
        p.corps?.toLowerCase().includes(lowerSearch) ||
        p.grade?.toLowerCase().includes(lowerSearch)
      );
    }
    if (filters.direction !== 'all') filtered = filtered.filter(p => p.id_direction === parseInt(filters.direction, 10));
    if (filters.service !== 'all') filtered = filtered.filter(p => p.id_service === parseInt(filters.service, 10));
    if (filters.statut !== 'all') filtered = filtered.filter(p => p.etat === filters.statut);
    if (filters.categorie !== 'all') filtered = filtered.filter(p => p.categorie === filters.categorie);
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const result = compareValues(aVal, bVal);
      return sortDirection === 'asc' ? result : -result;
    });
    setFilteredPersonnels(filtered);
    setPage(1);
  };

  const handleSort = (field: keyof Personnel) => { setSortField(field); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); };
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'direction' ? { service: 'all' } : {})
    }));
    if (key === 'direction') {
      if (value !== 'all') {
        fetchServicesByDirection(parseInt(value, 10));
      } else {
        setFilteredServices([]);
      }
    }
  };

  const resetFilters = () => {
    setFilters({ direction: 'all', service: 'all', statut: 'all', categorie: 'all' });
    setSearchTerm('');
    setFilteredServices([]);
    setShowFilters(false);
  };

  const handleDelete = async () => {
    if (!selectedPersonnel) return;
    try {
      await api.delete(`/personnels/${selectedPersonnel.id}`);
      triggerNotification('warning', '🗑️ Personnel supprimé', `${selectedPersonnel.prenom} ${selectedPersonnel.nom} a été supprimé de la base`, '/gestion-personnels');
      fetchPersonnels();
      setShowDeleteModal(false);
      setSelectedPersonnel(null);
    } catch (error) { console.error('Erreur:', error); alert('Erreur lors de la suppression'); }
  };

  const handleView = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setEditFormData({ ...personnel, poste: personnel.poste || '', corps: personnel.corps || '', indice: personnel.indice || '', grade: personnel.grade || '' });
    setIsEditing(false);
    if (personnel.id_direction) fetchServicesByDirection(personnel.id_direction);
    setShowViewModal(true);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => { setIsEditing(false); setEditFormData(selectedPersonnel!); };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'id_direction') {
      if (value) {
        fetchServicesByDirection(parseInt(value, 10));
      } else {
        setFilteredServices([]);
        setEditFormData(prev => ({ ...prev, id_service: undefined }));
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedPersonnel) return;
    try {
      await api.put(`/personnels/${selectedPersonnel.id}`, editFormData);
      triggerNotification('info', '✏️ Personnel modifié', `Les informations de ${editFormData.prenom} ${editFormData.nom} ont été mises à jour`, '/gestion-personnels');
      fetchPersonnels();
      setIsEditing(false);
      alert('Personnel modifié avec succès');
    } catch (error) { console.error('Erreur:', error); alert('Erreur lors de la modification'); }
  };

  const getSortIcon = (field: keyof Personnel) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faArrowDown} className="sort-icon-inactive" />;
    return sortDirection === 'asc' ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon-active" /> : <FontAwesomeIcon icon={faArrowDown} className="sort-icon-active" />;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Matricule', 'Nom', 'Prénom', 'CIN', 'Téléphone', 'Genre', 'Direction', 'Service', 'Poste', 'Catégorie', 'Corps', 'Indice', 'Grade', 'Date entrée', 'Statut'];
    const csvData = filteredPersonnels.map(p => [
      p.id, p.matricule || '-', p.nom, p.prenom, p.numero_cin, p.tel || '-', p.genre === 'M' ? 'Masculin' : 'Féminin',
      p.direction || '-', p.service || '-', p.poste || '-', getCategorieRomaine(p.categorie), p.corps || '-', p.indice || '-', p.grade || '-',
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
    { title: 'Hommes', value: personnels.filter(p => p.genre === 'M').length, icon: faMars },
    { title: 'Femmes', value: personnels.filter(p => p.genre === 'F').length, icon: faVenus },
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const categoriesOptions = [
    { value: 'A1', label: 'Catégorie I' }, { value: 'A2', label: 'Catégorie II' },
    { value: 'B1', label: 'Catégorie III' }, { value: 'B2', label: 'Catégorie IV' },
    { value: 'C1', label: 'Catégorie V' }, { value: 'C2', label: 'Catégorie VI' }
  ];

  return (
    <div className="gestion-personnels">
      {/* Header */}
      <div className="gestion-header">
        <div><h1><FontAwesomeIcon icon={faUsers} /> Gestion des personnels</h1><p>Liste complète des employés recrutés</p></div>
        <Link to="/recrutement" className="btn-primary"><FontAwesomeIcon icon={faPlus} /> Nouveau recrutement</Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        {statsCards.map((card, i) => (<div className="stat-card" key={i}><FontAwesomeIcon icon={card.icon} className="stat-icon" /><div className="stat-info"><span className="stat-value">{card.value}</span><span className="stat-label">{card.title}</span></div></div>))}
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="actions-group">
          <button className="btn-filter" onClick={() => setShowFilters(!showFilters)}><FontAwesomeIcon icon={faFilter} /> Filtres {(filters.direction !== 'all' || filters.service !== 'all' || filters.statut !== 'all' || filters.categorie !== 'all') && <span className="filter-active-badge">●</span>}</button>
          <button className="btn-outline" onClick={exportToCSV}><FontAwesomeIcon icon={faDownload} /> Exporter</button>
          <button className="btn-outline" onClick={fetchPersonnels}><FontAwesomeIcon icon={faSyncAlt} /> Rafraîchir</button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header"><h4><FontAwesomeIcon icon={faFilter} /> Filtres avancés</h4><button onClick={resetFilters} className="reset-filters"><FontAwesomeIcon icon={faTimesCircle} /> Réinitialiser</button></div>
          <div className="filters-grid">
            <div className="filter-group"><label>Direction</label><select value={filters.direction} onChange={(e) => handleFilterChange('direction', e.target.value)}><option value="all">Toutes les directions</option>{directions.map(d => (<option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>))}</select></div>
            <div className="filter-group"><label>Service</label><select value={filters.service} onChange={(e) => handleFilterChange('service', e.target.value)} disabled={filters.direction === 'all'}><option value="all">Tous les services</option>{filteredServices.map(s => (<option key={s.id_service} value={s.id_service}>{s.nom_service}</option>))}</select></div>
            <div className="filter-group"><label>Statut</label><select value={filters.statut} onChange={(e) => handleFilterChange('statut', e.target.value)}><option value="all">Tous les statuts</option><option value="Actif">Actif</option><option value="Inactif">Inactif</option></select></div>
            <div className="filter-group"><label>Catégorie</label><select value={filters.categorie} onChange={(e) => handleFilterChange('categorie', e.target.value)}><option value="all">Toutes les catégories</option>{categoriesOptions.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}</select></div>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="table-container">
        {loading ? (<div className="loading-state"><FontAwesomeIcon icon={faSpinner} spin /><p>Chargement des personnels...</p></div>) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th onClick={() => handleSort('matricule')}>Matricule {getSortIcon('matricule')}</th><th onClick={() => handleSort('nom')}>Nom complet {getSortIcon('nom')}</th><th onClick={() => handleSort('numero_cin')}>CIN {getSortIcon('numero_cin')}</th><th>Téléphone</th><th onClick={() => handleSort('genre')}>Genre {getSortIcon('genre')}</th><th>Direction</th><th>Service</th><th>Poste</th><th>Catégorie</th><th>Corps</th><th>Indice</th><th>Grade</th><th onClick={() => handleSort('date_entree')}>Date entrée {getSortIcon('date_entree')}</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {displayedPersonnels.map((personnel, index) => (
                    <tr key={personnel.id} ref={index === displayedPersonnels.length - 1 ? lastRowRef : null} className="personnel-row">
                      <td className="matricule">{personnel.matricule || `#${personnel.id}`}</td>
                      <td className="name">{personnel.nom} {personnel.prenom}</td>
                      <td>{personnel.numero_cin}</td>
                      <td>{personnel.tel || '-'}</td>
                      <td>{personnel.genre === 'M' ? (<span className="gender-badge male"><FontAwesomeIcon icon={faMars} /> Masculin</span>) : (<span className="gender-badge female"><FontAwesomeIcon icon={faVenus} /> Féminin</span>)}</td>
                      <td>{personnel.direction || '-'}</td>
                      <td>{personnel.service || '-'}</td>
                      <td>{personnel.poste || '-'}</td>
                      <td className="categorie-cell"><span className="categorie-romain">{getCategorieRomaine(personnel.categorie)}</span></td>
                      <td className="code-cell">{personnel.corps || '-'}</td>
                      <td className="code-cell">{personnel.indice || '-'}</td>
                      <td className="code-cell">{personnel.grade || '-'}</td>
                      <td>{new Date(personnel.date_entree).toLocaleDateString('fr-FR')}</td>
                      <td>{personnel.etat === 'Actif' ? (<span className="status-badge status-active"><FontAwesomeIcon icon={faCheckCircle} /> Actif</span>) : (<span className="status-badge status-inactive"><FontAwesomeIcon icon={faTimesCircle} /> Inactif</span>)}</td>
                      <td className="actions"><button className="action-view" onClick={() => handleView(personnel)}><FontAwesomeIcon icon={faEye} /> Voir</button><button className="action-delete" onClick={() => { setSelectedPersonnel(personnel); setShowDeleteModal(true); }}><FontAwesomeIcon icon={faTrashAlt} /> Supprimer</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {loadingMore && (<div className="loading-more"><FontAwesomeIcon icon={faSpinner} spin /><span>Chargement...</span></div>)}
            {displayedPersonnels.length === 0 && (<div className="empty-state"><FontAwesomeIcon icon={faUsers} /><p>Aucun personnel trouvé</p></div>)}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Confirmer la suppression</h3><button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button></div>
            <div className="modal-body"><p>Êtes-vous sûr de vouloir supprimer ce personnel ?</p><div className="delete-info"><strong>{selectedPersonnel.nom} {selectedPersonnel.prenom}</strong><span>CIN: {selectedPersonnel.numero_cin}</span><span>Matricule: {selectedPersonnel.matricule || selectedPersonnel.id}</span></div><p className="warning">Cette action est irréversible.</p></div>
            <div className="modal-footer"><button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button><button className="btn-confirm" onClick={handleDelete}>Confirmer</button></div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPersonnel && !isEditing && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3><FontAwesomeIcon icon={faUserTie} /> Détails du personnel</h3><button className="modal-close" onClick={() => setShowViewModal(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
            <div className="modal-body">
              <div className="profile-summary"><div className="avatar"><span>{selectedPersonnel.nom.charAt(0)}{selectedPersonnel.prenom.charAt(0)}</span></div><div><h4>{selectedPersonnel.nom} {selectedPersonnel.prenom}</h4>{selectedPersonnel.etat === 'Actif' ? (<span className="status-badge status-active"><FontAwesomeIcon icon={faCheckCircle} /> Actif</span>) : (<span className="status-badge status-inactive"><FontAwesomeIcon icon={faTimesCircle} /> Inactif</span>)}</div></div>
              <div className="details-grid">
                <div className="detail"><label><FontAwesomeIcon icon={faIdCard} /> Matricule</label><span>{selectedPersonnel.matricule || selectedPersonnel.id}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faIdCard} /> CIN</label><span>{selectedPersonnel.numero_cin}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faPhone} /> Téléphone</label><span>{selectedPersonnel.tel || '-'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faMars} /> Genre</label><span>{selectedPersonnel.genre === 'M' ? 'Masculin' : 'Féminin'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faCalendarAlt} /> Date naissance</label><span>{new Date(selectedPersonnel.date_naissance).toLocaleDateString('fr-FR')}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faCalendarAlt} /> Date entrée</label><span>{new Date(selectedPersonnel.date_entree).toLocaleDateString('fr-FR')}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faBuilding} /> Direction</label><span>{selectedPersonnel.direction || '-'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faBriefcase} /> Service</label><span>{selectedPersonnel.service || '-'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faUserTie} /> Poste</label><span>{selectedPersonnel.poste || '-'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faTag} /> Catégorie</label><span>{getCategorieRomaine(selectedPersonnel.categorie)}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faLayerGroup} /> Corps</label><span>{selectedPersonnel.corps || '-'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faGraduationCap} /> Indice</label><span>{selectedPersonnel.indice || '-'}</span></div>
                <div className="detail"><label><FontAwesomeIcon icon={faGraduationCap} /> Grade</label><span>{selectedPersonnel.grade || '-'}</span></div>
                <div className="detail"><label>Motif entrée</label><span>{selectedPersonnel.motif_entree || '-'}</span></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn-edit" onClick={handleEdit}><FontAwesomeIcon icon={faPen} /> Modifier</button><button className="btn-history" onClick={() => openHistoriqueModal(selectedPersonnel)}><FontAwesomeIcon icon={faHistory} /> Historique</button></div>
          </div>
        </div>
      )}

      {/* Edit Modal - AVEC FORMULAIRE COMPLET */}
      {showViewModal && selectedPersonnel && isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FontAwesomeIcon icon={faPen} /> Modifier le personnel</h3>
              <button className="modal-close" onClick={() => setIsEditing(false)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="modal-body">
              <div className="edit-form">
                {/* Ligne 1: Matricule et Nom */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Matricule</label>
                    <input type="text" name="matricule" value={editFormData.matricule || ''} onChange={handleEditChange} placeholder="Ex: RH-001" />
                  </div>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input type="text" name="nom" value={editFormData.nom || ''} onChange={handleEditChange} />
                  </div>
                </div>

                {/* Ligne 2: Prénom et CIN */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input type="text" name="prenom" value={editFormData.prenom || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>CIN *</label>
                    <input type="text" name="numero_cin" value={editFormData.numero_cin || ''} onChange={handleEditChange} />
                  </div>
                </div>

                {/* Ligne 3: Téléphone et Genre */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="tel" value={editFormData.tel || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Genre *</label>
                    <select name="genre" value={editFormData.genre || 'M'} onChange={handleEditChange}>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>

                {/* Ligne 4: Date naissance et Date entrée */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Date naissance *</label>
                    <input type="date" name="date_naissance" value={editFormData.date_naissance || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Date entrée *</label>
                    <input type="date" name="date_entree" value={editFormData.date_entree || ''} onChange={handleEditChange} />
                  </div>
                </div>

                {/* Ligne 5: Motif entrée et Direction */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Motif entrée</label>
                    <input type="text" name="motif_entree" value={editFormData.motif_entree || ''} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Direction *</label>
                    <select name="id_direction" value={editFormData.id_direction || ''} onChange={handleEditChange}>
                      <option value="">Sélectionner</option>
                      {directions.map(d => (<option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>))}
                    </select>
                  </div>
                </div>

                {/* Ligne 6: Service et Poste */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Service *</label>
                    <select name="id_service" value={editFormData.id_service || ''} onChange={handleEditChange} disabled={!editFormData.id_direction}>
                      <option value="">Sélectionner</option>
                      {filteredServices.map(s => (<option key={s.id_service} value={s.id_service}>{s.nom_service}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Poste *</label>
                    <input type="text" name="poste" value={editFormData.poste || ''} onChange={handleEditChange} />
                  </div>
                </div>

                {/* Ligne 7: Corps et Indice */}
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

                {/* Ligne 8: Grade et État */}
                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faGraduationCap} /> Grade</label>
                    <input type="text" name="grade" value={editFormData.grade || ''} onChange={handleEditChange} placeholder="Ex: Principal, Supérieur..." />
                  </div>
                  <div className="form-group">
                    <label>État *</label>
                    <select name="etat" value={editFormData.etat || 'Actif'} onChange={handleEditChange}>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancelEdit}><FontAwesomeIcon icon={faTimes} /> Annuler</button>
              <button className="btn-save" onClick={handleSaveEdit}><FontAwesomeIcon icon={faSave} /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Historique Modal */}
      {showHistoriqueModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowHistoriqueModal(false)}>
          <div className="modal modal-historique" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FontAwesomeIcon icon={faHistory} /> Parcours professionnel - {selectedPersonnel.prenom} {selectedPersonnel.nom}</h3>
              <button className="modal-close" onClick={() => setShowHistoriqueModal(false)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="modal-body historique-body">

              {/* Section 1: Identité et poste actuel */}
              <div className="historique-card">
                <div className="card-header"><div className="card-icon"><FontAwesomeIcon icon={faUserTie} /></div><h4>Identité et poste actuel</h4></div>
                <div className="card-body">
                  <div className="info-row"><label>Matricule :</label><span>{selectedPersonnel.matricule || `#${selectedPersonnel.id}`}</span></div>
                  <div className="info-row"><label>Nom complet :</label><span>{selectedPersonnel.nom} {selectedPersonnel.prenom}</span></div>
                  <div className="info-row"><label>Poste actuel :</label><span>{selectedPersonnel.poste || 'Non défini'}</span></div>
                  <div className="info-row"><label>Direction :</label><span>{selectedPersonnel.direction || '-'}</span></div>
                  <div className="info-row"><label>Service :</label><span>{selectedPersonnel.service || '-'}</span></div>
                  <div className="info-row"><label>Statut :</label><span className={selectedPersonnel.etat === 'Actif' ? 'text-success' : 'text-danger'}>{selectedPersonnel.etat || 'Actif'}</span></div>
                </div>
              </div>

              {/* Section 2: Ancienneté */}
              <div className="historique-card">
                <div className="card-header"><div className="card-icon"><FontAwesomeIcon icon={faBriefcase} /></div><h4>Ancienneté - Parcours avant INSTAT</h4></div>
                <div className="card-body">
                  {(anciennete && (anciennete.ancien_poste || anciennete.ancien_direction || anciennete.ancien_employeur)) ? (
                    <div className="anciennete-grid">
                      {anciennete.ancien_employeur && <div className="info-row"><label>Employeur précédent :</label><span>{anciennete.ancien_employeur}</span></div>}
                      {anciennete.ancien_poste && <div className="info-row"><label>Poste occupé :</label><span>{anciennete.ancien_poste}</span></div>}
                      {anciennete.ancien_direction && <div className="info-row"><label>Direction / Service :</label><span>{anciennete.ancien_direction}</span></div>}
                      {(anciennete.date_debut || anciennete.date_fin) && <div className="info-row"><label>Période :</label><span>{formatDate(anciennete.date_debut)} - {formatDate(anciennete.date_fin) || 'Présent'}</span></div>}
                      {anciennete.motif_depart && <div className="info-row"><label>Motif du départ :</label><span>{anciennete.motif_depart}</span></div>}
                    </div>
                  ) : (<div className="empty-message"><FontAwesomeIcon icon={faBriefcase} /><p>Aucune information sur l'ancienneté disponible</p></div>)}
                </div>
              </div>

              {/* Section 3: Recrutement à l'INSTAT */}
              <div className="historique-card">
                <div className="card-header"><div className="card-icon"><FontAwesomeIcon icon={faUserPlus} /></div><h4>Recrutement à l'INSTAT</h4></div>
                <div className="card-body">
                  <div className="info-row"><label>Date d'entrée :</label><span>{formatDate(selectedPersonnel.date_entree)}</span></div>
                  <div className="info-row"><label>Motif d'entrée :</label><span>{selectedPersonnel.motif_entree || '-'}</span></div>
                  <div className="info-row"><label>Direction d'affectation :</label><span>{selectedPersonnel.direction || '-'}</span></div>
                  <div className="info-row"><label>Service d'affectation :</label><span>{selectedPersonnel.service || '-'}</span></div>
                  <div className="info-row"><label>Poste à l'arrivée :</label><span>{selectedPersonnel.poste || '-'}</span></div>
                </div>
              </div>

              {/* Section 4: Évolution de carrière */}
              <div className="historique-card">
                <div className="card-header"><div className="card-icon"><FontAwesomeIcon icon={faChartLine} /></div><h4>Évolution de carrière</h4></div>
                <div className="card-body">
                  <div className="carriere-items">
                    <div className="carriere-item"><label>Catégorie</label><span className="categorie-value">{getCategorieRomaine(selectedPersonnel.categorie)}</span></div>
                    <div className="carriere-item"><label>Corps</label><span>{selectedPersonnel.corps || '-'}</span></div>
                    <div className="carriere-item"><label>Indice</label><span>{selectedPersonnel.indice || '-'}</span></div>
                    <div className="carriere-item"><label>Grade</label><span>{selectedPersonnel.grade || '-'}</span></div>
                  </div>
                </div>
              </div>

              {/* Section 5: Historique des mobilités */}
              <div className="historique-card">
                <div className="card-header"><div className="card-icon"><FontAwesomeIcon icon={faExchangeAlt} /></div><h4>Historique des mobilités</h4></div>
                <div className="card-body">
                  {historiqueMobilites.length === 0 ? (
                    <div className="empty-message"><FontAwesomeIcon icon={faExchangeAlt} /><p>Aucune mobilité enregistrée</p></div>
                  ) : (
                    <div className="mobilites-timeline">
                      {historiqueMobilites.map((mob, index) => (
                        <div key={mob.id_disposition} className="timeline-mob-item">
                          <div className="timeline-mob-marker"><div className="marker-dot"></div>{index < historiqueMobilites.length - 1 && <div className="marker-line"></div>}</div>
                          <div className="timeline-mob-content">
                            <div className="mob-header"><span className={`mob-type ${mob.type_mobilite}`}>{getTypeMobiliteLabel(mob.type_mobilite)}</span><span className="mob-date"><FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(mob.date_debut)} → {formatDate(mob.date_fin)}</span></div>
                            <div className="mob-path"><div className="path-from"><FontAwesomeIcon icon={faHome} /> {mob.provenance}</div><FontAwesomeIcon icon={faArrowRight} className="path-arrow" /><div className="path-to"><FontAwesomeIcon icon={faBuilding} /> {mob.destination}</div></div>
                            <div className="mob-status"><span className={`status-badge-mob ${mob.statut}`}>{mob.statut === 'en_cours' ? 'En cours' : mob.statut === 'depasse' ? 'Dépassé' : 'Terminé'}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 6: Informations personnelles */}
              <div className="historique-card">
                <div className="card-header"><div className="card-icon"><FontAwesomeIcon icon={faIdCard} /></div><h4>Informations personnelles</h4></div>
                <div className="card-body">
                  <div className="info-row"><label>CIN :</label><span>{selectedPersonnel.numero_cin}</span></div>
                  <div className="info-row"><label>Téléphone :</label><span>{selectedPersonnel.tel || '-'}</span></div>
                  <div className="info-row"><label>Genre :</label><span>{selectedPersonnel.genre === 'M' ? 'Masculin' : 'Féminin'}</span></div>
                  <div className="info-row"><label>Date de naissance :</label><span>{formatDate(selectedPersonnel.date_naissance)}</span></div>
                </div>
              </div>

            </div>
            <div className="modal-footer"><button className="btn-cancel" onClick={() => setShowHistoriqueModal(false)}>Fermer</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPersonnels;