// src/pages/CompleteSetup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '../Service/api';
import logoInstat from '../assets/image/WhatsApp Image 2026-03-31 at 11.02.14 - Copie.jpeg';
import '../style/personnels.css';

const CompleteSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Appel API pour marquer l'utilisateur comme initialisé
      await authAPI.completeSetup();
      
      // Mettre à jour l'utilisateur dans localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.is_initialized = true;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la finalisation');
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
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '12px', 
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '13px', color: '#495057', marginBottom: '10px' }}>
              <strong>Ce que vous pouvez faire maintenant :</strong>
            </p>
            <ul style={{ fontSize: '12px', color: '#6c7a8a', marginLeft: '20px' }}>
              <li>✓ Consulter le tableau de bord avec les statistiques</li>
              <li>✓ Gérer tous les personnels, directions et services</li>
              <li>✓ Suivre l'historique des changements</li>
              <li>✓ Gérer les bases ROHI et AUGURE</li>
              <li>✓ Configurer les statuts et situations administratives</li>
            </ul>
          </div>
          
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