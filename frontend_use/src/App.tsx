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

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/" element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} />
        <Route path="/personnels" element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} />
        <Route path="/directions" element={isAuthenticated ? <Directions /> : <Navigate to="/login" />} />
        <Route path="/services" element={isAuthenticated ? <Services /> : <Navigate to="/login" />} />
        <Route path="/postes" element={isAuthenticated ? <Postes /> : <Navigate to="/login" />} />
        <Route path="/carrieres" element={isAuthenticated ? <Carrieres /> : <Navigate to="/login" />} />
        <Route path="/historique" element={isAuthenticated ? <Historique /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;