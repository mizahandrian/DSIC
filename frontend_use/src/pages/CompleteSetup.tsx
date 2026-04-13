// src/pages/CompleteSetup.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

const CompleteSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier l'état de l'utilisateur au chargement
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    console.log('CompleteSetup - User from localStorage:', storedUser);
    
    // Si déjà initialisé, rediriger directement vers dashboard
    if (storedUser.is_initialized === true) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Appel API pour marquer l'utilisateur comme initialisé
      await authAPI.completeSetup();
      
      // Mettre à jour l'utilisateur dans localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.is_initialized = true;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Vérifier que la mise à jour a bien fonctionné
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('CompleteSetup - Updated user:', updatedUser);
      
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur:', error);
      // Force la mise à jour même en cas d'erreur API
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.is_initialized = true;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personnels-container">
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>
      <div className="grid-pattern"></div>

      <div className="personnels-content">
        <div className="personnels-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logoInstat} alt="INSTAT Madagascar" className="logo-img" />
            </div>
          </div>
          <h1>Configuration terminée !</h1>
          <p>Félicitations ! Vous avez rempli tous les formulaires nécessaires</p>
        </div>

        <div style={{ 
          maxWidth: '500px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '20px', 
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#e8f5e9', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '40px', color: '#27ae60' }} />
          </div>
          
          <h2 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '24px' }}>
            Bienvenue dans l'application !
          </h2>
          
          <p style={{ color: '#6c7a8a', marginBottom: '30px', lineHeight: '1.6' }}>
            Vous avez complété toutes les étapes d'initialisation.<br />
            Vous pouvez maintenant accéder au tableau de bord et gérer<br />
            l'ensemble des données de l'application.
          </p>
          
          <button 
            className="btn-primary" 
            onClick={handleComplete}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '8px' }} />
            {loading ? 'Finalisation...' : 'Accéder au tableau de bord'}
            <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteSetup;