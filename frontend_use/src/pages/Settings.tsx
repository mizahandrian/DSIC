// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoon,
  faBell,
  faGlobe,
  faShieldAlt,
  faToggleOn,
  faToggleOff,
  faEnvelope,
  faSms,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import '../style/settings.css';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode || false);
      setNotifications(settings.notifications !== undefined ? settings.notifications : true);
      setEmailNotifications(settings.emailNotifications !== undefined ? settings.emailNotifications : true);
      setSmsNotifications(settings.smsNotifications || false);
      setTwoFactor(settings.twoFactor || false);
    }
    
    // Appliquer le mode sombre au chargement
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Sauvegarder les préférences
  const saveSettings = (key: string, value: any) => {
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const newSettings = { ...currentSettings, [key]: value };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Mettre à jour la variable globale pour les notifications
    if (key === 'notifications' || key === 'emailNotifications' || key === 'smsNotifications') {
      updateGlobalNotificationSettings();
    }
  };

  // Mettre à jour les paramètres globaux des notifications
  const updateGlobalNotificationSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const notificationSettings = {
      notifications: savedSettings.notifications !== undefined ? savedSettings.notifications : true,
      emailNotifications: savedSettings.emailNotifications !== undefined ? savedSettings.emailNotifications : true,
      smsNotifications: savedSettings.smsNotifications || false
    };
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationSettings));
    
    // Déclencher un événement pour informer le NotificationBell des changements
    window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { detail: notificationSettings }));
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    saveSettings('darkMode', newValue);
    if (newValue) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    saveSettings('notifications', newValue);
  };

  const handleEmailNotificationsToggle = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    saveSettings('emailNotifications', newValue);
  };

  const handleSmsNotificationsToggle = () => {
    const newValue = !smsNotifications;
    setSmsNotifications(newValue);
    saveSettings('smsNotifications', newValue);
  };

  const handleTwoFactorToggle = () => {
    const newValue = !twoFactor;
    setTwoFactor(newValue);
    saveSettings('twoFactor', newValue);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>
          <FontAwesomeIcon icon={faGlobe} />
          Paramètres
        </h1>
        <p>Gérez vos préférences et configurations</p>
      </div>

      <div className="settings-content">
        {/* Section Apparence */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faPalette} />
            </div>
            <div className="card-title">
              <h3>Apparence</h3>
              <p>Personnalisez l'affichage de l'application</p>
            </div>
          </div>
          <div className="settings-item">
            <div className="item-info">
              <div className="item-icon">
                <FontAwesomeIcon icon={faMoon} />
              </div>
              <div className="item-text">
                <label>Mode sombre</label>
                <p>Activer le thème sombre pour une meilleure expérience nocturne</p>
              </div>
            </div>
            <button 
              className={`toggle-btn ${darkMode ? 'active' : ''}`}
              onClick={handleDarkModeToggle}
            >
              <FontAwesomeIcon icon={darkMode ? faToggleOn : faToggleOff} />
              {darkMode ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>

        {/* Section Notifications */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <div className="card-title">
              <h3>Notifications</h3>
              <p>Gérez vos alertes et communications</p>
            </div>
          </div>
          <div className="settings-item">
            <div className="item-info">
              <div className="item-icon">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div className="item-text">
                <label>Notifications push</label>
                <p>Recevoir des notifications sur votre navigateur (arrivées, départs, mobilités)</p>
              </div>
            </div>
            <button 
              className={`toggle-btn ${notifications ? 'active' : ''}`}
              onClick={handleNotificationsToggle}
            >
              <FontAwesomeIcon icon={notifications ? faToggleOn : faToggleOff} />
              {notifications ? 'Activées' : 'Désactivées'}
            </button>
          </div>
          <div className="settings-item">
            <div className="item-info">
              <div className="item-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="item-text">
                <label>Notifications email</label>
                <p>Recevoir des alertes par email</p>
              </div>
            </div>
            <button 
              className={`toggle-btn ${emailNotifications ? 'active' : ''}`}
              onClick={handleEmailNotificationsToggle}
            >
              <FontAwesomeIcon icon={emailNotifications ? faToggleOn : faToggleOff} />
              {emailNotifications ? 'Activées' : 'Désactivées'}
            </button>
          </div>
          <div className="settings-item">
            <div className="item-info">
              <div className="item-icon">
                <FontAwesomeIcon icon={faSms} />
              </div>
              <div className="item-text">
                <label>Notifications SMS</label>
                <p>Recevoir des alertes par SMS</p>
              </div>
            </div>
            <button 
              className={`toggle-btn ${smsNotifications ? 'active' : ''}`}
              onClick={handleSmsNotificationsToggle}
            >
              <FontAwesomeIcon icon={smsNotifications ? faToggleOn : faToggleOff} />
              {smsNotifications ? 'Activées' : 'Désactivées'}
            </button>
          </div>
        </div>

        {/* Section Sécurité */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <div className="card-title">
              <h3>Sécurité</h3>
              <p>Protégez votre compte</p>
            </div>
          </div>
          <div className="settings-item">
            <div className="item-info">
              <div className="item-icon">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <div className="item-text">
                <label>Double authentification</label>
                <p>Renforcez la sécurité de votre compte</p>
              </div>
            </div>
            <button 
              className={`toggle-btn ${twoFactor ? 'active' : ''}`}
              onClick={handleTwoFactorToggle}
            >
              <FontAwesomeIcon icon={twoFactor ? faToggleOn : faToggleOff} />
              {twoFactor ? 'Activée' : 'Désactivée'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;