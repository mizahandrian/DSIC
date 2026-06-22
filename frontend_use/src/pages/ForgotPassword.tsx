// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import logoInstat from '../assets/image/Logo-INSTAT.png';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('http://127.0.0.1:8000/api/forgot-password', { email });
      setMessage('Un code de vérification a été envoyé à votre email');
      setTimeout(() => {
        navigate(`/verify-code?email=${email}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email non trouvé');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">

      <div className="auth-form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Mot de passe oublié</h2>
            <p>Entrez votre email pour réinitialiser</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="alert-error">{error}</div>}
            {message && <div className="alert-success">{message}</div>}

            <div className="input-group">
              <label>Email professionnel</label>
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  placeholder="nom@instat.mg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <>
                  Envoyer le code
                  <FontAwesomeIcon icon={faPaperPlane} />
                </>
              )}
            </button>

            <div className="form-footer-link">
              <Link to="/login" className="back-link">
                <FontAwesomeIcon icon={faArrowLeft} />
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;