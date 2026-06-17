// src/components/ConfirmationToast.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faTimesCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface ConfirmationToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return faCheckCircle;
      case 'error': return faTimesCircle;
      case 'warning': return faExclamationCircle;
      default: return faInfoCircle;
    }
  };

  const getColor = () => {
    switch(type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const getBgColor = () => {
    switch(type) {
      case 'success': return '#d1fae5';
      case 'error': return '#fee2e2';
      case 'warning': return '#fef3c7';
      default: return '#dbeafe';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          className="confirmation-toast"
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            maxWidth: '400px',
            width: '100%',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: `2px solid ${getColor()}`,
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '1rem 1.25rem',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: getBgColor(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FontAwesomeIcon 
                icon={getIcon()} 
                style={{ color: getColor(), fontSize: '1.25rem' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.875rem', 
                color: '#1e293b',
                fontWeight: 500
              }}>
                {message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  if (onClose) onClose();
                }, 300);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '4px',
                fontSize: '1rem'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            style={{
              height: '3px',
              background: getColor(),
              position: 'absolute',
              bottom: 0,
              left: 0
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook pour utiliser facilement les confirrmations
export const useConfirmation = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  } | null>(null);

  const showConfirmation = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success',
    duration?: number
  ) => {
    setToast({ message, type, duration });
  };

  const ConfirmationComponent = () => {
    if (!toast) return null;
    return (
      <ConfirmationToast
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showConfirmation, ConfirmationComponent };
};

export default ConfirmationToast;