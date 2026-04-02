import React from "react";
import AuthLayout from "../components/AuthLayout";

const Login: React.FC = () => {
  return (
    <AuthLayout background="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0">
      <h2 className="auth-title">CONNECTER</h2>
      <form className="auth-form">
        <input type="email" placeholder="Courriel" className="auth-input" />
        <input type="password" placeholder="Mot de passe" className="auth-input" />
        <button type="submit" className="auth-button">Se Connecter</button>
        <a href="#" className="auth-link">Mot de passe oublié?</a>
        <p className="auth-subtext">BIENVENUE CHEZ INSTAT MADAGASCAR</p>
        {/* 🔽 Bouton ajouté pour aller vers l'inscription */}
        <a href="/register" className="auth-secondary">S'inscrire</a>
      </form>
    </AuthLayout>
  );
};

export default Login;
