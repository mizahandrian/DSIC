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
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import logoInstat from '../assets/image/Logo-INSTAT.png';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onClose }) => {
  const menuItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: faTachometerAlt },
    { path: '/super-admin', name: 'Super Admin', icon: faUserShield },
    { path: '/recrutement', name: 'Personnel', icon: faUserPlus },
    { path: '/gestion-personnels', name: 'Liste des personnels', icon: faList },
    { path: '/gestion-directions', name: 'Directions', icon: faBuilding },
    { path: '/gestion-services', name: 'Services', icon: faBriefcase },
    { path: '/base-rohi', name: 'Base ROHI', icon: faDatabase },
    { path: '/base-augure', name: 'Base AUGURE', icon: faDatabase },

  ];

  return (
    <div className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={logoInstat} alt="INSTAT" />
        </div>
        <h2>INSTAT Madagascar</h2>
        <p>Gestion Personnel</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;