// src/pages/BaseRohi.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faArrowRight, faArrowLeft, faEdit, faTrashAlt,
  faTimes, faSave, faEye, faDatabase, faUsers, faBuilding,
  faUser, faBriefcase, faPhone, faIdCard, faDoorOpen,
  faLink, faUnlink, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface BaseRohi {
  id_rohi: number;
  immatricule: string;
  nom: string;
  prenom: string;
  poste: string;
  porte: string;
  telephone: string;
  direction: string;
  service: string;
  date_integration?: string;
  statut?: 'actif' | 'inactif';
}

interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
  poste_titre?: string;
  direction_nom?: string;
  service_nom?: string;
}

interface LiaisonRohi {
  id: number;
  id_personnel: number;
  id_rohi: number;
  date_liaison: string;
}

const BaseRohi: React.FC = () => {
  const [baseRohi, setBaseRohi] = useState<BaseRohi[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [liaisons, setLiaisons] = useState<LiaisonRohi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiaisonModalOpen, setIsLiaisonModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRohi, setViewingRohi] = useState<BaseRohi | null>(null);
  const [editingRohi, setEditingRohi] = useState<BaseRohi | null>(null);
  const [selectedRohi, setSelectedRohi] = useState<BaseRohi | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  
  const [formData, setFormData] = useState({
    immatricule: '',
    nom: '',
    prenom: '',
    poste: '',
    porte: '',
    telephone: '',
    direction: '',
    service: '',
    statut: 'actif' as 'actif' | 'inactif',
  });

  const [liaisonData, setLiaisonData] = useState({
    id_personnel: '',
    id_rohi: '',
  });

  useEffect(() => {
    fetchBaseRohi();
    fetchPersonnels();
    fetchLiaisons();
  }, []);

  const fetchBaseRohi = async () => {
    try {
      const response = await api.get('/base-rohi');
      setBaseRohi(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchPersonnels = async () => {
    try {
      const response = await api.get('/personnels');
      setPersonnels(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchLiaisons = async () => {
    try {
      const response = await api.get('/personnels-rohi');
      setLiaisons(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLiaisonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLiaisonData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRohi) {
        await api.put(`/base-rohi/${editingRohi.id_rohi}`, formData);
      } else {
        await api.post('/base-rohi', formData);
      }
      fetchBaseRohi();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleLiaisonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/personnels-rohi', {
        id_personnel: parseInt(liaisonData.id_personnel),
        id_rohi: parseInt(liaisonData.id_rohi),
      });
      fetchLiaisons();
      setIsLiaisonModalOpen(false);
      setLiaisonData({ id_personnel: '', id_rohi: '' });
      alert('Liaison créée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la liaison');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLiaison = async (personnelId: number, rohiId: number) => {
    if (window.confirm('Supprimer cette liaison ?')) {
      try {
        await api.delete(`/personnels-rohi/${personnelId}/${rohiId}`);
        fetchLiaisons();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDelete = async (id: number, nom: string, prenom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${nom} ${prenom} de la base ROHI ?`)) {
      try {
        await api.delete(`/base-rohi/${id}`);
        fetchBaseRohi();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (rohi: BaseRohi) => {
    setEditingRohi(rohi);
    setFormData({
      immatricule: rohi.immatricule,
      nom: rohi.nom,
      prenom: rohi.prenom,
      poste: rohi.poste,
      porte: rohi.porte,
      telephone: rohi.telephone,
      direction: rohi.direction,
      service: rohi.service,
      statut: rohi.statut || 'actif',
    });
    setIsModalOpen(true);
  };

  const handleView = (rohi: BaseRohi) => {
    setViewingRohi(rohi);
    setIsViewModalOpen(true);
  };

  const handleOpenLiaison = (rohi: BaseRohi) => {
    setSelectedRohi(rohi);
    setLiaisonData({ id_personnel: '', id_rohi: rohi.id_rohi.toString() });
    setIsLiaisonModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/historique';
  };

  const handleNext = () => {
    window.location.href = '/base-augure';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRohi(null);
    setFormData({
      immatricule: '',
      nom: '',
      prenom: '',
      poste: '',
      porte: '',
      telephone: '',
      direction: '',
      service: '',
      statut: 'actif',
    });
  };

  const hasBaseRohi = () => baseRohi.length > 0;

  const isPersonnelLien = (personnelId: number, rohiId: number): boolean => {
    return liaisons.some(l => l.id_personnel === personnelId && l.id_rohi === rohiId);
  };

  const getPersonnelsLies = (rohiId: number) => {
    const liens = liaisons.filter(l => l.id_rohi === rohiId);
    return liens.map(lien => personnels.find(p => p.id_personnel === lien.id_personnel)).filter(p => p);
  };

  const filteredBaseRohi = baseRohi.filter(item => {
    const matchesSearch = 
      item.immatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.direction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection = filterDirection === 'all' || item.direction === filterDirection;
    return matchesSearch && matchesDirection;
  });

  const uniqueDirections = [...new Set(baseRohi.map(item => item.direction).filter(Boolean))];

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
          <h1>Base ROHI</h1>
          <p>Institut National de la Statistique - Madagascar</p>
        </div>

        {/* Barre d'actions */}
        <div className="actions-bar">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par matricule, nom, prénom ou direction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="form-select"
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">📋 Toutes les directions</option>
            {uniqueDirections.map(dir => (
              <option key={dir} value={dir}>{dir}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Précédent
            </button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Nouvelle entrée
            </button>
            <button 
              className="btn-next" 
              onClick={handleNext}
              style={{ 
                opacity: hasBaseRohi() ? 1 : 0.6,
                cursor: hasBaseRohi() ? 'pointer' : 'not-allowed'
              }}
            >
              Suivant
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {/* Tableau */}
        {filteredBaseRohi.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom & Prénom</th>
                  <th>Poste</th>
                  <th>Porte</th>
                  <th>Téléphone</th>
                  <th>Direction</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBaseRohi.map((item) => {
                  const personnelsLies = getPersonnelsLies(item.id_rohi);
                  return (
                    <tr key={item.id_rohi}>
                      <td><strong>{item.immatricule}</strong></td>
                      <td>{item.nom} {item.prenom}</td>
                      <td>{item.poste || '-'}</td>
                      <td>{item.porte || '-'}</td>
                      <td>{item.telephone || '-'}</td>
                      <td>{item.direction || '-'}</td>
                      <td>{item.service || '-'}</td>
                      <td>
                        <span className={item.statut === 'actif' ? 'badge-male' : 'badge-motif'}>
                          {item.statut === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button className="action-btn action-view" onClick={() => handleView(item)} title="Voir">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="action-btn action-edit" onClick={() => handleEdit(item)} title="Modifier">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenLiaison(item)} title="Lier à un personnel" style={{ color: '#2980b9' }}>
                          <FontAwesomeIcon icon={faLink} />
                        </button>
                        <button className="action-btn action-delete" onClick={() => handleDelete(item.id_rohi, item.nom, item.prenom)} title="Supprimer">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faDatabase} size="3x" />
            </div>
            <p className="empty-text">Aucune entrée ROHI trouvée</p>
            <p className="empty-subtext">Cliquez sur "Nouvelle entrée" pour ajouter des données</p>
          </div>
        )}
      </div>

      {/* Modal Formulaire ROHI */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={editingRohi ? faEdit : faDatabase} />
                {editingRohi ? 'Modifier l\'entrée ROHI' : 'Nouvelle entrée ROHI'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '5px' }} />
                    Matricule *
                  </label>
                  <input
                    type="text"
                    name="immatricule"
                    className="form-input"
                    value={formData.immatricule}
                    onChange={handleInputChange}
                    placeholder="Ex: ROHI-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    className="form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    className="form-input"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '5px' }} />
                    Poste
                  </label>
                  <input
                    type="text"
                    name="poste"
                    className="form-input"
                    value={formData.poste}
                    onChange={handleInputChange}
                    placeholder="Ex: Administrateur, Technicien..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: '5px' }} />
                    Porte / Bureau
                  </label>
                  <input
                    type="text"
                    name="porte"
                    className="form-input"
                    value={formData.porte}
                    onChange={handleInputChange}
                    placeholder="Ex: Bâtiment A, Bureau 12"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '5px' }} />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    className="form-input"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="Ex: 032 12 345 67"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '5px' }} />
                    Direction *
                  </label>
                  <input
                    type="text"
                    name="direction"
                    className="form-input"
                    value={formData.direction}
                    onChange={handleInputChange}
                    placeholder="Ex: DSIC, DG, DR/Tana..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
                    Service
                  </label>
                  <input
                    type="text"
                    name="service"
                    className="form-input"
                    value={formData.service}
                    onChange={handleInputChange}
                    placeholder="Ex: Infrastructure, Développement..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select
                    name="statut"
                    className="form-select"
                    value={formData.statut}
                    onChange={handleInputChange}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                  {loading ? 'Enregistrement...' : (editingRohi ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de liaison Personnel - ROHI */}
      {isLiaisonModalOpen && selectedRohi && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={faLink} />
                Lier un personnel à ROHI
              </h2>
              <button className="modal-close" onClick={() => setIsLiaisonModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleLiaisonSubmit}>
              <div className="modal-body">
                <div style={{ background: '#e8f4f8', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                  <strong>Entrée ROHI :</strong> {selectedRohi.immatricule} - {selectedRohi.nom} {selectedRohi.prenom}
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                    Personnel à lier *
                  </label>
                  <select
                    name="id_personnel"
                    className="form-select"
                    value={liaisonData.id_personnel}
                    onChange={handleLiaisonChange}
                    required
                  >
                    <option value="">-- Sélectionner un personnel --</option>
                    {personnels.map(p => {
                      const dejaLie = isPersonnelLien(p.id_personnel, selectedRohi.id_rohi);
                      return (
                        <option 
                          key={p.id_personnel} 
                          value={p.id_personnel}
                          disabled={dejaLie}
                        >
                          {p.nom} {p.prenom} - {p.poste_titre || 'Sans poste'}
                          {dejaLie && ' (déjà lié)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={{ fontSize: '12px', color: '#8a9bb0', marginTop: '10px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px', color: '#27ae60' }} />
                  Un personnel peut être lié à plusieurs entrées ROHI
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsLiaisonModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <FontAwesomeIcon icon={faLink} style={{ marginRight: '8px' }} />
                  {loading ? 'Liaison...' : 'Lier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualisation */}
      {isViewModalOpen && viewingRohi && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={faEye} /> Détails ROHI
              </h2>
              <button className="modal-close" onClick={() => setIsViewModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label className="form-label">Matricule</label>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{viewingRohi.immatricule}</div>
                </div>
                <div>
                  <label className="form-label">Statut</label>
                  <div>
                    <span className={viewingRohi.statut === 'actif' ? 'badge-male' : 'badge-motif'}>
                      {viewingRohi.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="form-label">Nom complet</label>
                <div style={{ fontSize: '16px' }}>{viewingRohi.nom} {viewingRohi.prenom}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label className="form-label">Poste</label>
                  <div>{viewingRohi.poste || '-'}</div>
                </div>
                <div>
                  <label className="form-label">Porte / Bureau</label>
                  <div>{viewingRohi.porte || '-'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="form-label">Téléphone</label>
                <div>{viewingRohi.telephone || '-'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Direction</label>
                  <div>{viewingRohi.direction || '-'}</div>
                </div>
                <div>
                  <label className="form-label">Service</label>
                  <div>{viewingRohi.service || '-'}</div>
                </div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
                <label className="form-label">
                  <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
                  Personnels liés ({getPersonnelsLies(viewingRohi.id_rohi).length})
                </label>
                <div style={{ marginTop: '10px' }}>
                  {getPersonnelsLies(viewingRohi.id_rohi).length > 0 ? (
                    getPersonnelsLies(viewingRohi.id_rohi).map(p => p && (
                      <div key={p.id_personnel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}>
                        <span>{p.nom} {p.prenom} - {p.poste_titre || 'Sans poste'}</span>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => handleDeleteLiaison(p.id_personnel, viewingRohi.id_rohi)}
                          style={{ padding: '4px 8px' }}
                        >
                          <FontAwesomeIcon icon={faUnlink} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#8a9bb0', textAlign: 'center', padding: '20px' }}>
                      Aucun personnel lié
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fermer</button>
              <button className="btn-primary" onClick={() => {
                setIsViewModalOpen(false);
                handleOpenLiaison(viewingRohi);
              }}>
                <FontAwesomeIcon icon={faLink} /> Lier un personnel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseRohi;