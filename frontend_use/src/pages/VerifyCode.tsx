// src/pages/VerifyCode.tsx
import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import logoInstat from '../assets/image/Logo-INSTAT.png';

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

      {/* Partie droite - Formulaire de vérification */}
      <div className="auth-form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Vérification</h2>
            <p>Entrez le code reçu par email</p>
          </div>

          <form onSubmit={handleVerify} className="login-form">
            {error && (
              <div className="alert-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            
            {message && (
              <div className="alert-success">
                <FontAwesomeIcon icon={faCheckCircle} />
                {message}
              </div>
            )}

            <div className="input-group">
              <label>Code de vérification</label>
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="text"
                  placeholder="Entrez le code à 6 chiffres"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                  maxLength={6}
                />
              </div>
              <small className="input-hint">
                Un code a été envoyé à <strong>{email || "votre adresse email"}</strong>
              </small>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                "Vérifier le code"
              )}
            </button>

            <div className="form-footer-link">
              <Link to="/forgot-password" className="back-link">
                <FontAwesomeIcon icon={faArrowLeft} />
                Renvoyer le code
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}