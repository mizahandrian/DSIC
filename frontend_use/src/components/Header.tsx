// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.email) {
      localStorage.setItem(`profile_${currentUser.email}`, JSON.stringify(currentUser));
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user.prenom && user.name) {
      return `${user.prenom.charAt(0)}${user.name.charAt(0)}`.toUpperCase();
    }
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.prenom) return user.prenom.charAt(0).toUpperCase();
    return 'RH';
  };

  const getUserAvatar = () => {
    if (user.avatar) {
      return <img src={user.avatar} alt="Avatar" className="user-avatar-img" />;
    }
    return <div className="user-avatar-initials">{getUserInitial()}</div>;
  };

  return (
    <div className="dashboard-header">
      {/* Bouton hamburger pour mobile */}
      <button className="menu-toggle" onClick={onMenuClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Espace vide pour pousser la notification et le profil à droite */}
      <div style={{ flex: 1 }}></div>

      {/* Notification Bell - à côté du profil */}
      <NotificationBell />

      {/* Menu utilisateur */}
      <div className="header-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div className="user-avatar">
          {getUserAvatar()}
        </div>
        <span className="user-name">{user.prenom || user.name || 'RH'}</span>
        
        {dropdownOpen && (
          <div className="user-dropdown">
            <button className="dropdown-item" onClick={() => navigate('/profile')}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
              Mon profil
            </button>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;