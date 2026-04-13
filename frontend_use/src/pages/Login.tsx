// src/pages/Login.tsx
import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../Service/api';

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // ✅ Vérification CORRECTE : si l'utilisateur a déjà complété les formulaires
      if (user.is_initialized === true) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/personnels';
      }
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;
      if (error.response?.data?.errors) {
        const formattedErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formattedErrors[key] = value[0];
        });
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Email ou mot de passe incorrect' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {errors.general && <div className="error-message">{errors.general}</div>}
      
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
        {errors.email && <span className="error-text">{errors.email}</span>}
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
        {errors.password && <span className="error-text">{errors.password}</span>}
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