// src/pages/Etats.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faTimes, faSave, faSearch, faArrowLeft, faUserCheck, faUserSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface Etat {
  id_etat: number;
  nom_etat: 'Actif' | 'Inactif';
  cause_inactivite: string;
  commentaire: string;
}

const Etats: React.FC = () => {
  const [etats, setEtats] = useState<Etat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtat, setEditingEtat] = useState<Etat | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState('all');
  const [formData, setFormData] = useState({
    nom_etat: 'Actif' as 'Actif' | 'Inactif',
    cause_inactivite: '',
    commentaire: '',
  });

  useEffect(() => {
    fetchEtats();
  }, []);

  const fetchEtats = async () => {
    try {
      const response = await api.get('/etats');
      setEtats(response.data);
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
      if (editingEtat) {
        await api.put(`/etats/${editingEtat.id_etat}`, formData);
      } else {
        await api.post('/etats', formData);
      }
      fetchEtats();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string) => {
    if (window.confirm(`Supprimer l'état "${nom}" ?`)) {
      try {
        await api.delete(`/etats/${id}`);
        fetchEtats();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (etat: Etat) => {
    setEditingEtat(etat);
    setFormData({
      nom_etat: etat.nom_etat,
      cause_inactivite: etat.cause_inactivite || '',
      commentaire: etat.commentaire || '',
    });
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/dashboard';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEtat(null);
    setFormData({
      nom_etat: 'Actif',
      cause_inactivite: '',
      commentaire: '',
    });
  };

  const filteredEtats = etats.filter(e => {
    const matchesSearch = e.nom_etat.toLowerCase().includes(searchTerm.toLowerCase()) || (e.cause_inactivite && e.cause_inactivite.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEtat = filterEtat === 'all' || e.nom_etat === filterEtat;
    return matchesSearch && matchesEtat;
  });

  return (
    <div className="personnels-container">
      <div className="bg-shape-1"></div><div className="bg-shape-2"></div><div className="bg-shape-3"></div><div className="wave-bg"></div><div className="grid-pattern"></div>
      <div className="personnels-content">
        <div className="personnels-header">
          <div className="logo-wrapper"><div className="logo-circle"><img src={logoInstat} alt="INSTAT" className="logo-img" /></div></div>
          <h1>Gestion des États</h1>
          <p>Gestion des états (Actif / Inactif) avec motifs et commentaires</p>
        </div>

        <div className="actions-bar">
          <div className="search-wrapper"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher par état ou motif..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="form-select" value={filterEtat} onChange={(e) => setFilterEtat(e.target.value)} style={{ width: '150px' }}><option value="all">Tous</option><option value="Actif">Actif</option><option value="Inactif">Inactif</option></select>
          <div style={{ display: 'flex', gap: '12px' }}><button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Retour</button><button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouvel état</button></div>
        </div>

        <div className="table-container"><table className="data-table"><thead><tr><th>ID</th><th>État</th><th>Cause d'inactivité</th><th>Commentaire</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
          <tbody>{filteredEtats.map((e) => (<tr key={e.id_etat}><td>{e.id_etat}</td><td><span className={e.nom_etat === 'Actif' ? 'badge-male' : 'badge-motif'}><FontAwesomeIcon icon={e.nom_etat === 'Actif' ? faUserCheck : faUserSlash} style={{ marginRight: '5px' }} />{e.nom_etat}</span></td><td>{e.cause_inactivite || '-'}</td><td>{e.commentaire || '-'}</td><td style={{ textAlign: 'center' }}><button className="action-btn action-edit" onClick={() => handleEdit(e)}><FontAwesomeIcon icon={faEdit} /></button><button className="action-btn action-delete" onClick={() => handleDelete(e.id_etat, e.nom_etat)}><FontAwesomeIcon icon={faTrashAlt} /></button></td></tr>))}</tbody></table>
          {filteredEtats.length === 0 && (<div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faUserCheck} size="3x" /></div><p className="empty-text">Aucun état trouvé</p></div>)}
        </div>
      </div>

      {isModalOpen && (<div className="modal-overlay"><div className="modal"><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={editingEtat ? faEdit : faUserCheck} />{editingEtat ? 'Modifier' : 'Ajouter'}</h2><button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body">
          <div className="form-group"><label className="form-label">État *</label><select name="nom_etat" className="form-select" value={formData.nom_etat} onChange={handleInputChange}><option value="Actif">Actif</option><option value="Inactif">Inactif</option></select></div>
          <div className="form-group"><label className="form-label">Cause d'inactivité</label><input type="text" name="cause_inactivite" className="form-input" value={formData.cause_inactivite} onChange={handleInputChange} placeholder="Ex: Démission, Retraite, Décès..." /></div>
          <div className="form-group"><label className="form-label">Commentaire</label><textarea name="commentaire" className="form-input" value={formData.commentaire} onChange={handleInputChange} rows={3} placeholder="Informations complémentaires..." /></div>
        </div><div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit" disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingEtat ? 'Modifier' : 'Ajouter')}</button></div></form></div></div>)}
    </div>
  );
};

export default Etats;