// src/components/LoadingSpinner.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Chargement...' 
}) => {
  const sizes = {
    small: { width: 30, height: 30, border: 3 },
    medium: { width: 50, height: 50, border: 4 },
    large: { width: 70, height: 70, border: 5 }
  };

  const { width, height, border } = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem'
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          width,
          height,
          border: `${border}px solid #e2e8f0`,
          borderTopColor: '#4a5c6a',
          borderRadius: '50%'
        }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            color: '#64748b',
            fontSize: size === 'large' ? '1rem' : '0.875rem',
            margin: 0
          }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;