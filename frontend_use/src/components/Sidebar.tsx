// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUserShield, 
  faDatabase,
  faUserPlus,
  faList,
  faBriefcase,
  faBuilding,
  faCog,
  faUserCircle,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import logoInstat from '../assets/image/Logo-INSTAT.png';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onMobileClose }) => {
  const menuItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: faTachometerAlt },
    { path: '/super-admin', name: 'Super Admin', icon: faUserShield },
    { path: '/recrutement', name: 'Ajout Personnel', icon: faUserPlus },
    { path: '/gestion-personnels', name: 'Liste des personnels', icon: faList },
    { path: '/gestion-directions', name: 'Directions', icon: faBuilding },
    { path: '/gestion-services', name: 'Services', icon: faBriefcase },
    { path: '/gestion-postes', name: 'Postes', icon: faBriefcase },
    { path: '/situation-personnels', name: 'Situation', icon: faExchangeAlt },
    { path: '/base-rohi', name: 'Base ROHI', icon: faDatabase },
    { path: '/base-augure', name: 'Base AUGURE', icon: faDatabase },
    { path: '/settings', name: 'Paramètres', icon: faCog },
  ];

  return (
    <>
      <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logoInstat} alt="INSTAT" />
          </div>
          <div className="sidebar-brand">
            <h2>INSTAT Madagascar</h2>
            <p>Gestion Personnels</p>
          </div>
        </div>

        <div className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onMobileClose}
            >
              <div className="nav-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      {isMobileOpen && <div className="sidebar-overlay" onClick={onMobileClose}></div>}
    </>
  );
};

export default Sidebar;