// Navigation.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navigation = ({ token, handleLogout, userRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        setLoading(false);
        setCurrentRole(null);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        console.log('Navigation - Fetched role:', userData.role); // Debug log
        setCurrentRole(userData.role);
      } catch (err) {
        console.error('Error fetching user role:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [token]);

  console.log('Navigation - Props userRole:', userRole); // Debug log
  console.log('Navigation - Current role:', currentRole); // Debug log

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/log");
  };

  if (loading) {
    return <div>Loading navigation...</div>;
  }

  return (
    <nav className="flex gap-4 p-5 bg-gray-800 border-b border-gray-700 justify-center items-center">
      <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/">
        🏠 Home
      </Link>
      {token && (
        <>
          <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/profile">
            👤 Profile
          </Link>
          <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/tasks">
            📋 Zadania
          </Link>
          <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/recepcionist">
            📋 Recepcja
          </Link>
        </>
      )}
      {token && currentRole === 'ADMIN' && (
        <>
          <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/admin">
            ⚙️ Admin Panel
          </Link>
          <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/raports">
            📊 Raporty
          </Link>
        </>
      )}
      {token && currentRole === 'USER' && (
        <>
          <span className="text-gray-500 cursor-not-allowed">⚙️ Admin Panel</span>
          <span className="text-gray-500 cursor-not-allowed">📊 Raporty</span>
        </>
      )}
      {!token && (
        <Link className="text-purple-400 hover:text-purple-300 transition-colors no-underline font-medium" to="/log">
          🔐 Logowanie
        </Link>
      )}
      {token && (
        <button
          className="bg-red-600 hover:bg-red-500 text-white border-none py-2 px-4 rounded cursor-pointer font-medium transition-colors"
          onClick={handleLogoutClick}
        >
          🚪 Wyloguj
        </button>
      )}
    </nav>
  );
};

export default Navigation;