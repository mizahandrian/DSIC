import React from 'react';
import Login from '../pages/Login';
import logoInstat from '../assets/image/Logo2.png';
import '../style/auth.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-container">
      {/* ============================================ */}
      {/* FORMES GÉOMÉTRIQUES MODERNES EN ARRIÈRE-PLAN */}
      {/* ============================================ */}
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>
      <div className="grid-pattern"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img 
                src={logoInstat} 
                alt="INSTAT Madagascar" 
                className="auth-logo"
              />
            </div>
          </div>
          <h2>Bienvenue Chez</h2>
          <h1>INSTAT MADAGASCAR</h1>
          <p className="header-subtitle">Institut National de la Statistique</p>
        </div>
        
        <div className="auth-content">
          <Login />
        </div>
        
        <div className="auth-footer">
          <p>INSTAT MADAGASCAR - Données et Statistiques</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;