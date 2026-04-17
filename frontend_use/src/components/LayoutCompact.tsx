// src/components/LayoutCompact.tsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AnimatedOutlet from './AnimatedOutlet';
import '../style/dashboard.css';

const LayoutCompact: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>

      <Sidebar isCompact={false} />
      <Header isCompact={false} />
      
      <main className="main-normal">
        <AnimatedOutlet />
      </main>
    </div>
  );
};

export default LayoutCompact;