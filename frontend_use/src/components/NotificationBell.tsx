// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faCheckCircle, faExclamationTriangle, 
  faInfoCircle, faTimes, faUserPlus, faUserEdit,
  faUserMinus, faExchangeAlt, faClock, faBuilding,
  faTrashAlt, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from '../Service/api';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
  action?: string;
  personnelId?: number;
  personnelName?: string;
}

interface NotificationPreferences {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    notifications: true,
    emailNotifications: true,
    smsNotifications: false
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les notifications depuis localStorage
  useEffect(() => {
    loadNotifications();
    loadPreferences();
    
    // Écouter les événements de notification
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      console.log('Nouvelle notification reçue:', event.detail);
      addNotification(event.detail);
    };
    
    // Écouter les changements de paramètres
    const handleSettingsChange = (event: CustomEvent<NotificationPreferences>) => {
      setPreferences(event.detail);
    };
    
    window.addEventListener('new-notification', handleNewNotification as EventListener);
    window.addEventListener('notificationSettingsChanged', handleSettingsChange as EventListener);
    
    // Vérifier les situations expirées toutes les heures
    checkExpiredSituations();
    const interval = setInterval(checkExpiredSituations, 3600000);
    
    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener);
      window.removeEventListener('notificationSettingsChanged', handleSettingsChange as EventListener);
      clearInterval(interval);
    };
  }, []);

  // Mettre à jour le compteur à chaque changement des notifications
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    // Sauvegarder le compteur dans localStorage pour persistance
    localStorage.setItem('notification-unread-count', count.toString());
  }, [notifications]);

  // Fermer le dropdown quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    } else {
      const defaultPrefs = {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false
      };
      setPreferences(defaultPrefs);
      localStorage.setItem('notificationPreferences', JSON.stringify(defaultPrefs));
    }
  };

  const loadNotifications = () => {
    const saved = localStorage.getItem('app-notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
      const count = parsed.filter((n: Notification) => !n.read).length;
      setUnreadCount(count);
    } else {
      // Pas de notifications de démonstration, démarrer avec une liste vide
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('app-notifications', JSON.stringify(newNotifications));
    // Le compteur sera mis à jour via useEffect
  };

  const addNotification = (notification: Notification) => {
    // Vérifier si les notifications push sont activées
    if (!preferences.notifications) {
      console.log('Notifications désactivées, notification ignorée');
      return;
    }
    
    // Éviter les doublons (même message pour le même personnel dans la dernière minute)
    const now = Date.now();
    const isDuplicate = notifications.some(n => 
      n.title === notification.title && 
      n.personnelId === notification.personnelId &&
      now - new Date(n.date).getTime() < 60000 // 1 minute
    );
    
    if (isDuplicate) {
      console.log('Notification en double ignorée');
      return;
    }
    
    // Ajouter la nouvelle notification au début de la liste
    const newNotifications = [notification, ...notifications];
    
    // Limiter le nombre de notifications à 50 maximum
    if (newNotifications.length > 50) {
      newNotifications.pop();
    }
    
    saveNotifications(newNotifications);
    
    // Afficher le toast
    showToast(notification);
    
    // Mettre à jour le compteur dans le localStorage
    const currentCount = parseInt(localStorage.getItem('notification-unread-count') || '0');
    localStorage.setItem('notification-unread-count', (currentCount + 1).toString());
  };

  const showToast = (notification: Notification) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${notification.type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div class="toast-content">
        <strong>${notification.title}</strong>
        <p>${notification.message}</p>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  };

  const checkExpiredSituations = async () => {
    if (!preferences.notifications) return;
    
    try {
      const response = await api.get('/situation-personnels');
      const situations = response.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      situations.forEach((s: any) => {
        if (!s.date_fin || s.situation === 'activite') return;
        
        const finDate = new Date(s.date_fin);
        finDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((finDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        const lastCheckKey = `notif-expired-${s.id_disposition}`;
        const lastCheck = localStorage.getItem(lastCheckKey);
        const todayStr = today.toISOString().split('T')[0];
        
        let notification: Notification | null = null;
        
        if (diffDays < 0 && lastCheck !== todayStr) {
          notification = {
            id: `expired-${s.id_disposition}-${Date.now()}`,
            type: 'error',
            title: '⚠️ Situation expirée',
            message: `${s.personnel_prenom} ${s.personnel_nom} aurait dû revenir de ${s.destination} le ${new Date(s.date_fin).toLocaleDateString('fr-FR')}`,
            date: new Date().toISOString(),
            read: false,
            link: '/situation-personnels',
            personnelId: s.id_personnel,
            personnelName: `${s.personnel_prenom} ${s.personnel_nom}`
          };
          localStorage.setItem(lastCheckKey, todayStr);
        } else if (diffDays <= 7 && diffDays > 0 && lastCheck !== todayStr) {
          notification = {
            id: `near-expiry-${s.id_disposition}-${Date.now()}`,
            type: 'warning',
            title: '⏰ Retour prochain',
            message: `${s.personnel_prenom} ${s.personnel_nom} doit revenir de ${s.destination} dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`,
            date: new Date().toISOString(),
            read: false,
            link: '/situation-personnels',
            personnelId: s.id_personnel,
            personnelName: `${s.personnel_prenom} ${s.personnel_nom}`
          };
          localStorage.setItem(lastCheckKey, todayStr);
        }
        
        if (notification) {
          addNotification(notification);
        }
      });
      
    } catch (error) {
      console.error('Erreur vérification situations:', error);
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'error': return faTimes;
      default: return faInfoCircle;
    }
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    return `Il y a ${days} j`;
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className={`bell-button ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllAsRead} className="notif-btn">Tout lire</button>
                  <button onClick={clearAll} className="notif-btn">Tout effacer</button>
                </>
              )}
            </div>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <FontAwesomeIcon icon={faBell} />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notif-icon" style={{ background: `${getIconColor(notif.type)}20`, color: getIconColor(notif.type) }}>
                    <FontAwesomeIcon icon={getIcon(notif.type)} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-time">{formatDate(notif.date)}</div>
                  </div>
                  {notif.link && (
                    <Link to={notif.link} className="notif-link" onClick={(e) => e.stopPropagation()}>
                      Voir
                    </Link>
                  )}
                  <button 
                    className="notif-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1100;
          min-width: 300px;
          max-width: 400px;
          transform: translateX(400px);
          transition: transform 0.3s ease;
          border-left: 4px solid;
        }
        .toast-notification.show {
          transform: translateX(0);
        }
        .toast-notification.toast-success { border-left-color: #10b981; }
        .toast-notification.toast-warning { border-left-color: #f59e0b; }
        .toast-notification.toast-error { border-left-color: #ef4444; }
        .toast-notification.toast-info { border-left-color: #3b82f6; }
        .toast-icon svg { width: 20px; height: 20px; }
        .toast-content strong { display: block; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .toast-content p { font-size: 0.75rem; color: #64748b; margin: 0; }
        body.dark-mode .toast-notification { background: #1e293b; }
        body.dark-mode .toast-content p { color: #94a3b8; }
      `}</style>
    </div>
  );
};

// Fonction utilitaire pour déclencher une notification
export const triggerNotification = (
  type: 'success' | 'warning' | 'info' | 'error',
  title: string,
  message: string,
  link?: string,
  personnelId?: number,
  personnelName?: string
) => {
  // Vérifier si les notifications sont activées avant d'envoyer
  const savedPrefs = localStorage.getItem('notificationPreferences');
  let notificationsEnabled = true;
  
  if (savedPrefs) {
    const prefs = JSON.parse(savedPrefs);
    notificationsEnabled = prefs.notifications !== undefined ? prefs.notifications : true;
  }
  
  if (!notificationsEnabled) {
    console.log('triggerNotification: Notifications désactivées');
    return;
  }
  
  const notification: Notification = {
    id: `${Date.now()}-${Math.random()}-${performance.now()}`,
    type,
    title,
    message,
    date: new Date().toISOString(),
    read: false,
    link,
    personnelId,
    personnelName
  };
  
  console.log('Envoi de la notification:', notification);
  window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
};

export default NotificationBell;