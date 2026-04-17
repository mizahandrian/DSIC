import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [params] = useSearchParams();
  const email = params.get("email");

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas ❌");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères ❌");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email,
        password,
        password_confirmation: confirm,
      });

      setMessage("Mot de passe changé avec succès ✔");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError("Erreur lors du changement de mot de passe ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
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
                src="/src/assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg" 
                alt="INSTAT Madagascar" 
                className="auth-logo"
              />
            </div>
          </div>
          <h2>Bienvenue Chez</h2>
          <h1>INSTAT MADAGASCAR</h1>
          <p className="header-subtitle">Nouveau mot de passe</p>
        </div>

        <div className="auth-content">
          <form onSubmit={handleReset} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <small className="form-hint">Minimum 8 caractères</small>
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "CHANGEMENT..." : "CHANGER LE MOT DE PASSE"}
            </button>

            <div className="form-options" style={{ textAlign: "center", marginTop: "20px" }}>
              <a href="/login" className="forgot-link">
                ← Retour à la connexion
              </a>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          <p>INSTAT MADAGASCAR - Données et Statistiques</p>
        </div>
      </div>
    </div>
  );
}