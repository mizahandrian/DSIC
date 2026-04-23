// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, setAuthToken } from '../Service/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemple@instat.mg"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <div className="form-options">
        <Link to="/forgot-password" className="forgot-link">
          Mot de passe oublié ?
        </Link>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'CONNEXION...' : 'SE CONNECTER'}
      </button>
    </form>
  );
};

export default Login;