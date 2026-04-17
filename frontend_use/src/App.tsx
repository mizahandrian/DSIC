// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import LayoutNormal from './components/LayoutNormal';
import LayoutCompact from './components/LayoutCompact';
import Personnels from './pages/Personnels';
import Directions from './pages/Directions';
import Services from './pages/Services';
import Carrieres from './pages/Carrieres';
import Postes from './pages/Postes';
import Historique from './pages/Historique';
import BaseRohi from './pages/BaseRohi';
import BaseAugure from './pages/BaseAugure';
import Dashboard from './pages/Dashboard';
import StatutAdmin from './pages/StatutAdmin';
import SituationAdmin from './pages/SituationAdmin';
import Etats from './pages/Etats';
import CompleteSetup from './pages/CompleteSetup';
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import api from './Service/api';

// Layout simple sans sidebar (pour l'initialisation)
const SimpleLayout: React.FC = () => {
  return <Outlet />;
};

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    const checkUserInitialization = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/user/check-initialized');
          const initialized = response.data.is_initialized === true;
          setIsInitialized(initialized);
          
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.is_initialized = initialized;
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('User initialized:', initialized);
        } catch (error) {
          console.error('Erreur vérification:', error);
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          setIsInitialized(user.is_initialized === true);
        }
      }
      setLoading(false);
    };
    checkUserInitialization();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '50px', height: '50px', border: '3px solid #e9ecef', borderTopColor: '#2c3e50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  console.log('App render:', { isAuthenticated, isInitialized });

  return (
    <Router>
      <Routes>
        {/* Page de login */}
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* ==================== UTILISATEUR NON INITIALISÉ ==================== */}
        {/* Pendant l'initialisation : PAS de Sidebar, PAS de Header */}
        {isAuthenticated && isInitialized === false && (
          <Route element={<SimpleLayout />}>
            <Route path="/personnels" element={<Personnels />} />
            <Route path="/directions" element={<Directions />} />
            <Route path="/services" element={<Services />} />
            <Route path="/carrieres" element={<Carrieres />} />
            <Route path="/postes" element={<Postes />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/base-rohi" element={<BaseRohi />} />
            <Route path="/base-augure" element={<BaseAugure />} />
            <Route path="/complete-setup" element={<CompleteSetup />} />
          </Route>
        )}
        
        {/* ==================== UTILISATEUR INITIALISÉ ==================== */}
        {/* Après initialisation : AVEC Sidebar et Header */}
        {isAuthenticated && isInitialized === true && (
          <>
            {/* Dashboard avec LayoutCompact */}
            <Route element={<LayoutCompact />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* Autres pages avec LayoutNormal */}
            <Route element={<LayoutNormal />}>
              <Route path="/personnels" element={<Personnels />} />
              <Route path="/directions" element={<Directions />} />
              <Route path="/services" element={<Services />} />
              <Route path="/carrieres" element={<Carrieres />} />
              <Route path="/postes" element={<Postes />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/base-rohi" element={<BaseRohi />} />
              <Route path="/base-augure" element={<BaseAugure />} />
              <Route path="/statut-admin" element={<StatutAdmin />} />
              <Route path="/situation-admin" element={<SituationAdmin />} />
              <Route path="/etats" element={<Etats />} />
            </Route>
          </>
        )}
        
        {/* Redirection par défaut */}
        <Route 
          path="/" 
          element={
            !isAuthenticated ? <Navigate to="/login" /> :
            isInitialized === true ? <Navigate to="/dashboard" /> : <Navigate to="/personnels" />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;