// src/pages/GestionPersonnels.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faSearch, faEdit, faTrashAlt, faEye, faPlus,
  faArrowUp, faArrowDown, faFilter, faDownload, faPrint,
  faUserCheck, faUserTimes, faBuilding, faBriefcase, faUserTie,
  faCalendarAlt, faPhone, faIdCard, faVenusMars, faChevronLeft,
  faChevronRight, faEllipsisH, faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
  tel: string;
  genre: 'M' | 'F';
  numero_cin: string;
  date_naissance: string;
  date_entree: string;
  motif_entree: string;
  direction_nom?: string;
  service_nom?: string;
  poste_titre?: string;
  etat_nom?: string;
}

const GestionPersonnels: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [filteredPersonnels, setFilteredPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Personnel>('id_personnel');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchPersonnels();
  }, []);

  useEffect(() => {
    filterAndSortPersonnels();
  }, [personnels, searchTerm, sortField, sortDirection]);

  const fetchPersonnels = async () => {
    setLoading(true);
    try {
      const response = await api.get('/personnels');
      setPersonnels(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPersonnels = () => {
    let filtered = [...personnels];
    
    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numero_cin.includes(searchTerm) ||
        p.id_personnel.toString().includes(searchTerm)
      );
    }
    
    // Trier
    filtered.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredPersonnels(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Personnel) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!selectedPersonnel) return;
    try {
      await api.delete(`/personnels/${selectedPersonnel.id_personnel}`);
      fetchPersonnels();
      setShowDeleteModal(false);
      setSelectedPersonnel(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getSortIcon = (field: keyof Personnel) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faArrowDown} className="sort-icon inactive" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon active" />
      : <FontAwesomeIcon icon={faArrowDown} className="sort-icon active" />;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPersonnels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPersonnels.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ['ID', 'Nom', 'Prénom', 'CIN', 'Téléphone', 'Genre', 'Direction', 'Service', 'Poste', 'Date entrée', 'Statut'];
    const csvData = filteredPersonnels.map(p => [
      p.id_personnel, p.nom, p.prenom, p.numero_cin, p.tel, p.genre === 'M' ? 'Masculin' : 'Féminin',
      p.direction_nom || '-', p.service_nom || '-', p.poste_titre || '-',
      new Date(p.date_entree).toLocaleDateString('fr-FR'), p.etat_nom || 'Actif'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personnels_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statsCards = [
    { title: 'Total personnels', value: personnels.length, icon: faUsers, color: '#10b981', bg: '#e8f5e9' },
    { title: 'Actifs', value: personnels.filter(p => p.etat_nom === 'Actif').length, icon: faUserCheck, color: '#10b981', bg: '#e8f5e9' },
    { title: 'Hommes', value: personnels.filter(p => p.genre === 'M').length, icon: faVenusMars, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Femmes', value: personnels.filter(p => p.genre === 'F').length, icon: faVenusMars, color: '#ec4899', bg: '#fce7f3' },
  ];

  return (
    <div className="gestion-container">
      {/* En-tête */}
      <div className="gestion-header">
        <div className="gestion-title">
          <h1><FontAwesomeIcon icon={faUsers} /> Gestion des personnels</h1>
          <p>Liste complète des employés recrutés</p>
        </div>
        <div className="gestion-actions">
          <button className="btn-export" onClick={exportToCSV}>
            <FontAwesomeIcon icon={faDownload} /> Exporter
          </button>
          <Link to="/recrutement" className="btn-add">
            <FontAwesomeIcon icon={faPlus} /> Nouveau recrutement
          </Link>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="stats-cards">
        {statsCards.map((card, i) => (
          <div className="stat-card-mini" key={i}>
            <div className="stat-icon-mini" style={{ background: card.bg, color: card.color }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="stat-info-mini">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="gestion-filters">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, CIN ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-refresh" onClick={fetchPersonnels}>
          <FontAwesomeIcon icon={faSyncAlt} /> Rafraîchir
        </button>
      </div>

      {/* Tableau des personnels */}
      <div className="gestion-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des personnels...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="gestion-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id_personnel')}>Matricule {getSortIcon('id_personnel')}</th>
                    <th onClick={() => handleSort('nom')}>Nom complet {getSortIcon('nom')}</th>
                    <th onClick={() => handleSort('numero_cin')}>CIN {getSortIcon('numero_cin')}</th>
                    <th>Téléphone</th>
                    <th onClick={() => handleSort('genre')}>Genre {getSortIcon('genre')}</th>
                    <th>Direction</th>
                    <th>Service</th>
                    <th>Poste</th>
                    <th onClick={() => handleSort('date_entree')}>Date entrée {getSortIcon('date_entree')}</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((personnel) => (
                    <tr key={personnel.id_personnel} className="personnel-row">
                      <td className="matricule">#{personnel.id_personnel}</td>
                      <td className="name">
                        <div className="name-info">
                          <strong>{personnel.nom}</strong> {personnel.prenom}
                        </div>
                      </td>
                      <td>{personnel.numero_cin}</td>
                      <td>{personnel.tel || '-'}</td>
                      <td>
                        <span className={`gender-badge ${personnel.genre === 'M' ? 'male' : 'female'}`}>
                          {personnel.genre === 'M' ? 'Masculin' : 'Féminin'}
                        </span>
                      </td>
                      <td>{personnel.direction_nom || '-'}</td>
                      <td>{personnel.service_nom || '-'}</td>
                      <td>{personnel.poste_titre || '-'}</td>
                      <td>{new Date(personnel.date_entree).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <span className={`status-badge ${personnel.etat_nom === 'Actif' ? 'active' : 'inactive'}`}>
                          {personnel.etat_nom || 'Actif'}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="action-btn view" 
                          onClick={() => { setSelectedPersonnel(personnel); setShowViewModal(true); }}
                          title="Voir"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <Link to={`/recrutement?edit=${personnel.id_personnel}`} className="action-btn edit" title="Modifier">
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button 
                          className="action-btn delete" 
                          onClick={() => { setSelectedPersonnel(personnel); setShowDeleteModal(true); }}
                          title="Supprimer"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPersonnels.length > 0 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="page-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer le personnel suivant ?</p>
              <div className="delete-info">
                <strong>{selectedPersonnel.nom} {selectedPersonnel.prenom}</strong>
                <span>CIN: {selectedPersonnel.numero_cin}</span>
                <span>Matricule: #{selectedPersonnel.id_personnel}</span>
              </div>
              <p className="warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={handleDelete}>Confirmer la suppression</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-container view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FontAwesomeIcon icon={faUserTie} /> Détails du personnel</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="modal-body view-body">
              <div className="view-avatar">
                <div className="avatar-circle">
                  {selectedPersonnel.nom.charAt(0)}{selectedPersonnel.prenom.charAt(0)}
                </div>
                <h4>{selectedPersonnel.nom} {selectedPersonnel.prenom}</h4>
                <span className={`badge ${selectedPersonnel.etat_nom === 'Actif' ? 'active' : 'inactive'}`}>
                  {selectedPersonnel.etat_nom || 'Actif'}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faIdCard} /> Matricule</label>
                  <span>#{selectedPersonnel.id_personnel}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faIdCard} /> CIN</label>
                  <span>{selectedPersonnel.numero_cin}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faPhone} /> Téléphone</label>
                  <span>{selectedPersonnel.tel || '-'}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faVenusMars} /> Genre</label>
                  <span>{selectedPersonnel.genre === 'M' ? 'Masculin' : 'Féminin'}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> Date naissance</label>
                  <span>{new Date(selectedPersonnel.date_naissance).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> Date entrée</label>
                  <span>{new Date(selectedPersonnel.date_entree).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faBuilding} /> Direction</label>
                  <span>{selectedPersonnel.direction_nom || '-'}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faBriefcase} /> Service</label>
                  <span>{selectedPersonnel.service_nom || '-'}</span>
                </div>
                <div className="detail-group">
                  <label><FontAwesomeIcon icon={faUserTie} /> Poste</label>
                  <span>{selectedPersonnel.poste_titre || '-'}</span>
                </div>
                <div className="detail-group">
                  <label>Motif entrée</label>
                  <span>{selectedPersonnel.motif_entree || '-'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link to={`/recrutement?edit=${selectedPersonnel.id_personnel}`} className="btn-edit">
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </Link>
              <button className="btn-close" onClick={() => setShowViewModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPersonnels;