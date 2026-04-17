// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faUsers, faBuilding, faBriefcase, faUserTie,
  faChartLine, faHistory, faDatabase, faAddressCard, faExchangeAlt,
  faUserCheck, faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';
import logoInstat from '../assets/image/Logo-INSTAT.png';

interface SidebarProps {
  isCompact?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCompact = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const sidebarWidth = isCompact ? 200 : 280;
  const logoSize = isCompact ? 50 : 70;
  const imgSize = isCompact ? 40 : 55;
  const headerFontSize = isCompact ? 14 : 18;
  const subFontSize = isCompact ? 9 : 11;
  const navPadding = isCompact ? '10px 12px' : '12px 24px';
  const navMargin = isCompact ? '2px 8px' : '4px 12px';
  const navRadius = isCompact ? 10 : 12;
  const iconSize = isCompact ? 14 : 18;
  const textSize = isCompact ? 12 : 14;
  const headerPadding = isCompact ? '20px 15px' : '25px 20px';

  // Styles pour desktop
  const desktopStyles = {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    width: sidebarWidth,
    height: '100vh',
    background: 'linear-gradient(180deg, #1a2a3a 0%, #2c3e50 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 100,
    overflowY: 'auto' as const,
    transition: 'all 0.3s ease',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)'
  };

  // Styles pour mobile
  const mobileStyles = {
    position: 'fixed' as const,
    left: isMobileMenuOpen ? 0 : -sidebarWidth,
    top: 0,
    width: sidebarWidth,
    height: '100vh',
    background: 'linear-gradient(180deg, #1a2a3a 0%, #2c3e50 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 1000,
    overflowY: 'auto' as const,
    transition: 'all 0.3s ease',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
  };

  const currentStyles = isMobile ? mobileStyles : desktopStyles;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Bouton hamburger pour mobile - sans fond bleu */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          style={{
            position: 'fixed',
            top: '18px',
            left: '15px',
            zIndex: 1001,
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: '#2c3e50',
            fontSize: '22px'
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {/* Overlay pour fermer le menu sur mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <div style={currentStyles}>
        <div style={{ padding: headerPadding, textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* Bouton fermeture sur mobile */}
          {isMobile && (
            <button
              onClick={closeMobileMenu}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
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
          <h2 style={{ fontSize: headerFontSize, color: 'white', margin: 0 }}>INSTAT{!isCompact && ' Madagascar'}</h2>
          <p style={{ fontSize: subFontSize, color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>Gestion Personnel</p>
        </div>
        <nav style={{ padding: '20px 0' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
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
                borderLeft: isActive ? '3px solid #ffd700' : 'none',
                transition: 'all 0.3s ease'
              })}
            >
              <FontAwesomeIcon icon={item.icon} style={{ fontSize: iconSize, width: '24px' }} />
              <span style={{ fontSize: textSize, fontWeight: 500 }}>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;