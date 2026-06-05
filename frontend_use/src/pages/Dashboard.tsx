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
  faFileAlt, faChevronRight, faChartLine, faChartBar,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

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
      const [personnelsRes, directionsRes, servicesRes] = await Promise.all([
        api.get('/personnels'),
        api.get('/directions'),
        api.get('/services')
      ]);

      const personnels = personnelsRes.data.map((p: any) => ({
        ...p,
        direction: p.direction?.nom_direction,
        service: p.service?.nom_service,
        poste: p.poste,
        etat: p.etat
      }));
      const directions = directionsRes.data;

      const actifs = personnels.filter((p: any) => p.etat === 'Actif').length;
      const inactifs = personnels.filter((p: any) => p.etat === 'Inactif').length;

      const directionsStats = directions
        .map((d: any) => ({
          name: d.nom_direction.length > 15 ? d.nom_direction.substring(0, 15) + '...' : d.nom_direction,
          count: personnels.filter((p: any) => p.id_direction === d.id_direction).length
        }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 6);

      setStats({
        totalPersonnels: personnels.length,
        totalDirections: directions.length,
        totalServices: servicesRes.data.length,
        totalPostes: new Set(personnels.map((p: any) => p.poste).filter(Boolean)).size,
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

  // Graphique en barres - violet
  const barChartData = {
    labels: stats.directionsData.map(d => d.name),
    datasets: [
      {
        label: 'Personnels',
        data: stats.directionsData.map(d => d.count),
        backgroundColor: '#4f46e5',
        borderColor: '#4338ca',
        borderWidth: 1,
        borderRadius: 8,
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

  // Graphique en ligne - violet
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const evolutionData = months.map((_, i) => {
    return Math.max(1, Math.round(stats.totalPersonnels * (i + 1) / 12));
  });

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Effectifs',
        data: evolutionData,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
    { title: 'Personnels', value: stats.totalPersonnels, icon: faUsers, color: '#4f46e5', bg: '#e0e7ff' },
    { title: 'Directions', value: stats.totalDirections, icon: faBuilding, color: '#4f46e5', bg: '#e0e7ff' },
    { title: 'Services', value: stats.totalServices, icon: faBriefcase, color: '#4f46e5', bg: '#e0e7ff' },
    { title: 'Postes', value: stats.totalPostes, icon: faUserTie, color: '#4f46e5', bg: '#e0e7ff' },
  ];

  const quickActions = [
    { title: 'Ajouter un personnel', icon: faUserPlus, desc: 'Nouveau recrutement', link: '/recrutement' },
    { title: 'Modifier un personnel', icon: faUserEdit, desc: 'Mettre à jour', link: '/gestion-personnels' },
    { title: 'Gérer les statuts', icon: faUserCheck, desc: 'Actif/Inactif', link: '/gestion-personnels' },
    { title: 'Exporter les données', icon: faFileAlt, desc: 'Rapports CSV', link: '/gestion-personnels' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* En-tête de bienvenue */}
      <div className="welcome-section">
        <h1>Tableau de bord</h1>
        <p>Bienvenue sur votre espace de gestion RH</p>
      </div>

      {/* Cartes statistiques */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon-wrapper" style={{ background: card.bg, color: card.color }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* État des personnels */}
      <div className="status-cards">
        <div className="status-card active">
          <div className="status-info">
            <span className="status-value">{stats.personnelsActifs}</span>
            <span className="status-label">Personnels actifs</span>
          </div>
          <div className="status-progress">
            <div className="progress-fill" style={{ width: `${(stats.personnelsActifs / (stats.totalPersonnels || 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="status-card inactive">
          <div className="status-info">
            <span className="status-value">{stats.personnelsInactifs}</span>
            <span className="status-label">Personnels inactifs</span>
          </div>
          <div className="status-progress">
            <div className="progress-fill" style={{ width: `${(stats.personnelsInactifs / (stats.totalPersonnels || 1)) * 100}%`, background: '#cbd5e1' }}></div>
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

      {/* Graphiques */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div>
              <h3>Répartition par direction</h3>
              <p>Nombre de personnels par direction</p>
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

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div>
              <h3>Évolution des effectifs</h3>
              <p>Tendance sur 12 mois</p>
            </div>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Derniers personnels */}
      <div className="recent-section">
        <div className="recent-header">
          <h3>Derniers personnels ajoutés</h3>
          <Link to="/gestion-personnels" className="view-link">
            Voir tout <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        </div>
        <div className="table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Poste</th>
                <th>Date d'entrée</th>
              </tr>
            </thead>
            <tbody>
              {stats.recents.map((p: any) => (
                <tr key={p.id}>
                  <td className="matricule">{p.matricule || '-'}</td>
                  <td className="name">{p.nom}</td>
                  <td>{p.prenom}</td>
                  <td>{p.poste || '-'}</td>
                  <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
              {stats.recents.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-row">
                    Aucun personnel enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;