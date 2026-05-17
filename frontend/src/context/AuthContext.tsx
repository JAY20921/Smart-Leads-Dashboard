import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginFormData, RegisterFormData, AuthContextValue } from '../types';
import { authApi } from '../services/authService';
import axios from 'axios';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null') as User | null; }
    catch { return null; }
  });
  const [token, setToken]     = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = useCallback(async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      const { user: u, token: t } = res.data.data!;
      setUser(u);
      setToken(t);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      const { user: u, token: t } = res.data.data!;
      setUser(u);
      setToken(t);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export const getApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message ?? 'An unexpected error occurred';
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
};
