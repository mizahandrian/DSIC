// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      
  
      
      // Stocker les nouvelles données
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
  const email = response.data.user.email;

  // ✅ Récupérer les modifications sauvegardées pour cet email
  const savedProfile = JSON.parse(localStorage.getItem(`profile_${email}`) || '{}');

  // Fusionner : modifications sauvegardées prennent priorité
  const mergedUser = { ...response.data.user, ...savedProfile };

  localStorage.setItem('user', JSON.stringify(mergedUser));
}
      
      // Forcer la redirection avec window.location
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error("Erreur:", err);
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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

      <div className="input-group">
        <label>Mot de passe</label>
        <div className="input-icon-wrapper">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <div className="form-options">
        <Link to="/forgot-password" className="forgot-link">
          Mot de passe oublié ?
        </Link>
      </div>

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? (
          <span className="loading-spinner-small"></span>
        ) : (
          <>
            Se connecter
            <FontAwesomeIcon icon={faArrowRight} />
          </>
        )}
      </button>
    </form>
  );
};

export default Login;