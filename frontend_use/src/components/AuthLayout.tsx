// src/components/AuthLayout.tsx
import React from 'react';
import Login from '../pages/Login';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/auth.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-split">
      {/* Partie gauche - Branding avec grand logo */}
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo-large">
            <img src={logoInstat} alt="INSTAT" />
          </div>
          <h1>INSTAT Madagascar</h1>
          <p className="brand-tagline">Institut National de la Statistique</p>
          <div className="brand-features">
            <div className="feature">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <span>Gestion centralisée du personnel</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <span>Suivi des carrières et promotions</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span>Génération de rapports et statistiques</span>
            </div>
          </div>
        </div>
        <div className="brand-footer">
          <p>© 2024 INSTAT Madagascar</p>
        </div>
      </div>

      {/* Partie droite - Formulaire de connexion */}
      <div className="auth-form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Connexion</h2>
            <p>Accédez à votre espace de gestion RH</p>
          </div>
          <Login />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;