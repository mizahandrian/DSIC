// src/pages/Personnels.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faArrowRight, 
  faEdit, 
  faTrashAlt,
  faTimes,
  faSave,
  faUser,
  faUsers,
  faCalendarAlt,
  faIdCard,
  faPhone,
  faVenusMars,
  faCalendarCheck,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
  tel: string;
  genre: 'M' | 'F';
  date_naissance: string;
  numero_cin: string;
  date_entree: string;
  motif_entree: string;
}

const Personnels: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPersonnel, setViewingPersonnel] = useState<Personnel | null>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    tel: '',
    genre: 'M' as 'M' | 'F',
    date_naissance: '',
    numero_cin: '',
    date_entree: '',
    motif_entree: '',
  });

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const fetchPersonnels = async () => {
    try {
      const response = await api.get('/personnels');
      setPersonnels(response.data);
    } catch (error) {
      console.error('Erreur:', error);
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
      if (editingPersonnel) {
        await api.put(`/personnels/${editingPersonnel.id_personnel}`, formData);
      } else {
        await api.post('/personnels', formData);
      }
      fetchPersonnels();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string, prenom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${nom} ${prenom} ?`)) {
      try {
        await api.delete(`/personnels/${id}`);
        fetchPersonnels();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (personnel: Personnel) => {
    setEditingPersonnel(personnel);
    setFormData({
      nom: personnel.nom,
      prenom: personnel.prenom,
      tel: personnel.tel,
      genre: personnel.genre,
      date_naissance: personnel.date_naissance,
      numero_cin: personnel.numero_cin,
      date_entree: personnel.date_entree,
      motif_entree: personnel.motif_entree,
    });
    setIsModalOpen(true);
  };

  const handleView = (personnel: Personnel) => {
    setViewingPersonnel(personnel);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPersonnel(null);
    setFormData({
      nom: '',
      prenom: '',
      tel: '',
      genre: 'M',
      date_naissance: '',
      numero_cin: '',
      date_entree: '',
      motif_entree: '',
    });
  };

  // ✅ CONDITION : Vérifier s'il y a au moins un personnel
  const hasPersonnels = () => {
    return personnels.length > 0;
  };

  // ✅ CONDITION : Redirection avec vérification
  const handleNext = () => {
    if (hasPersonnels()) {
      window.location.href = '/directions';
    } else {
      alert('⚠️ Veuillez d\'abord ajouter au moins un personnel avant de passer à la section suivante.');
    }
  };

  const filteredPersonnels = personnels.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.numero_cin.includes(searchTerm)
  );

  return (
    <div className="personnels-container">
      {/* ============================================ */}
      {/* FORMES GÉOMÉTRIQUES EN ARRIÈRE-PLAN */}
      {/* ============================================ */}
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>
      <div className="grid-pattern"></div>
      
      {/* ============================================ */}
      {/* CONTENU PRINCIPAL */}
      {/* ============================================ */}
      <div className="personnels-content">
        {/* En-tête avec logo */}
        <div className="personnels-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT Madagascar" className="logo-img" />
            </div>
          </div>
          <h1>Gestion des Personnels</h1>
          <p>Institut National de la Statistique - Madagascar</p>
        </div>

        {/* Barre d'actions */}
        <div className="actions-bar">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par nom, prénom ou CIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Nouveau personnel
            </button>
            {/* ✅ Bouton Suivant avec condition */}
            <button 
              className="btn-next" 
              onClick={handleNext}
              style={{ 
                opacity: hasPersonnels() ? 1 : 0.6,
                cursor: hasPersonnels() ? 'pointer' : 'not-allowed'
              }}
            >
              Suivant
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
        
        {/* Tableau */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom complet</th>
                <th>CIN</th>
                <th>Téléphone</th>
                <th>Genre</th>
                <th>Date naissance</th>
                <th>Date entrée</th>
                <th>Motif</th>
                <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonnels.map((personnel) => (
                <tr key={personnel.id_personnel}>
                  <td><strong>{personnel.id_personnel}</strong></td>
                  <td><strong>{personnel.nom}</strong> {personnel.prenom}</td>
                  <td>{personnel.numero_cin}</td>
                  <td>{personnel.tel || '-'}</td>
                  <td>
                    <span className={personnel.genre === 'M' ? 'badge-male' : 'badge-female'}>
                      {personnel.genre === 'M' ? 'Masculin' : 'Féminin'}
                    </span>
                  </td>
                  <td>{new Date(personnel.date_naissance).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(personnel.date_entree).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className="badge-motif">
                      {personnel.motif_entree || 'Nouveau recrutement'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="action-btn action-view"
                      onClick={() => handleView(personnel)}
                      title="Voir"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className="action-btn action-edit"
                      onClick={() => handleEdit(personnel)}
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => handleDelete(personnel.id_personnel, personnel.nom, personnel.prenom)}
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPersonnels.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <FontAwesomeIcon icon={faUsers} size="3x" />
              </div>
              <p className="empty-text">Aucun personnel trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Formulaire */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={editingPersonnel ? faEdit : faUser} />
                {editingPersonnel ? 'Modifier le personnel' : 'Ajouter un personnel'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                    Nom complet *
                  </label>
                  <div className="name-group">
                    <input
                      type="text"
                      name="nom"
                      className="form-input"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Nom"
                      required
                    />
                    <input
                      type="text"
                      name="prenom"
                      className="form-input"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Prénoms"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px' }} />
                    Numéro CIN *
                  </label>
                  <input
                    type="text"
                    name="numero_cin"
                    className="form-input"
                    value={formData.numero_cin}
                    onChange={handleInputChange}
                    placeholder="Ex: 101234567890"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="tel"
                    className="form-input"
                    value={formData.tel}
                    onChange={handleInputChange}
                    placeholder="Ex: 032 12 345 67"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faVenusMars} style={{ marginRight: '8px' }} />
                    Genre *
                  </label>
                  <select
                    name="genre"
                    className="form-select"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    className="form-input"
                    value={formData.date_naissance}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '8px' }} />
                    Date d'entrée *
                  </label>
                  <input
                    type="date"
                    name="date_entree"
                    className="form-input"
                    value={formData.date_entree}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Motif d'entrée</label>
                  <input
                    type="text"
                    name="motif_entree"
                    className="form-input"
                    value={formData.motif_entree}
                    onChange={handleInputChange}
                    placeholder="Ex: Recrutement, Mutation, Contrat..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                  {loading ? 'Enregistrement...' : (editingPersonnel ? 'Modifier' : 'Enregistrer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {isViewModalOpen && viewingPersonnel && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FontAwesomeIcon icon={faUser} />
                Détails du personnel
              </h2>
              <button className="modal-close" onClick={() => setIsViewModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Matricule</label>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{viewingPersonnel.id_personnel}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Nom complet</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{viewingPersonnel.nom} {viewingPersonnel.prenom}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>CIN</label>
                <div>{viewingPersonnel.numero_cin}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Téléphone</label>
                <div>{viewingPersonnel.tel || '-'}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Date naissance</label>
                <div>{new Date(viewingPersonnel.date_naissance).toLocaleDateString('fr-FR')}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#8a9bb0' }}>Date entrée</label>
                <div>{new Date(viewingPersonnel.date_entree).toLocaleDateString('fr-FR')}</div>
              </div>
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

export default Personnels;