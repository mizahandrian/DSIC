// src/components/MainLayout.tsx
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PageTransition from './PageTransition'; // Import par défaut

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <Sidebar 
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <Header onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />
      <main className="main-content">
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </main>
    </div>
  );
};

export default MainLayout;