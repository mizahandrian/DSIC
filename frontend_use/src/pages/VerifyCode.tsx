// src/pages/VerifyCode.tsx
import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


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