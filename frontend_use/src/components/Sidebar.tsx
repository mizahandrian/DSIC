// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faUsers, faBuilding, faBriefcase, faUserTie,
  faChartLine, faHistory, faDatabase, faAddressCard, faExchangeAlt,
  faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import logoInstat from '../assets/image/Logo-INSTAT.png';

interface SidebarProps {
  isCompact?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCompact = false }) => {
  const menuItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: faTachometerAlt },
    { path: '/personnels', name: 'Personnels', icon: faUsers },
    { path: '/directions', name: 'Directions', icon: faBuilding },
    { path: '/services', name: 'Services', icon: faBriefcase },
    { path: '/postes', name: 'Postes', icon: faUserTie },
    { path: '/carrieres', name: 'Carrières', icon: faChartLine },
    { path: '/historique', name: 'Historique', icon: faHistory },
    { path: '/base-rohi', name: 'Base ROHI', icon: faDatabase },
    { path: '/base-augure', name: 'Base AUGURE', icon: faDatabase },
    { path: '/statut-admin', name: 'Statuts Admin', icon: faAddressCard },
    { path: '/situation-admin', name: 'Situation Admin', icon: faExchangeAlt },
    { path: '/etats', name: 'États', icon: faUserCheck },
  ];

  // Largeur uniforme de 280px pour tous
  const sidebarWidth = 280;
  const logoSize = 70;
  const imgSize = 55;
  const headerFontSize = 18;
  const subFontSize = 11;
  const navPadding = '12px 24px';
  const navMargin = '4px 12px';
  const navRadius = 12;
  const iconSize = 18;
  const textSize = 14;
  const headerPadding = '25px 20px';

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: sidebarWidth,
      height: '100vh',
      background: 'rgba(44, 62, 80, 0.98)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <div style={{ padding: headerPadding, textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{
          width: logoSize,
          height: logoSize,
          margin: '0 auto 15px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <img src={logoInstat} alt="INSTAT" style={{ width: imgSize, height: imgSize, objectFit: 'contain' }} />
        </div>
        <h2 style={{ fontSize: headerFontSize, color: 'white', margin: 0 }}>INSTAT Madagascar</h2>
        <p style={{ fontSize: subFontSize, color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>Gestion Personnel</p>
      </div>
      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: navPadding,
              color: isActive ? '#ffd700' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              margin: navMargin,
              borderRadius: navRadius,
              gap: '12px',
              background: isActive ? 'rgba(255,215,0,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid #ffd700' : 'none'
            })}
          >
            <FontAwesomeIcon icon={item.icon} style={{ fontSize: iconSize, width: '24px' }} />
            <span style={{ fontSize: textSize, fontWeight: 500 }}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;