// src/pages/BaseRohi.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDatabase, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave,  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/base-rohi.css';

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
  statut?: string;
}

const BaseRohi: React.FC = () => {
  const [items, setItems] = useState<BaseRohi[]>([]);
  const [filteredItems, setFilteredItems] = useState<BaseRohi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseRohi | null>(null);
  const [formData, setFormData] = useState({
    immatricule: '',
    nom: '',
    prenom: '',
    poste: '',
    porte: '',
    telephone: '',
    direction: '',
    service: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<BaseRohi | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/base-rohi');
      setItems(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.immatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.direction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        await api.put(`/base-rohi/${editingItem.id_rohi}`, formData);
      } else {
        await api.post('/base-rohi', formData);
      }
      await fetchItems();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/base-rohi/${deleteConfirm.id_rohi}`);
      await fetchItems();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      immatricule: '', nom: '', prenom: '', poste: '', porte: '', telephone: '', direction: '', service: ''
    });
    setShowModal(true);
  };

  const openEditModal = (item: BaseRohi) => {
    setEditingItem(item);
    setFormData({
      immatricule: item.immatricule,
      nom: item.nom,
      prenom: item.prenom,
      poste: item.poste || '',
      porte: item.porte || '',
      telephone: item.telephone || '',
      direction: item.direction || '',
      service: item.service || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="base-rohi-container">
      <div className="base-header">
        <div className="base-title">
          <h1><FontAwesomeIcon icon={faDatabase} /> Base ROHI</h1>
          <p>Registre des Opérations Harmonisé et Intégré</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Nouvelle entrée
        </button>
      </div>

      <div className="base-filters">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par matricule, nom, prénom ou direction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-refresh" onClick={fetchItems}>
          <FontAwesomeIcon icon={faSyncAlt} /> Rafraîchir
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="base-table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom complet</th>
                  <th>Poste</th>
                  <th>Porte/Bureau</th>
                  <th>Téléphone</th>
                  <th>Direction</th>
                  <th>Service</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => (
                  <tr key={item.id_rohi}>
                    <td className="matricule-cell">{item.immatricule}</td>
                    <td><strong>{item.nom}</strong> {item.prenom}</td>
                    <td>{item.poste || '-'}</td>
                    <td>{item.porte || '-'}</td>
                    <td>{item.telephone || '-'}</td>
                    <td>{item.direction || '-'}</td>
                    <td>{item.service || '-'}</td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => openEditModal(item)}>
                        <FontAwesomeIcon icon={faEdit} /> Modifier
                      </button>
                      <button className="action-btn delete" onClick={() => setDeleteConfirm(item)}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="page-btn">«</button>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="page-btn">‹</button>
              <span className="page-info">Page {currentPage} sur {totalPages}</span>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">›</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="page-btn">»</button>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="empty-state">
              <p>Aucune entrée ROHI trouvée</p>
            </div>
          )}
        </>
      )}

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Modifier l\'entrée ROHI' : 'Nouvelle entrée ROHI'}</h3>
              <button className="modal-close" onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Matricule *</label>
                    <input type="text" name="immatricule" value={formData.immatricule} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Poste</label>
                    <input type="text" name="poste" value={formData.poste} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Porte / Bureau</label>
                    <input type="text" name="porte" value={formData.porte} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Direction *</label>
                    <input type="text" name="direction" value={formData.direction} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Service</label>
                    <input type="text" name="service" value={formData.service} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn-submit">
                  <FontAwesomeIcon icon={faSave} /> {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation suppression */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-container modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="modal-body">
              <p>Supprimer l'entrée :</p>
              <p className="confirm-name"><strong>{deleteConfirm.immatricule} - {deleteConfirm.nom} {deleteConfirm.prenom}</strong></p>
              <p className="warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="btn-confirm" onClick={handleDelete}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseRohi;