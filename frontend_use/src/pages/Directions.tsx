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
  faArrowUp,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

interface Direction {
  id_direction: number;
  nom_direction: string;
  type: 'centrale' | 'regionale' | 'provinciale';
  nombre_services?: number;
  nombre_personnels?: number;
  description?: string;
}

const initialDirections = [
  { nom_direction: 'AC - Administration Centrale', type: 'centrale', description: 'Administration Centrale' },
  { nom_direction: 'CGP - Cellule de Gestion des Projets', type: 'centrale', description: 'Cellule de Gestion des Projets' },
  { nom_direction: 'DAAF - Direction des Affaires Administratives et Financières', type: 'centrale', description: 'Direction des Affaires Administratives et Financières' },
  { nom_direction: 'DCNM - Direction de la Coordination Nationale et des Méthodologies', type: 'centrale', description: 'Direction de la Coordination Nationale et des Méthodologies' },
  { nom_direction: 'DDSS - Direction des Données et des Systèmes Statistiques', type: 'centrale', description: 'Direction des Données et des Systèmes Statistiques' },
  { nom_direction: 'DFRS - Direction des Finances et des Ressources Statistiques', type: 'centrale', description: 'Direction des Finances et des Ressources Statistiques' },
  { nom_direction: 'DG - Direction Générale', type: 'centrale', description: 'Direction Générale' },
  { nom_direction: 'DSCVM - Direction des Statistiques et des Comptes de la Vie et des Ménages', type: 'centrale', description: 'Direction des Statistiques et des Comptes de la Vie et des Ménages' },
  { nom_direction: 'DSE - Direction des Statistiques Economiques', type: 'centrale', description: 'Direction des Statistiques Economiques' },
  { nom_direction: 'DSIC - Direction des Systèmes d\'Information et de la Communication', type: 'centrale', description: 'Direction des Systèmes d\'Information et de la Communication' },
  { nom_direction: 'BACE - Bureau d\'Appui et de Coordination Externe', type: 'centrale', description: 'Bureau d\'Appui et de Coordination Externe' },
  { nom_direction: 'DAI/MEF - Direction des Affaires Internationales', type: 'centrale', description: 'Direction des Affaires Internationales / Ministère' },
  { nom_direction: 'DGT/DBIFA - Direction Générale du Trésor', type: 'centrale', description: 'Direction Générale du Trésor' },
  { nom_direction: 'DRH/MEF - Direction des Ressources Humaines', type: 'centrale', description: 'Direction des Ressources Humaines / Ministère' },
  { nom_direction: 'DR/Antsiranana - Direction Régionale Antsiranana', type: 'regionale', description: 'Direction Régionale d\'Antsiranana' },
  { nom_direction: 'DR/Fianar - Direction Régionale Fianarantsoa', type: 'regionale', description: 'Direction Régionale de Fianarantsoa' },
  { nom_direction: 'DR/Mahajanga - Direction Régionale Mahajanga', type: 'regionale', description: 'Direction Régionale de Mahajanga' },
  { nom_direction: 'DR/Tana - Direction Régionale Antananarivo', type: 'regionale', description: 'Direction Régionale d\'Antananarivo' },
  { nom_direction: 'DR/Toamasina - Direction Régionale Toamasina', type: 'regionale', description: 'Direction Régionale de Toamasina' },
  { nom_direction: 'DR/Toliara - Direction Régionale Toliara', type: 'regionale', description: 'Direction Régionale de Toliara' },
  { nom_direction: 'CRM DIANA - Centre de Recherche et de Médiation DIANA', type: 'provinciale', description: 'Centre de Recherche et de Médiation - Région DIANA' },
  { nom_direction: 'CRM Vakinankaratra - Centre de Recherche et de Médiation Vakinankaratra', type: 'provinciale', description: 'Centre de Recherche et de Médiation - Région Vakinankaratra' },
];

