// src/pages/Profile.tsx
import React, { useState } from 'react';
import '../style/profile.css';

interface UserProfile {
  name: string;
  prenom: string;
  email: string;
  phone: string;
  age: number;
  sexe: 'homme' | 'femme';
  role: string;
  avatar?: string;
}

const Profile: React.FC = () => {
  // Récupérer les infos de l'utilisateur connecté depuis localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: user.name || 'Nom',
    prenom: user.prenom || 'Prénom',
    email: user.email || 'email@example.com',
    phone: user.phone || 'Téléphone',
    age: user.age || 0,
    sexe: user.sexe || 'homme',
    role: user.role || 'Rôle',
    avatar: user.avatar,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div className="profile-content">
        {/* Section Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                {profile.prenom.charAt(0)}{profile.name.charAt(0)}
              </div>
            )}
          </div>
          <button className="btn-change-avatar">Changer la photo</button>
        </div>

        {/* Formulaire d'informations */}
        <div className="profile-info-section">
          {!isEditing ? (
            // Vue normale
            <div className="profile-info-view">
              <div className="info-row">
                <div className="info-group">
                  <label>Nom</label>
                  <p>{profile.name}</p>
                </div>
                <div className="info-group">
                  <label>Prénom</label>
                  <p>{profile.prenom}</p>
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-group">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
                <div className="info-group">
                  <label>Téléphone</label>
                  <p>{profile.phone || '-'}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group">
                  <label>Âge</label>
                  <p>{profile.age} ans</p>
                </div>
                <div className="info-group">
                  <label>Sexe</label>
                  <p>{profile.sexe === 'homme' ? 'Homme' : 'Femme'}</p>
                </div>
              </div>

              <div className="info-group">
                <label>Rôle</label>
                <p><span className="role-badge">{profile.role}</span></p>
              </div>

              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Modifier mon profil
              </button>
            </div>
          ) : (
            // Vue édition
            <form onSubmit={handleSubmit} className="profile-info-edit">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prénom *</label>
                  <input 
                    type="text" 
                    value={formData.prenom} 
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Âge</label>
                  <input 
                    type="number" 
                    value={formData.age} 
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Sexe</label>
                  <select value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value as any})}>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section Sécurité */}
        <div className="profile-security-section">
          <h3>Sécurité</h3>
          <div className="security-item">
            <div>
              <strong>Mot de passe</strong>
              <p>Dernière modification : il y a 2 mois</p>
            </div>
            <button className="btn-change-password">Changer le mot de passe</button>
          </div>
          <div className="security-item">
            <div>
              <strong>Double authentification</strong>
              <p>Sécurisez votre compte</p>
            </div>
            <button className="btn-enable-2fa">Activer</button>
          </div>
        </div>

        {/* Section Sessions actives */}
        <div className="profile-sessions-section">
          <h3>Sessions actives</h3>
          <div className="session-item">
            <div>
              <strong>Chrome sur Windows</strong>
              <p>• 2026-05-11 14:30 • Paris, France</p>
            </div>
            <button className="btn-logout">Déconnecter</button>
          </div>
          <div className="session-item current">
            <div>
              <strong>Session actuelle</strong>
              <p>• Chrome sur Windows • En cours</p>
            </div>
            <span className="badge-current">Actuelle</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;