// src/components/AnimatedOutlet.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

const AnimatedOutlet: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'fade-out') {
      setTransitionStage('fade-in');
      setDisplayLocation(location);
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
      style={{ width: '100%', minHeight: '100%' }}
    >
      <Outlet />
    </div>
  );
};

export default AnimatedOutlet;