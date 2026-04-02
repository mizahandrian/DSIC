import React from "react";
import InputField from "../components/InputField";
import logo from "../assets/logo.png";
import "./Auth.css";

const Login: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image-left" style={{ backgroundImage: "url('https://picsum.photos/200/400')" }}></div>

        <div className="auth-logo">
          <img src={logo} alt="Logo INSTAT" />
        </div>

        <h2 className="auth-title">CONNECTER</h2>

        <form>
          <InputField type="email" placeholder="Courriel" />
          <InputField type="password" placeholder="Mot de passe" />
          <button type="submit" className="auth-button">Se Connecter</button>
        </form>

        <div className="auth-link">Mot de passe oublié ?</div>
      </div>
    </div>
  );
};

export default Login;