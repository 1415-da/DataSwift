"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Persist auth state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("auth:user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  // Simulated API calls (replace with real API integration)
  const login = async (email: string, password: string) => {
    setLoading(true);
    // TODO: Replace with real API call
    await new Promise((res) => setTimeout(res, 800));
    setUser({ email });
    setLoading(false);
  };

  const signup = async (email: string, password: string, name?: string, remember?: boolean) => {
    setLoading(true);
    // TODO: Replace with real API call
    await new Promise((res) => setTimeout(res, 1000));
    setUser({ email, name });
    // For demo, always persist. In real app, use 'remember' to decide between localStorage/sessionStorage/cookie
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 