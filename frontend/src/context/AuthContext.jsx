import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if tokens exist
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('auth/profile/');
          setUser(response.data);
        } catch (error) {
          console.error("Auth initialization failed", error);
          // Interceptor handles logout if tokens are completely invalid
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('auth/login/', { email, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data || { detail: "Authentication failed. Please check credentials." };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role = 'user') => {
    setLoading(true);
    try {
      const response = await api.post('auth/register/', { username, email, password, role });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data || { detail: "Registration failed. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await api.post('auth/logout/', { refresh });
      }
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('auth/profile/', profileData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Failed to update profile." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
