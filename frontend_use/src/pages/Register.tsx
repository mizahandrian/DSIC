import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../Service/api';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      window.location.href = '/';
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
        setErrors({ general: "Erreur lors de l'inscription" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <div className="form-group">
        <label>Nom complet</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Votre nom complet"
          required
          disabled={loading}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

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
        <small className="form-hint">Minimum 8 caractères</small>
      </div>

      <div className="form-group">
        <label>Confirmer Password</label>
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={loading}
        />
        {errors.password_confirmation && <span className="error-text">{errors.password_confirmation}</span>}
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "INSCRIPTION..." : "S'INSCRIRE"}
      </button>
    </form>
  );
};

export default Register;