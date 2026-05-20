// src/pages/Settings.tsx
import React, { useState } from 'react';
import '../style/settings.css'; // optionnel

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="settings-container">
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
        ⚙️ Paramètres
      </h1>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>Mode sombre</h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Activer/désactiver le thème sombre</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 16px',
              background: darkMode ? '#1e293b' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? 'Désactiver' : 'Activer'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>Notifications</h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Recevoir des alertes importantes</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            style={{
              padding: '8px 16px',
              background: notifications ? '#10b981' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {notifications ? 'Activées' : 'Désactivées'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;