const Directions: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDirection, setViewingDirection] = useState<Direction | null>(null);
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
    description: '',
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
        initializeDirections();
      }
    } catch (error) {
      console.error('Erreur:', error);
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
      console.error('Erreur:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      description: direction.description || '',
    });
    setIsModalOpen(true);
  };

  const handleView = (direction: Direction) => {
    setViewingDirection(direction);
    setIsViewModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/personnels';
  };

  // ✅ CONDITION : Vérifier s'il y a des directions
  const hasDirections = () => {
    return directions.length > 0;
  };

  // ✅ CONDITION : Redirection avec vérification
  const handleNext = () => {
    if (hasDirections()) {
      window.location.href = '/services';
    } else {
      alert('⚠️ Veuillez d\'abord configurer les directions avant de continuer.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDirection(null);
    setFormData({
      nom_direction: '',
      type: 'centrale',
      description: '',
    });
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
        <div className="personnels-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT Madagascar" className="logo-img" />
            </div>
          </div>
          <h1>Gestion des Directions</h1>
          <p>Institut National de la Statistique - Madagascar</p>
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
            <option value="all">📋 Tous les types</option>
            <option value="centrale">🏢 Directions Centrales</option>
            <option value="regionale">📍 Directions Régionales</option>
            <option value="provinciale">🏙️ Directions Provinciales</option>
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
            {/* ✅ Bouton Suivant avec condition */}
            <button 
              className="btn-next" 
              onClick={handleNext}
              style={{ 
                opacity: hasDirections() ? 1 : 0.6,
                cursor: hasDirections() ? 'pointer' : 'not-allowed'
              }}
            >
              Suivant
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {(['centrale', 'regionale', 'provinciale'] as const).map((type) => (
          groupedDirections[type].length > 0 && (
            <div key={type} style={{ marginBottom: '30px' }}>
              <div className="category-header" onClick={() => toggleType(type)}>
                <div className="category-badge" style={{ background: getTypeColor(type) }}>
                  <FontAwesomeIcon icon={getTypeIcon(type)} />
                </div>
                <h2 className="category-title">{getTypeLabel(type)}</h2>
                <span className="category-count">{groupedDirections[type].length} direction(s)</span>
                <FontAwesomeIcon icon={expandedTypes[type] ? faArrowUp : faArrowDown} className="category-toggle" />
              </div>

              {expandedTypes[type] && (
                <div className="directions-grid">
                  {groupedDirections[type].map((direction) => (
                    <div key={direction.id_direction} className="direction-card">
                      <div className="direction-card-content">
                        <div className="direction-icon-wrapper">
                          <div className="direction-icon" style={{ background: `${getTypeColor(type)}15`, color: getTypeColor(type) }}>
                            <FontAwesomeIcon icon={getTypeIcon(type)} />
                          </div>
                        </div>
                        <div className="direction-info">
                          <h3 className="direction-title">{direction.nom_direction}</h3>
                          {direction.description && <p className="direction-description">{direction.description}</p>}
                          <div className="direction-stats">
                            <span className="direction-stat">
                              <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
                              {direction.nombre_personnels || 0} personnels
                            </span>
                            <span className="direction-stat">Services: {direction.nombre_services || 0}</span>
                          </div>
                        </div>
                        <div className="direction-actions">
                          <button className="action-btn action-view" onClick={() => handleView(direction)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="action-btn action-edit" onClick={() => handleEdit(direction)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="action-btn action-delete" onClick={() => handleDelete(direction.id_direction, direction.nom_direction)}>
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
            <div className="empty-icon"><FontAwesomeIcon icon={faBuilding} size="3x" /></div>
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
              <button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom de la direction *</label>
                  <input type="text" name="nom_direction" className="form-input" value={formData.nom_direction} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type de direction *</label>
                  <select name="type" className="form-select" value={formData.type} onChange={handleInputChange} required>
                    <option value="centrale">Direction Centrale</option>
                    <option value="regionale">Direction Régionale</option>
                    <option value="provinciale">Direction Provinciale</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                  {loading ? 'Enregistrement...' : (editingDirection ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualisation */}
      {isViewModalOpen && viewingDirection && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title"><FontAwesomeIcon icon={faBuilding} /> Détails de la direction</h2>
              <button className="modal-close" onClick={() => setIsViewModalOpen(false)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Nom</label>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{viewingDirection.nom_direction}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Type</label>
                <div>{viewingDirection.type === 'centrale' ? 'Centrale' : viewingDirection.type === 'regionale' ? 'Régionale' : 'Provinciale'}</div>
              </div>
              {viewingDirection.description && (
                <div><label style={{ fontSize: '12px', color: '#8a9bb0' }}>Description</label><div>{viewingDirection.description}</div></div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directions;

