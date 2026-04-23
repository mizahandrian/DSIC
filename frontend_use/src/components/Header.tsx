// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user.name) return user.name.charAt(0).toUpperCase();
    return 'R';
  };

  return (
    <div className="header">
      <div className="header-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div className="user-avatar">{getUserInitial()}</div>
        <span className="user-name">{user.name || 'RH'}</span>
        
        {dropdownOpen && (
          <div className="user-dropdown">
            <button className="dropdown-item">
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