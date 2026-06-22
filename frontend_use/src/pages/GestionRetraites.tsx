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
  faEnvelope,
  faGraduationCap,
  faTag,
  faLayerGroup,
  faHistory,
  faFilter,
  faChevronDown,
  faChevronUp,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/gestion-retraites.css';

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
}

interface HistoriqueRetraite {
  id: number;
  id_personnel: number;
  date_sortie: string;
  motif: string;
  commentaire?: string;
  created_at: string;
}

const GestionRetraites: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [retraites, setRetraites] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonnels, setSelectedPersonnels] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedRetraite, setSelectedRetraite] = useState<Personnel | null>(null);
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [historiqueRetraite, setHistoriqueRetraite] = useState<HistoriqueRetraite[]>([]);
  const [activeTab, setActiveTab] = useState<'eligible' | 'retraites'>('eligible');
  const [filterMois, setFilterMois] = useState<string>('');
  const [filterAnnee, setFilterAnnee] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedPersonnelHistorique, setSelectedPersonnelHistorique] = useState<Personnel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const personnelsRes = await api.get('/personnels');
      const directionsRes = await api.get('/directions');
      const servicesRes = await api.get('/services');

      // Calculer l'âge et la date de retraite (60 ans)
      const personnelsWithData = personnelsRes.data.map((p: Personnel) => {
        const age = calculateAge(p.date_naissance);
        const { mois, annee } = getRetraiteDate(p.date_naissance);
        return {
          ...p,
          age,
          mois_retraite: mois,
          annee_retraite: annee,
          direction_nom: directionsRes.data.find((d: any) => d.id_direction === p.id_direction)?.nom_direction || '',
          service_nom: servicesRes.data.find((s: any) => s.id_service === p.id_service)?.nom_service || '',
        };
      });

      // Filtrer les personnels actifs
      const actifs = personnelsWithData.filter((p: Personnel) => p.statut === 'actif');
      setPersonnels(actifs);

      // Récupérer les retraités
      const retraitesList = personnelsWithData.filter((p: Personnel) => p.statut === 'retraite');
      setRetraites(retraitesList);

    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de charger les données');
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
    const mois = birthDate.getMonth() + 1; // 1-12
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
    
    // Vérifier si la personne a 60 ans ET si le mois de retraite est passé ou en cours
    if (personnel.age > 60) return true;
    if (personnel.age === 60) {
      const retraiteMois = personnel.mois_retraite || 0;
      const retraiteAnnee = personnel.annee_retraite || 0;
      if (retraiteAnnee < currentYear) return true;
      if (retraiteAnnee === currentYear && retraiteMois <= currentMonth) return true;
    }
    return false;
  };

  const personnelsEligibles = personnels.filter(p => isEligible(p));

  // Filtrer par mois
  const filterByMonth = (list: Personnel[]) => {
    if (!filterMois) return list;
    return list.filter(p => p.mois_retraite === parseInt(filterMois));
  };

  // Filtrer par année
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
      alert('Veuillez sélectionner au moins un personnel');
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

      alert(`${selectedPersonnels.size} personnel(s) mis à la retraite avec succès`);
      await fetchData();
      setSelectedPersonnels(new Set());

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à la retraite');
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
      alert('Retraite annulée avec succès');
      await fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'annulation');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRetraite = (personnel: Personnel) => {
    setSelectedRetraite(personnel);
    setShowModal(true);
  };

  const handleViewHistorique = async (personnel: Personnel) => {
    setSelectedPersonnelHistorique(personnel);
    setLoading(true);
    try {
      // Simulation de données historiques - à remplacer par votre API
      const historiqueData: HistoriqueRetraite[] = [
        {
          id: 1,
          id_personnel: personnel.id_personnel,
          date_sortie: personnel.date_sortie || new Date().toISOString().split('T')[0],
          motif: 'Retraite anticipée',
          commentaire: 'Départ volontaire',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          id_personnel: personnel.id_personnel,
          date_sortie: '2023-06-15',
          motif: 'Retraite normale',
          commentaire: 'Atteinte de l\'âge légal',
          created_at: '2023-06-15'
        }
      ];
      setHistoriqueRetraite(historiqueData);
      setShowHistoriqueModal(true);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de charger l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpand = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredEligibles = filterByMonth(filterByYear(personnelsEligibles))
    .filter(p => {
      const nomComplet = `${p.prenom} ${p.nom}`;
      return nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const filteredRetraites = retraites.filter(p => {
    const nomComplet = `${p.prenom} ${p.nom}`;
    return nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.matricule.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Générer les options des mois
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

  // Générer les options des années
  const currentYear = new Date().getFullYear();
  const anneeOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    anneeOptions.push(i);
  }

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

      {/* Filtres */}
      <div className="retraite-filters">
        <div className="filter-group search">
          <FontAwesomeIcon icon={faSearch} className="filter-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === 'eligible' && (
          <>
            <div className="filter-group">
              <FontAwesomeIcon icon={faCalendarAlt} className="filter-icon" />
              <select value={filterMois} onChange={(e) => setFilterMois(e.target.value)}>
                <option value="">Tous les mois</option>
                {moisOptions.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <FontAwesomeIcon icon={faCalendarAlt} className="filter-icon" />
              <select value={filterAnnee} onChange={(e) => setFilterAnnee(e.target.value)}>
                <option value="">Toutes les années</option>
                {anneeOptions.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Contenu */}
      <div className="retraite-content">
        {activeTab === 'eligible' ? (
          <div className="eligible-section">
            {/* Actions */}
            <div className="retraite-actions">
              <div className="selection-info">
                {selectedPersonnels.size > 0 && (
                  <span>{selectedPersonnels.size} personnel(s) sélectionné(s)</span>
                )}
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

            {/* Tableau Éligibles */}
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
                    <th>Matricule</th>
                    <th>Nom complet</th>
                    <th>Âge</th>
                    <th>Retraite prévue</th>
                    <th>Date entrée</th>
                    <th>Ancienneté</th>
                    <th>Direction</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEligibles.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="no-data">
                        <FontAwesomeIcon icon={faUser} />
                        <p>Aucun personnel éligible trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEligibles.map((p) => (
                      <React.Fragment key={p.id_personnel}>
                        <tr className="eligible-row">
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
                          <td>
                            {p.mois_retraite && p.annee_retraite ? (
                              <span className="retraite-date-prevue">
                                {moisOptions.find(m => parseInt(m.value) === p.mois_retraite)?.label} {p.annee_retraite}
                              </span>
                            ) : '-'}
                          </td>
                          <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
                          <td>{calculateAnciennete(p.date_entree)} ans</td>
                          <td>{p.direction_nom}</td>
                          <td className="actions-cell">
                            <button 
                              className="btn-view"
                              onClick={() => handleViewRetraite(p)}
                              title="Voir les détails"
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                            <button 
                              className="btn-history"
                              onClick={() => handleViewHistorique(p)}
                              title="Voir l'historique"
                            >
                              <FontAwesomeIcon icon={faHistory} />
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="retraites-section">
            {/* Tableau Retraités */}
            <div className="retraite-table-container">
              <table className="retraite-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom complet</th>
                    <th>Date entrée</th>
                    <th>Date sortie</th>
                    <th>Motif</th>
                    <th>Direction</th>
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
                            className="btn-view"
                            onClick={() => handleViewRetraite(p)}
                            title="Voir les détails"
                          >
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                          <button 
                            className="btn-history"
                            onClick={() => handleViewHistorique(p)}
                            title="Voir l'historique"
                          >
                            <FontAwesomeIcon icon={faHistory} />
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
                  <label>Poste</label>
                  <p>{selectedRetraite.poste_titre || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Catégorie</label>
                  <p>{selectedRetraite.categorie}</p>
                </div>
                <div className="detail-item">
                  <label>Grade</label>
                  <p>{selectedRetraite.grade}</p>
                </div>
                <div className="detail-item">
                  <label>Corps</label>
                  <p>{selectedRetraite.corps}</p>
                </div>
                <div className="detail-item">
                  <label>Indice</label>
                  <p>{selectedRetraite.indice}</p>
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
      {showHistoriqueModal && selectedPersonnelHistorique && (
        <div className="modal-overlay" onClick={() => setShowHistoriqueModal(false)}>
          <div className="modal-container historique-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faHistory} />
                Historique - {selectedPersonnelHistorique.prenom} {selectedPersonnelHistorique.nom}
              </h2>
              <button className="modal-close" onClick={() => setShowHistoriqueModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="historique-list">
                {historiqueRetraite.length === 0 ? (
                  <div className="no-historique">
                    <FontAwesomeIcon icon={faFileAlt} />
                    <p>Aucun historique disponible</p>
                  </div>
                ) : (
                  historiqueRetraite.map((h) => (
                    <div key={h.id} className="historique-item">
                      <div className="historique-header">
                        <span className="historique-date">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          {new Date(h.date_sortie).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="historique-motif">{h.motif}</span>
                      </div>
                      {h.commentaire && (
                        <div className="historique-commentaire">
                          <FontAwesomeIcon icon={faInfoCircle} />
                          {h.commentaire}
                        </div>
                      )}
                      <div className="historique-footer">
                        <span className="historique-created">
                          Enregistré le : {new Date(h.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
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