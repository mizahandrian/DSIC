import React, { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import '../style/auth.css';

const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Bienvenue Chez</h2>
          <h1>INSTAT MADAGASCAR</h1>
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
        
        {isLogin ? <Login /> : <Register />}
        
        <div className="auth-footer">
          <p>© 2024 INSTAT MADAGASCAR - Données et Statistiques</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;