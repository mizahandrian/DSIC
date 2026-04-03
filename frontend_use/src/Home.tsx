import React from 'react';

const Home: React.FC = () => {
  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '50px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ color: '#1e3c72', marginBottom: '20px' }}>Bienvenue sur INSTAT MADAGASCAR</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Vous êtes connecté avec succès !</p>
        <button 
          onClick={handleLogout}
          style={{
            padding: '12px 30px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Home;