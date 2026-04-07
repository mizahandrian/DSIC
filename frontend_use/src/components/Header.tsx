// src/components/Header.tsx
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      position: 'fixed',
      top: 0,
      right: 0,
      left: '280px',
      zIndex: 100,
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div className="search-bar" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher..."
          style={{
            width: '100%',
            padding: '10px 40px',
            border: '2px solid #e8ecef',
            borderRadius: '16px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      
      <div className="user-menu" style={{ position: 'relative' }}>
        <div 
          className="user-avatar"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2c3e50, #34495e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        
        {userMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)',
            minWidth: '220px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '15px', background: '#fafbfc', borderBottom: '1px solid #f0f2f5' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2c3e50' }}>{user.name || 'Utilisateur'}</p>
              <small style={{ fontSize: '11px', color: '#8a9bb0' }}>{user.email || ''}</small>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 15px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#e74c3c'
              }}
            >
              🚪 Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;