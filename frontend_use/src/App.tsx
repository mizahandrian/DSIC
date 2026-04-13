// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
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
        
        {/* Routes accessibles à tous les utilisateurs authentifiés */}
        <Route path="/personnels" element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} />
        <Route path="/directions" element={isAuthenticated ? <Directions /> : <Navigate to="/login" />} />
        <Route path="/services" element={isAuthenticated ? <Services /> : <Navigate to="/login" />} />
        <Route path="/carrieres" element={isAuthenticated ? <Carrieres /> : <Navigate to="/login" />} />
        <Route path="/postes" element={isAuthenticated ? <Postes /> : <Navigate to="/login" />} />
        <Route path="/historique" element={isAuthenticated ? <Historique /> : <Navigate to="/login" />} />
        <Route path="/base-rohi" element={isAuthenticated ? <BaseRohi /> : <Navigate to="/login" />} />
        <Route path="/base-augure" element={isAuthenticated ? <BaseAugure /> : <Navigate to="/login" />} />
        <Route path="/statut-admin" element={isAuthenticated ? <StatutAdmin /> : <Navigate to="/login" />} />
        <Route path="/situation-admin" element={isAuthenticated ? <SituationAdmin /> : <Navigate to="/login" />} />
        <Route path="/etats" element={isAuthenticated ? <Etats /> : <Navigate to="/login" />} />
        <Route path="/complete-setup" element={isAuthenticated ? <CompleteSetup /> : <Navigate to="/login" />} />
        
        {/* Dashboard accessible uniquement si l'utilisateur est initialisé */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated && isInitialized === true ? <Dashboard /> : <Navigate to="/personnels" />} 
        />
        
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