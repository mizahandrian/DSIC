// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBuilding, faBriefcase, faUserTie,
  faArrowUp, faArrowDown, faEye, faPlus, 
  faChartPie, faChartBar, faChartLine, faClock, 
  faAddressCard, faExchangeAlt, faUserCheck
} from '@fortawesome/free-solid-svg-icons';
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
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import api from '../Service/api';
import '../style/dashboard.css';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Types
interface Statistiques {
  totalPersonnels: number;
  totalDirections: number;
  totalServices: number;
  totalPostes: number;
  totalFonctionnaires: number;
  totalPrives: number;
  personnelsActifs: number;
  personnelsInactifs: number;
  hommes: number;
  femmes: number;
  tauxOccupation: number;
}

interface PersonnelRecent {
  id_personnel: number;
  nom: string;
  prenom: string;
  poste_titre: string;
  date_entree: string;
  statut: string;
}

interface DirectionStat {
  id_direction: number;
  nom_direction: string;
  nombre_personnels: number;
}

interface EvolutionData {
  mois: string;
  nombre: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistiques>({
    totalPersonnels: 0,
    totalDirections: 0,
    totalServices: 0,
    totalPostes: 0,
    totalFonctionnaires: 0,
    totalPrives: 0,
    personnelsActifs: 0,
    personnelsInactifs: 0,
    hommes: 0,
    femmes: 0,
    tauxOccupation: 0
  });
  const [personnelsRecents, setPersonnelsRecents] = useState<PersonnelRecent[]>([]);
  const [directionsStats, setDirectionsStats] = useState<DirectionStat[]>([]);
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [personnelsRes, directionsRes, servicesRes, postesRes] = await Promise.all([
        api.get('/personnels'),
        api.get('/directions'),
        api.get('/services'),
        api.get('/postes')
      ]);

      const personnels = personnelsRes.data;
      const directions = directionsRes.data;
      const services = servicesRes.data;
      const postes = postesRes.data;

      const actifs = personnels.filter((p: any) => p.id_etat === 1 || p.etat_nom === 'Actif').length || 0;
      const inactifs = personnels.filter((p: any) => p.id_etat === 2 || p.etat_nom === 'Inactif').length || 0;
      const hommes = personnels.filter((p: any) => p.genre === 'M').length || 0;
      const femmes = personnels.filter((p: any) => p.genre === 'F').length || 0;

      const dirStats = directions.map((dir: any) => ({
        id_direction: dir.id_direction,
        nom_direction: dir.nom_direction.length > 20 ? dir.nom_direction.substring(0, 20) + '...' : dir.nom_direction,
        nombre_personnels: personnels.filter((p: any) => p.id_direction === dir.id_direction).length
      })).sort((a: any, b: any) => b.nombre_personnels - a.nombre_personnels).slice(0, 6);

      // Données d'évolution (simulées - à remplacer par des données réelles de l'API)
      const evolution = [
        { mois: 'Jan', nombre: 12 },
        { mois: 'Fév', nombre: 15 },
        { mois: 'Mar', nombre: 18 },
        { mois: 'Avr', nombre: 22 },
        { mois: 'Mai', nombre: 25 },
        { mois: 'Juin', nombre: 30 },
        { mois: 'Juil', nombre: 35 },
        { mois: 'Aoû', nombre: 38 },
        { mois: 'Sep', nombre: 42 },
        { mois: 'Oct', nombre: 45 },
        { mois: 'Nov', nombre: 48 },
        { mois: 'Déc', nombre: stats.totalPersonnels || 52 },
      ];

      const recents = [...personnels].sort((a: any, b: any) => 
        new Date(b.date_entree).getTime() - new Date(a.date_entree).getTime()
      ).slice(0, 5).map((p: any) => ({
        id_personnel: p.id_personnel,
        nom: p.nom,
        prenom: p.prenom,
        poste_titre: p.poste_titre || 'Non défini',
        date_entree: p.date_entree,
        statut: p.id_etat === 1 || p.etat_nom === 'Actif' ? 'Actif' : 'Inactif'
      }));

