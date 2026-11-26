import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setToken, clearToken, getStoredUser, storeUser } from '../services/api.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true); // initial check

  // ── Verify token on mount ──
  useEffect(() => {
    const verify = async () => {
      const stored = getStoredUser();
      if (!stored) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        const me = data?.data || data?.user || null;
        setUser(me);
        const isLocal = !!localStorage.getItem('resumeiq_token');
        storeUser(me, isLocal);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  // ── Register ──
  const register = useCallback(async ({ fullName, email, password, confirmPassword, acceptedTerms }) => {
    const { data } = await api.post('/auth/register', {
      fullName,
      email,
      password,
      confirmPassword: confirmPassword ?? password,
      acceptedTerms: acceptedTerms ?? true,
    });
    const { token, user: u } = data.data || data;
    setToken(token, false);
    storeUser(u, false);
    setUser(u);
    return u;
  }, []);

  // ── Login ──
  const login = useCallback(async ({ email, password, remember }) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token, user: u } = data.data || data;
    setToken(token, !!remember);
    storeUser(u, !!remember);
    setUser(u);
    return u;
  }, []);

  // ── Logout ──
  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clearToken();
    setUser(null);
  }, []);

  // ── Refresh user from server ──
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      const me = data?.data || data?.user || null;
      setUser(me);
      const isLocal = !!localStorage.getItem('resumeiq_token');
      storeUser(me, isLocal);
      return me;
    } catch {
      return null;
    }
  }, []);

  // ── Update local user state (after profile edit) ──
  const updateUserState = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      const isLocal = !!localStorage.getItem('resumeiq_token');
      storeUser(updated, isLocal);
      return updated;
    });
  }, []);

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshUser,
    updateUserState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
