// src/pages/Directions.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faArrowRight, 
  faArrowLeft,
  faUsers,
  faBuilding,
  faEye,
  faUserPlus,
  faCheckCircle,
  faTimesCircle,
  faCity,
  faMapMarkerAlt,
  faLandmark,
  faUserCheck,
  faChartLine,
  faList,
  faPlus,
  faEdit,
  faTrashAlt,
  faTimes,
  faSave,
  faEye as faEyeIcon,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

interface Direction {
  id_direction: number;
  nom_direction: string;
  type: 'centrale' | 'regionale' | 'provinciale';
  description?: string;
  nombre_services?: number;
  nombre_personnels?: number;
}

interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
}

interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
  poste_titre?: string;
  id_direction: number;
}

// Liste fixe des directions (sans doublons)
const directionsList = [
  { nom_direction: 'AC - Administration Centrale', type: 'centrale', description: 'Administration Centrale' },
  { nom_direction: 'CGP - Cellule de Gestion des Projets', type: 'centrale', description: 'Cellule de Gestion des Projets' },
  { nom_direction: 'DAAF - Direction des Affaires Administratives et Financières', type: 'centrale', description: 'Direction des Affaires Administratives et Financières' },
  { nom_direction: 'DCNM - Direction de la Coordination Nationale et des Méthodologies', type: 'centrale', description: 'Direction de la Coordination Nationale et des Méthodologies' },
  { nom_direction: 'DDSS - Direction des Données et des Systèmes Statistiques', type: 'centrale', description: 'Direction des Données et des Systèmes Statistiques' },
  { nom_direction: 'DFRS - Direction des Finances et des Ressources Statistiques', type: 'centrale', description: 'Direction des Finances et des Ressources Statistiques' },
  { nom_direction: 'DG - Direction Générale', type: 'centrale', description: 'Direction Générale' },
  { nom_direction: 'DSCVM - Direction des Statistiques et des Comptes de la Vie et des Ménages', type: 'centrale', description: 'Direction des Statistiques et des Comptes' },
  { nom_direction: 'DSE - Direction des Statistiques Economiques', type: 'centrale', description: 'Direction des Statistiques Economiques' },
  { nom_direction: 'DSIC - Direction des Systèmes d\'Information et de la Communication', type: 'centrale', description: 'Direction des Systèmes d\'Information' },
  { nom_direction: 'BACE - Bureau d\'Appui et de Coordination Externe', type: 'centrale', description: 'Bureau d\'Appui et de Coordination Externe' },
  { nom_direction: 'DAI/MEF - Direction des Affaires Internationales', type: 'centrale', description: 'Direction des Affaires Internationales' },
  { nom_direction: 'DGT/DBIFA - Direction Générale du Trésor', type: 'centrale', description: 'Direction Générale du Trésor' },
  { nom_direction: 'DRH/MEF - Direction des Ressources Humaines', type: 'centrale', description: 'Direction des Ressources Humaines' },
  { nom_direction: 'DR/Antsiranana - Direction Régionale Antsiranana', type: 'regionale', description: 'Direction Régionale d\'Antsiranana' },
  { nom_direction: 'DR/Fianar - Direction Régionale Fianarantsoa', type: 'regionale', description: 'Direction Régionale de Fianarantsoa' },
  { nom_direction: 'DR/Mahajanga - Direction Régionale Mahajanga', type: 'regionale', description: 'Direction Régionale de Mahajanga' },
  { nom_direction: 'DR/Tana - Direction Régionale Antananarivo', type: 'regionale', description: 'Direction Régionale d\'Antananarivo' },
  { nom_direction: 'DR/Toamasina - Direction Régionale Toamasina', type: 'regionale', description: 'Direction Régionale de Toamasina' },
  { nom_direction: 'DR/Toliara - Direction Régionale Toliara', type: 'regionale', description: 'Direction Régionale de Toliara' },
  { nom_direction: 'CRM DIANA - Centre de Recherche et de Médiation DIANA', type: 'provinciale', description: 'Centre de Recherche - Région DIANA' },
  { nom_direction: 'CRM Vakinankaratra - Centre de Recherche et de Médiation Vakinankaratra', type: 'provinciale', description: 'Centre de Recherche - Région Vakinankaratra' },
];