      setStats({
        totalPersonnels: personnels.length,
        totalDirections: directions.length,
        totalServices: services.length,
        totalPostes: postes.length,
        totalFonctionnaires: 0,
        totalPrives: 0,
        personnelsActifs: actifs,
        personnelsInactifs: inactifs,
        hommes: hommes,
        femmes: femmes,
        tauxOccupation: postes.length > 0 ? Math.round((personnels.length / postes.length) * 100) : 0
      });

      setDirectionsStats(dirStats);
      setPersonnelsRecents(recents);
      setEvolutionData(evolution);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Configuration du graphique en barres (bâtonnets)
  const barChartData = {
    labels: directionsStats.map(d => d.nom_direction),
    datasets: [
      {
        label: 'Nombre de personnels',
        data: directionsStats.map(d => d.nombre_personnels),
        backgroundColor: 'rgba(44, 62, 80, 0.7)',
        borderColor: 'rgba(44, 62, 80, 1)',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6,
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
          font: { size: 12 },
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        callbacks: {
          label: function(context: any) {
            return `Personnels: ${context.raw}`;
          }
        }
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
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', rotation: 0 },
      },
    },
  };

  // Configuration du graphique en ligne (évolution)
  const lineChartData = {
    labels: evolutionData.map(e => e.mois),
    datasets: [
      {
        label: 'Évolution des effectifs',
        data: evolutionData.map(e => e.nombre),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
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
          font: { size: 12 },
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        callbacks: {
          label: function(context: any) {
            return `Effectifs: ${context.raw} personnels`;
          }
        }
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
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', rotation: 0 },
      },
    },
  };

