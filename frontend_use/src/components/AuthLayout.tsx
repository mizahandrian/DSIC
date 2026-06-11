// src/components/AuthLayout.tsx
import React from 'react';
import logoInstat from '../assets/image/Logo-INSTAT.png';
import '../style/auth.css';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="auth-split">
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
                </svg>
              </div>
              <span>Suivi des carrières et promotions</span>
            </div>
          </div>
        </div>
        <div className="brand-footer">
          <p>© INSTAT Madagascar</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="form-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;