// src/components/superadmin/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import type { CreateUserData, UpdateUserData, User } from '../../types/User';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  loading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'rh' as 'dg' | 'rh' | 'chef_dsic',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role as 'dg' | 'rh' | 'chef_dsic',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'rh',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide';
    if (!user && !formData.password) newErrors.password = 'Le mot de passe est requis';
    if (!user && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submitData: Partial<CreateUserData & UpdateUserData> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
    };
    
    if (!user && formData.password) {
      submitData.password = formData.password;
    }
    if (user && formData.password) {
      submitData.password = formData.password;
    }
    
    onSubmit(submitData as CreateUserData | UpdateUserData);
  };

  return (
    <div className="user-form">
      <div className="user-form-header">
        <h3>
          <FontAwesomeIcon icon={user ? faEdit : faUserPlus} />
          {user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
        </h3>
        <button className="close-btn" onClick={onCancel}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="user-form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Nom complet *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@instat.mg"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="032 12 345 67"
              />
            </div>
            
            <div className="form-group">
              <label>Rôle *</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="dg">👑 Directeur Général</option>
                <option value="rh">📋 RH</option>
                <option value="chef_dsic">💻 Chef DSIC</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{user ? 'Nouveau mot de passe' : 'Mot de passe *'}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.password && <span className="error">{errors.password}</span>}
              {!user && <small>Minimum 6 caractères</small>}
            </div>
            
            {!user && (
              <div className="form-group">
                <label>Confirmer le mot de passe *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="user-form-footer">
          <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            <FontAwesomeIcon icon={faSave} />
            {loading ? 'Enregistrement...' : (user ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;