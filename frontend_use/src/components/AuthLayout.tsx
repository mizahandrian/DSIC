import React from "react";
import "../style/Auth.css"; // ✅ chemin corrigé

interface AuthLayoutProps {
  children: React.ReactNode;
  background: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, background }) => {
  return (
    <div className="auth-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="auth-card">
        {/* 🔽 Remplace cette image par ton logo PNG plus tard */}
        <img src="/WhatsApp Image 2026-03-31 at 11.02.14.jpeg" alt="Logo" className="auth-logo" />
        {children}
        <footer className="auth-footer">
          © 2024 INSTAT MADAGASCAR - Données et Statistiques
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
