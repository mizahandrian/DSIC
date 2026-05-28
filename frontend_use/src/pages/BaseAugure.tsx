// src/pages/BaseAugure.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDatabase, faSearch, faEdit, faTrashAlt, faPlus, faTimes,
  faSave, faSyncAlt, faChevronLeft, faChevronRight, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/base-augure.css';

interface BaseAugure {
  id: number;
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

const BaseAugure: React.FC = () => {
  const [items, setItems] = useState<BaseAugure[]>([]);
  const [filteredItems, setFilteredItems] = useState<BaseAugure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseAugure | null>(null);
  const [formData, setFormData] = useState({
    agentMatricule: '',
    agentNom: '',
    agentCin: '',
    agentDateNais: '',
    corpsCode: '',
    gradeCode: '',
    indice: '',
    categorieCode: '',
    posteAgentNumero: '',
    titre: '',
    structureRattachement: '',
    statutAgent: 'Actif',
    sanctionCode: '',
    sanctionLibelle: '',
    regCode: '',
    regLibelle: '',
    dateEffet: '',
    intervalAge: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<BaseAugure | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/base-augure');
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
        item.agentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agentCin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.structureRattachement.toLowerCase().includes(searchTerm.toLowerCase())
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
        await api.put(`/base-augure/${editingItem.id}`, formData);
      } else {
        await api.post('/base-augure', formData);
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
      await api.delete(`/base-augure/${deleteConfirm.id}`);
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
      agentMatricule: '', agentNom: '', agentCin: '', agentDateNais: '',
      corpsCode: '', gradeCode: '', indice: '', categorieCode: '',
      posteAgentNumero: '', titre: '', structureRattachement: '', statutAgent: 'Actif',
      sanctionCode: '', sanctionLibelle: '', regCode: '', regLibelle: '',
      dateEffet: '', intervalAge: '',
    });
    setShowModal(true);
  };

  const openEditModal = (item: BaseAugure) => {
    setEditingItem(item);
    setFormData({
      agentMatricule: item.agentMatricule,
      agentNom: item.agentNom,
      agentCin: item.agentCin || '',
      agentDateNais: item.agentDateNais || '',
      corpsCode: item.corpsCode || '',
      gradeCode: item.gradeCode || '',
      indice: item.indice || '',
      categorieCode: item.categorieCode || '',
      posteAgentNumero: item.posteAgentNumero || '',
      titre: item.titre || '',
      structureRattachement: item.structureRattachement,
      statutAgent: item.statutAgent || 'Actif',
      sanctionCode: item.sanctionCode || '',
      sanctionLibelle: item.sanctionLibelle || '',
      regCode: item.regCode || '',
      regLibelle: item.regLibelle || '',
      dateEffet: item.dateEffet || '',
      intervalAge: item.intervalAge || '',
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
    <div className="base-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><FontAwesomeIcon icon={faDatabase} /> Base AUGURE</h1>
          <p>Application de Gestion des Utilisateurs et des Ressources</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} />
          Nouvelle entrée
        </button>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par matricule, nom, CIN ou structure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions-group">
          <button className="btn-outline" onClick={fetchItems}>
            <FontAwesomeIcon icon={faSyncAlt} />
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Chargement des données...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>CIN</th>
                    <th>Titre</th>
                    <th>Corps/Grade</th>
                    <th>Indice</th>
                    <th>Structure</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="matricule-cell">{item.agentMatricule}</td>
                      <td className="name-cell">{item.agentNom}</td>
                      <td>{item.agentCin || '-'}</td>
                      <td>{item.titre || '-'}</td>
                      <td>{item.corpsCode || '-'} / {item.gradeCode || '-'}</td>
                      <td>{item.indice || '-'}</td>
                      <td>{item.structureRattachement || '-'}</td>
                      <td>
                        <span className={`status-tag ${item.statutAgent === 'Actif' ? 'status-active' : 'status-inactive'}`}>
                          {item.statutAgent || 'Actif'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="action-edit" onClick={() => openEditModal(item)}>
                          <FontAwesomeIcon icon={faEdit} />
                          Modifier
                        </button>
                        <button className="action-delete" onClick={() => setDeleteConfirm(item)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="page-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} /> <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faDatabase} />
                <p>Aucune entrée AUGURE trouvée</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Modifier l\'entrée AUGURE' : 'Nouvelle entrée AUGURE'}</h3>
              <button className="modal-close" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Matricule *</label>
                    <input type="text" name="agentMatricule" value={formData.agentMatricule} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Nom complet *</label>
                    <input type="text" name="agentNom" value={formData.agentNom} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CIN</label>
                    <input type="text" name="agentCin" value={formData.agentCin} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Date de naissance</label>
                    <input type="date" name="agentDateNais" value={formData.agentDateNais} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Code Corps</label>
                    <input type="text" name="corpsCode" value={formData.corpsCode} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Grade Code</label>
                    <input type="text" name="gradeCode" value={formData.gradeCode} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Indice</label>
                    <input type="text" name="indice" value={formData.indice} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Catégorie Code</label>
                    <input type="text" name="categorieCode" value={formData.categorieCode} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Numéro poste</label>
                    <input type="text" name="posteAgentNumero" value={formData.posteAgentNumero} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Titre</label>
                    <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Structure rattachement *</label>
                    <input type="text" name="structureRattachement" value={formData.structureRattachement} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Statut agent</label>
                    <select name="statutAgent" value={formData.statutAgent} onChange={handleInputChange}>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                      <option value="Détaché">Détaché</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Code sanction</label>
                    <input type="text" name="sanctionCode" value={formData.sanctionCode} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Libellé sanction</label>
                    <input type="text" name="sanctionLibelle" value={formData.sanctionLibelle} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Code région</label>
                    <input type="text" name="regCode" value={formData.regCode} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Libellé région</label>
                    <input type="text" name="regLibelle" value={formData.regLibelle} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date d'effet</label>
                    <input type="date" name="dateEffet" value={formData.dateEffet} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Intervalle âge</label>
                    <input type="text" name="intervalAge" value={formData.intervalAge} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  <FontAwesomeIcon icon={faSave} />
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <p>Supprimer l'entrée :</p>
              <div className="delete-preview">
                <strong>{deleteConfirm.agentMatricule} - {deleteConfirm.agentNom}</strong>
              </div>
              <p className="warning-text">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Annuler
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseAugure;