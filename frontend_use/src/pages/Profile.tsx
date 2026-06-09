// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faIdCard,
  faBuilding,
  faBriefcase,
  faEdit,
  faSave,
  faTimes,
  faUserCircle,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import '../style/profile.css';

const compressImage = (file: File, maxWidth = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.4)); // qualité 40%, très léger
    };
    img.onerror = reject;
    img.src = url;
  });
};

interface UserProfile {
  id?: number;
  name: string;
  prenom: string;
  email: string;
  phone: string;
  sexe: 'homme' | 'femme';
  role: string;
  avatar?: string;
  matricule?: string;
  direction?: string;
  service?: string;
  dateEmbauche?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    prenom: '',
    email: '',
    phone: '',
    sexe: 'homme',
    role: '',
    matricule: '',
    direction: '',
    service: '',
    dateEmbauche: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Charger les données de l'utilisateur connecté
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
  setLoading(true);
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const userData = {
      name: user.name || user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      phone: user.phone || user.telephone || '',
      sexe: (user.sexe as 'homme' | 'femme') || 'homme',
      role: user.role || user.poste || '',
      matricule: user.matricule || '',
      direction: user.direction || '',
      service: user.service || '',
      dateEmbauche: user.dateEmbauche || '',
      avatar: user.avatar || ''
    };

    setProfile(userData);
    setFormData(userData); // ✅ même objet pour les deux
  } catch (error) {
    console.error('Erreur chargement profil:', error);
  } finally {
    setLoading(false);
  }
};
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      setAvatarFile(file);
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
  if (!avatarFile) return;

  setUploadingAvatar(true);
  try {
    // Compression via canvas
    const compressed = await compressImage(avatarFile, 100);

    const updatedProfile = { ...profile, avatar: compressed };
    setProfile(updatedProfile);
    setFormData({ ...formData, avatar: compressed });

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, avatar: compressed }));

    setAvatarFile(null);
    alert('Photo de profil mise à jour avec succès !');
  } catch (error) {
    console.error('Erreur upload avatar:', error);
    alert('Erreur lors de l\'upload de la photo');
  } finally {
    setUploadingAvatar(false);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...formData };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // ✅ Sauvegarder aussi dans profile_${email} immédiatement
    if (updatedUser.email) {
      localStorage.setItem(`profile_${updatedUser.email}`, JSON.stringify(updatedUser));
    }
    
    setProfile(formData);
    setIsEditing(false);
    alert('Profil mis à jour avec succès');
  } catch (error) {
    alert('Erreur lors de la mise à jour');
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Modal d'édition */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faEdit} />
                Modifier mon profil
              </h2>
              <button className="modal-close" onClick={() => setIsEditing(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Section Photo de profil */}
              <div className="form-section">
                <h3>
                  <FontAwesomeIcon icon={faCamera} />
                  Photo de profil
                </h3>
                <div className="avatar-edit-section">
                  <div className="avatar-preview">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar preview" />
                    ) : (
                      <div className="avatar-placeholder-preview">
                        <FontAwesomeIcon icon={faUserCircle} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="avatar-upload-modal"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <button 
                    type="button"
                    className="btn-upload-avatar"
                    onClick={() => document.getElementById('avatar-upload-modal')?.click()}
                  >
                    <FontAwesomeIcon icon={faCamera} />
                    Changer la photo
                  </button>
                  {avatarFile && (
                    <button 
                      type="button"
                      className="btn-save-avatar"
                      onClick={uploadAvatar}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? 'Upload...' : 'Sauvegarder la photo'}
                    </button>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <FontAwesomeIcon icon={faUser} />
                  Identité
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input 
                      type="text" 
                      value={formData.prenom} 
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sexe</label>
                    <select value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value as any})}>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <FontAwesomeIcon icon={faEnvelope} />
                  Contact
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
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
              </div>

              <div className="form-section">
                <h3>
                  <FontAwesomeIcon icon={faBriefcase} />
                  Organisation
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Direction</label>
                    <input 
                      type="text" 
                      value={formData.direction} 
                      onChange={(e) => setFormData({...formData, direction: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Service</label>
                    <input 
                      type="text" 
                      value={formData.service} 
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Rôle / Poste</label>
                  <input 
                    type="text" 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  <FontAwesomeIcon icon={faSave} />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar-large">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" />
            ) : (
              <div className="avatar-initials">
                {profile.prenom.charAt(0)}{profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="profile-hero-info">
            <h1>{profile.prenom} {profile.name}</h1>
            <p className="profile-role">{profile.role}</p>
            <p className="profile-location">{profile.direction} • {profile.service}</p>
          </div>
          <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon icon={faEdit} />
            Modifier
          </button>
        </div>
      </div>

      {/* Main Content - Uniquement Informations personnelles */}
      <div className="profile-main">
        <div className="profile-card">
          <div className="info-grid">
            <div className="info-section">
              <h3>
                <FontAwesomeIcon icon={faUser} />
                Identité
              </h3>
              <div className="info-item">
                <label>Nom complet</label>
                <p>{profile.prenom} {profile.name}</p>
              </div>
              <div className="info-item">
                <label>Matricule</label>
                <p>{profile.matricule}</p>
              </div>
              <div className="info-item">
                <label>Date d'embauche</label>
                <p>{profile.dateEmbauche}</p>
              </div>
              <div className="info-item">
                <label>Sexe</label>
                <p>{profile.sexe === 'homme' ? 'Homme' : 'Femme'}</p>
              </div>
            </div>

            <div className="info-section">
              <h3>
                <FontAwesomeIcon icon={faEnvelope} />
                Contact
              </h3>
              <div className="info-item">
                <label>Email professionnel</label>
                <p>{profile.email}</p>
              </div>
              <div className="info-item">
                <label>Téléphone</label>
                <p>{profile.phone}</p>
              </div>
            </div>

            <div className="info-section">
              <h3>
                <FontAwesomeIcon icon={faBuilding} />
                Organisation
              </h3>
              <div className="info-item">
                <label>Direction</label>
                <p>{profile.direction}</p>
              </div>
              <div className="info-item">
                <label>Service</label>
                <p>{profile.service}</p>
              </div>
              <div className="info-item">
                <label>Rôle</label>
                <p>{profile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;