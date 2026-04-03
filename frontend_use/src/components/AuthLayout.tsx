import React, { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/auth.css';

const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <img 
              src={logoInstat} 
              alt="INSTAT Madagascar" 
              className="auth-logo"
            />
          </div>
          <h2>Bienvenue Chez</h2>
          <h1>INSTAT MADAGASCAR</h1>
          <p className="header-subtitle">Institut National de la Statistique</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            SE CONNECTER
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            S'INSCRIRE
          </button>
        </div>
        
        <div className="auth-content">
          {isLogin ? <Login /> : <Register />}
        </div>
        
        <div className="auth-footer">
          <p>© 2024 INSTAT MADAGASCAR - Données et Statistiques</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;