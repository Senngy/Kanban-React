import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getUser } from "../services/auth.service";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Vérifie si un user existe (token présent)
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getUser(); // GET /me
        setUser(userData);
      } catch (error) {
        console.error("Auth expired or invalid:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auto-logout events from api.js
    const handleAutoLogout = () => {
      logout();
      // Optionally show a toast here via a callback or importing toast
    };
    window.addEventListener("auth:logout", handleAutoLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAutoLogout);
    };
  }, [token]);

  // Login
  const login = async (credentials) => {
    const { token: newToken, user: userData } = await loginUser(credentials);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  // Register (avec auto-login)
  const register = async (userInfo) => {
    const { token: newToken, user: userData } = await registerUser(userInfo);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};