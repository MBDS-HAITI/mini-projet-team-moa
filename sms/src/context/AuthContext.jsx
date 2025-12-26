import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8010/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
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

      setToken(authToken);
      setUser(normalizedUser);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } finally {
      setLoading(false);
    }
  };

    //----------------------------------------------------------------
const loginWithGoogle = async (googleToken) => {
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: googleToken }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = payload.message || payload.error || "Google authentication failed";
      throw new Error(errorMessage);
    }

    const authToken = payload.token;
    const authUser = payload.user;

    if (!authToken || !authUser) {
      throw new Error("Invalid response from server. Please try again.");
    }

    const normalizedUser = {
      ...authUser,
      role: authUser.role ? authUser.role.toLowerCase() : undefined,
    };

    setToken(authToken);
    setUser(normalizedUser);

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    
    return normalizedUser;
  } catch (err) {
    console.error("Google login error:", err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  //-----------------------------------------------------------------

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        loginWithGoogle, 
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);