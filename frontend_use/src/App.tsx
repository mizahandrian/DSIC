// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Personnels from './pages/Personnels';
import Directions from './pages/Directions';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Page de login/register */}
        <Route path="/login" element={<AuthLayout />} />
        
        {/* Pages principales */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/personnels" 
          element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/directions" 
          element={isAuthenticated ? <Directions /> : <Navigate to="/login" />} 
        />
        
        {/* Redirection */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;