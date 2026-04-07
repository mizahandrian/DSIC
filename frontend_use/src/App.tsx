// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Personnels from './pages/Personnels';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Page de login/register */}
        <Route path="/login" element={<AuthLayout />} />
        
        {/* Page principale = Formulaire de gestion des personnels */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} 
        />
        
        {/* Redirection pour toutes les autres routes */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;