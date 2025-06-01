import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Log = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://springboot-backend-hnmc.onrender.com/auth/login", {
        email,
        passwordHash: password,
      });

      const token = response.data.token;
      
      // First set the token
      setToken(token);
      localStorage.setItem("token", token);

      // Then fetch user data immediately
      const userResponse = await fetch("https://springboot-backend-hnmc.onrender.com/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem("userRole", userData.role);
        
        // Navigate first
        navigate("/");
        
        // Then show success message and refresh
        setTimeout(() => {
          alert("Zalogowano pomyślnie!");
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Nieprawidłowy login lub hasło!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form
        className="flex flex-col p-10 rounded-lg bg-gray-800 shadow-2xl w-80"
        onSubmit={handleLogin}
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-200">
          Logowanie
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          className="p-3 mb-6 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="p-3 bg-purple-700 hover:bg-purple-600 text-white rounded font-bold transition-colors"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
};

export default Log;