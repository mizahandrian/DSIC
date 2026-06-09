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

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les notifications depuis localStorage
  useEffect(() => {
    loadNotifications();
    
    // Écouter les événements de notification
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      addNotification(event.detail);
    };
    
    window.addEventListener('new-notification', handleNewNotification as EventListener);
    
    // Vérifier les situations expirées toutes les heures
    checkExpiredSituations();
    const interval = setInterval(checkExpiredSituations, 3600000);
    
    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener);
      clearInterval(interval);
    };
  }, []);

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

  const loadNotifications = () => {
    const saved = localStorage.getItem('app-notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length);
    } else {
      // Notifications de démonstration
      const demoNotifications: Notification[] = [
        {
          id: '1',
          type: 'info',
          title: 'Bienvenue',
          message: 'Bienvenue sur la plateforme de gestion RH',
          date: new Date().toISOString(),
          read: false
        }
      ];
      setNotifications(demoNotifications);
      localStorage.setItem('app-notifications', JSON.stringify(demoNotifications));
      setUnreadCount(1);
    }
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('app-notifications', JSON.stringify(newNotifications));
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const addNotification = (notification: Notification) => {
    const newNotifications = [notification, ...notifications];
    saveNotifications(newNotifications);
    
    // Afficher une alerte toast
    showToast(notification);
  };

  const showToast = (notification: Notification) => {
    // Créer un élément toast
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
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  };

  const checkExpiredSituations = async () => {
    try {
      const response = await api.get('/situation-personnels');
      const situations = response.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const expiredNotifications: Notification[] = [];
      
      situations.forEach((s: any) => {
        if (!s.date_fin || s.situation === 'activite') return;
        
        const finDate = new Date(s.date_fin);
        finDate.setHours(0, 0, 0, 0);
        const diffTime = finDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Vérifier si déjà notifié (stocké dans localStorage)
        const lastCheck = localStorage.getItem(`notif-expired-${s.id_disposition}`);
        const todayStr = today.toISOString().split('T')[0];
        
        if (diffDays < 0 && lastCheck !== todayStr) {
          expiredNotifications.push({
            id: `expired-${s.id_disposition}-${Date.now()}`,
            type: 'error',
            title: '⚠️ Situation expirée',
            message: `${s.personnel_prenom} ${s.personnel_nom} aurait dû revenir de ${s.destination} le ${new Date(s.date_fin).toLocaleDateString('fr-FR')}`,
            date: new Date().toISOString(),
            read: false,
            link: '/situation-personnels',
            personnelId: s.id_personnel,
            personnelName: `${s.personnel_prenom} ${s.personnel_nom}`
          });
          localStorage.setItem(`notif-expired-${s.id_disposition}`, todayStr);
        } else if (diffDays <= 7 && diffDays > 0 && lastCheck !== todayStr) {
          expiredNotifications.push({
            id: `near-expiry-${s.id_disposition}-${Date.now()}`,
            type: 'warning',
            title: '⏰ Retour prochain',
            message: `${s.personnel_prenom} ${s.personnel_nom} doit revenir de ${s.destination} dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`,
            date: new Date().toISOString(),
            read: false,
            link: '/situation-personnels',
            personnelId: s.id_personnel,
            personnelName: `${s.personnel_prenom} ${s.personnel_nom}`
          });
          localStorage.setItem(`notif-expired-${s.id_disposition}`, todayStr);
        }
      });
      
      expiredNotifications.forEach(notif => {
        addNotification(notif);
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
        {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
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
                    <Link to={notif.link} className="notif-link">
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
  const notification: Notification = {
    id: `${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    date: new Date().toISOString(),
    read: false,
    link,
    personnelId,
    personnelName
  };
  
  window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
};

export default NotificationBell;