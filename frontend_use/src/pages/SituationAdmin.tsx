// src/pages/SituationAdmin.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faTimes, faSave, faSearch, faArrowLeft, faExchangeAlt, faCalendarAlt, faBuilding, faComment } from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface SituationAdmin {
  id_situation: number;
  date_entrer: string;
  situation: 'activite' | 'mise_disposition' | 'detachement' | 'disponibilite';
  destination: string;
  date_depart: string;
  commentaire: string;
  id_personnel: number;
  personnel_nom?: string;
}

interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
}

const SituationAdmin: React.FC = () => {
  const [situations, setSituations] = useState<SituationAdmin[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSituation, setEditingSituation] = useState<SituationAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSituation, setFilterSituation] = useState('all');
  const [formData, setFormData] = useState({
    id_personnel: '',
    date_entrer: '',
    situation: 'activite' as 'activite' | 'mise_disposition' | 'detachement' | 'disponibilite',
    destination: '',
    date_depart: '',
    commentaire: '',
  });

  useEffect(() => {
    fetchSituations();
    fetchPersonnels();
  }, []);

  const fetchSituations = async () => {
    try {
      const response = await api.get('/situations-admin');
      setSituations(response.data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, id_personnel: parseInt(formData.id_personnel) };
      if (editingSituation) {
        await api.put(`/situations-admin/${editingSituation.id_situation}`, data);
      } else {
        await api.post('/situations-admin', data);
      }
      fetchSituations();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer cette situation ?')) {
      try {
        await api.delete(`/situations-admin/${id}`);
        fetchSituations();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (situation: SituationAdmin) => {
    setEditingSituation(situation);
    setFormData({
      id_personnel: situation.id_personnel.toString(),
      date_entrer: situation.date_entrer,
      situation: situation.situation,
      destination: situation.destination || '',
      date_depart: situation.date_depart || '',
      commentaire: situation.commentaire || '',
    });
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    window.location.href = '/dashboard';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSituation(null);
    setFormData({
      id_personnel: '',
      date_entrer: '',
      situation: 'activite',
      destination: '',
      date_depart: '',
      commentaire: '',
    });
  };

  const getSituationLabel = (situation: string) => {
    switch(situation) {
      case 'activite': return 'Activité';
      case 'mise_disposition': return 'Mise à disposition';
      case 'detachement': return 'Détachement';
      case 'disponibilite': return 'Disponibilité';
      default: return situation;
    }
  };

  const filteredSituations = situations.filter(s => {
    const personnel = personnels.find(p => p.id_personnel === s.id_personnel);
    const nom = personnel ? `${personnel.nom} ${personnel.prenom}` : '';
    const matchesSearch = nom.toLowerCase().includes(searchTerm.toLowerCase()) || (s.destination && s.destination.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSituation = filterSituation === 'all' || s.situation === filterSituation;
    return matchesSearch && matchesSituation;
  });

  return (
    <div className="personnels-container">
      <div className="bg-shape-1"></div><div className="bg-shape-2"></div><div className="bg-shape-3"></div><div className="wave-bg"></div><div className="grid-pattern"></div>
      <div className="personnels-content">
        <div className="personnels-header">
          <div className="logo-wrapper"><div className="logo-circle"><img src={logoInstat} alt="INSTAT" className="logo-img" /></div></div>
          <h1>Situations Administratives</h1>
          <p>Gestion des situations (Activité, Détachement, Disponibilité, Mise à disposition)</p>
        </div>

        <div className="actions-bar">
          <div className="search-wrapper"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher par personnel ou destination..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="form-select" value={filterSituation} onChange={(e) => setFilterSituation(e.target.value)} style={{ width: '200px' }}>
            <option value="all">Toutes les situations</option>
            <option value="activite">Activité</option>
            <option value="mise_disposition">Mise à disposition</option>
            <option value="detachement">Détachement</option>
            <option value="disponibilite">Disponibilité</option>
          </select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Retour</button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouvelle situation</button>
          </div>
        </div>

        <div className="table-container"><table className="data-table"><thead><tr><th>Personnel</th><th>Situation</th><th>Date entrée</th><th>Destination</th><th>Date départ</th><th>Commentaire</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
          <tbody>{filteredSituations.map((s) => {
            const p = personnels.find(p => p.id_personnel === s.id_personnel);
            return (<tr key={s.id_situation}><td><strong>{p ? `${p.nom} ${p.prenom}` : '-'}</strong></td>
            <td><span className="badge-motif">{getSituationLabel(s.situation)}</span></td>
            <td>{s.date_entrer ? new Date(s.date_entrer).toLocaleDateString('fr-FR') : '-'}</td>
            <td>{s.destination || '-'}</td><td>{s.date_depart ? new Date(s.date_depart).toLocaleDateString('fr-FR') : '-'}</td>
            <td>{s.commentaire || '-'}</td>
            <td style={{ textAlign: 'center' }}><button className="action-btn action-edit" onClick={() => handleEdit(s)}><FontAwesomeIcon icon={faEdit} /></button><button className="action-btn action-delete" onClick={() => handleDelete(s.id_situation)}><FontAwesomeIcon icon={faTrashAlt} /></button></td></tr>);
          })}</tbody></table>
          {filteredSituations.length === 0 && (<div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faExchangeAlt} size="3x" /></div><p className="empty-text">Aucune situation trouvée</p></div>)}
        </div>
      </div>

      {isModalOpen && (<div className="modal-overlay"><div className="modal"><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={editingSituation ? faEdit : faExchangeAlt} />{editingSituation ? 'Modifier' : 'Ajouter'}</h2><button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body">
          <div className="form-group"><label className="form-label">Personnel *</label><select name="id_personnel" className="form-select" value={formData.id_personnel} onChange={handleInputChange} required><option value="">Sélectionner</option>{personnels.map(p => <option key={p.id_personnel} value={p.id_personnel}>{p.nom} {p.prenom}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Date d'entrée dans la situation</label><input type="date" name="date_entrer" className="form-input" value={formData.date_entrer} onChange={handleInputChange} /></div>
          <div className="form-group"><label className="form-label">Situation *</label><select name="situation" className="form-select" value={formData.situation} onChange={handleInputChange}><option value="activite">Activité</option><option value="mise_disposition">Mise à disposition</option><option value="detachement">Détachement</option><option value="disponibilite">Disponibilité</option></select></div>
          <div className="form-group"><label className="form-label">Destination (nouveau ministère/institut)</label><input type="text" name="destination" className="form-input" value={formData.destination} onChange={handleInputChange} placeholder="Ex: Ministère des Finances..." /></div>
          <div className="form-group"><label className="form-label">Date de départ</label><input type="date" name="date_depart" className="form-input" value={formData.date_depart} onChange={handleInputChange} /></div>
          <div className="form-group"><label className="form-label">Commentaire</label><textarea name="commentaire" className="form-input" value={formData.commentaire} onChange={handleInputChange} rows={3} placeholder="Informations complémentaires..." /></div>
        </div><div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit" disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingSituation ? 'Modifier' : 'Ajouter')}</button></div></form></div></div>)}
    </div>
  );
};

export default SituationAdmin;