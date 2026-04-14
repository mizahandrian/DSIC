// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBuilding, faBriefcase, faUserTie,
  faArrowUp, faArrowDown, faEye, faPlus, 
  faChartPie, faChartBar, faClock, faAddressCard, faExchangeAlt, faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import '../style/dashboard.css';

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
        nom_direction: dir.nom_direction.length > 25 ? dir.nom_direction.substring(0, 25) + '...' : dir.nom_direction,
        nombre_personnels: personnels.filter((p: any) => p.id_direction === dir.id_direction).length
      })).sort((a: any, b: any) => b.nombre_personnels - a.nombre_personnels).slice(0, 5);

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
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
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

      {/* Graphiques */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">
            <FontAwesomeIcon icon={faChartPie} style={{ color: '#2980b9' }} />
            Répartition par genre
          </h3>
          <div className="chart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                background: `conic-gradient(#1976d2 0deg ${(stats.hommes / (stats.totalPersonnels || 1)) * 360}deg, #c2185b ${(stats.hommes / (stats.totalPersonnels || 1)) * 360}deg 360deg)`,
                margin: '0 auto 20px'
              }}></div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div><span style={{ background: '#1976d2', width: '12px', height: '12px', display: 'inline-block', borderRadius: '2px', marginRight: '5px' }}></span> Hommes: {stats.hommes}</div>
                <div><span style={{ background: '#c2185b', width: '12px', height: '12px', display: 'inline-block', borderRadius: '2px', marginRight: '5px' }}></span> Femmes: {stats.femmes}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">
            <FontAwesomeIcon icon={faChartBar} style={{ color: '#27ae60' }} />
            Top 5 directions
          </h3>
          <div className="chart-container">
            {directionsStats.map((dir, idx) => (
              <div key={dir.id_direction} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                  <span>{dir.nom_direction}</span>
                  <span style={{ fontWeight: 'bold' }}>{dir.nombre_personnels}</span>
                </div>
                <div style={{ background: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(dir.nombre_personnels / (directionsStats[0]?.nombre_personnels || 1)) * 100}%`, 
                    height: '8px', 
                    background: '#27ae60', 
                    borderRadius: '10px' 
                  }}></div>
                </div>
              </div>
            ))}
            {directionsStats.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8a9bb0' }}>
                Aucune direction avec personnels
              </div>
            )}
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
        <table>
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