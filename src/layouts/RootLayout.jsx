// RootLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navigation from '../layouts/Navigation.jsx';  

const RootLayout = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setToken(null);
    navigate("/log");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navigation token={token} handleLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;