import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password", {
        email,
      });

      setMessage("Code envoyé par email 📧");

      setTimeout(() => {
        navigate(`/verify-code?email=${email}`);
      }, 1000);
    } catch (err: any) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de l'envoi ❌");
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
          <p className="header-subtitle">Mot de passe oublié</p>
        </div>

        <div className="auth-content">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="exemple@instat.mg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "ENVOI..." : "ENVOYER LE CODE"}
            </button>

            <div className="form-options" style={{ textAlign: "center", marginTop: "20px" }}>
              <a href="/login" className="forgot-link">
                ← Retour à la connexion
              </a>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          <p> INSTAT MADAGASCAR - Données et Statistiques</p>
        </div>
      </div>
    </div>
  );
}