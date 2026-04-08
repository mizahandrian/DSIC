// src/pages/Directions.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faArrowRight, 
  faArrowLeft,
  faEdit, 
  faTrashAlt,
  faTimes,
  faSave,
  faBuilding,
  faCity,
  faMapMarkerAlt,
  faUsers,
  faArrowDown,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

interface Direction {
  id_direction: number;
  nom_direction: string;
  type: 'centrale' | 'regionale' | 'provinciale';
  parent_id?: number;
  nombre_services?: number;
  nombre_personnels?: number;
}

// Données initiales des directions
const initialDirections = [
  { nom_direction: 'AC', type: 'centrale' },
  { nom_direction: 'CGP', type: 'centrale' },
  { nom_direction: 'DAAF', type: 'centrale' },
  { nom_direction: 'DCNM', type: 'centrale' },
  { nom_direction: 'DDSS', type: 'centrale' },
  { nom_direction: 'DFRS', type: 'centrale' },
  { nom_direction: 'DG', type: 'centrale' },
  { nom_direction: 'DSCVM', type: 'centrale' },
  { nom_direction: 'DSE', type: 'centrale' },
  { nom_direction: 'DSIC', type: 'centrale' },
  { nom_direction: 'BACE', type: 'centrale' },
  { nom_direction: 'DAI/MEF', type: 'centrale' },
  { nom_direction: 'DGT/DBIFA', type: 'centrale' },
  { nom_direction: 'DRH/MEF', type: 'centrale' },
  // Directions régionales
  { nom_direction: 'DR/Antsiranana', type: 'regionale' },
  { nom_direction: 'DR/Fianar', type: 'regionale' },
  { nom_direction: 'DR/Mahajanga', type: 'regionale' },
  { nom_direction: 'DR/Tana', type: 'regionale' },
  { nom_direction: 'DR/Toamasina', type: 'regionale' },
  { nom_direction: 'DR/Toliara', type: 'regionale' },
  // Directions provinciales
  { nom_direction: 'CRM DIANA', type: 'provinciale' },
  { nom_direction: 'CRM Vakinankaratra', type: 'provinciale' },
];

