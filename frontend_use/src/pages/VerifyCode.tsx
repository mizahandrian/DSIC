import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const email = params.get("email");

  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("http://127.0.0.1:8000/api/verify-code", {
        email,
        otp,
      });

      setMessage("Code valide ✔");

      setTimeout(() => {
        navigate(`/reset-password?email=${email}`);
      }, 1000);
    } catch (err) {
      setError("Code invalide ❌");
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
          <p className="header-subtitle">Vérification du code</p>
        </div>

        <div className="auth-content">
          <form onSubmit={handleVerify} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <label>Code de vérification</label>
              <input
                type="text"
                placeholder="Entrez le code à 6 chiffres"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
                maxLength={6}
              />
              <small className="form-hint">
                Un code a été envoyé à {email || "votre adresse email"}
              </small>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "VÉRIFICATION..." : "VÉRIFIER LE CODE"}
            </button>

            <div className="form-options" style={{ textAlign: "center", marginTop: "20px" }}>
              <a href="/forgot-password" className="forgot-link">
                ← Renvoyer le code
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