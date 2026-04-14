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
import api from './Service/api';

const SimpleLayout: React.FC = () => <Outlet />;

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
          setIsInitialized(response.data.is_initialized);
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.is_initialized = response.data.is_initialized;
          localStorage.setItem('user', JSON.stringify(user));
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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        
        {/* Dashboard avec Layout Compact (Sidebar 180px) */}
        <Route element={isAuthenticated && isInitialized === true ? <LayoutCompact /> : <Navigate to="/personnels" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Autres pages avec Layout Normal (Sidebar 280px) */}
        <Route element={isAuthenticated && isInitialized === true ? <LayoutNormal /> : <Navigate to="/personnels" />}>
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
        
        {/* Routes sans Sidebar (pendant l'initialisation) */}
        <Route element={isAuthenticated ? <SimpleLayout /> : <Navigate to="/login" />}>
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
        
        {/* Redirection racine */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              isInitialized === true ? <Navigate to="/dashboard" /> : <Navigate to="/personnels" />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;