const Directions: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [showAffectationModal, setShowAffectationModal] = useState(false);
  const [personnelToAffect, setPersonnelToAffect] = useState<Personnel | null>(null);
  const [selectedDirectionId, setSelectedDirectionId] = useState<string>('');
  const [expandedTypes, setExpandedTypes] = useState({
    centrale: true,
    regionale: true,
    provinciale: true
  });

  useEffect(() => {
    initializeDirections();
    fetchServices();
    fetchPersonnels();
  }, []);

  const initializeDirections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/directions');
      if (response.data && response.data.length > 0) {
        setDirections(response.data);
      } else {
        for (const dir of directionsList) {
          await api.post('/directions', dir);
        }
        const newResponse = await api.get('/directions');
        setDirections(newResponse.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erreur chargement services:', error);
    }
  };

  const fetchPersonnels = async () => {
    try {
      const response = await api.get('/personnels');
      setPersonnels(response.data);
    } catch (error) {
      console.error('Erreur chargement personnels:', error);
    }
  };

  const handleAffecterPersonnel = async () => {
    if (!personnelToAffect || !selectedDirectionId) return;
    
    setLoading(true);
    try {
      await api.put(`/personnels/${personnelToAffect.id_personnel}`, {
        ...personnelToAffect,
        id_direction: parseInt(selectedDirectionId)
      });
      fetchPersonnels();
      setShowAffectationModal(false);
      setPersonnelToAffect(null);
      setSelectedDirectionId('');
      alert('Personnel affecté avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'affectation');
    } finally {
      setLoading(false);
    }
  };

  const openAffectationModal = (personnel: Personnel) => {
    setPersonnelToAffect(personnel);
    setSelectedDirectionId(personnel.id_direction?.toString() || '');
    setShowAffectationModal(true);
  };

  const handlePrevious = () => {
    window.location.href = '/personnels';
  };

  const handleNext = () => {
    window.location.href = '/services';
  };

  const toggleType = (type: 'centrale' | 'regionale' | 'provinciale') => {
    setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredDirections = directions.filter(d => {
    const matchesSearch = d.nom_direction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const groupedDirections = {
    centrale: filteredDirections.filter(d => d.type === 'centrale'),
    regionale: filteredDirections.filter(d => d.type === 'regionale'),
    provinciale: filteredDirections.filter(d => d.type === 'provinciale'),
  };

  const getServicesCount = (directionId: number) => {
    return services.filter(s => s.id_direction === directionId).length;
  };

  const getPersonnelsCount = (directionId: number) => {
    return personnels.filter(p => p.id_direction === directionId).length;
  };

  const getPersonnelsByDirection = (directionId: number) => {
    return personnels.filter(p => p.id_direction === directionId);
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'centrale': return 'Directions Centrales';
      case 'regionale': return 'Directions Régionales';
      case 'provinciale': return 'Directions Provinciales';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'centrale': return faLandmark;
      case 'regionale': return faMapMarkerAlt;
      case 'provinciale': return faCity;
      default: return faBuilding;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'centrale': return '#2c3e50';
      case 'regionale': return '#2980b9';
      case 'provinciale': return '#27ae60';
      default: return '#6c7a8a';
    }
  };

  return (
    <div className="personnels-container">
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>
      <div className="grid-pattern"></div>

      <div className="personnels-content">
        <div className="personnels-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT Madagascar" className="logo-img" />
            </div>
          </div>
          <h1>Directions et Affectations</h1>
          <p>Visualisation des directions et affectation des personnels</p>
        </div>

        <div className="actions-bar">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher une direction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">Tous les types</option>
            <option value="centrale">Directions Centrales</option>
            <option value="regionale">Directions Régionales</option>
            <option value="provinciale">Directions Provinciales</option>
          </select>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}>
              <FontAwesomeIcon icon={faArrowLeft} /> Précédent
            </button>
            <button className="btn-next" onClick={handleNext}>
              Suivant <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faBuilding} size="3x" /></div><p className="empty-text">Chargement...</p></div>
        ) : (
          <>
            {(['centrale', 'regionale', 'provinciale'] as const).map((type) => (
              groupedDirections[type].length > 0 && (
                <div key={type} style={{ marginBottom: '30px' }}>
                  <div className="category-header" onClick={() => toggleType(type)}>
                    <div className="category-badge" style={{ background: getTypeColor(type) }}>
                      <FontAwesomeIcon icon={getTypeIcon(type)} />
                    </div>
                    <h2 className="category-title">{getTypeLabel(type)}</h2>
                    <span className="category-count">{groupedDirections[type].length} direction(s)</span>
                    <FontAwesomeIcon icon={expandedTypes[type] ? faChevronUp : faChevronDown} className="category-toggle" />
                  </div>

                  {expandedTypes[type] && (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Direction</th>
                            <th>Description</th>
                            <th style={{ textAlign: 'center' }}>Services</th>
                            <th style={{ textAlign: 'center' }}>Personnels</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedDirections[type].map((direction) => {
                            const servicesCount = getServicesCount(direction.id_direction);
                            const personnelsCount = getPersonnelsCount(direction.id_direction);
                            const directionPersonnels = getPersonnelsByDirection(direction.id_direction);
                            
                            return (
                              <React.Fragment key={direction.id_direction}>
                                <tr style={{ background: '#fafbfc' }}>
                                  <td style={{ fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={getTypeIcon(type)} style={{ marginRight: '10px', color: getTypeColor(type) }} />
                                    {direction.nom_direction}
                                  </td>
                                  <td style={{ color: '#6c7a8a', fontSize: '13px' }}>{direction.description || '-'}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span className="badge-primary" style={{ padding: '4px 12px', borderRadius: '20px', background: '#e3f2fd', color: '#1976d2' }}>
                                      <FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />
                                      {servicesCount} service(s)
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span className="badge-success" style={{ padding: '4px 12px', borderRadius: '20px', background: '#e8f5e9', color: '#27ae60' }}>
                                      <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
                                      {personnelsCount} personnel(s)
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <button 
                                      className="action-btn action-view"
                                      onClick={() => setSelectedDirection(selectedDirection?.id_direction === direction.id_direction ? null : direction)}
                                      title="Voir les personnels"
                                    >
                                      <FontAwesomeIcon icon={faEyeIcon} /> {selectedDirection?.id_direction === direction.id_direction ? 'Masquer' : 'Voir'}
                                    </button>
                                  </td>
                                </tr>
                                {selectedDirection?.id_direction === direction.id_direction && (
                                  <tr>
                                    <td colSpan={5} style={{ padding: '0', background: '#f8f9fa' }}>
                                      <div style={{ padding: '15px 20px', borderTop: '1px solid #e9ecef' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                          <strong style={{ color: '#2c3e50' }}>
                                            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                                            Personnels affectés à {direction.nom_direction}
                                          </strong>
                                          <button 
                                            className="btn-secondary" 
                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => setSelectedDirection(null)}
                                          >
                                            <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />
                                            Fermer
                                          </button>
                                        </div>
                                        {directionPersonnels.length > 0 ? (
                                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                              <tr style={{ background: '#e9ecef' }}>
                                                <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Matricule</th>
                                                <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Nom complet</th>
                                                <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Poste</th>
                                                <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>Actions</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {directionPersonnels.map(p => (
                                                <tr key={p.id_personnel} style={{ borderBottom: '1px solid #e9ecef' }}>
                                                  <td style={{ padding: '8px' }}>{p.id_personnel}</td>
                                                  <td style={{ padding: '8px' }}><strong>{p.nom}</strong> {p.prenom}</td>
                                                  <td style={{ padding: '8px' }}>{p.poste_titre || '-'}</td>
                                                  <td style={{ padding: '8px', textAlign: 'center' }}>
                                                    <button 
                                                      className="action-btn action-edit"
                                                      onClick={() => openAffectationModal(p)}
                                                      title="Changer de direction"
                                                      style={{ color: '#2980b9' }}
                                                    >
                                                      <FontAwesomeIcon icon={faUserPlus} /> Changer
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : (
                                          <div style={{ textAlign: 'center', padding: '30px', color: '#8a9bb0' }}>
                                            <FontAwesomeIcon icon={faUsers} size="2x" style={{ marginBottom: '10px' }} />
                                            <p>Aucun personnel affecté à cette direction</p>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            ))}
          </>
        )}

        {filteredDirections.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon"><FontAwesomeIcon icon={faBuilding} size="3x" /></div>
            <p className="empty-text">Aucune direction trouvée</p>
          </div>
        )}
      </div>

      {/* Modal d'affectation */}
      {showAffectationModal && personnelToAffect && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={faUserPlus} />
                Affecter un personnel à une direction
              </h2>
              <button className="modal-close" onClick={() => setShowAffectationModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#e8f4f8', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                <div><strong>Personnel :</strong> {personnelToAffect.nom} {personnelToAffect.prenom}</div>
                <div><strong>Poste actuel :</strong> {personnelToAffect.poste_titre || 'Non défini'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
                  Nouvelle direction *
                </label>
                <select
                  className="form-select"
                  value={selectedDirectionId}
                  onChange={(e) => setSelectedDirectionId(e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner une direction --</option>
                  {directions.map(dir => (
                    <option key={dir.id_direction} value={dir.id_direction}>
                      {dir.nom_direction}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '12px', color: '#8a9bb0', marginTop: '10px' }}>
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px', color: '#27ae60' }} />
                L'affectation sera effective immédiatement
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAffectationModal(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleAffecterPersonnel} disabled={loading}>
                {loading ? 'Affectation...' : 'Affecter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directions;