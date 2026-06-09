// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuperAdmin from './pages/SuperAdmin';
import Recrutement from './pages/Recrutement';
import GestionPersonnels from './pages/GestionPersonnels';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import GestionDirections from './pages/GestionDirections';
import GestionServices from './pages/GestionServices';
import BaseRohi from './pages/BaseRohi';
import BaseAugure from './pages/BaseAugure';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SituationPersonnels from './pages/SituationPersonnels';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import api from './Service/api';

import './style/recrutement.css';
import './style/gestion.css';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await api.get('/me');
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid #eef2f6', borderTopColor: '#4A5C6A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Layout pour pages protégées
  const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    if (!isAuthenticated) {
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
          {children}
        </main>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        <Route path="/verify-code" element={<AuthLayout><VerifyCode /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
        
        {/* Routes protégées */}
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/super-admin" element={<ProtectedLayout><SuperAdmin /></ProtectedLayout>} />
        <Route path="/recrutement" element={<ProtectedLayout><Recrutement /></ProtectedLayout>} />
        <Route path="/gestion-personnels" element={<ProtectedLayout><GestionPersonnels /></ProtectedLayout>} />
        <Route path="/gestion-directions" element={<ProtectedLayout><GestionDirections /></ProtectedLayout>} />
        <Route path="/gestion-services" element={<ProtectedLayout><GestionServices /></ProtectedLayout>} />
        <Route path="/base-rohi" element={<ProtectedLayout><BaseRohi /></ProtectedLayout>} />
        <Route path="/base-augure" element={<ProtectedLayout><BaseAugure /></ProtectedLayout>} />
        <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        <Route path="/situation-personnels" element={<ProtectedLayout><SituationPersonnels /></ProtectedLayout>} />
        
        {/* Redirections */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;