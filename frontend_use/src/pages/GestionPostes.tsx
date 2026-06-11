// src/pages/GestionPostes.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave, faSyncAlt, faBuilding, faChevronLeft, faChevronRight,
  faSpinner, faFilter, faLightbulb, faInfoCircle, faTags
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/gestion-postes.css';

interface Poste {
  id_poste: number;
  titre_poste: string;
  description: string;
  id_direction: number;
  id_service: number;
  direction_nom?: string;
  service_nom?: string;
  categorie?: string;
  niveau?: string;
  salaire_base?: number;
  competences?: string;
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

// Suggestions de postes par direction et service
const suggestionsPostes: Record<string, string[]> = {
  // Direction Générale
  'Direction Générale - Direction': ['Directeur Général', 'Directeur Général Adjoint', 'Secrétaire Général', 'Chef de Cabinet'],
  'Direction Générale - Secrétariat': ['Assistant de Direction', 'Secrétaire de Direction', 'Assistant Exécutif'],
  
  // Direction des Ressources Humaines
  'DRH - Direction': ['Directeur des RH', 'Directeur RH Adjoint', 'Chef de Département RH'],
  'DRH - Recrutement': ['Responsable Recrutement', 'Chargé de Recrutement', 'Assistant Recrutement'],
  'DRH - Formation': ['Responsable Formation', 'Chargé de Formation', 'Coordinateur Formation'],
  'DRH - Paie': ['Responsable Paie', 'Gestionnaire Paie', 'Assistant Paie'],
  'DRH - Administration': ['Gestionnaire RH', 'Administrateur RH', 'Chargé d\'Administration'],
  
  // Direction des Systèmes d'Information
  'DSI - Direction': ['Directeur des Systèmes d\'Information', 'Directeur Technique', 'Chef de Projet SI'],
  'DSI - Développement': ['Chef de projet Développement', 'Développeur Full Stack', 'Développeur Front-end', 'Développeur Back-end', 'Intégrateur Web'],
  'DSI - Infrastructure': ['Responsable Infrastructure', 'Administrateur Systèmes et Réseaux', 'Technicien Support', 'Administrateur Base de Données'],
  'DSI - Sécurité': ['Responsable Sécurité Informatique', 'Analyste Sécurité', 'Ingénieur Cybersécurité'],
  'DSI - Data': ['Data Analyst', 'Data Scientist', 'Ingénieur Données', 'Data Engineer'],
  
  // Direction Administrative et Financière
  'DAF - Direction': ['Directeur Administratif et Financier', 'Directeur Financier', 'Directeur Administratif'],
  'DAF - Comptabilité': ['Chef Comptable', 'Comptable', 'Assistant Comptable', 'Comptable Matières'],
  'DAF - Finances': ['Responsable Financier', 'Analyste Financier', 'Contrôleur de Gestion'],
  'DAF - Budget': ['Responsable Budget', 'Chargé de Budget', 'Analyste Budgétaire'],
  'DAF - Achats': ['Responsable Achats', 'Chargé d\'Achats', 'Gestionnaire Approvisionnement'],
  
  // Direction des Statistiques
  'DS - Direction': ['Directeur des Statistiques', 'Directeur des Études', 'Chef de Département Statistique'],
  'DS - Études': ['Chef de Projet Études', 'Chargé d\'Études Statistiques', 'Analyste Statistique'],
  'DS - Enquêtes': ['Responsable Enquêtes', 'Chef d\'Enquête', 'Enquêteur', 'Superviseur Enquête'],
  'DS - Démographie': ['Démographe', 'Chargé d\'Études Démographiques', 'Analyste Démographique'],
  'DS - Economie': ['Économiste', 'Chargé d\'Études Économiques', 'Analyste Économique'],
  
  // Direction de la Communication
  'DCOM - Direction': ['Directeur de la Communication', 'Directeur Marketing', 'Responsable Communication'],
  'DCOM - Communication': ['Responsable Communication', 'Chargé de Communication', 'Community Manager', 'Rédacteur Web'],
  'DCOM - Relations Publiques': ['Responsable Relations Publiques', 'Chargé des Relations Publiques', 'Attaché de Presse'],
  'DCOM - Événementiel': ['Responsable Événementiel', 'Chargé d\'Événements', 'Coordinateur Événementiel'],
  
  // Direction Juridique
  'DJ - Direction': ['Directeur Juridique', 'Directeur des Affaires Juridiques', 'Chef du Service Juridique'],
  'DJ - Juridique': ['Juriste', 'Juriste d\'Entreprise', 'Assistant Juridique', 'Avocat'],
  'DJ - Contentieux': ['Responsable Contentieux', 'Chargé de Contentieux', 'Juriste Contentieux'],
  
  // Direction de la Qualité
  'DQ - Direction': ['Directeur Qualité', 'Responsable Qualité', 'Chef de Projet Qualité'],
  'DQ - Qualité': ['Responsable Assurance Qualité', 'Chargé Qualité', 'Auditeur Qualité', 'Contrôleur Qualité'],
  'DQ - Processus': ['Responsable Amélioration Continue', 'Chargé d\'Optimisation', 'Analyste Processus'],
  
  // Direction Commerciale
  'DC - Direction': ['Directeur Commercial', 'Directeur des Ventes', 'Directeur Marketing Commercial'],
  'DC - Commercial': ['Responsable Commercial', 'Commercial', 'Chargé d\'Affaires', 'Conseiller Commercial'],
  'DC - Ventes': ['Responsable des Ventes', 'Chargé des Ventes', 'Conseiller de Vente'],
  
  // Direction Technique
  'DT - Direction': ['Directeur Technique', 'Directeur Ingénierie', 'Directeur des Opérations'],
  'DT - Technique': ['Ingénieur', 'Technicien Supérieur', 'Technicien', 'Assistant Technique'],
  'DT - Maintenance': ['Responsable Maintenance', 'Technicien Maintenance', 'Ingénieur Maintenance'],
  
  // Direction de la Recherche
  'DR - Direction': ['Directeur de la Recherche', 'Directeur Scientifique', 'Chef de Département Recherche'],
  'DR - Recherche': ['Chercheur', 'Ingénieur de Recherche', 'Assistant de Recherche', 'Doctorant'],
  'DR - Innovation': ['Responsable Innovation', 'Ingénieur R&D', 'Chargé d\'Innovation'],
  
  // Par défaut
  'default': ['Agent Administratif', 'Assistant', 'Stagiaire', 'Consultant', 'Analyste', 'Coordinateur', 'Responsable']
};

const GestionPostes: React.FC = () => {
  const [postes, setPostes] = useState<Poste[]>([]);
  const [filteredPostes, setFilteredPostes] = useState<Poste[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingPoste, setEditingPoste] = useState<Poste | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Poste | null>(null);
  
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  
  // Suggestions de postes
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [formData, setFormData] = useState({
    titre_poste: '',
    description: '',
    id_direction: '',
    id_service: '',
    categorie: '',
    niveau: '',
    salaire_base: '',
    competences: ''
  });

  useEffect(() => {
    fetchPostes();
    fetchDirections();
    fetchServices();
  }, []);

  useEffect(() => {
    filterPostes();
  }, [postes, searchTerm, filterDirection, filterService]);

  useEffect(() => {
    if (formData.id_direction) {
      const dirId = parseInt(formData.id_direction);
      const dir = directions.find(d => d.id_direction === dirId);
      const selectedService = services.find(s => s.id_service === parseInt(formData.id_service));
      
      // Générer des suggestions basées sur la direction et le service
      let suggestionKey = '';
      
      if (selectedService && dir) {
        suggestionKey = `${dir.nom_direction} - ${selectedService.nom_service}`;
      } else if (dir) {
        suggestionKey = `${dir.nom_direction}`;
      }
      
      // Chercher dans les suggestions
      let matchedSuggestions: string[] = [];
      if (suggestionsPostes[suggestionKey]) {
        matchedSuggestions = suggestionsPostes[suggestionKey];
      } else {
        // Chercher une correspondance partielle
        for (const key in suggestionsPostes) {
          if (key.includes(suggestionKey.split(' - ')[0]) && (suggestionKey.split(' - ')[1] === '' || key.includes(suggestionKey.split(' - ')[1] || ''))) {
            matchedSuggestions = suggestionsPostes[key];
            break;
          }
        }
      }
      
      if (matchedSuggestions.length === 0) {
        matchedSuggestions = suggestionsPostes['default'];
      }
      
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [formData.id_direction, formData.id_service, directions, services]);

  const fetchPostes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/postes');
      setPostes(response.data);
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

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchServicesByDirection = async (directionId: number) => {
    try {
      const response = await api.get(`/services/direction/${directionId}`);
      setFilteredServices(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filterPostes = () => {
    let filtered = [...postes];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.titre_poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.direction_nom && p.direction_nom.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterDirection !== 'all') {
      filtered = filtered.filter(p => p.id_direction === parseInt(filterDirection));
    }
    
    if (filterService !== 'all') {
      filtered = filtered.filter(p => p.id_service === parseInt(filterService));
    }
    
    setFilteredPostes(filtered);
    setCurrentPage(1);
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, id_direction: value, id_service: '' }));
    if (value) {
      fetchServicesByDirection(parseInt(value));
    } else {
      setFilteredServices([]);
    }
    setSelectedSuggestion('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setFormData(prev => ({ ...prev, titre_poste: suggestion }));
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedSuggestion('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const posteData = {
        titre_poste: formData.titre_poste,
        description: formData.description,
        id_direction: parseInt(formData.id_direction),
        id_service: parseInt(formData.id_service),
        categorie: formData.categorie,
        niveau: formData.niveau,
        salaire_base: formData.salaire_base ? parseFloat(formData.salaire_base) : null,
        competences: formData.competences
      };
      
      if (editingPoste) {
        await api.put(`/postes/${editingPoste.id_poste}`, posteData);
      } else {
        await api.post('/postes', posteData);
      }
      await fetchPostes();
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
      await api.delete(`/postes/${deleteConfirm.id_poste}`);
      await fetchPostes();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingPoste(null);
    setFormData({
      titre_poste: '',
      description: '',
      id_direction: '',
      id_service: '',
      categorie: '',
      niveau: '',
      salaire_base: '',
      competences: ''
    });
    setSelectedSuggestion('');
    setSuggestions([]);
    setFilteredServices([]);
    setShowModal(true);
  };

  const openEditModal = (poste: Poste) => {
    setEditingPoste(poste);
    setFormData({
      titre_poste: poste.titre_poste,
      description: poste.description || '',
      id_direction: poste.id_direction.toString(),
      id_service: poste.id_service.toString(),
      categorie: poste.categorie || '',
      niveau: poste.niveau || '',
      salaire_base: poste.salaire_base?.toString() || '',
      competences: poste.competences || ''
    });
    if (poste.id_direction) {
      fetchServicesByDirection(poste.id_direction);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPoste(null);
    setShowSuggestions(false);
  };

  const getDirectionName = (id: number) => {
    const dir = directions.find(d => d.id_direction === id);
    return dir ? dir.nom_direction : '-';
  };

  const getServiceName = (id: number) => {
    const serv = services.find(s => s.id_service === id);
    return serv ? serv.nom_service : '-';
  };

  const totalPages = Math.ceil(filteredPostes.length / itemsPerPage);
  const paginatedPostes = filteredPostes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: postes.length,
    parDirection: directions.map(d => ({
      nom: d.nom_direction,
      count: postes.filter(p => p.id_direction === d.id_direction).length
    })).filter(d => d.count > 0)
  };

  return (
    <div className="postes-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <FontAwesomeIcon icon={faBriefcase} />
            Gestion des postes
          </h1>
          <p>Créez et gérez les postes par direction et service</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} />
          Nouveau poste
        </button>
      </div>

      {/* Statistiques */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon poste-total">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total postes</span>
          </div>
        </div>
        {stats.parDirection.slice(0, 3).map((dir, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon poste-dir">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{dir.count}</span>
              <span className="stat-label">{dir.nom.length > 20 ? dir.nom.substring(0, 20) + '...' : dir.nom}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters-group">
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
          <select 
            className="filter-select"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            disabled={filterDirection === 'all'}
          >
            <option value="all">Tous les services</option>
            {services.filter(s => filterDirection === 'all' || s.id_direction === parseInt(filterDirection)).map(s => (
              <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des postes */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Chargement des postes...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Intitulé du poste</th>
                    <th>Direction</th>
                    <th>Service</th>
                    <th>Catégorie</th>
                    <th>Niveau</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPostes.map((poste) => (
                    <tr key={poste.id_poste}>
                      <td className="id-cell">#{poste.id_poste}</td>
                      <td className="title-cell">{poste.titre_poste}</td>
                      <td>{getDirectionName(poste.id_direction)}</td>
                      <td>{getServiceName(poste.id_service)}</td>
                      <td>{poste.categorie || '-'}</td>
                      <td>{poste.niveau || '-'}</td>
                      <td className="actions-cell">
                        <button className="action-edit" onClick={() => openEditModal(poste)}>
                          <FontAwesomeIcon icon={faEdit} />
                          Modifier
                        </button>
                        <button className="action-delete" onClick={() => setDeleteConfirm(poste)}>
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

            {filteredPostes.length === 0 && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faBriefcase} />
                <p>Aucun poste trouvé</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Ajout/Modification avec suggestions */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faBriefcase} />
                {editingPoste ? 'Modifier le poste' : 'Nouveau poste'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faBuilding} /> Direction *</label>
                    <select 
                      name="id_direction" 
                      value={formData.id_direction} 
                      onChange={handleDirectionChange} 
                      required
                    >
                      <option value="">Sélectionner une direction</option>
                      {directions.map(d => (
                        <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FontAwesomeIcon icon={faBriefcase} /> Service *</label>
                    <select 
                      name="id_service" 
                      value={formData.id_service} 
                      onChange={handleInputChange} 
                      required
                      disabled={!formData.id_direction}
                    >
                      <option value="">
                        {formData.id_direction ? "Sélectionner un service" : "Choisissez d'abord une direction"}
                      </option>
                      {filteredServices.map(s => (
                        <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group suggestion-group">
                  <label><FontAwesomeIcon icon={faTags} /> Intitulé du poste *</label>
                  <div className="suggestion-input-wrapper">
                    <input
                      type="text"
                      name="titre_poste"
                      value={formData.titre_poste}
                      onChange={handleInputChange}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Ex: Développeur Full Stack, Responsable RH..."
                      required
                      autoComplete="off"
                    />
                    {suggestions.length > 0 && !formData.titre_poste && (
                      <button 
                        type="button" 
                        className="suggestion-trigger"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                      >
                        <FontAwesomeIcon icon={faLightbulb} />
                      </button>
                    )}
                  </div>
                  
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-list">
                      <div className="suggestions-header">
                        <FontAwesomeIcon icon={faLightbulb} />
                        <span>Suggestions pour ce poste :</span>
                      </div>
                      <div className="suggestions-items">
                        {suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <FontAwesomeIcon icon={faTags} />
                            <span>{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select name="categorie" value={formData.categorie} onChange={handleInputChange}>
                      <option value="">Sélectionner une catégorie</option>
                      <option value="A1">A1 - Cadre Supérieur</option>
                      <option value="A2">A2 - Cadre Moyen</option>
                      <option value="B1">B1 - Technicien Supérieur</option>
                      <option value="B2">B2 - Technicien</option>
                      <option value="C1">C1 - Agent d'Exécution</option>
                      <option value="C2">C2 - Agent de Service</option>
                    </select>
                  </div>
                  {/* <div className="form-group">
                    <label>Niveau</label>
                    <select name="niveau" value={formData.niveau} onChange={handleInputChange}>
                      <option value="">Sélectionner un niveau</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Confirmé">Confirmé</option>
                      <option value="Senior">Senior</option>
                      <option value="Expert">Expert</option>
                      <option value="Manager">Manager</option>
                      <option value="Directeur">Directeur</option>
                    </select>
                  </div> */}
                </div>

                {/* <div className="form-row">
                  <div className="form-group">
                    <label>Salaire de base (Ar)</label>
                    <input 
                      type="number" 
                      name="salaire_base" 
                      value={formData.salaire_base} 
                      onChange={handleInputChange}
                      placeholder="Ex: 750000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Compétences requises</label>
                    <input 
                      type="text" 
                      name="competences" 
                      value={formData.competences} 
                      onChange={handleInputChange}
                      placeholder="Ex: JavaScript, PHP, SQL, Gestion d'équipe..."
                    />
                  </div>
                </div> */}

                <div className="form-group">
                  <label>Description du poste</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Décrivez les missions et responsabilités du poste..."
                  />
                </div>

                <div className="info-box">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Les suggestions de postes sont basées sur la direction et le service sélectionnés.</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn-save">
                  <FontAwesomeIcon icon={faSave} />
                  {editingPoste ? 'Modifier' : 'Ajouter'}
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
              <p>Supprimer le poste :</p>
              <div className="delete-preview">
                <strong>{deleteConfirm.titre_poste}</strong>
                <span>{getDirectionName(deleteConfirm.id_direction)} - {getServiceName(deleteConfirm.id_service)}</span>
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

export default GestionPostes;