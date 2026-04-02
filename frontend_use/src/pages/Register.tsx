import React from "react";
import InputField from "../components/InputField";
import logo from "../assets/logo.png";
import "./Auth.css";

const Register: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image-right" style={{ backgroundImage: "url('https://picsum.photos/201/400')" }}></div>

        <div className="auth-logo">
          <img src={logo} alt="Logo INSTAT" />
        </div>

        <h2 className="auth-title">S'INSCRIRE</h2>

        <form>
          <InputField type="text" placeholder="Nom complet" />
          <InputField type="email" placeholder="Courriel" />
          <InputField type="password" placeholder="Confirmer le mot de passe" />
          <button type="submit" className="auth-button">S'inscrire</button>
        </form>

        <div className="auth-link">Déjà inscrit ? Connectez-vous</div>
        <div className="auth-link">RETOUR À LA CONNEXION</div>
      </div>
    </div>
  );
};

export default Register;