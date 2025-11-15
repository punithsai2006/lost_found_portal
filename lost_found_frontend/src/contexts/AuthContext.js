import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { loginUser, getCurrentUser } from "../services/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attach Authorization Header to every request
  useEffect(() => {
    const interceptorId = api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptorId);
  }, []);

  // ------------------------------
  // Fetch logged-in user
  // ------------------------------
  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res);
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchCurrentUser();
    else setLoading(false);
  }, []);

  // ------------------------------
  // LOGIN
  // ------------------------------
  const login = async (rollNumber, password) => {
    try {
      const data = await loginUser(rollNumber, password);
      localStorage.setItem("token", data.access_token);
      await fetchCurrentUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  // ------------------------------
  // LOGOUT
  // ------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        setUser,
        isAuthenticated: !!user,
        isAdmin: user?.role_name === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
