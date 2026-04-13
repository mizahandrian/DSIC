// src/pages/BaseAugure.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faArrowRight, faArrowLeft, faEdit, faTrashAlt,
  faTimes, faSave, faEye, faDatabase, faUsers, faBuilding,
  faUser, faBriefcase, faPhone, faIdCard, faCalendarAlt,
  faLink, faUnlink, faCheckCircle, faTag, faChartLine,
  faGavel, faEnvelope, faMapMarkerAlt, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import api, { authAPI } from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface BaseAugure {
  id_augure: number;
  agentMatricule: string;
  corpsCode: string;
  indice: string;
  posteAgentNumero: string;
  titre: string;
  categorieCode: string;
  regCode: string;
  sanctionLibelle: string;
  agentDateNais: string;
  sanctionCode: string;
  agentCin: string;
  dateEffet: string;
  structureRattachement: string;
  agentNom: string;
  regLibelle: string;
  intervalAge: string;
  gradeCode: string;
  statutAgent: string;
}

interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
  numero_cin: string;
  poste_titre?: string;
  direction_nom?: string;
}

interface LiaisonAugure {
  id: number;
  id_personnel: number;
  id_augure: number;
  date_liaison: string;
}

const BaseAugure: React.FC = () => {
  const [baseAugure, setBaseAugure] = useState<BaseAugure[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [liaisons, setLiaisons] = useState<LiaisonAugure[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiaisonModalOpen, setIsLiaisonModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingAugure, setViewingAugure] = useState<BaseAugure | null>(null);
  const [editingAugure, setEditingAugure] = useState<BaseAugure | null>(null);
  const [selectedAugure, setSelectedAugure] = useState<BaseAugure | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStructure, setFilterStructure] = useState('all');
  
  const [formData, setFormData] = useState({
    agentMatricule: '',
    corpsCode: '',
    indice: '',
    posteAgentNumero: '',
    titre: '',
    categorieCode: '',
    regCode: '',
    sanctionLibelle: '',
    agentDateNais: '',
    sanctionCode: '',
    agentCin: '',
    dateEffet: '',
    structureRattachement: '',
    agentNom: '',
    regLibelle: '',
    intervalAge: '',
    gradeCode: '',
    statutAgent: '',
  });

  const [liaisonData, setLiaisonData] = useState({
    id_personnel: '',
    id_augure: '',
  });

  useEffect(() => {
    fetchBaseAugure();
    fetchPersonnels();
    fetchLiaisons();
  }, []);

  const fetchBaseAugure = async () => {
    try {
      const response = await api.get('/base-augure');
      setBaseAugure(response.data);
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
      const response = await api.get('/personnels-augure');
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
      if (editingAugure) {
        await api.put(`/base-augure/${editingAugure.id_augure}`, formData);
      } else {
        await api.post('/base-augure', formData);
      }
      fetchBaseAugure();
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
      await api.post('/personnels-augure', {
        id_personnel: parseInt(liaisonData.id_personnel),
        id_augure: parseInt(liaisonData.id_augure),
      });
      fetchLiaisons();
      setIsLiaisonModalOpen(false);
      setLiaisonData({ id_personnel: '', id_augure: '' });
      alert('Liaison créée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la liaison');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLiaison = async (personnelId: number, augureId: number) => {
    if (window.confirm('Supprimer cette liaison ?')) {
      try {
        await api.delete(`/personnels-augure/${personnelId}/${augureId}`);
        fetchLiaisons();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDelete = async (id: number, agentNom: string, agentMatricule: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${agentNom} (${agentMatricule}) de la base AUGURE ?`)) {
      try {
        await api.delete(`/base-augure/${id}`);
        fetchBaseAugure();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (augure: BaseAugure) => {
    setEditingAugure(augure);
    setFormData({
      agentMatricule: augure.agentMatricule,
      corpsCode: augure.corpsCode,
      indice: augure.indice,
      posteAgentNumero: augure.posteAgentNumero,
      titre: augure.titre,
      categorieCode: augure.categorieCode,
      regCode: augure.regCode,
      sanctionLibelle: augure.sanctionLibelle,
      agentDateNais: augure.agentDateNais,
      sanctionCode: augure.sanctionCode,
      agentCin: augure.agentCin,
      dateEffet: augure.dateEffet,
      structureRattachement: augure.structureRattachement,
      agentNom: augure.agentNom,
      regLibelle: augure.regLibelle,
      intervalAge: augure.intervalAge,
      gradeCode: augure.gradeCode,
      statutAgent: augure.statutAgent,
    });
    setIsModalOpen(true);
  };

  const handleView = (augure: BaseAugure) => {
    setViewingAugure(augure);
    setIsViewModalOpen(true);
  };

  const handleOpenLiaison = (augure: BaseAugure) => {
    setSelectedAugure(augure);
    setLiaisonData({ id_personnel: '', id_augure: augure.id_augure.toString() });
    setIsLiaisonModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/base-rohi';
  };

  // ✅ MODIFICATION ICI : handleNext corrigé
  const handleNext = async () => {
    if (hasBaseAugure()) {
      try {
        // Appel API pour marquer l'utilisateur comme initialisé
        await authAPI.completeSetup();
        
        // Mettre à jour l'utilisateur dans localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.is_initialized = true;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Rediriger vers la page de confirmation
        window.location.href = '/complete-setup';
      } catch (error) {
        console.error('Erreur lors de la finalisation:', error);
        // Même en cas d'erreur, on redirige vers complete-setup
        window.location.href = '/complete-setup';
      }
    } else {
      alert('⚠️ Veuillez d\'abord ajouter au moins une entrée AUGURE avant de terminer la configuration.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAugure(null);
    setFormData({
      agentMatricule: '',
      corpsCode: '',
      indice: '',
      posteAgentNumero: '',
      titre: '',
      categorieCode: '',
      regCode: '',
      sanctionLibelle: '',
      agentDateNais: '',
      sanctionCode: '',
      agentCin: '',
      dateEffet: '',
      structureRattachement: '',
      agentNom: '',
      regLibelle: '',
      intervalAge: '',
      gradeCode: '',
      statutAgent: '',
    });
  };

  const hasBaseAugure = () => baseAugure.length > 0;

  const isPersonnelLien = (personnelId: number, augureId: number): boolean => {
    return liaisons.some(l => l.id_personnel === personnelId && l.id_augure === augureId);
  };

  const getPersonnelsLies = (augureId: number) => {
    const liens = liaisons.filter(l => l.id_augure === augureId);
    return liens.map(lien => personnels.find(p => p.id_personnel === lien.id_personnel)).filter(p => p);
  };

  const filteredBaseAugure = baseAugure.filter(item => {
    const matchesSearch = 
      item.agentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agentCin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.structureRattachement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStructure = filterStructure === 'all' || item.structureRattachement === filterStructure;
    return matchesSearch && matchesStructure;
  });

  const uniqueStructures = [...new Set(baseAugure.map(item => item.structureRattachement).filter(Boolean))];

  return (
    <div className="personnels-container">
      {/* Formes géométriques */}
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>
      <div className="grid-pattern"></div>

      <div className="personnels-content">
        {/* En-tête avec logo */}
        <div className="personnels-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT Madagascar" className="logo-img" />
            </div>
          </div>
          <h1>Base AUGURE</h1>
          <p>Institut National de la Statistique - Madagascar</p>
        </div>

        {/* Barre d'actions */}
        <div className="actions-bar">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par matricule, nom, CIN ou structure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="form-select"
            value={filterStructure}
            onChange={(e) => setFilterStructure(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">Toutes les structures</option>
            {uniqueStructures.map(struct => (
              <option key={struct} value={struct}>{struct}</option>
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
                opacity: hasBaseAugure() ? 1 : 0.6,
                cursor: hasBaseAugure() ? 'pointer' : 'not-allowed'
              }}
            >
              Terminer
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {/* Tableau */}
        {filteredBaseAugure.length > 0 ? (
          <div className="table-container">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom & Prénom</th>
                    <th>CIN</th>
                    <th>Titre</th>
                    <th>Corps/Grade</th>
                    <th>Indice</th>
                    <th>Structure</th>
                    <th>Statut</th>
                    <th style={{ textAlign: 'center', width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBaseAugure.map((item) => (
                    <tr key={item.id_augure}>
                      <td><strong>{item.agentMatricule}</strong></td>
                      <td>{item.agentNom}</td>
                      <td>{item.agentCin || '-'}</td>
                      <td>{item.titre || '-'}</td>
                      <td>{item.corpsCode} / {item.gradeCode}</td>
                      <td>{item.indice || '-'}</td>
                      <td>{item.structureRattachement || '-'}</td>
                      <td>
                        <span className={item.statutAgent === 'Actif' ? 'badge-male' : 'badge-motif'}>
                          {item.statutAgent || 'Actif'}
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
                        <button className="action-btn action-delete" onClick={() => handleDelete(item.id_augure, item.agentNom, item.agentMatricule)} title="Supprimer">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faDatabase} size="3x" />
            </div>
            <p className="empty-text">Aucune entrée AUGURE trouvée</p>
            <p className="empty-subtext">Cliquez sur "Nouvelle entrée" pour ajouter des données</p>
          </div>
        )}
      </div>

      {/* Modal Formulaire AUGURE */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={editingAugure ? faEdit : faDatabase} />
                {editingAugure ? 'Modifier l\'entrée AUGURE' : 'Nouvelle entrée AUGURE'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {/* Identité */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '5px' }} />
                      Matricule *
                    </label>
                    <input
                      type="text"
                      name="agentMatricule"
                      className="form-input"
                      value={formData.agentMatricule}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="agentNom"
                      className="form-input"
                      value={formData.agentNom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '5px' }} />
                      CIN
                    </label>
                    <input
                      type="text"
                      name="agentCin"
                      className="form-input"
                      value={formData.agentCin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} />
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      name="agentDateNais"
                      className="form-input"
                      value={formData.agentDateNais}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Carrière */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faTag} style={{ marginRight: '5px' }} />
                      Code Corps
                    </label>
                    <input
                      type="text"
                      name="corpsCode"
                      className="form-input"
                      value={formData.corpsCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '5px' }} />
                      Grade Code
                    </label>
                    <input
                      type="text"
                      name="gradeCode"
                      className="form-input"
                      value={formData.gradeCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '5px' }} />
                      Indice
                    </label>
                    <input
                      type="text"
                      name="indice"
                      className="form-input"
                      value={formData.indice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faGraduationCap} style={{ marginRight: '5px' }} />
                      Catégorie Code
                    </label>
                    <input
                      type="text"
                      name="categorieCode"
                      className="form-input"
                      value={formData.categorieCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Poste */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '5px' }} />
                      Numéro poste
                    </label>
                    <input
                      type="text"
                      name="posteAgentNumero"
                      className="form-input"
                      value={formData.posteAgentNumero}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '5px' }} />
                      Titre
                    </label>
                    <input
                      type="text"
                      name="titre"
                      className="form-input"
                      value={formData.titre}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Structure */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '5px' }} />
                      Structure rattachement *
                    </label>
                    <input
                      type="text"
                      name="structureRattachement"
                      className="form-input"
                      value={formData.structureRattachement}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                      Statut agent
                    </label>
                    <select
                      name="statutAgent"
                      className="form-select"
                      value={formData.statutAgent}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                      <option value="Détaché">Détaché</option>
                      <option value="En disponibilité">En disponibilité</option>
                    </select>
                  </div>

                  {/* Sanction */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faGavel} style={{ marginRight: '5px' }} />
                      Code sanction
                    </label>
                    <input
                      type="text"
                      name="sanctionCode"
                      className="form-input"
                      value={formData.sanctionCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faGavel} style={{ marginRight: '5px' }} />
                      Libellé sanction
                    </label>
                    <input
                      type="text"
                      name="sanctionLibelle"
                      className="form-input"
                      value={formData.sanctionLibelle}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Région */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '5px' }} />
                      Code région
                    </label>
                    <input
                      type="text"
                      name="regCode"
                      className="form-input"
                      value={formData.regCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '5px' }} />
                      Libellé région
                    </label>
                    <input
                      type="text"
                      name="regLibelle"
                      className="form-input"
                      value={formData.regLibelle}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Dates */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} />
                      Date d'effet
                    </label>
                    <input
                      type="date"
                      name="dateEffet"
                      className="form-input"
                      value={formData.dateEffet}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '5px' }} />
                      Intervalle âge
                    </label>
                    <input
                      type="text"
                      name="intervalAge"
                      className="form-input"
                      value={formData.intervalAge}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                  {loading ? 'Enregistrement...' : (editingAugure ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de liaison Personnel - AUGURE */}
      {isLiaisonModalOpen && selectedAugure && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={faLink} />
                Lier un personnel à AUGURE
              </h2>
              <button className="modal-close" onClick={() => setIsLiaisonModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleLiaisonSubmit}>
              <div className="modal-body">
                <div style={{ background: '#e8f4f8', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                  <strong>Entrée AUGURE :</strong> {selectedAugure.agentMatricule} - {selectedAugure.agentNom}
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
                      const dejaLie = isPersonnelLien(p.id_personnel, selectedAugure.id_augure);
                      return (
                        <option 
                          key={p.id_personnel} 
                          value={p.id_personnel}
                          disabled={dejaLie}
                        >
                          {p.nom} {p.prenom} - {p.numero_cin} - {p.poste_titre || 'Sans poste'}
                          {dejaLie && ' (déjà lié)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={{ fontSize: '12px', color: '#8a9bb0', marginTop: '10px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px', color: '#27ae60' }} />
                  Un personnel peut être lié à plusieurs entrées AUGURE
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
      {isViewModalOpen && viewingAugure && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={faEye} /> Détails AUGURE
              </h2>
              <button className="modal-close" onClick={() => setIsViewModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Matricule</label>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{viewingAugure.agentMatricule}</div>
                </div>
                <div>
                  <label className="form-label">Statut</label>
                  <div>
                    <span className={viewingAugure.statutAgent === 'Actif' ? 'badge-male' : 'badge-motif'}>
                      {viewingAugure.statutAgent || 'Actif'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Nom complet</label>
                  <div style={{ fontSize: '16px' }}>{viewingAugure.agentNom}</div>
                </div>
                <div>
                  <label className="form-label">CIN</label>
                  <div>{viewingAugure.agentCin || '-'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Date naissance</label>
                  <div>{viewingAugure.agentDateNais ? new Date(viewingAugure.agentDateNais).toLocaleDateString('fr-FR') : '-'}</div>
                </div>
                <div>
                  <label className="form-label">Date d'effet</label>
                  <div>{viewingAugure.dateEffet ? new Date(viewingAugure.dateEffet).toLocaleDateString('fr-FR') : '-'}</div>
                </div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <label className="form-label">Informations professionnelles</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div><strong>Corps:</strong> {viewingAugure.corpsCode || '-'}</div>
                  <div><strong>Grade:</strong> {viewingAugure.gradeCode || '-'}</div>
                  <div><strong>Indice:</strong> {viewingAugure.indice || '-'}</div>
                  <div><strong>Catégorie:</strong> {viewingAugure.categorieCode || '-'}</div>
                  <div><strong>Titre:</strong> {viewingAugure.titre || '-'}</div>
                  <div><strong>Structure:</strong> {viewingAugure.structureRattachement || '-'}</div>
                </div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <label className="form-label">Région</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div><strong>Code région:</strong> {viewingAugure.regCode || '-'}</div>
                  <div><strong>Libellé région:</strong> {viewingAugure.regLibelle || '-'}</div>
                </div>
              </div>

              {(viewingAugure.sanctionCode || viewingAugure.sanctionLibelle) && (
                <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                  <label className="form-label">Sanction</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    <div><strong>Code:</strong> {viewingAugure.sanctionCode || '-'}</div>
                    <div><strong>Libellé:</strong> {viewingAugure.sanctionLibelle || '-'}</div>
                  </div>
                </div>
              )}

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
                <label className="form-label">
                  <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
                  Personnels liés ({getPersonnelsLies(viewingAugure.id_augure).length})
                </label>
                <div style={{ marginTop: '10px' }}>
                  {getPersonnelsLies(viewingAugure.id_augure).length > 0 ? (
                    getPersonnelsLies(viewingAugure.id_augure).map(p => p && (
                      <div key={p.id_personnel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}>
                        <span>{p.nom} {p.prenom} - {p.numero_cin}</span>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => handleDeleteLiaison(p.id_personnel, viewingAugure.id_augure)}
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
                handleOpenLiaison(viewingAugure);
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

export default BaseAugure;