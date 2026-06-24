// src/pages/GestionRetraites.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendarAlt,
  faBuilding,
  faBriefcase,
  faClock,
  faTimes,
  faSearch,
  faUserSlash,
  faUserCheck,
  faInfoCircle,
  faUndo,
  faIdCard,
  faPhone,
  faHistory,
  faCalendarDay,
  faSort,
  faSortUp,
  faSortDown,
  faEye,
  faCalendarPlus,
  faCalendarCheck,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/gestion-retraites.css';
import { triggerNotification } from '../components/NotificationBell';

interface Personnel {
  id_personnel: number;
  matricule: string;
  nom: string;
  prenom: string;
  genre: string;
  numero_cin: string;
  tel: string;
  email?: string;
  date_naissance: string;
  date_entree: string;
  date_sortie?: string;
  motif_sortie?: string;
  statut: 'actif' | 'inactif' | 'retraite';
  id_direction: number;
  id_service: number;
  id_poste: number;
  categorie: string;
  indice: string;
  corps: string;
  grade: string;
  direction_nom?: string;
  service_nom?: string;
  poste_titre?: string;
  age?: number;
  mois_retraite?: number;
  annee_retraite?: number;
  anciennete?: number;
}

type SortField = 'matricule' | 'nom' | 'age' | 'date_naissance' | 'date_entree' | 'direction_nom';
type SortDirection = 'asc' | 'desc';

