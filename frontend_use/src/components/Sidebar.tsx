// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUserShield, 
  faUsers, 
  faDatabase,
  faLock
} from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>INSTAT</h2>
        <p>Gestion RH</p>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
          <span className="nav-text">Tableau de bord</span>
        </NavLink>

        <NavLink to="/super-admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faUserShield} className="nav-icon" />
          <span className="nav-text">Super Admin</span>
        </NavLink>

        <NavLink to="/recrutement" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faUsers} className="nav-icon" />
          <span className="nav-text">Recrutement</span>
        </NavLink>

        <NavLink to="/bases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faDatabase} className="nav-icon" />
          <span className="nav-text">Bases</span>
        </NavLink>

        <NavLink to="/forgot-password" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faLock} className="nav-icon" />
          <span className="nav-text">Mot de passe oublié</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;