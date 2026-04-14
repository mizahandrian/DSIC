// src/components/LayoutCompact.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../style/dashboard.css';

const LayoutCompact: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>

      <Sidebar isCompact={true} />
      <Header isCompact={true} />
      
      <main className="main-compact">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutCompact;