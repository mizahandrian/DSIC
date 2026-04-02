import React from "react";
import AuthLayout from "../components/AuthLayout";

const Register: React.FC = () => {
  return (
    <AuthLayout background="https://images.unsplash.com/photo-1522202176988-66273c2fd55f">
      <h2 className="auth-title">S'INSCRIRE</h2>
      <form className="auth-form">
        <input type="text" placeholder="Nom complet" className="auth-input" />
        <input type="email" placeholder="Courriel" className="auth-input" />
        <input type="password" placeholder="Mot de passe" className="auth-input" />
        <input type="password" placeholder="Confirmer le mot de passe" className="auth-input" />
        <button type="submit" className="auth-button">S'inscrire</button>
        <p className="auth-subtext">
          Déjà inscrit? <a href="/login" className="auth-link">Connectez-vous</a>
        </p>
        {/* 🔽 Bouton ajouté pour revenir à la connexion */}
        <a href="/login" className="auth-secondary">Se Connecter</a>
      </form>
    </AuthLayout>
  );
};

export default Register;
