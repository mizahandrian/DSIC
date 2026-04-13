// src/pages/Carrieres.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faArrowRight, faArrowLeft, faEdit, faTrashAlt,
  faTimes, faSave, faEye, faGraduationCap, faChartLine, faCalendarAlt,
  faTags, faLayerGroup, faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface Carriere {
  id_carriere: number;
  categorie: string;
  indice: string;
  corps: string;
  grade: string;
  date_effet: string;
  nombre_postes?: number;
  description?: string;
}

const initialCarrieres = [
  { categorie: 'A1', indice: '450', corps: 'Ingénieur des Travaux Statistiques', grade: 'Ingénieur Principal', date_effet: '2024-01-01' },
  { categorie: 'A1', indice: '430', corps: 'Ingénieur des Travaux Statistiques', grade: 'Ingénieur', date_effet: '2024-01-01' },
  { categorie: 'A2', indice: '380', corps: 'Technicien Supérieur Statistique', grade: 'Technicien Supérieur Principal', date_effet: '2024-01-01' },
  { categorie: 'A2', indice: '350', corps: 'Technicien Supérieur Statistique', grade: 'Technicien Supérieur', date_effet: '2024-01-01' },
  { categorie: 'B1', indice: '300', corps: 'Technicien Statistique', grade: 'Technicien Principal', date_effet: '2024-01-01' },
  { categorie: 'B1', indice: '270', corps: 'Technicien Statistique', grade: 'Technicien', date_effet: '2024-01-01' },
  { categorie: 'C1', indice: '220', corps: 'Agent Administratif', grade: 'Agent Principal', date_effet: '2024-01-01' },
  { categorie: 'C1', indice: '200', corps: 'Agent Administratif', grade: 'Agent', date_effet: '2024-01-01' },
];

