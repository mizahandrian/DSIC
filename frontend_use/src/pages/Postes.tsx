// src/pages/Postes.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faArrowRight, faArrowLeft, faEdit, faTrashAlt,
  faTimes, faSave, faUsers, faEye, faBriefcase, faTag,
  faGraduationCap, faSitemap, faCheckCircle, faUserTie, faClipboardList,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/personnels.css';

interface Service { id_service: number; nom_service: string; }
interface Carriere { id_carriere: number; categorie: string; indice: string; corps: string; grade: string; }
interface Poste { id_poste: number; titre_poste: string; indice: string; id_service: number; id_carriere: number; service_nom?: string; carriere_categorie?: string; carriere_corps?: string; carriere_grade?: string; nombre_personnels?: number; description?: string; }

const Postes: React.FC = () => {
  const [postes, setPostes] = useState<Poste[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [carrieres, setCarrieres] = useState<Carriere[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPoste, setViewingPoste] = useState<Poste | null>(null);
  const [editingPoste, setEditingPoste] = useState<Poste | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [formData, setFormData] = useState({ titre_poste: '', indice: '', id_service: '', id_carriere: '', description: '' });

  useEffect(() => { fetchPostes(); fetchServices(); fetchCarrieres(); }, []);

  const fetchPostes = async () => { try { const response = await api.get('/postes'); setPostes(response.data); } catch (error) { console.error(error); } };
  const fetchServices = async () => { try { const response = await api.get('/services'); setServices(response.data); } catch (error) { console.error(error); } };
  const fetchCarrieres = async () => { try { const response = await api.get('/carrieres'); setCarrieres(response.data); } catch (error) { console.error(error); } };
  const handleInputChange = (e: any) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { ...formData, id_service: parseInt(formData.id_service), id_carriere: parseInt(formData.id_carriere) };
      if (editingPoste) await api.put(`/postes/${editingPoste.id_poste}`, data);
      else await api.post('/postes', data);
      fetchPostes(); closeModal();
    } catch (error) { alert('Erreur'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number, titre: string) => { if (window.confirm(`Supprimer "${titre}" ?`)) { await api.delete(`/postes/${id}`); fetchPostes(); } };
  const handleEdit = (poste: Poste) => { setEditingPoste(poste); setFormData({ titre_poste: poste.titre_poste, indice: poste.indice || '', id_service: poste.id_service.toString(), id_carriere: poste.id_carriere.toString(), description: poste.description || '' }); setIsModalOpen(true); };
  const handleView = (poste: Poste) => { setViewingPoste(poste); setIsViewModalOpen(true); };
  const handlePrevious = () => { window.location.href = '/carrieres'; };
  
  // ✅ MODIFIÉ : Redirige vers Historique
  const hasPostes = () => postes.length > 0;
  const handleNext = () => { if (hasPostes()) window.location.href = '/historique'; else alert('⚠️ Veuillez d\'abord ajouter au moins un poste.'); };

  const closeModal = () => { setIsModalOpen(false); setEditingPoste(null); setFormData({ titre_poste: '', indice: '', id_service: '', id_carriere: '', description: '' }); };
  const filteredPostes = postes.filter(p => p.titre_poste.toLowerCase().includes(searchTerm.toLowerCase()) && (filterService === 'all' || p.id_service.toString() === filterService));
  const groupedPostes = filteredPostes.reduce((acc, p) => { const sn = p.service_nom || `Service ${p.id_service}`; if (!acc[sn]) acc[sn] = []; acc[sn].push(p); return acc; }, {} as Record<string, Poste[]>);
  const getCarriereInfo = (id: number) => carrieres.find(c => c.id_carriere === id);
  const hasCarrieres = () => carrieres.length > 0;

  return (
    <div className="personnels-container">
      <div className="bg-shape-1"></div><div className="bg-shape-2"></div><div className="bg-shape-3"></div><div className="wave-bg"></div><div className="grid-pattern"></div>
      <div className="personnels-content">
        <div className="personnels-header"><div className="logo-wrapper"><div className="logo-circle"><img src={logoInstat} alt="INSTAT" className="logo-img" /></div></div><h1>Gestion des Postes</h1><p>Institut National de la Statistique - Madagascar</p></div>
        <div className="actions-bar">
          <div className="search-wrapper"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <select className="form-select" value={filterService} onChange={e => setFilterService(e.target.value)} style={{ width: '220px' }}><option value="all">Tous les services</option>{services.map(s => <option key={s.id_service} value={s.id_service.toString()}>{s.nom_service}</option>)}</select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Précédent</button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouveau poste</button>
            <button className="btn-next" onClick={handleNext} style={{ opacity: hasPostes() ? 1 : 0.6, cursor: hasPostes() ? 'pointer' : 'not-allowed' }}>Suivant <FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        </div>
        {Object.keys(groupedPostes).length > 0 ? Object.entries(groupedPostes).map(([sn, ps]) => (
          <div key={sn} style={{ marginBottom: '30px' }}><div className="category-header"><div className="category-badge" style={{ background: '#9b59b6' }}><FontAwesomeIcon icon={faSitemap} /></div><h2 className="category-title">{sn}</h2><span className="category-count">{ps.length} poste(s)</span></div>
            <div className="postes-grid">{ps.map(p => { const ci = getCarriereInfo(p.id_carriere); return (
              <div key={p.id_poste} className="poste-card"><div className="poste-card-content">
                <div className="poste-icon-wrapper"><div className="poste-icon"><FontAwesomeIcon icon={faUserTie} /></div></div>
                <div className="poste-info"><h3 className="poste-title">{p.titre_poste}</h3>{p.description && <p className="poste-description">{p.description}</p>}
                  <div className="poste-details">{p.indice && <span className="poste-detail"><FontAwesomeIcon icon={faTag} /> Indice: {p.indice}</span>}{ci && <><span className="poste-detail"><FontAwesomeIcon icon={faGraduationCap} /> {ci.categorie} - {ci.corps}</span><span className="poste-detail">Grade: {ci.grade}</span></>}</div>
                  <div className="poste-stats"><span className="poste-stat"><FontAwesomeIcon icon={faUsers} /> {p.nombre_personnels || 0} occupant(s)</span></div></div>
                <div className="poste-actions"><button className="action-btn action-view" onClick={() => handleView(p)}><FontAwesomeIcon icon={faEye} /></button><button className="action-btn action-edit" onClick={() => handleEdit(p)}><FontAwesomeIcon icon={faEdit} /></button><button className="action-btn action-delete" onClick={() => handleDelete(p.id_poste, p.titre_poste)}><FontAwesomeIcon icon={faTrashAlt} /></button></div>
              </div></div>
            )})}</div>
          </div>
        )) : <div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faBriefcase} size="3x" /></div><p className="empty-text">Aucun poste trouvé</p></div>}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title"><FontAwesomeIcon icon={editingPoste ? faEdit : faUserTie} />{editingPoste ? 'Modifier' : 'Spécifier un poste'}</h2>
              <button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ background: '#e8f4f8', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                  <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '12px' }} />
                  <strong>Spécification du poste</strong><br />
                  <small>Renseignez toutes les informations relatives au poste</small>
                </div>

                {/* ✅ Vérification si des carrières existent */}
                {!hasCarrieres() && (
                  <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #f39c12' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '12px', color: '#f39c12' }} />
                    <strong style={{ color: '#e65100' }}>Attention :</strong>
                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#e65100' }}>
                      Aucune carrière n'a été créée. Veuillez d'abord créer des carrières avant de pouvoir créer des postes.
                    </p>
                    <button 
                      type="button"
                      className="btn-primary"
                      style={{ marginTop: '10px', padding: '8px 16px', fontSize: '12px' }}
                      onClick={() => window.location.href = '/carrieres'}
                    >
                      <FontAwesomeIcon icon={faGraduationCap} /> Créer des carrières
                    </button>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">1. Service *</label>
                  <select name="id_service" className="form-select" value={formData.id_service} onChange={handleInputChange} required>
                    <option value="">Sélectionner</option>
                    {services.map(s => <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">2. Intitulé du poste *</label>
                  <input type="text" name="titre_poste" className="form-input" value={formData.titre_poste} onChange={handleInputChange} placeholder="Ex: Administrateur Réseau..." required />
                </div>

                <div className="form-group">
                  <label className="form-label">3. Indice / Grade</label>
                  <input type="text" name="indice" className="form-input" value={formData.indice} onChange={handleInputChange} placeholder="Ex: Indice 450" />
                </div>

                <div className="form-group">
                  <label className="form-label">4. Carrière associée *</label>
                  <select name="id_carriere" className="form-select" value={formData.id_carriere} onChange={handleInputChange} required disabled={!hasCarrieres()}>
                    <option value="">{hasCarrieres() ? 'Sélectionner' : 'Aucune carrière disponible'}</option>
                    {carrieres.map(c => (
                      <option key={c.id_carriere} value={c.id_carriere}>
                        {c.categorie} - {c.corps} ({c.grade})
                      </option>
                    ))}
                  </select>
                  {!hasCarrieres() && (
                    <small style={{ fontSize: '11px', color: '#e74c3c', marginTop: '5px', display: 'block' }}>
                      ⚠️ Veuillez d'abord créer des carrières dans l'onglet "Carrières"
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">5. Description</label>
                  <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows={3} />
                </div>

                {(formData.id_service || formData.titre_poste || formData.id_carriere) && (
                  <div style={{ background: '#f0f7f0', padding: '15px', borderRadius: '12px' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px', color: '#27ae60' }} />
                    <strong>Récapitulatif</strong>
                    {formData.titre_poste && <div style={{ marginTop: '8px' }}>Poste: {formData.titre_poste}</div>}
                    {formData.id_service && <div>Service: {services.find(s => s.id_service.toString() === formData.id_service)?.nom_service}</div>}
                    {formData.id_carriere && <div>Carrière: {carrieres.find(c => c.id_carriere.toString() === formData.id_carriere)?.corps}</div>}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn-submit" disabled={loading || !hasCarrieres()}>
                  <FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingPoste ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View */}
      {isViewModalOpen && viewingPoste && (<div className="modal-overlay"><div className="modal" style={{ maxWidth: '550px' }}><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={faUserTie} /> Détails</h2><button className="modal-close" onClick={() => setIsViewModalOpen(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
        <div className="modal-body"><div><label>Service</label><div>{viewingPoste.service_nom}</div></div><div><label>Intitulé</label><div style={{ fontSize: '18px', fontWeight: 'bold' }}>{viewingPoste.titre_poste}</div></div>{viewingPoste.indice && <div><label>Indice</label><div>{viewingPoste.indice}</div></div>}
        {(() => { const ci = getCarriereInfo(viewingPoste.id_carriere); return ci && (<div><label>Carrière</label><div>{ci.categorie} - {ci.corps}<br /><small>Grade: {ci.grade} | Indice: {ci.indice}</small></div></div>); })()}
        {viewingPoste.description && <div><label>Description</label><div>{viewingPoste.description}</div></div>}
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}><FontAwesomeIcon icon={faUsers} style={{ fontSize: '28px' }} /><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{viewingPoste.nombre_personnels || 0}</div><div>occupant(s)</div></div></div>
        <div className="modal-footer"><button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fermer</button></div></div></div>)}
    </div>
  );
};

export default Postes;