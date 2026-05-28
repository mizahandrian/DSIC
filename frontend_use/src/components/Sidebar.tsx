// src/components/Sidebar.tsx
import React, { useState } from 'react';
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
  faChevronLeft,
  faChevronRight,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import logoInstat from '../assets/image/Logo-INSTAT.png';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle, isMobileOpen = false, onMobileClose }) => {
  const menuItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: faTachometerAlt },
    { path: '/super-admin', name: 'Super Admin', icon: faUserShield },
    { path: '/recrutement', name: 'Ajout Personnel', icon: faUserPlus },
    { path: '/gestion-personnels', name: 'Liste des personnels', icon: faList },
    { path: '/gestion-directions', name: 'Directions', icon: faBuilding },
    { path: '/gestion-services', name: 'Services', icon: faBriefcase },
    { path: '/base-rohi', name: 'Base ROHI', icon: faDatabase },
    { path: '/base-augure', name: 'Base AUGURE', icon: faDatabase },
    { path: '/profile', name: 'Mon profil', icon: faUserCircle },
    { path: '/settings', name: 'Paramètres', icon: faCog },
  ];

  return (
    <>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className={`sidebar-logo ${isCollapsed ? 'collapsed' : ''}`}>
            <img src={logoInstat} alt="INSTAT" />
          </div>
          {!isCollapsed && (
            <>
              <h2>INSTAT Madagascar</h2>
              <p>Gestion RH</p>
            </>
          )}
          <button className="sidebar-toggle" onClick={onToggle}>
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onMobileClose}
            >
              <FontAwesomeIcon icon={item.icon} className="nav-icon" />
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {isMobileOpen && <div className="sidebar-overlay" onClick={onMobileClose}></div>}
    </>
  );
};

export default Sidebar;