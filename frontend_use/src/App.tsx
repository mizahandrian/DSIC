import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Home from './Home';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated: boolean = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;