import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Configure axios base URL
const API_BASE_URL = "http://localhost:5000/api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Set auth token in headers if it exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete api.defaults.headers.common["x-auth-token"];
    }
  }, [token]);

  // Register function - sends POST request to /api/users/register
  const register = async (userData) => {
    try {
      console.log(
        "Sending registration request to:",
        `${API_BASE_URL}/users/register`
      );
      console.log("Registration data:", userData);

      const response = await api.post("/users/register", userData);

      console.log("Registration response:", response.data);

      const { token: newToken, user: newUser } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  // Login function - sends POST request to /api/users/login
  const login = async (credentials) => {
    try {
      console.log("Sending login request to:", `${API_BASE_URL}/users/login`);
      console.log("Login credentials:", { email: credentials.email });

      const response = await api.post("/users/login", credentials);

      console.log("Login response:", response.data);

      const { token: newToken, user: newUser } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["x-auth-token"];
  };

  // Load user from token
  const loadUser = async () => {
    if (token) {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Error loading user:", error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
