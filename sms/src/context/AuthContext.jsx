import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8010/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);
  const [oauthToken, setOAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    const storedOAuth = localStorage.getItem("oauthToken");

    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedOAuth) setOAuthToken(storedOAuth);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = payload.error || "Invalid email or password";
        throw new Error(message);
      }

      const authToken = payload.token;
      const authUser = payload.user || { email };
      const normalizedUser = {
        ...authUser,
        role: authUser.role ? authUser.role.toLowerCase() : undefined
      };

      if (!authToken) {
        throw new Error("Token manquant dans la réponse du serveur.");
      }

      setAuthToken(authToken);
      setUser(normalizedUser);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8010/api';
    window.location.href = `${apiUrl}/users/oauth/login`;
  };

  const handleOAuthCallback = (token, oauthAccessToken) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("oauthToken", oauthAccessToken);
    setAuthToken(token);
    setOAuthToken(oauthAccessToken);
    
    // Décoder le JWT pour récupérer les infos user
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userData = { 
      id: payload.userId, 
      role: payload.role,
      username: payload.username,
      email: payload.email
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    navigate("/");
  };

  const logout = () => {
    setAuthToken(null);
    setOAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("oauthToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        oauthToken,
        isAuthenticated: !!authToken,
        loading,
        login,
        loginWithOAuth,
        handleOAuthCallback,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);