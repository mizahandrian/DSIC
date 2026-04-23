// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import api from './Service/api';

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
        <div style={{ width: '50px', height: '50px', border: '3px solid #e9ecef', borderTopColor: '#2c3e50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Page de login */}
        <Route path="/login" element={<AuthLayout />} />
        
        {/* Routes protégées - Dashboard avec LayoutCompact */}
        <Route element={isAuthenticated ? <LayoutCompact /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Routes protégées - Pages CRUD avec LayoutNormal */}
        <Route element={isAuthenticated ? <LayoutNormal /> : <Navigate to="/login" />}>
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
        
        {/* Redirection */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;