  // Configuration du graphique en camembert (répartition genre)
  const pieChartData = {
    labels: ['Hommes', 'Femmes'],
    datasets: [
      {
        data: [stats.hommes, stats.femmes],
        backgroundColor: ['#3b82f6', '#ec4899'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12 },
          color: '#64748b',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = stats.hommes + stats.femmes;
            const percentage = total > 0 ? Math.round((context.raw / total) * 100) : 0;
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e9ecef', borderTopColor: '#2c3e50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Personnels</h3>
            <p className="stat-number">{stats.totalPersonnels}</p>
            <div className="stat-trend trend-up">
              <FontAwesomeIcon icon={faArrowUp} /> +12% ce mois
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Directions</h3>
            <p className="stat-number">{stats.totalDirections}</p>
            <div className="stat-trend trend-up">
              <FontAwesomeIcon icon={faArrowUp} /> +2 nouvelles
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#e8f5e9', color: '#27ae60' }}>
            <FontAwesomeIcon icon={faBuilding} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Services</h3>
            <p className="stat-number">{stats.totalServices}</p>
            <div className="stat-trend trend-up">
              <FontAwesomeIcon icon={faArrowUp} /> +5 nouveaux
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#fff3e0', color: '#e65100' }}>
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Postes</h3>
            <p className="stat-number">{stats.totalPostes}</p>
            <div className="stat-trend">
              Taux occupation: {stats.tauxOccupation}%
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#fce4ec', color: '#c2185b' }}>
            <FontAwesomeIcon icon={faUserTie} />
          </div>
        </div>
      </div>

      {/* Graphiques - Première ligne */}
      <div className="charts-grid">
        {/* Graphique en barres (bâtonnets) - Top directions */}
        <div className="chart-card">
          <h3 className="chart-title">
            <FontAwesomeIcon icon={faChartBar} style={{ color: '#2c3e50' }} />
            Top directions
          </h3>
          <div className="chart-container" style={{ height: '320px' }}>
            {directionsStats.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Graphique en ligne - Évolution */}
        <div className="chart-card">
          <h3 className="chart-title">
            <FontAwesomeIcon icon={faChartLine} style={{ color: '#10b981' }} />
            Évolution des effectifs
          </h3>
          <div className="chart-container" style={{ height: '320px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Graphiques - Deuxième ligne */}
      <div className="charts-grid">
        {/* Graphique en camembert - Répartition par genre */}
        <div className="chart-card">
          <h3 className="chart-title">
            <FontAwesomeIcon icon={faChartPie} style={{ color: '#3b82f6' }} />
            Répartition par genre
          </h3>
          <div className="chart-container" style={{ height: '300px' }}>
            {(stats.hommes > 0 || stats.femmes > 0) ? (
              <Pie data={pieChartData} options={pieChartOptions} />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Statistiques des états (Actif/Inactif) */}
        <div className="chart-card">
          <h3 className="chart-title">
            <FontAwesomeIcon icon={faUserCheck} style={{ color: '#10b981' }} />
            États des personnels
          </h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Actifs</span>
                  <span style={{ fontWeight: 'bold' }}>{stats.personnelsActifs}</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(stats.personnelsActifs / (stats.totalPersonnels || 1)) * 100}%`, 
                    height: '30px', 
                    background: '#10b981', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'white', 
                    fontSize: '12px' 
                  }}>
                    {Math.round((stats.personnelsActifs / (stats.totalPersonnels || 1)) * 100)}%
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Inactifs</span>
                  <span style={{ fontWeight: 'bold' }}>{stats.personnelsInactifs}</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(stats.personnelsInactifs / (stats.totalPersonnels || 1)) * 100}%`, 
                    height: '30px', 
                    background: '#ef4444', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'white', 
                    fontSize: '12px' 
                  }}>
                    {Math.round((stats.personnelsInactifs / (stats.totalPersonnels || 1)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des personnels récents */}
      <div className="recent-table">
        <div className="recent-header">
          <h3 className="recent-title">
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', color: '#2980b9' }} />
            Derniers personnels ajoutés
          </h3>
          <Link to="/personnels" className="view-all">Voir tout →</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom complet</th>
              <th>Poste</th>
              <th>Date entrée</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {personnelsRecents.map((p) => (
              <tr key={p.id_personnel}>
                <td>{p.id_personnel}</td>
                <td><strong>{p.nom}</strong> {p.prenom}</td>
                <td>{p.poste_titre}</td>
                <td>{new Date(p.date_entree).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '3px 10px', 
                    borderRadius: '20px', 
                    fontSize: '11px',
                    background: p.statut === 'Actif' ? '#e8f5e9' : '#ffebee',
                    color: p.statut === 'Actif' ? '#27ae60' : '#e74c3c'
                  }}>
                    {p.statut}
                  </span>
                </td>
                <td><Link to={`/personnels/${p.id_personnel}`} style={{ color: '#2980b9' }}>Voir</Link></td>
              </tr>
            ))}
            {personnelsRecents.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8a9bb0' }}>
                  Aucun personnel enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <Link to="/statut-admin" className="quick-btn">
          <div className="quick-icon" style={{ background: '#e3f2fd' }}>
            <FontAwesomeIcon icon={faAddressCard} style={{ color: '#1976d2' }} />
          </div>
          <div className="quick-info">
            <h4>Gérer les statuts</h4>
            <p>Fonctionnaire / Privé</p>
          </div>
        </Link>
        <Link to="/situation-admin" className="quick-btn">
          <div className="quick-icon" style={{ background: '#e8f5e9' }}>
            <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#27ae60' }} />
          </div>
          <div className="quick-info">
            <h4>Gérer les situations</h4>
            <p>Activité, détachement...</p>
          </div>
        </Link>
        <Link to="/etats" className="quick-btn">
          <div className="quick-icon" style={{ background: '#fff3e0' }}>
            <FontAwesomeIcon icon={faUserCheck} style={{ color: '#e65100' }} />
          </div>
          <div className="quick-info">
            <h4>Gérer les états</h4>
            <p>Actif / Inactif</p>
          </div>
        </Link>
        <Link to="/personnels" className="quick-btn">
          <div className="quick-icon" style={{ background: '#fce4ec' }}>
            <FontAwesomeIcon icon={faPlus} style={{ color: '#c2185b' }} />
          </div>
          <div className="quick-info">
            <h4>Ajouter un personnel</h4>
            <p>Nouveau recrutement</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;