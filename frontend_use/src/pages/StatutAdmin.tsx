// src/pages/StatutAdmin.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faTimes, faSave, faSearch, faArrowLeft, faArrowRight, faEye, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface StatutAdmin {
  id_statut: number;
  nom_statut: string;
  type_statut: 'fonctionnaire' | 'prive';
  description?: string;
}

const StatutAdmin: React.FC = () => {
  const [statuts, setStatuts] = useState<StatutAdmin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatut, setEditingStatut] = useState<StatutAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    nom_statut: '',
    type_statut: 'fonctionnaire' as 'fonctionnaire' | 'prive',
    description: '',
  });

  useEffect(() => {
    fetchStatuts();
  }, []);

  const fetchStatuts = async () => {
    try {
      const response = await api.get('/statuts');
      setStatuts(response.data);
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
      if (editingStatut) {
        await api.put(`/statuts/${editingStatut.id_statut}`, formData);
      } else {
        await api.post('/statuts', formData);
      }
      fetchStatuts();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string) => {
    if (window.confirm(`Supprimer le statut "${nom}" ?`)) {
      try {
        await api.delete(`/statuts/${id}`);
        fetchStatuts();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (statut: StatutAdmin) => {
    setEditingStatut(statut);
    setFormData({
      nom_statut: statut.nom_statut,
      type_statut: statut.type_statut,
      description: statut.description || '',
    });
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/dashboard';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStatut(null);
    setFormData({
      nom_statut: '',
      type_statut: 'fonctionnaire',
      description: '',
    });
  };

  const filteredStatuts = statuts.filter(s => {
    const matchesSearch = s.nom_statut.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || s.type_statut === filterType;
    return matchesSearch && matchesType;
  });

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
          <h1>Statuts Administratifs</h1>
          <p>Gestion des statuts (Fonctionnaire / Privé)</p>
        </div>

        <div className="actions-bar">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: '180px' }}>
            <option value="all">Tous les types</option>
            <option value="fonctionnaire">Fonctionnaire</option>
            <option value="prive">Privé</option>
          </select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Retour</button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouveau statut</button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Nom du statut</th><th>Type</th><th>Description</th><th style={{ textAlign: 'center' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filteredStatuts.map((s) => (
                <tr key={s.id_statut}>
                  <td>{s.id_statut}</td>
                  <td><strong>{s.nom_statut}</strong></td>
                  <td><span className={s.type_statut === 'fonctionnaire' ? 'badge-male' : 'badge-female'}>{s.type_statut === 'fonctionnaire' ? 'Fonctionnaire' : 'Privé'}</span></td>
                  <td>{s.description || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="action-btn action-edit" onClick={() => handleEdit(s)}><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="action-btn action-delete" onClick={() => handleDelete(s.id_statut, s.nom_statut)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStatuts.length === 0 && (<div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faAddressCard} size="3x" /></div><p className="empty-text">Aucun statut trouvé</p></div>)}
        </div>
      </div>

      {isModalOpen && (<div className="modal-overlay"><div className="modal"><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={editingStatut ? faEdit : faAddressCard} />{editingStatut ? 'Modifier' : 'Ajouter'}</h2><button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body">
          <div className="form-group"><label className="form-label">Nom du statut *</label><input type="text" name="nom_statut" className="form-input" value={formData.nom_statut} onChange={handleInputChange} required /></div>
          <div className="form-group"><label className="form-label">Type *</label><select name="type_statut" className="form-select" value={formData.type_statut} onChange={handleInputChange}><option value="fonctionnaire">Fonctionnaire</option><option value="prive">Privé</option></select></div>
          <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows={3} /></div>
        </div><div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit" disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingStatut ? 'Modifier' : 'Ajouter')}</button></div></form></div></div>)}
    </div>
  );
};

export default StatutAdmin;