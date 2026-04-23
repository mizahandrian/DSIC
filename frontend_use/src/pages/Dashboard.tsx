// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBuilding, faBriefcase, faUserTie,
  faArrowUp, faUserCheck, faDatabase, faEye, faPlus, faHistory
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

interface DashboardStats {
  totalPersonnels: number;
  totalDirections: number;
  totalServices: number;
  totalPostes: number;
  personnelsActifs: number;
  recents: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPersonnels: 0,
    totalDirections: 0,
    totalServices: 0,
    totalPostes: 0,
    personnelsActifs: 0,
    recents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [personnelsRes, directionsRes, servicesRes, postesRes] = await Promise.all([
        api.get('/personnels'),
        api.get('/directions'),
        api.get('/services'),
        api.get('/postes')
      ]);

      const personnels = personnelsRes.data;
      const actifs = personnels.filter((p: any) => p.id_etat === 1 || p.etat_nom === 'Actif').length;

      setStats({
        totalPersonnels: personnels.length,
        totalDirections: directionsRes.data.length,
        totalServices: servicesRes.data.length,
        totalPostes: postesRes.data.length,
        personnelsActifs: actifs,
        recents: [...personnels].slice(0, 5)
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Personnels', value: stats.totalPersonnels, icon: faUsers, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Directions', value: stats.totalDirections, icon: faBuilding, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Services', value: stats.totalServices, icon: faBriefcase, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Postes', value: stats.totalPostes, icon: faUserTie, color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
  }

  return (
    <div>
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-number">{card.value}</p>
              <div className="stat-trend"><FontAwesomeIcon icon={faArrowUp} /> +12% ce mois</div>
            </div>
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title"><FontAwesomeIcon icon={faUserCheck} /> État des personnels</h3>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', padding: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.personnelsActifs}</div>
              <div style={{ color: '#64748b' }}>Actifs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>{stats.totalPersonnels - stats.personnelsActifs}</div>
              <div style={{ color: '#64748b' }}>Inactifs</div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title"><FontAwesomeIcon icon={faDatabase} /> Actions rapides</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/recrutement" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#1e293b' }}>
              <FontAwesomeIcon icon={faPlus} color="#3b82f6" /> Ajouter un personnel
            </Link>
            <Link to="/recrutement" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#1e293b' }}>
              <FontAwesomeIcon icon={faEye} color="#10b981" /> Voir tous les personnels
            </Link>
            <Link to="/historique" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#1e293b' }}>
              <FontAwesomeIcon icon={faHistory} color="#f59e0b" /> Historique
            </Link>
          </div>
        </div>
      </div>

      <div className="recent-table">
        <div className="recent-header">
          <h3 className="recent-title"><FontAwesomeIcon icon={faUsers} /> Derniers personnels</h3>
          <Link to="/recrutement" className="view-all">Voir tout →</Link>
        </div>
        <table className="data-table">
          <thead><tr><th>Matricule</th><th>Nom</th><th>Prénom</th><th>Poste</th><th>Date entrée</th></tr></thead>
          <tbody>
            {stats.recents.map((p: any) => (
              <tr key={p.id_personnel}>
                <td>{p.id_personnel}</td>
                <td><strong>{p.nom}</strong></td>
                <td>{p.prenom}</td>
                <td>{p.poste_titre || '-'}</td>
                <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;