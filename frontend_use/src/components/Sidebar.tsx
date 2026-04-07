// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/personnels', name: 'Personnels', icon: '👤' },
    { path: '/directions', name: 'Directions', icon: '🏢' },
    { path: '/services', name: 'Services', icon: '👥' },
    { path: '/postes', name: 'Postes & Carrières', icon: '💼' },
    { path: '/historique', name: 'Historique', icon: '📜' },
    { path: '/base-rohi', name: 'Base ROHI', icon: '📚' },
    { path: '/base-augure', name: 'Base AUGURE', icon: '🔮' },
  ];

  return (
    <div className="sidebar" style={{
      width: '280px',
      background: 'rgba(44, 62, 80, 0.95)',
      backdropFilter: 'blur(10px)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      color: 'white',
      overflowY: 'auto'
    }}>
      <div className="sidebar-header" style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="sidebar-logo" style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 15px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={logoInstat} alt="INSTAT" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '50%' }} />
        </div>
        <h1 style={{ fontSize: '18px', margin: 0 }}>Gestion Personnel</h1>
        <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '5px' }}>INSTAT Madagascar</p>
      </div>
      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              margin: '4px 12px',
              borderRadius: '12px',
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              position: 'relative'
            })}
          >
            <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;