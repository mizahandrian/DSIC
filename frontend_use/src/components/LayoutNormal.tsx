// src/components/LayoutNormal.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../style/dashboard.css';

const LayoutNormal: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="wave-bg"></div>

      <Sidebar isCompact={false} />
      <Header isCompact={false} />
      
      <main className="main-normal">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutNormal;