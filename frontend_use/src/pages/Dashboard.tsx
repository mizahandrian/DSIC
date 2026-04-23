// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBuilding, faBriefcase, faUserTie,
  faArrowUp, faUserCheck, faDatabase, faEye, faPlus, 
  faHistory, faChartLine, faChartPie, faCalendarAlt,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import logoInstat from '../assets/image/Logo-INSTAT.png';

interface DashboardStats {
  totalPersonnels: number;
  totalDirections: number;
  totalServices: number;
  totalPostes: number;
  personnelsActifs: number;
  evolutionData: number[];
  directionsData: { name: string; count: number }[];
  recents: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPersonnels: 0,
    totalDirections: 0,
    totalServices: 0,
    totalPostes: 0,
    personnelsActifs: 0,
    evolutionData: [12, 15, 18, 22, 25, 30, 35, 38, 42, 45, 48, 52],
    directionsData: [],
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
      const directions = directionsRes.data;
      const actifs = personnels.filter((p: any) => p.id_etat === 1 || p.etat_nom === 'Actif').length;

      const directionsData = directions.slice(0, 6).map((d: any) => ({
        name: d.nom_direction.length > 12 ? d.nom_direction.substring(0, 12) + '...' : d.nom_direction,
        count: personnels.filter((p: any) => p.id_direction === d.id_direction).length
      }));

      setStats({
        totalPersonnels: personnels.length,
        totalDirections: directions.length,
        totalServices: servicesRes.data.length,
        totalPostes: postesRes.data.length,
        personnelsActifs: actifs,
        evolutionData: [12, 15, 18, 22, 25, 30, 35, 38, 42, 45, 48, personnels.length],
        directionsData: directionsData,
        recents: [...personnels].slice(0, 5)
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Personnels', value: stats.totalPersonnels, icon: faUsers, color: '#10b981', bg: '#e8f5e9' },
    { title: 'Directions', value: stats.totalDirections, icon: faBuilding, color: '#10b981', bg: '#e8f5e9' },
    { title: 'Services', value: stats.totalServices, icon: faBriefcase, color: '#10b981', bg: '#e8f5e9' },
    { title: 'Postes', value: stats.totalPostes, icon: faUserTie, color: '#10b981', bg: '#e8f5e9' },
  ];

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const maxEvolution = Math.max(...stats.evolutionData);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête avec logo */}
      <div className="dashboard-header">
        <div className="dashboard-logo">
          <img src={logoInstat} alt="INSTAT" />
        </div>
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue sur votre espace de gestion RH</p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-number">{card.value}</p>
              <div className="stat-trend">
                <FontAwesomeIcon icon={faArrowUp} /> +12% ce mois
              </div>
            </div>
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {/* Graphique en barres */}
        <div className="chart-card">
          <h3 className="chart-title">
            <div className="chart-title-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            Évolution des effectifs
          </h3>
          <div className="bar-chart">
            {stats.evolutionData.map((value, index) => (
              <div key={index} className="bar-item">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(value / maxEvolution) * 160}px`,
                    backgroundColor: '#10b981'
                  }}
                />
                <span className="bar-label">{months[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique en donut */}
        <div className="chart-card">
          <h3 className="chart-title">
            <div className="chart-title-icon">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
            État des personnels
          </h3>
          <div className="donut-chart">
            <div className="donut">
              <div className="donut-inner">
                <span className="donut-value">{Math.round((stats.personnelsActifs / stats.totalPersonnels) * 100) || 0}%</span>
                <span className="donut-label">Actifs</span>
              </div>
            </div>
            <div className="donut-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#10b981' }}></div>
                <span>Actifs ({stats.personnelsActifs})</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#e2e8f0' }}></div>
                <span>Inactifs ({stats.totalPersonnels - stats.personnelsActifs})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top directions */}
      <div className="recent-table" style={{ marginBottom: '32px' }}>
        <div className="recent-header">
          <h3 className="recent-title">
            <FontAwesomeIcon icon={faBuilding} style={{ color: '#10b981' }} />
            Top directions
          </h3>
          <Link to="/directions" className="view-all">Voir tout <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></Link>
        </div>
        <div style={{ padding: '0 24px 24px 24px' }}>
          {stats.directionsData.map((dir, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#334155' }}>{dir.name}</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{dir.count}</span>
              </div>
              <div style={{ background: '#eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${(dir.count / (stats.directionsData[0]?.count || 1)) * 100}%`, height: '6px', background: '#10b981', borderRadius: '8px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers personnels */}
      <div className="recent-table">
        <div className="recent-header">
          <h3 className="recent-title">
            <FontAwesomeIcon icon={faUsers} style={{ color: '#10b981' }} />
            Derniers personnels ajoutés
          </h3>
          <Link to="/personnels" className="view-all">Voir tout <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Poste</th>
              <th>Date entrée</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {stats.recents.map((p: any) => (
              <tr key={p.id_personnel}>
                <td>{p.id_personnel}</td>
                <td><strong>{p.nom}</strong></td>
                <td>{p.prenom}</td>
                <td>{p.poste_titre || '-'}</td>
                <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={`badge ${p.id_etat === 1 || p.etat_nom === 'Actif' ? 'badge-active' : 'badge-inactive'}`}>
                    {p.id_etat === 1 || p.etat_nom === 'Actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;