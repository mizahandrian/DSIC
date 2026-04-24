// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Recrutement from './pages/Recrutement';
import GestionPersonnels from './pages/GestionPersonnels';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import api from './Service/api';
import './style/recrutement.css';
import './style/gestion.css';

import SuperAdmin from "./pages/SuperAdmin";

<Route path="/super-admin" element={<SuperAdmin />} />
// Pages temporaires (à remplacer plus tard)
/*const SuperAdmin = () => (
  <div style={{ padding: '24px' }}>
    <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Super Admin</h1>
    <p style={{ color: '#64748b' }}>Gestion des utilisateurs (à venir)</p>
  </div>
);*/

const Bases = () => (
  <div style={{ padding: '24px' }}>
    <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Bases</h1>
    <p style={{ color: '#64748b' }}>Base ROHI et Base AUGURE (à venir)</p>
  </div>
);

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
        <div style={{ width: '40px', height: '40px', border: '2px solid #eef2f6', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Routes protégées avec layout principal */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recrutement" element={<Recrutement />} />
          <Route path="/gestion-personnels" element={<GestionPersonnels />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/bases" element={<Bases />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;