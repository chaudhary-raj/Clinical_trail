import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // ─── Restore session from localStorage on mount ───────
  useEffect(() => {
    const storedToken = localStorage.getItem('ctms_token');
    const storedUser = localStorage.getItem('ctms_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('ctms_token');
        localStorage.removeItem('ctms_user');
      }
    }
    setLoading(false);
  }, []);

  // ─── Login ────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = response.data.data;

    localStorage.setItem('ctms_token', newToken);
    localStorage.setItem('ctms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return response.data;
  }, []);

  // ─── Register ─────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    const { token: newToken, user: newUser } = response.data.data;

    localStorage.setItem('ctms_token', newToken);
    localStorage.setItem('ctms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return response.data;
  }, []);

  // ─── Logout ───────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Proceed with local logout regardless
    } finally {
      localStorage.removeItem('ctms_token');
      localStorage.removeItem('ctms_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
