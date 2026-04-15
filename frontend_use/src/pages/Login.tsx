// src/pages/Login.tsx
import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../Service/api';

//link mdp oblie

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Login response:', response.data);
      console.log('is_initialized:', user.is_initialized);
      
      // Redirection en fonction du statut d'initialisation
      if (user.is_initialized === true) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/personnels';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Email ou mot de passe incorrect');
      }
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
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@instat.mg"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <div className="form-options">
        <a href="/forgot-password" className="forgot-link">
          Mot de passe oublié ?
        </a>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'CONNEXION...' : 'SE CONNECTER'}
      </button>
    </form>
  );
};

export default Login;