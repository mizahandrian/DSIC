// src/pages/Services.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faArrowRight, faArrowLeft, faEdit, faTrashAlt,
  faTimes, faSave, faUsers, faBuilding, faEye, faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

interface Direction { id_direction: number; nom_direction: string; }
interface Service { id_service: number; nom_service: string; id_direction: number; direction_nom?: string; nombre_personnels?: number; description?: string; }

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [formData, setFormData] = useState({ nom_service: '', id_direction: '', description: '' });

  useEffect(() => { fetchServices(); fetchDirections(); }, []);

  const fetchServices = async () => { try { const response = await api.get('/services'); setServices(response.data); } catch (error) { console.error(error); } };
  const fetchDirections = async () => { try { const response = await api.get('/directions'); setDirections(response.data); } catch (error) { console.error(error); } };
  const handleInputChange = (e: any) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingService) await api.put(`/services/${editingService.id_service}`, { ...formData, id_direction: parseInt(formData.id_direction) });
      else await api.post('/services', { ...formData, id_direction: parseInt(formData.id_direction) });
      fetchServices(); closeModal();
    } catch (error) { alert('Erreur'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number, nom: string) => { if (window.confirm(`Supprimer "${nom}" ?`)) { await api.delete(`/services/${id}`); fetchServices(); } };
  const handleEdit = (service: Service) => { setEditingService(service); setFormData({ nom_service: service.nom_service, id_direction: service.id_direction.toString(), description: service.description || '' }); setIsModalOpen(true); };
  const handleView = (service: Service) => { setViewingService(service); setIsViewModalOpen(true); };
  const handlePrevious = () => { window.location.href = '/directions'; };
  
  // ✅ CONDITION
  const hasServices = () => services.length > 0;
  const handleNext = () => { if (hasServices()) window.location.href = '/postes'; else alert('⚠️ Veuillez d\'abord ajouter au moins un service.'); };

  const closeModal = () => { setIsModalOpen(false); setEditingService(null); setFormData({ nom_service: '', id_direction: '', description: '' }); };
  const filteredServices = services.filter(s => s.nom_service.toLowerCase().includes(searchTerm.toLowerCase()) && (filterDirection === 'all' || s.id_direction.toString() === filterDirection));
  const groupedServices = filteredServices.reduce((acc, s) => { const dn = s.direction_nom || `Direction ${s.id_direction}`; if (!acc[dn]) acc[dn] = []; acc[dn].push(s); return acc; }, {} as Record<string, Service[]>);

  return (
    <div className="personnels-container">
      <div className="personnels-content">
        <div className="personnels-header">
          <div className="logo-wrapper"><div className="logo-circle"><img src={logoInstat} alt="INSTAT" className="logo-img" /></div></div>
          <h1>Gestion des Services</h1><p>Institut National de la Statistique - Madagascar</p>
        </div>
        <div className="actions-bar">
          <div className="search-wrapper"><FontAwesomeIcon icon={faSearch} className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <select className="form-select" value={filterDirection} onChange={e => setFilterDirection(e.target.value)} style={{ width: '220px' }}><option value="all">Toutes les directions</option>{directions.map(d => <option key={d.id_direction} value={d.id_direction.toString()}>{d.nom_direction}</option>)}</select>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handlePrevious}><FontAwesomeIcon icon={faArrowLeft} /> Précédent</button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faPlus} /> Nouveau service</button>
            <button className="btn-next" onClick={handleNext} style={{ opacity: hasServices() ? 1 : 0.6, cursor: hasServices() ? 'pointer' : 'not-allowed' }}>Suivant <FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        </div>
        {Object.keys(groupedServices).length > 0 ? Object.entries(groupedServices).map(([dn, ss]) => (
          <div key={dn} style={{ marginBottom: '30px' }}>
            <div className="category-header"><div className="category-badge" style={{ background: '#3498db' }}><FontAwesomeIcon icon={faBuilding} /></div><h2 className="category-title">{dn}</h2><span className="category-count">{ss.length} service(s)</span></div>
            <div className="services-grid">{ss.map(s => (
              <div key={s.id_service} className="service-card"><div className="service-card-content">
                <div className="service-icon-wrapper"><div className="service-icon"><FontAwesomeIcon icon={faBriefcase} /></div></div>
                <div className="service-info"><h3 className="service-title">{s.nom_service}</h3>{s.description && <p className="service-description">{s.description}</p>}<div className="service-stats"><span className="service-stat"><FontAwesomeIcon icon={faUsers} /> {s.nombre_personnels || 0} personnels</span></div></div>
                <div className="service-actions"><button className="action-btn action-view" onClick={() => handleView(s)}><FontAwesomeIcon icon={faEye} /></button><button className="action-btn action-edit" onClick={() => handleEdit(s)}><FontAwesomeIcon icon={faEdit} /></button><button className="action-btn action-delete" onClick={() => handleDelete(s.id_service, s.nom_service)}><FontAwesomeIcon icon={faTrashAlt} /></button></div>
              </div></div>
            ))}</div>
          </div>
        )) : <div className="empty-state"><div className="empty-icon"><FontAwesomeIcon icon={faBriefcase} size="3x" /></div><p className="empty-text">Aucun service trouvé</p></div>}
      </div>

      {/* Modal */}
      {isModalOpen && (<div className="modal-overlay"><div className="modal"><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={editingService ? faEdit : faBriefcase} />{editingService ? 'Modifier' : 'Ajouter'}</h2><button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body"><div className="form-group"><label className="form-label">Direction *</label><select name="id_direction" className="form-select" value={formData.id_direction} onChange={handleInputChange} required><option value="">Sélectionner</option>{directions.map(d => <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Nom du service *</label><input type="text" name="nom_service" className="form-input" value={formData.nom_service} onChange={handleInputChange} required /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} rows={3} /></div></div>
        <div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit" disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : (editingService ? 'Modifier' : 'Ajouter')}</button></div></form></div></div>)}

      {/* Modal View */}
      {isViewModalOpen && viewingService && (<div className="modal-overlay"><div className="modal" style={{ maxWidth: '500px' }}><div className="modal-header"><h2 className="modal-title"><FontAwesomeIcon icon={faBriefcase} /> Détails</h2><button className="modal-close" onClick={() => setIsViewModalOpen(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
        <div className="modal-body"><div><label>Direction</label><div>{viewingService.direction_nom}</div></div><div><label>Nom</label><div>{viewingService.nom_service}</div></div>{viewingService.description && <div><label>Description</label><div>{viewingService.description}</div></div>}</div>
        <div className="modal-footer"><button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fermer</button></div></div></div>)}
    </div>
  );
};

export default Services;