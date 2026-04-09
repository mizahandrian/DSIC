// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Personnels from './pages/Personnels';
import Directions from './pages/Directions';
import Services from './pages/Services';
import Postes from './pages/Postes';
import Carrieres from './pages/Carrieres';
import Historique from './pages/Historique';
import BaseRohi from './pages/BaseRohi';
import BaseAugure from './pages/BaseAugure';
import Dashboard from './pages/Dashboard';
import StatutAdmin from './pages/StatutAdmin';
import SituationAdmin from './pages/SituationAdmin';
import Etats from './pages/Etats';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/personnels" element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} />
        <Route path="/directions" element={isAuthenticated ? <Directions /> : <Navigate to="/login" />} />
        <Route path="/services" element={isAuthenticated ? <Services /> : <Navigate to="/login" />} />
        <Route path="/postes" element={isAuthenticated ? <Postes /> : <Navigate to="/login" />} />
        <Route path="/carrieres" element={isAuthenticated ? <Carrieres /> : <Navigate to="/login" />} />
        <Route path="/historique" element={isAuthenticated ? <Historique /> : <Navigate to="/login" />} />
        <Route path="/base-rohi" element={isAuthenticated ? <BaseRohi /> : <Navigate to="/login" />} />
        <Route path="/base-augure" element={isAuthenticated ? <BaseAugure /> : <Navigate to="/login" />} />
        <Route path="/statut-admin" element={isAuthenticated ? <StatutAdmin /> : <Navigate to="/login" />} />
        <Route path="/situation-admin" element={isAuthenticated ? <SituationAdmin /> : <Navigate to="/login" />} />
        <Route path="/etats" element={isAuthenticated ? <Etats /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;