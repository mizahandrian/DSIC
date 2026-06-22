// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import { ConfirmationProvider } from './context/ConfirmationContext';
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
import GestionPostes from './pages/GestionPostes';
import GestionRetraites from './pages/GestionRetraites'; // Ajout de l'import
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

  return (
    <ConfirmationProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/verify-code" element={<AuthLayout><VerifyCode /></AuthLayout>} />
          <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
          
          {/* Routes protégées */}
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/super-admin" element={<MainLayout><SuperAdmin /></MainLayout>} />
          <Route path="/recrutement" element={<MainLayout><Recrutement /></MainLayout>} />
          <Route path="/gestion-personnels" element={<MainLayout><GestionPersonnels /></MainLayout>} />
          <Route path="/gestion-retraites" element={<MainLayout><GestionRetraites /></MainLayout>} />
          <Route path="/gestion-directions" element={<MainLayout><GestionDirections /></MainLayout>} />
          <Route path="/gestion-services" element={<MainLayout><GestionServices /></MainLayout>} />
          <Route path="/gestion-postes" element={<MainLayout><GestionPostes /></MainLayout>} />
          <Route path="/base-rohi" element={<MainLayout><BaseRohi /></MainLayout>} />
          <Route path="/base-augure" element={<MainLayout><BaseAugure /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/situation-personnels" element={<MainLayout><SituationPersonnels /></MainLayout>} />
          
          {/* Redirection */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </ConfirmationProvider>
  );
};

export default App;