// src/components/AuthLayout.tsx
import React from 'react';
import Login from '../pages/Login';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/auth.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT" className="auth-logo" />
            </div>
          </div>
          <h1>INSTAT MADAGASCAR</h1>
          <p className="header-subtitle">Institut National de la Statistique</p>
        </div>
        
        <div className="auth-content">
          <Login />
        </div>
        
        <div className="auth-footer">
          <p>©  INSTAT MADAGASCAR - Données et Statistiques</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;