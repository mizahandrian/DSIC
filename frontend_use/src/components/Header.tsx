// src/components/Header.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  isCompact?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isCompact = false }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: isCompact ? '180px' : '280px',
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: isCompact ? '10px 25px' : '12px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    zIndex: 99
  };

  return (
    <div style={headerStyle}>
      <div style={{ position: 'relative', width: '300px' }}>
        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8a9bb0' }} />
        <input
          type="text"
          placeholder="Rechercher..."
          style={{
            width: '100%',
            padding: '10px 15px 10px 40px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', position: 'relative' }}>
          <FontAwesomeIcon icon={faBell} />
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e74c3c', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>3</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2c3e50, #34495e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#2c3e50' }}>{user.name || 'Utilisateur'}</span>
        </div>
        {userMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '30px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
            minWidth: '220px',
            overflow: 'hidden',
            zIndex: 100
          }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2c3e50' }}>{user.name || 'Utilisateur'}</p>
              <small style={{ fontSize: '11px', color: '#8a9bb0' }}>{user.email || ''}</small>
            </div>
            <button style={{ width: '100%', padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#495057' }}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} /> Mon profil
            </button>
            <button style={{ width: '100%', padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#495057' }}>
              <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} /> Paramètres
            </button>
            <button onClick={handleLogout} style={{ width: '100%', padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#e74c3c' }}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;