const Carrieres: React.FC = () => {
  const [carrieres, setCarrieres] = useState<Carriere[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCarriere, setViewingCarriere] = useState<Carriere | null>(null);
  const [editingCarriere, setEditingCarriere] = useState<Carriere | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('all');
  const [formData, setFormData] = useState({ categorie: '', indice: '', corps: '', grade: '', date_effet: '', description: '' });

  useEffect(() => { fetchCarrieres(); }, []);

  const fetchCarrieres = async () => {
    try { const response = await api.get('/carrieres'); if (response.data?.length > 0) setCarrieres(response.data); else initializeCarrieres(); } 
    catch (error) { console.error(error); initializeCarrieres(); }
  };

  const initializeCarrieres = async () => { try { for (const c of initialCarrieres) await api.post('/carrieres', c); const response = await api.get('/carrieres'); setCarrieres(response.data); } catch (error) { console.error(error); } };
  const handleInputChange = (e: any) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { if (editingCarriere) await api.put(`/carrieres/${editingCarriere.id_carriere}`, formData); else await api.post('/carrieres', formData); fetchCarrieres(); closeModal(); } 
    catch (error) { alert('Erreur'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number, corps: string) => { if (window.confirm(`Supprimer "${corps}" ?`)) { await api.delete(`/carrieres/${id}`); fetchCarrieres(); } };
  const handleEdit = (c: Carriere) => { setEditingCarriere(c); setFormData({ categorie: c.categorie, indice: c.indice, corps: c.corps, grade: c.grade, date_effet: c.date_effet, description: c.description || '' }); setIsModalOpen(true); };
  const handleView = (c: Carriere) => { setViewingCarriere(c); setIsViewModalOpen(true); };
  const handlePrevious = () => { window.location.href = '/services'; };
  
  // ✅ MODIFIÉ : Redirige vers Postes
  const hasCarrieres = () => carrieres.length > 0;
  const handleNext = () => { if (hasCarrieres()) window.location.href = '/postes'; else alert('⚠️ Veuillez d\'abord ajouter au moins une carrière.'); };

  const closeModal = () => { setIsModalOpen(false); setEditingCarriere(null); setFormData({ categorie: '', indice: '', corps: '', grade: '', date_effet: '', description: '' }); };
  const filteredCarrieres = carrieres.filter(c => (c.categorie.toLowerCase().includes(searchTerm.toLowerCase()) || c.corps.toLowerCase().includes(searchTerm.toLowerCase()) || c.grade.toLowerCase().includes(searchTerm.toLowerCase())) && (filterCategorie === 'all' || c.categorie === filterCategorie));
  const groupedCarrieres = filteredCarrieres.reduce((acc, c) => { if (!acc[c.categorie]) acc[c.categorie] = []; acc[c.categorie].push(c); return acc; }, {} as Record<string, Carriere[]>);
  const getCategorieColor = (cat: string) => { if (cat === 'A1') return '#2c3e50'; if (cat === 'A2') return '#2980b9'; if (cat === 'B1') return '#27ae60'; if (cat === 'C1') return '#e67e22'; return '#7f8c8d'; };
  const getCategorieLabel = (cat: string) => { if (cat === 'A1') return 'Catégorie A1 - Cadres Supérieurs'; if (cat === 'A2') return 'Catégorie A2 - Cadres Moyens'; if (cat === 'B1') return 'Catégorie B1 - Techniciens'; if (cat === 'C1') return 'Catégorie C1 - Agents'; return cat; };

  return (
    <div className="personnels-container">
      <div className="bg-shape-1"></div><div className="bg-shape-2"></div><div className="bg-shape-3"></div><div className="wave-bg"></div><div className="grid-pattern"></div>
      <div className="personnels-content">
        <div className="personnels-header"><div className="logo-wrapper"><div className="logo-circle"><img src={logoInstat} alt="INSTAT" className="logo-img" /></div></div><h1>Gestion des Carrières</h1><p>Institut National de la Statistique - Madagascar</p></div>
        <div className="actions-bar">
          <div className="search-wrapper"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <select className="form-select" value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)} style={{ width: '200px' }}><option value="all">Toutes les catégories</option><option value="A1">Catégorie A1</option><option value="A2">Catégorie A2</option><option value="B1">Catégorie B1</option><option value="C1">Catégorie C1</option></select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Précédent</button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouvelle carrière</button>
            <button className="btn-next" onClick={handleNext} style={{ opacity: hasCarrieres() ? 1 : 0.6, cursor: hasCarrieres() ? 'pointer' : 'not-allowed' }}>Suivant <FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        </div>
        {Object.keys(groupedCarrieres).length > 0 ? Object.entries(groupedCarrieres).map(([cat, cs]) => (
          <div key={cat} style={{ marginBottom: '30px' }}><div className="category-header"><div className="category-badge" style={{ background: getCategorieColor(cat) }}><FontAwesomeIcon icon={faLayerGroup} /></div><h2 className="category-title">{getCategorieLabel(cat)}</h2><span className="category-count">{cs.length} carrière(s)</span></div>
            <div className="carrieres-grid">{cs.map(c => (
              <div key={c.id_carriere} className="carriere-card"><div className="carriere-card-content">
                <div className="carriere-icon-wrapper"><div className="carriere-icon"><FontAwesomeIcon icon={faGraduationCap} /></div></div>
                <div className="carriere-info"><h3 className="carriere-title">{c.corps}</h3>
                  <div className="carriere-details"><span className="carriere-detail"><FontAwesomeIcon icon={faTags} /> Grade: {c.grade}</span><span className="carriere-detail"><FontAwesomeIcon icon={faChartLine} /> Indice: {c.indice}</span><span className="carriere-detail"><FontAwesomeIcon icon={faCalendarAlt} /> Effet: {new Date(c.date_effet).toLocaleDateString('fr-FR')}</span></div>
                  <div className="carriere-stats"><span className="carriere-stat"><FontAwesomeIcon icon={faBriefcase} /> {c.nombre_postes || 0} poste(s)</span></div></div>
                <div className="carriere-actions"><button className="action-btn action-view" onClick={() => handleView(c)}><FontAwesomeIcon icon={faEye} /></button><button className="action-btn action-edit" onClick={() => handleEdit(c)}><FontAwesomeIcon icon={faEdit} /></button><button className="action-btn action-delete" onClick={() => handleDelete(c.id_carriere, c.corps)}><FontAwesomeIcon icon={faTrashAlt} /></button></div>
              </div></div>
            ))}</div>
          </div>
        )) : <div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faGraduationCap} size="3x" /></div><p className="empty-text">Aucune carrière trouvée</p></div>}
      </div>

      {isModalOpen && (<div className="modal-overlay"><div className="modal"><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={editingCarriere ? faEdit : faGraduationCap} />{editingCarriere ? 'Modifier' : 'Ajouter'}</h2><button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body"><div className="form-group"><label className="form-label">Catégorie *</label><select name="categorie" className="form-select" value={formData.categorie} onChange={handleInputChange} required><option value="">Sélectionner</option><option value="A1">A1 - Cadres Supérieurs</option><option value="A2">A2 - Cadres Moyens</option><option value="B1">B1 - Techniciens</option><option value="C1">C1 - Agents</option></select></div>
        <div className="form-group"><label className="form-label">Indice *</label><input type="text" name="indice" className="form-input" value={formData.indice} onChange={handleInputChange} required /></div>
        <div className="form-group"><label className="form-label">Corps *</label><input type="text" name="corps" className="form-input" value={formData.corps} onChange={handleInputChange} required /></div>
        <div className="form-group"><label className="form-label">Grade *</label><input type="text" name="grade" className="form-input" value={formData.grade} onChange={handleInputChange} required /></div>
        <div className="form-group"><label className="form-label">Date d'effet *</label><input type="date" name="date_effet" className="form-input" value={formData.date_effet} onChange={handleInputChange} required /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows={3} /></div></div>
        <div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit" disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingCarriere ? 'Modifier' : 'Ajouter')}</button></div></form></div></div>)}

      {isViewModalOpen && viewingCarriere && (<div className="modal-overlay"><div className="modal" style={{ maxWidth: '500px' }}><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={faGraduationCap} /> Détails</h2><button className="modal-close" onClick={() => setIsViewModalOpen(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
        <div className="modal-body"><div><label>Catégorie</label><div>{getCategorieLabel(viewingCarriere.categorie)}</div></div><div><label>Corps</label><div style={{ fontSize: '18px', fontWeight: 'bold' }}>{viewingCarriere.corps}</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div><label>Indice</label><div>{viewingCarriere.indice}</div></div><div><label>Grade</label><div>{viewingCarriere.grade}</div></div></div>
        <div><label>Date d'effet</label><div>{new Date(viewingCarriere.date_effet).toLocaleDateString('fr-FR')}</div></div>
        {viewingCarriere.description && <div><label>Description</label><div>{viewingCarriere.description}</div></div>}</div>
        <div className="modal-footer"><button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fermer</button></div></div></div>)}
    </div>
  );
};

export default Carrieres;