const Directions: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedTypes, setExpandedTypes] = useState({
    centrale: true,
    regionale: true,
    provinciale: true
  });

  const [formData, setFormData] = useState({
    nom_direction: '',
    type: 'centrale' as 'centrale' | 'regionale' | 'provinciale',
  });

  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    try {
      const response = await api.get('/directions');
      if (response.data && response.data.length > 0) {
        setDirections(response.data);
      } else {
        // Si aucune direction n'existe, initialiser avec les données par défaut
        initializeDirections();
      }
    } catch (error) {
      console.error('Erreur chargement directions:', error);
      initializeDirections();
    }
  };

  const initializeDirections = async () => {
    try {
      for (const dir of initialDirections) {
        await api.post('/directions', dir);
      }
      const response = await api.get('/directions');
      setDirections(response.data);
    } catch (error) {
      console.error('Erreur initialisation:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingDirection) {
        await api.put(`/directions/${editingDirection.id_direction}`, formData);
      } else {
        await api.post('/directions', formData);
      }
      fetchDirections();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la direction "${nom}" ?`)) {
      try {
        await api.delete(`/directions/${id}`);
        fetchDirections();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (direction: Direction) => {
    setEditingDirection(direction);
    setFormData({
      nom_direction: direction.nom_direction,
      type: direction.type,
    });
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/personnels';
  };

  const handleNext = () => {
    window.location.href = '/services';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDirection(null);
    setFormData({
      nom_direction: '',
      type: 'centrale',
    });
  };

  const toggleType = (type: 'centrale' | 'regionale' | 'provinciale') => {
    setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Filtrer les directions
  const filteredDirections = directions.filter(d => {
    const matchesSearch = d.nom_direction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  // Grouper par type
  const groupedDirections = {
    centrale: filteredDirections.filter(d => d.type === 'centrale'),
    regionale: filteredDirections.filter(d => d.type === 'regionale'),
    provinciale: filteredDirections.filter(d => d.type === 'provinciale'),
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
      case 'centrale': return faBuilding;
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
      <div className="personnels-content">
        {/* En-tête avec logo */}
        <div className="personnels-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT Madagascar" className="logo-img" />
            </div>
          </div>
          <h1>Gestion des Directions</h1>
          <p>Institut National de la Statistique - Madagascar</p>
        </div>

        {/* Barre d'actions */}
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
            style={{ width: '180px' }}
          >
            <option value="all">Tous les types</option>
            <option value="centrale">Directions Centrales</option>
            <option value="regionale">Directions Régionales</option>
            <option value="provinciale">Directions Provinciales</option>
          </select>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Précédent
            </button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Nouvelle direction
            </button>
            <button className="btn-next" onClick={handleNext}>
              Suivant
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {/* Liste des directions par catégorie */}
        {(['centrale', 'regionale', 'provinciale'] as const).map((type) => (
          groupedDirections[type].length > 0 && (
            <div key={type} style={{ marginBottom: '30px' }}>
              {/* En-tête de catégorie */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '15px',
                  cursor: 'pointer',
                  padding: '10px 0'
                }}
                onClick={() => toggleType(type)}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: getTypeColor(type),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <FontAwesomeIcon icon={getTypeIcon(type)} />
                </div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  margin: 0
                }}>
                  {getTypeLabel(type)}
                </h2>
                <span style={{
                  background: '#e9ecef',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: '#6c7a8a'
                }}>
                  {groupedDirections[type].length}
                </span>
                <FontAwesomeIcon 
                  icon={expandedTypes[type] ? faArrowUp : faArrowDown}
                  style={{ color: '#8a9bb0', marginLeft: 'auto' }}
                />
              </div>

              {/* Liste des directions de la catégorie */}
              {expandedTypes[type] && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {groupedDirections[type].map((direction) => (
                    <div
                      key={direction.id_direction}
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        border: '1px solid #e9ecef',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: `${getTypeColor(type)}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getTypeColor(type)
                          }}>
                            <FontAwesomeIcon icon={getTypeIcon(type)} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#2c3e50' }}>
                              {direction.nom_direction}
                            </h3>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                              <span style={{ fontSize: '12px', color: '#8a9bb0' }}>
                                <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
                                {direction.nombre_personnels || 0} personnels
                              </span>
                              <span style={{ fontSize: '12px', color: '#8a9bb0' }}>
                                Services: {direction.nombre_services || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            className="action-btn action-edit"
                            onClick={() => handleEdit(direction)}
                            title="Modifier"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleDelete(direction.id_direction, direction.nom_direction)}
                            title="Supprimer"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        ))}

        {filteredDirections.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faBuilding} size="3x" />
            </div>
            <p className="empty-text">Aucune direction trouvée</p>
          </div>
        )}
      </div>

      {/* Modal Formulaire */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={editingDirection ? faEdit : faBuilding} />
                {editingDirection ? 'Modifier la direction' : 'Ajouter une direction'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
                    Nom de la direction *
                  </label>
                  <input
                    type="text"
                    name="nom_direction"
                    className="form-input"
                    value={formData.nom_direction}
                    onChange={handleInputChange}
                    placeholder="Ex: DSIC, DR/Tana, ..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                    Type de direction *
                  </label>
                  <select
                    name="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="centrale">Direction Centrale</option>
                    <option value="regionale">Direction Régionale</option>
                    <option value="provinciale">Direction Provinciale</option>
                  </select>
                  <small style={{ fontSize: '11px', color: '#8a9bb0', marginTop: '5px', display: 'block' }}>
                    Centrale: Siège principal | Régionale: DR/... | Provinciale: CRM...
                  </small>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                  {loading ? 'Enregistrement...' : (editingDirection ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directions;