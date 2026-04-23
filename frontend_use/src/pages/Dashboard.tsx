// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBuilding, faBriefcase, faUserTie,
  faUserPlus, faUserEdit, faUserCheck,
  faFileAlt, faChevronRight, faChartLine, faChartSimple
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

interface DashboardStats {
  totalPersonnels: number;
  totalDirections: number;
  totalServices: number;
  totalPostes: number;
  evolutionData: number[];
  recents: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPersonnels: 0,
    totalDirections: 0,
    totalServices: 0,
    totalPostes: 0,
    evolutionData: [12, 15, 18, 22, 25, 30, 35, 38, 42, 45, 48, 52],
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

      setStats({
        totalPersonnels: personnels.length,
        totalDirections: directionsRes.data.length,
        totalServices: servicesRes.data.length,
        totalPostes: postesRes.data.length,
        evolutionData: [12, 15, 18, 22, 25, 30, 35, 38, 42, 45, 48, personnels.length],
        recents: [...personnels].slice(0, 5)
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Personnels', value: stats.totalPersonnels, icon: faUsers, link: '/recrutement' },
    { title: 'Directions', value: stats.totalDirections, icon: faBuilding, link: '/recrutement' },
    { title: 'Services', value: stats.totalServices, icon: faBriefcase, link: '/recrutement' },
    { title: 'Postes', value: stats.totalPostes, icon: faUserTie, link: '/recrutement' },
  ];

  const quickActions = [
    { title: 'Nouveau personnel', icon: faUserPlus, desc: 'Ajouter un employé', link: '/recrutement' },
    { title: 'Modifier personnel', icon: faUserEdit, desc: 'Mettre à jour', link: '/recrutement' },
    { title: 'Gérer statuts', icon: faUserCheck, desc: 'Actif/Inactif', link: '/statut-admin' },
    { title: 'Voir rapports', icon: faFileAlt, desc: 'Export données', link: '/recrutement' },
  ];

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const maxEvolution = Math.max(...stats.evolutionData, 1);

  // Calcul des points pour la courbe (coordonnées SVG)
  const getCurvePoints = () => {
    const width = 100;
    const height = 60;
    const step = width / (stats.evolutionData.length - 1);
    
    return stats.evolutionData.map((value, index) => {
      const x = index * step;
      const y = height - (value / maxEvolution) * height;
      return `${x},${y}`;
    }).join(' ');
  };

  const points = getCurvePoints();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid #eef2f6', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Message de bienvenue */}
      <div className="dashboard-welcome">
        <p>Bienvenue sur votre espace de gestion </p>
      </div>

      {/* Cartes statistiques - sans ligne de tendance */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <Link to={card.link} key={i} className="stat-card">
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-number">{card.value}</p>
            </div>
            <div className="stat-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
          </Link>
        ))}
      </div>

      {/* Section des 2 courbes */}
      <div className="charts-grid">
        {/* Courbe 1 : Évolution des effectifs */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div>
              <h3 className="chart-title">Évolution des effectifs</h3>
              <p className="chart-subtitle">Comparaison 2024 vs 2025</p>
            </div>
          </div>
          <div className="curve-container">
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="curve-svg">
              {/* Courbe 2024 */}
              <polyline
                points="0,50 9,48 18,45 27,40 36,35 45,30 54,25 63,22 72,18 81,15 90,12 100,10"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4"
                className="curve-line"
              />
              {/* Courbe 2025 (données réelles) */}
              <polyline
                points={points}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                className="curve-line curve-active"
              />
              {/* Points sur la courbe active */}
              {stats.evolutionData.map((_, idx) => (
                <circle
                  key={idx}
                  cx={idx * (100 / (stats.evolutionData.length - 1))}
                  cy={60 - (stats.evolutionData[idx] / maxEvolution) * 60}
                  r="1.2"
                  fill="#10b981"
                  className="curve-dot"
                />
              ))}
            </svg>
            <div className="curve-labels">
              {months.map((month, idx) => (
                <span key={idx} className="curve-label">{month}</span>
              ))}
            </div>
            <div className="curve-legend">
              <span className="legend-dot dashed"></span>
              <span className="legend-text">2024 (prévision)</span>
              <span className="legend-dot solid"></span>
              <span className="legend-text">2025 (réel)</span>
            </div>
          </div>
        </div>

        {/* Courbe 2 : Répartition par catégorie */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon">
              <FontAwesomeIcon icon={faChartSimple} />
            </div>
            <div>
              <h3 className="chart-title">Répartition par catégorie</h3>
              <p className="chart-subtitle">Cadres vs Techniciens vs Agents</p>
            </div>
          </div>
          <div className="curve-container">
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="curve-svg">
              {/* Cadres */}
              <polyline
                points="0,45 9,42 18,38 27,35 36,30 45,28 54,25 63,22 72,20 81,18 90,15 100,12"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="curve-line"
              />
              {/* Techniciens */}
              <polyline
                points="0,52 9,50 18,48 27,45 36,42 45,40 54,38 63,35 72,32 81,30 90,28 100,25"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                className="curve-line"
              />
              {/* Agents */}
              <polyline
                points="0,58 9,56 18,55 27,53 36,52 45,50 54,48 63,46 72,44 81,42 90,40 100,38"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                className="curve-line"
              />
            </svg>
            <div className="curve-labels">
              {months.map((month, idx) => (
                <span key={idx} className="curve-label">{month}</span>
              ))}
            </div>
            <div className="curve-legend">
              <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
              <span className="legend-text">Cadres</span>
              <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
              <span className="legend-text">Techniciens</span>
              <span className="legend-dot" style={{ background: '#8b5cf6' }}></span>
              <span className="legend-text">Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides - accès direct */}
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
          <Link to="/recrutement" className="view-all">
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