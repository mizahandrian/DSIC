// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  isCompact?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isCompact = false }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Sur mobile, laisser la place pour le bouton hamburger (55px)
  const leftValue = isMobile ? '55px' : (isCompact ? '200px' : '280px');

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: leftValue,
    right: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    padding: isCompact ? '8px 20px' : '12px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    zIndex: 99,
    height: isCompact ? '55px' : '60px'
  };

  return (
    <div style={headerStyle}>
      <div style={{ position: 'relative', width: isMobile ? 'calc(100% - 40px)' : '300px' }}>
        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Rechercher..."
          style={{
            width: '100%',
            padding: '8px 15px 8px 40px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', position: 'relative' }}>
          <FontAwesomeIcon icon={faBell} />
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e74c3c', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>3</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div style={{
            width: '35px',
            height: '35px',
            background: 'linear-gradient(135deg, #2c3e50, #34495e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!isMobile && <span style={{ fontSize: '13px', fontWeight: 500, color: '#2c3e50' }}>{user.name || 'Utilisateur'}</span>}
        </div>
        {userMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '55px',
            right: '20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
            minWidth: '220px',
            overflow: 'hidden',
            zIndex: 100
          }}>
            <div style={{ padding: '12px 15px', borderBottom: '1px solid #e9ecef' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2c3e50' }}>{user.name || 'Utilisateur'}</p>
              <small style={{ fontSize: '11px', color: '#8a9bb0' }}>{user.email || ''}</small>
            </div>
            <button style={{ width: '100%', padding: '10px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#495057' }}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} /> Mon profil
            </button>
            <button style={{ width: '100%', padding: '10px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#495057' }}>
              <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} /> Paramètres
            </button>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#e74c3c' }}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;