const GestionRetraites: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [retraites, setRetraites] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonnels, setSelectedPersonnels] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedRetraite, setSelectedRetraite] = useState<Personnel | null>(null);
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'eligible' | 'retraites'>('eligible');
  const [filterMois, setFilterMois] = useState<string>('');
  const [filterAnnee, setFilterAnnee] = useState<string>('');
  const [searchDateDebut, setSearchDateDebut] = useState<string>('');
  const [searchDateFin, setSearchDateFin] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/personnels');
      const directionsRes = await api.get('/directions');
      const servicesRes = await api.get('/services');

      const personnelsWithData = response.data.map((p: Personnel) => {
        const age = calculateAge(p.date_naissance);
        const { mois, annee } = getRetraiteDate(p.date_naissance);
        const anciennete = calculateAnciennete(p.date_entree);
        return {
          ...p,
          age,
          mois_retraite: mois,
          annee_retraite: annee,
          anciennete,
          direction_nom: directionsRes.data.find((d: any) => d.id_direction === p.id_direction)?.nom_direction || '',
          service_nom: servicesRes.data.find((s: any) => s.id_service === p.id_service)?.nom_service || '',
        };
      });

      // Éligibles = tous sauf retraités
      setPersonnels(personnelsWithData.filter((p: Personnel) => p.statut !== 'retraite'));

      // Retraités = seulement ceux avec statut retraite
      setRetraites(personnelsWithData.filter((p: Personnel) => p.statut === 'retraite'));

    } catch (error) {
      console.error('Erreur:', error);
      triggerNotification('error', '❌ Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateNaissance: string): number => {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getRetraiteDate = (dateNaissance: string): { mois: number; annee: number } => {
    const birthDate = new Date(dateNaissance);
    const mois = birthDate.getMonth() + 1;
    const annee = birthDate.getFullYear() + 60;
    return { mois, annee };
  };

  const calculateAnciennete = (dateEntree: string): number => {
    const entryDate = new Date(dateEntree);
    const today = new Date();
    let years = today.getFullYear() - entryDate.getFullYear();
    const m = today.getMonth() - entryDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < entryDate.getDate())) {
      years--;
    }
    return years;
  };

  const isEligible = (personnel: Personnel): boolean => {
    if (!personnel.age) return false;
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    if (personnel.age > 60) return true;
    if (personnel.age === 60) {
      const retraiteMois = personnel.mois_retraite || 0;
      const retraiteAnnee = personnel.annee_retraite || 0;
      if (retraiteAnnee < currentYear) return true;
      if (retraiteAnnee === currentYear && retraiteMois <= currentMonth) return true;
    }
    return false;
  };

  const advancedSearch = (personnel: Personnel): boolean => {
    if (!searchTerm.trim() && !searchDateDebut && !searchDateFin) return true;

    let match = true;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const nomComplet = `${personnel.prenom} ${personnel.nom}`.toLowerCase();
      match = match && (
        nomComplet.includes(term) ||
        personnel.matricule.toLowerCase().includes(term) ||
        personnel.numero_cin.toLowerCase().includes(term)
      );
    }

    if (searchDateDebut) {
      const dateNaissance = new Date(personnel.date_naissance);
      const debut = new Date(searchDateDebut);
      match = match && dateNaissance >= debut;
    }

    if (searchDateFin) {
      const dateNaissance = new Date(personnel.date_naissance);
      const fin = new Date(searchDateFin);
      match = match && dateNaissance <= fin;
    }

    return match;
  };

  const sortData = (data: Personnel[], field: SortField, direction: SortDirection): Personnel[] => {
    return [...data].sort((a, b) => {
      let aValue: any = a[field] || '';
      let bValue: any = b[field] || '';

      if (field === 'nom') {
        aValue = `${a.prenom} ${a.nom}`;
        bValue = `${b.prenom} ${b.nom}`;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const personnelsEligibles = personnels.filter(p => isEligible(p));

  const filterByMonth = (list: Personnel[]) => {
    if (!filterMois) return list;
    return list.filter(p => p.mois_retraite === parseInt(filterMois));
  };

  const filterByYear = (list: Personnel[]) => {
    if (!filterAnnee) return list;
    return list.filter(p => p.annee_retraite === parseInt(filterAnnee));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredEligibles.map(p => p.id_personnel);
      setSelectedPersonnels(new Set(allIds));
    } else {
      setSelectedPersonnels(new Set());
    }
  };

  const handleSelectPersonnel = (id: number) => {
    const newSelected = new Set(selectedPersonnels);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPersonnels(newSelected);
  };

  const handleMettreEnRetraite = async () => {
    if (selectedPersonnels.size === 0) {
      triggerNotification('warning', '⚠️ Attention', 'Veuillez sélectionner au moins un personnel');
      return;
    }

    if (!window.confirm(`Confirmez-vous la mise à la retraite de ${selectedPersonnels.size} personnel(s) ?`)) {
      return;
    }

    setLoading(true);
    try {
      const ids = Array.from(selectedPersonnels);
      await api.post('/personnels/retraite', { 
        ids, 
        date_sortie: new Date().toISOString().split('T')[0],
        motif: 'retraite'
      });

      triggerNotification('success', '✅ Succès', `${selectedPersonnels.size} personnel(s) mis à la retraite avec succès`);
      await fetchData();
      setSelectedPersonnels(new Set());

    } catch (error) {
      console.error('Erreur:', error);
      triggerNotification('error', '❌ Erreur', 'Erreur lors de la mise à la retraite');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnulerRetraite = async (id: number) => {
    if (!window.confirm('Confirmez-vous l\'annulation de la retraite de ce personnel ?')) {
      return;
    }

    setLoading(true);
    try {
      await api.put(`/personnels/${id}/annuler-retraite`);
      triggerNotification('success', '✅ Succès', 'Retraite annulée avec succès');
      await fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      triggerNotification('error', '❌ Erreur', 'Erreur lors de l\'annulation');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRetraite = (personnel: Personnel) => {
    setSelectedRetraite(personnel);
    setShowModal(true);
  };

  const handleViewHistorique = (personnel: Personnel) => {
    setSelectedRetraite(personnel);
    setShowHistoriqueModal(true);
  };

  const filteredEligibles = sortData(
    filterByMonth(filterByYear(personnelsEligibles)).filter(advancedSearch),
    sortField,
    sortDirection
  );

  const filteredRetraites = sortData(
    retraites.filter(advancedSearch),
    sortField,
    sortDirection
  );

  const moisOptions = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="sort-icon active" />
      : <FontAwesomeIcon icon={faSortDown} className="sort-icon active" />;
  };

  if (loading) {
    return (
      <div className="retraite-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="gestion-retraites-page">
      <div className="retraite-header">
        <h1>
          <FontAwesomeIcon icon={faUserSlash} />
          Gestion des retraites
        </h1>
        <p>Gérez les départs à la retraite du personnel</p>
      </div>

      {/* Statistiques */}
      <div className="retraite-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Personnels éligibles</span>
            <span className="stat-value">{personnelsEligibles.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUserSlash} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Retraités</span>
            <span className="stat-value">{retraites.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total personnels</span>
            <span className="stat-value">{personnels.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="retraite-tabs">
        <button 
          className={`tab-btn ${activeTab === 'eligible' ? 'active' : ''}`}
          onClick={() => setActiveTab('eligible')}
        >
          <FontAwesomeIcon icon={faUserCheck} />
          Éligibles ({personnelsEligibles.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'retraites' ? 'active' : ''}`}
          onClick={() => setActiveTab('retraites')}
        >
          <FontAwesomeIcon icon={faUserSlash} />
          Retraités ({retraites.length})
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="retraite-search-advanced">
        <div className="search-main">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, matricule, CIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>

        <div className="search-filters">
          <div className="filter-group date-filter">
            <FontAwesomeIcon icon={faCalendarDay} className="filter-icon" />
            <input
              type="date"
              placeholder="Date naissance début"
              value={searchDateDebut}
              onChange={(e) => setSearchDateDebut(e.target.value)}
              className="filter-input"
            />
            <span className="filter-separator">à</span>
            <input
              type="date"
              placeholder="Date naissance fin"
              value={searchDateFin}
              onChange={(e) => setSearchDateFin(e.target.value)}
              className="filter-input"
            />
          </div>

          {activeTab === 'eligible' && (
            <>
              <div className="filter-group">
                <FontAwesomeIcon icon={faCalendarPlus} className="filter-icon" />
                <select value={filterMois} onChange={(e) => setFilterMois(e.target.value)} className="filter-select">
                  <option value="">Mois retraite</option>
                  {moisOptions.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <FontAwesomeIcon icon={faCalendarCheck} className="filter-icon" />
                <select value={filterAnnee} onChange={(e) => setFilterAnnee(e.target.value)} className="filter-select">
                  <option value="">Année retraite</option>
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="search-quick-filters">
          <button 
            className={`quick-filter ${!filterMois && !filterAnnee && !searchDateDebut && !searchDateFin ? 'active' : ''}`}
            onClick={() => {
              setFilterMois('');
              setFilterAnnee('');
              setSearchDateDebut('');
              setSearchDateFin('');
              setSearchTerm('');
            }}
          >
            Tous
          </button>
          <button 
            className="quick-filter"
            onClick={() => {
              const today = new Date();
              const debut = new Date(today.getFullYear() - 60, 0, 1);
              const fin = new Date(today.getFullYear() - 60, 11, 31);
              setSearchDateDebut(debut.toISOString().split('T')[0]);
              setSearchDateFin(fin.toISOString().split('T')[0]);
            }}
          >
            60 ans
          </button>
          <button 
            className="quick-filter"
            onClick={() => {
              const today = new Date();
              const debut = new Date(today.getFullYear() - 150, 0, 1);
              const fin = new Date(today.getFullYear() - 61, 11, 31);
              setSearchDateDebut(debut.toISOString().split('T')[0]);
              setSearchDateFin(fin.toISOString().split('T')[0]);
            }}
          >
            + de 60 ans
          </button>
          <button 
            className="quick-filter"
            onClick={() => {
              const today = new Date();
              const mois = today.getMonth() + 1;
              const annee = today.getFullYear();
              setFilterMois(String(mois));
              setFilterAnnee(String(annee));
            }}
          >
            Ce mois-ci
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="retraite-content">
        {activeTab === 'eligible' ? (
          <div className="eligible-section">
            <div className="retraite-actions">
              <div className="selection-info">
                {selectedPersonnels.size > 0 && (
                  <span className="selection-count">{selectedPersonnels.size} sélectionné(s)</span>
                )}
                <span className="result-count">{filteredEligibles.length} résultat(s)</span>
              </div>
              <div className="action-buttons">
                <button 
                  className="btn-select-all"
                  onClick={() => handleSelectAll(selectedPersonnels.size !== filteredEligibles.length)}
                >
                  {selectedPersonnels.size === filteredEligibles.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                </button>
                <button 
                  className="btn-retraite"
                  onClick={handleMettreEnRetraite}
                  disabled={selectedPersonnels.size === 0}
                >
                  <FontAwesomeIcon icon={faUserSlash} />
                  Mettre à la retraite
                </button>
              </div>
            </div>

            <div className="retraite-table-container">
              <table className="retraite-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedPersonnels.size === filteredEligibles.length && filteredEligibles.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th onClick={() => handleSort('matricule')} className="sortable">
                      Matricule {getSortIcon('matricule')}
                    </th>
                    <th onClick={() => handleSort('nom')} className="sortable">
                      Nom complet {getSortIcon('nom')}
                    </th>
                    <th onClick={() => handleSort('age')} className="sortable">
                      Âge {getSortIcon('age')}
                    </th>
                    <th onClick={() => handleSort('date_naissance')} className="sortable">
                      Date naissance {getSortIcon('date_naissance')}
                    </th>
                    <th>Retraite prévue</th>
                    <th onClick={() => handleSort('date_entree')} className="sortable">
                      Date entrée {getSortIcon('date_entree')}
                    </th>
                    <th>Ancienneté</th>
                    <th onClick={() => handleSort('direction_nom')} className="sortable">
                      Direction {getSortIcon('direction_nom')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEligibles.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="no-data">
                        <FontAwesomeIcon icon={faUser} />
                        <p>Aucun personnel éligible trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEligibles.map((p) => (
                      <tr key={p.id_personnel} className="eligible-row">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedPersonnels.has(p.id_personnel)}
                            onChange={() => handleSelectPersonnel(p.id_personnel)}
                          />
                        </td>
                        <td>{p.matricule}</td>
                        <td>
                          <strong>{p.prenom} {p.nom}</strong>
                          <span className="badge-eligible">
                            <FontAwesomeIcon icon={faClock} />
                            {p.age} ans
                          </span>
                        </td>
                        <td>{p.age} ans</td>
                        <td>{new Date(p.date_naissance).toLocaleDateString('fr-FR')}</td>
                        <td>
                          {p.mois_retraite && p.annee_retraite ? (
                            <span className="retraite-date-prevue">
                              {moisOptions.find(m => parseInt(m.value) === p.mois_retraite)?.label} {p.annee_retraite}
                            </span>
                          ) : '-'}
                        </td>
                        <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
                        <td>{p.anciennete} ans</td>
                        <td>{p.direction_nom}</td>
                        <td className="actions-cell">
                          <button 
                            className="btn-history"
                            onClick={() => handleViewHistorique(p)}
                            title="Voir l'historique"
                          >
                            <FontAwesomeIcon icon={faHistory} />
                            Historique
                          </button>
                          <button 
                            className="btn-action-text"
                            onClick={() => handleViewRetraite(p)}
                          >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="retraites-section">
            <div className="retraite-table-container">
              <table className="retraite-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('matricule')} className="sortable">
                      Matricule {getSortIcon('matricule')}
                    </th>
                    <th onClick={() => handleSort('nom')} className="sortable">
                      Nom complet {getSortIcon('nom')}
                    </th>
                    <th onClick={() => handleSort('date_entree')} className="sortable">
                      Date entrée {getSortIcon('date_entree')}
                    </th>
                    <th>Date sortie</th>
                    <th>Motif</th>
                    <th onClick={() => handleSort('direction_nom')} className="sortable">
                      Direction {getSortIcon('direction_nom')}
                    </th>
                    <th>Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRetraites.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="no-data">
                        <FontAwesomeIcon icon={faUserSlash} />
                        <p>Aucun retraité trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRetraites.map((p) => (
                      <tr key={p.id_personnel} className="retraite-row">
                        <td>{p.matricule}</td>
                        <td>
                          <strong>{p.prenom} {p.nom}</strong>
                          <span className="badge-retraite">
                            <FontAwesomeIcon icon={faUserSlash} />
                            Retraité
                          </span>
                        </td>
                        <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
                        <td>{p.date_sortie ? new Date(p.date_sortie).toLocaleDateString('fr-FR') : '-'}</td>
                        <td>
                          <span className="motif-retraite">{p.motif_sortie || 'Retraite'}</span>
                        </td>
                        <td>{p.direction_nom}</td>
                        <td>{p.service_nom}</td>
                        <td className="actions-cell">
                          <button 
                            className="btn-history"
                            onClick={() => handleViewHistorique(p)}
                            title="Voir l'historique"
                          >
                            <FontAwesomeIcon icon={faHistory} />
                            Historique
                          </button>
                          <button 
                            className="btn-action-text"
                            onClick={() => handleViewRetraite(p)}
                          >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Détails
                          </button>
                          <button 
                            className="btn-undo"
                            onClick={() => handleAnnulerRetraite(p.id_personnel)}
                            title="Annuler la retraite"
                          >
                            <FontAwesomeIcon icon={faUndo} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {showModal && selectedRetraite && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faInfoCircle} />
                Détails du personnel
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nom complet</label>
                  <p><strong>{selectedRetraite.prenom} {selectedRetraite.nom}</strong></p>
                </div>
                <div className="detail-item">
                  <label>Matricule</label>
                  <p>{selectedRetraite.matricule}</p>
                </div>
                <div className="detail-item">
                  <label>Numéro CIN</label>
                  <p>{selectedRetraite.numero_cin}</p>
                </div>
                <div className="detail-item">
                  <label>Téléphone</label>
                  <p>{selectedRetraite.tel || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Date de naissance</label>
                  <p>{new Date(selectedRetraite.date_naissance).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="detail-item">
                  <label>Âge</label>
                  <p>{calculateAge(selectedRetraite.date_naissance)} ans</p>
                </div>
                <div className="detail-item">
                  <label>Date d'entrée</label>
                  <p>{new Date(selectedRetraite.date_entree).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="detail-item">
                  <label>Ancienneté</label>
                  <p>{calculateAnciennete(selectedRetraite.date_entree)} ans</p>
                </div>
                <div className="detail-item">
                  <label>Direction</label>
                  <p>{selectedRetraite.direction_nom || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Service</label>
                  <p>{selectedRetraite.service_nom || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Catégorie</label>
                  <p>{selectedRetraite.categorie}</p>
                </div>
                <div className="detail-item">
                  <label>Grade</label>
                  <p>{selectedRetraite.grade}</p>
                </div>
                {selectedRetraite.date_sortie && (
                  <>
                    <div className="detail-item">
                      <label>Date de sortie</label>
                      <p>{new Date(selectedRetraite.date_sortie).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="detail-item">
                      <label>Motif de sortie</label>
                      <p className="motif-retraite">{selectedRetraite.motif_sortie || 'Retraite'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historique */}
      {showHistoriqueModal && selectedRetraite && (
        <div className="modal-overlay" onClick={() => setShowHistoriqueModal(false)}>
          <div className="modal-container historique-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faHistory} />
                Historique - {selectedRetraite.prenom} {selectedRetraite.nom}
              </h2>
              <button className="modal-close" onClick={() => setShowHistoriqueModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="historique-list">
                <div className="historique-item">
                  <div className="historique-header">
                    <span className="historique-date">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {selectedRetraite.date_sortie ? new Date(selectedRetraite.date_sortie).toLocaleDateString('fr-FR') : 'Date non définie'}
                    </span>
                    <span className="historique-motif">{selectedRetraite.motif_sortie || 'Retraite'}</span>
                  </div>
                  <div className="historique-footer">
                    <span className="historique-created">
                      Statut : {selectedRetraite.statut === 'retraite' ? 'Retraité' : 'Actif'}
                    </span>
                  </div>
                </div>
                <div className="historique-item">
                  <div className="historique-header">
                    <span className="historique-date">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {new Date(selectedRetraite.date_entree).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="historique-motif">Entrée en service</span>
                  </div>
                  <div className="historique-footer">
                    <span className="historique-created">
                      Ancienneté : {calculateAnciennete(selectedRetraite.date_entree)} ans
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-close" onClick={() => setShowHistoriqueModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionRetraites;