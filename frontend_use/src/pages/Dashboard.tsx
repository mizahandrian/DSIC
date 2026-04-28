// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faBuilding, faBriefcase, faUserTie,
  faUserPlus, faUserEdit, faUserCheck,
  faFileAlt, faChevronRight, faChartLine, faChartBar
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

// Enregistrement Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalPersonnels: number;
  totalDirections: number;
  totalServices: number;
  totalPostes: number;
  personnelsActifs: number;
  personnelsInactifs: number;
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
    personnelsInactifs: 0,
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
      const inactifs = personnels.length - actifs;

      // Données pour le graphique en barres (Top 6 directions)
      const directionsStats = directions.slice(0, 6).map((d: any) => ({
        name: d.nom_direction.length > 15 ? d.nom_direction.substring(0, 15) + '...' : d.nom_direction,
        count: personnels.filter((p: any) => p.id_direction === d.id_direction).length
      })).sort((a: any, b: any) => b.count - a.count);

      setStats({
        totalPersonnels: personnels.length,
        totalDirections: directions.length,
        totalServices: servicesRes.data.length,
        totalPostes: postesRes.data.length,
        personnelsActifs: actifs,
        personnelsInactifs: inactifs,
        directionsData: directionsStats,
        recents: [...personnels].slice(0, 5)
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Configuration du graphique en barres (bâtonnets)
  const barChartData = {
    labels: stats.directionsData.map(d => d.name),
    datasets: [
      {
        label: 'Nombre de personnels',
        data: stats.directionsData.map(d => d.count),
        backgroundColor: '#10b981',
        borderColor: '#0d9488',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11 },
          color: '#64748b',
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (context: any) => `Personnels: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b', stepSize: 1 },
        title: {
          display: true,
          text: 'Nombre de personnels',
          color: '#64748b',
          font: { size: 11 },
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  };

  // Données pour l'évolution (12 mois)
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const evolutionData = months.map((_, i) => {
    // Simulation de croissance basée sur le nombre total de personnels
    return Math.max(1, Math.round(stats.totalPersonnels * (i + 1) / 12));
  });

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Effectifs',
        data: evolutionData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11 },
          color: '#64748b',
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (context: any) => `Effectifs: ${context.raw} personnels`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b', stepSize: 10 },
        title: {
          display: true,
          text: 'Nombre de personnels',
          color: '#64748b',
          font: { size: 11 },
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  };

  const statCards = [
    { title: 'Personnels', value: stats.totalPersonnels, icon: faUsers },
    { title: 'Directions', value: stats.totalDirections, icon: faBuilding },
    { title: 'Services', value: stats.totalServices, icon: faBriefcase },
    { title: 'Postes', value: stats.totalPostes, icon: faUserTie },
  ];

  const quickActions = [
    { title: 'Nouveau personnel', icon: faUserPlus, desc: 'Ajouter un employé', link: '/recrutement' },
    { title: 'Modifier personnel', icon: faUserEdit, desc: 'Mettre à jour', link: '/gestion-personnels' },
    { title: 'Gérer statuts', icon: faUserCheck, desc: 'Actif/Inactif', link: '/statut-admin' },
    { title: 'Voir rapports', icon: faFileAlt, desc: 'Export données', link: '/gestion-personnels' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Message de bienvenue */}
      <div className="dashboard-welcome">
        <h1>Bienvenue sur votre Tableau de bord</h1>
      </div>

      {/* Cartes statistiques */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-number">{card.value}</p>
            </div>
            <div className="stat-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {/* Graphique en barres - Top directions */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div>
              <h3 className="chart-title">Top directions</h3>
              <p className="chart-subtitle">Nombre de personnels par direction</p>
            </div>
          </div>
          <div className="chart-container">
            {stats.directionsData.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="no-data">Aucune donnée disponible</div>
            )}
          </div>
        </div>

        {/* Graphique en ligne - Évolution */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div>
              <h3 className="chart-title">Évolution des effectifs</h3>
              <p className="chart-subtitle">Tendance sur 12 mois</p>
            </div>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* État des personnels simplifié */}
      <div className="stats-simple">
        <div className="stat-card-mini">
          <div className="stat-info">
            <h3>Personnels actifs</h3>
            <p className="stat-number">{stats.personnelsActifs}</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{ width: `${(stats.personnelsActifs / (stats.totalPersonnels || 1)) * 100}%` }}></div>
            </div>
          </div>
          <div className="stat-icon-mini">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-info">
            <h3>Personnels inactifs</h3>
            <p className="stat-number">{stats.personnelsInactifs}</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{ width: `${(stats.personnelsInactifs / (stats.totalPersonnels || 1)) * 100}%`, background: '#e2e8f0' }}></div>
            </div>
          </div>
          <div className="stat-icon-mini">
            <FontAwesomeIcon icon={faUserCheck} style={{ color: '#94a3b8' }} />
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        {quickActions.map((action, i) => (
          <Link to={action.link} key={i} className="quick-card">
            <div className="quick-icon">
              <FontAwesomeIcon icon={action.icon} />
            </div>
            <h4>{action.title}</h4>
            <p>{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Derniers personnels ajoutés */}
      <div className="recent-table">
        <div className="recent-header">
          <h3 className="recent-title">
            <FontAwesomeIcon icon={faUsers} style={{ color: '#10b981' }} />
            Derniers personnels ajoutés
          </h3>
          <Link to="/gestion-personnels" className="view-all">
            Voir tout <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '11px' }} />
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Poste</th>
              <th>Date entrée</th>
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
              </tr>
            ))}
            {stats.recents.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Aucun personnel enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;