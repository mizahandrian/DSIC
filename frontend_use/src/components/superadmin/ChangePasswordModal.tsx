// src/components/superadmin/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faKey } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types/User';

interface ChangePasswordModalProps {
  user: User | null;
  onConfirm: (userId: number, password: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ user, onConfirm, onCancel, loading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (user) {
      onConfirm(user.id, password);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container modal-password" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FontAwesomeIcon icon={faKey} /> Changer le mot de passe</h3>
          <button className="modal-close" onClick={onCancel}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="user-info">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
            </div>
            
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              <FontAwesomeIcon icon={faSave} /> {loading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;