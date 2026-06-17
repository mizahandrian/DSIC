// src/context/ConfirmationContext.tsx
import React, { createContext, useContext, useState } from 'react';
import ConfirmationToast from '../components/ConfirmationToast';

interface ConfirmationContextType {
  showConfirmation: (
    message: string, 
    type?: 'success' | 'error' | 'warning' | 'info',
    duration?: number
  ) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    id: number;
  } | null>(null);

  const showConfirmation = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success',
    duration?: number
  ) => {
    const id = Date.now();
    setToast({ message, type, duration, id });
  };

  const handleClose = () => {
    setToast(null);
  };

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      {toast && (
        <ConfirmationToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleClose}
        />
      )}
    </ConfirmationContext.Provider>
  );
};