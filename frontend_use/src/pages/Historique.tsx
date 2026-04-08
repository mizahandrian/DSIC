// src/pages/Historique.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faArrowRight, faArrowLeft, faEdit, faTrashAlt,
  faTimes, faSave, faHistory, faUser, faBuilding, faBriefcase,
  faCalendarAlt, faExchangeAlt, faEye, faCheckCircle, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

interface Personnel { id_personnel: number; nom: string; prenom: string; poste_titre?: string; }
interface Direction { id_direction: number; nom_direction: string; }
interface Historique { id_historique: number; ancien_poste: string; ancien_direction: string; date_changement: string; motif_changement: string; id_personnel: number; personnel_nom?: string; personnel_prenom?: string; }

const Historique: React.FC = () => {
  const [historiques, setHistoriques] = useState<Historique[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingHistorique, setViewingHistorique] = useState<Historique | null>(null);
  const [editingHistorique, setEditingHistorique] = useState<Historique | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [formData, setFormData] = useState({ id_personnel: '', ancien_poste: '', ancien_direction: '', date_changement: '', motif_changement: '' });

  useEffect(() => { fetchHistoriques(); fetchPersonnels(); fetchDirections(); }, []);

  const fetchHistoriques = async () => { try { const response = await api.get('/historiques'); setHistoriques(response.data); } catch (error) { console.error(error); } };
  const fetchPersonnels = async () => { try { const response = await api.get('/personnels'); setPersonnels(response.data); } catch (error) { console.error(error); } };
  const fetchDirections = async () => { try { const response = await api.get('/directions'); setDirections(response.data); } catch (error) { console.error(error); } };
  const handleInputChange = (e: any) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { ...formData, id_personnel: parseInt(formData.id_personnel) };
      if (editingHistorique) await api.put(`/historiques/${editingHistorique.id_historique}`, data);
      else await api.post('/historiques', data);
      fetchHistoriques(); closeModal();
    } catch (error) { alert('Erreur'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number, nom: string) => { if (window.confirm(`Supprimer l'historique de "${nom}" ?`)) { await api.delete(`/historiques/${id}`); fetchHistoriques(); } };
  const handleEdit = (h: Historique) => { setEditingHistorique(h); setFormData({ id_personnel: h.id_personnel.toString(), ancien_poste: h.ancien_poste, ancien_direction: h.ancien_direction, date_changement: h.date_changement || '', motif_changement: h.motif_changement || '' }); setIsModalOpen(true); };
  const handleView = (h: Historique) => { setViewingHistorique(h); setIsViewModalOpen(true); };
  const handlePrevious = () => { window.location.href = '/carrieres'; };
  
  // ✅ CONDITION
  const hasHistoriques = () => historiques.length > 0;
  const handleNext = () => { if (hasHistoriques()) window.location.href = '/base-rohi'; else alert('⚠️ Veuillez d\'abord ajouter au moins un historique.'); };

  const hasHistoriqueForPersonnel = (personnelId: number): boolean => historiques.some(h => h.id_personnel === personnelId);
  const closeModal = () => { setIsModalOpen(false); setEditingHistorique(null); setFormData({ id_personnel: '', ancien_poste: '', ancien_direction: '', date_changement: '', motif_changement: '' }); };
  const filteredHistoriques = historiques.filter(h => { const p = personnels.find(p => p.id_personnel === h.id_personnel); const nom = p ? `${p.nom} ${p.prenom}` : ''; return (nom.toLowerCase().includes(searchTerm.toLowerCase()) || h.ancien_poste.toLowerCase().includes(searchTerm.toLowerCase())) && (filterDirection === 'all' || h.ancien_direction === filterDirection); });

  return (
    <div className="personnels-container">
      <div className="personnels-content">
        <div className="personnels-header"><div className="logo-wrapper"><div className="logo-circle"><img src={logoInstat} alt="INSTAT" className="logo-img" /></div></div><h1>Gestion des Historiques</h1><p>Institut National de la Statistique - Madagascar</p></div>
        <div className="actions-bar">
          <div className="search-wrapper"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <select className="form-select" value={filterDirection} onChange={e => setFilterDirection(e.target.value)} style={{ width: '220px' }}><option value="all">Toutes les directions</option>{directions.map(d => <option key={d.id_direction} value={d.nom_direction}>{d.nom_direction}</option>)}</select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Précédent</button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouvel historique</button>
            <button className="btn-next" onClick={handleNext} style={{ opacity: hasHistoriques() ? 1 : 0.6, cursor: hasHistoriques() ? 'pointer' : 'not-allowed' }}>Suivant <FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        </div>
        {filteredHistoriques.length > 0 ? (<div className="historiques-grid">{filteredHistoriques.map(h => { const p = personnels.find(p => p.id_personnel === h.id_personnel); return (
          <div key={h.id_historique} className="historique-card"><div className="historique-card-content">
            <div className="historique-icon-wrapper"><div className="historique-icon"><FontAwesomeIcon icon={faHistory} /></div></div>
            <div className="historique-info"><div className="historique-header"><h3 className="historique-title">{p ? `${p.nom} ${p.prenom}` : `Personnel ${h.id_personnel}`}</h3>{h.date_changement && <span className="historique-date"><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(h.date_changement).toLocaleDateString('fr-FR')}</span>}</div>
              <div className="historique-details"><div className="historique-detail"><FontAwesomeIcon icon={faBriefcase} /> <strong>Ancien poste:</strong> {h.ancien_poste || '-'}</div><div className="historique-detail"><FontAwesomeIcon icon={faBuilding} /> <strong>Ancienne direction:</strong> {h.ancien_direction || '-'}</div>{h.motif_changement && <div className="historique-detail"><FontAwesomeIcon icon={faExchangeAlt} /> <strong>Motif:</strong> {h.motif_changement}</div>}</div></div>
            <div className="historique-actions"><button className="action-btn action-view" onClick={() => handleView(h)}><FontAwesomeIcon icon={faEye} /></button><button className="action-btn action-edit" onClick={() => handleEdit(h)}><FontAwesomeIcon icon={faEdit} /></button><button className="action-btn action-delete" onClick={() => handleDelete(h.id_historique, p ? `${p.nom} ${p.prenom}` : 'ce personnel')}><FontAwesomeIcon icon={faTrashAlt} /></button></div>
          </div></div>
        )})}</div>) : <div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faHistory} size="3x" /></div><p className="empty-text">Aucun historique trouvé</p></div>}
      </div>

      {/* Modal */}
      {isModalOpen && (<div className="modal-overlay"><div className="modal" style={{ maxWidth: '600px' }}><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={editingHistorique ? faEdit : faHistory} />{editingHistorique ? 'Modifier' : 'Ajouter'}</h2><button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body">
          <div style={{ background: '#e8f4f8', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}><FontAwesomeIcon icon={faClipboardList} /> <strong>Historique du personnel</strong><br /><small>Chaque personnel ne peut avoir qu'un seul historique</small></div>
          <div className="form-group"><label className="form-label">1. Personnel *</label><select name="id_personnel" className="form-select" value={formData.id_personnel} onChange={handleInputChange} required><option value="">Sélectionner</option>{personnels.map(p => { const hasHist = hasHistoriqueForPersonnel(p.id_personnel); const isEditing = editingHistorique && editingHistorique.id_personnel === p.id_personnel; return <option key={p.id_personnel} value={p.id_personnel} disabled={hasHist && !isEditing}>{p.nom} {p.prenom} - {p.poste_titre || 'Sans poste'}{hasHist && !isEditing && ' (a déjà un historique)'}</option>; })}</select></div>
          <div className="form-group"><label className="form-label">2. Ancien poste *</label><input type="text" name="ancien_poste" className="form-input" value={formData.ancien_poste} onChange={handleInputChange} required /></div>
          <div className="form-group"><label className="form-label">3. Ancienne direction *</label><select name="ancien_direction" className="form-select" value={formData.ancien_direction} onChange={handleInputChange} required><option value="">Sélectionner</option>{directions.map(d => <option key={d.id_direction} value={d.nom_direction}>{d.nom_direction}</option>)}</select></div>
          <div className="form-group"><label className="form-label">4. Date de changement</label><input type="date" name="date_changement" className="form-input" value={formData.date_changement} onChange={handleInputChange} /></div>
          <div className="form-group"><label className="form-label">5. Motif du changement</label><select name="motif_changement" className="form-select" value={formData.motif_changement} onChange={handleInputChange}><option value="">Sélectionner</option><option value="Mutation">Mutation</option><option value="Promotion">Promotion</option><option value="Transfert">Transfert</option><option value="Démission">Démission</option><option value="Retraite">Retraite</option></select></div>
          {(formData.id_personnel || formData.ancien_poste) && <div style={{ background: '#f0f7f0', padding: '15px', borderRadius: '12px' }}><FontAwesomeIcon icon={faCheckCircle} style={{ color: '#27ae60' }} /> <strong>Récapitulatif</strong><br />{formData.id_personnel && <div>Personnel: {personnels.find(p => p.id_personnel.toString() === formData.id_personnel)?.nom} {personnels.find(p => p.id_personnel.toString() === formData.id_personnel)?.prenom}</div>}{formData.ancien_poste && <div>Ancien poste: {formData.ancien_poste}</div>}{formData.ancien_direction && <div>Ancienne direction: {formData.ancien_direction}</div>}</div>}
        </div><div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit" disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingHistorique ? 'Modifier' : 'Créer')}</button></div></form></div></div>)}

      {/* Modal View */}
      {isViewModalOpen && viewingHistorique && (<div className="modal-overlay"><div className="modal" style={{ maxWidth: '500px' }}><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={faHistory} /> Détails</h2><button className="modal-close" onClick={() => setIsViewModalOpen(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
        <div className="modal-body"><div><label>Personnel</label><div style={{ fontSize: '18px', fontWeight: 'bold' }}>{viewingHistorique.personnel_nom} {viewingHistorique.personnel_prenom}</div></div>
        <div><label>Ancien poste</label><div>{viewingHistorique.ancien_poste || '-'}</div></div><div><label>Ancienne direction</label><div>{viewingHistorique.ancien_direction || '-'}</div></div>
        {viewingHistorique.date_changement && <div><label>Date</label><div>{new Date(viewingHistorique.date_changement).toLocaleDateString('fr-FR')}</div></div>}
        {viewingHistorique.motif_changement && <div><label>Motif</label><div>{viewingHistorique.motif_changement}</div></div>}</div>
        <div className="modal-footer"><button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fermer</button></div></div></div>)}
    </div>
  );
};

export default Historique;