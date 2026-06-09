// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faCheckCircle, faExclamationTriangle, 
  faInfoCircle, faTimes, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les notifications au démarrage
  useEffect(() => {
    loadNotifications();
  }, []);

  // Sauvegarder les notifications à chaque changement
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    localStorage.setItem('app-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Écouter les nouvelles notifications
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      console.log('Notification reçue:', event.detail);
      addNotification(event.detail);
    };
    
    window.addEventListener('new-notification', handleNewNotification as EventListener);
    
    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener);
    };
  }, [notifications]);

  // Fermer le dropdown en cliquant dehors
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
    } else {
      setNotifications([]);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      // Éviter les doublons (même titre et message dans les dernières 30 secondes)
      const now = Date.now();
      const isDuplicate = prev.some(n => 
        n.title === notification.title && 
        n.message === notification.message &&
        now - new Date(n.date).getTime() < 30000
      );
      
      if (isDuplicate) {
        console.log('Notification en double ignorée');
        return prev;
      }
      
      // Ajouter en tête et limiter à 30 notifications
      const newNotifications = [notification, ...prev].slice(0, 30);
      return newNotifications;
    });
    
    // Afficher le toast
    showToast(notification);
  };

  const showToast = (notification: Notification) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${notification.type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div class="toast-content">
        <strong>${escapeHtml(notification.title)}</strong>
        <p>${escapeHtml(notification.message)}</p>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
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
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire pour déclencher une notification
export const triggerNotification = (
  type: 'success' | 'warning' | 'info' | 'error',
  title: string,
  message: string,
  link?: string
) => {
  const notification: Notification = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    date: new Date().toISOString(),
    read: false,
    link
  };
  
  console.log('Dispatching notification:', notification);
  window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
};

export default NotificationBell;