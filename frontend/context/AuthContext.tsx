"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signInWithProvider: (provider: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hydrate from localStorage on first mount to retain user across refresh while session loads
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('auth:user') : null;
      if (stored && !user) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reflect next-auth session into our local state and storage
    if (status === "authenticated" && session?.user) {
      const nextUser: User = {
        name: session.user.name || "",
        email: session.user.email || "",
        avatarUrl: session.user.image || "",
      };
      setUser(nextUser);
      try {
        localStorage.setItem('auth:user', JSON.stringify(nextUser));
      } catch {}
    } else if (status === "unauthenticated") {
      setUser(null);
      try {
        localStorage.removeItem('auth:user');
      } catch {}
    }
    setLoading(status === "loading");
  }, [session, status]);

  // For demo/local login, you can keep or remove
  const login = async (email: string, password: string) => {
    await signIn("credentials", { email, password, redirect: false });
  };

  const signup = async (email: string, password: string, name?: string, remember?: boolean) => {
    // You can implement a custom sign up flow or just use OAuth
    // For now, just call signIn
    await signIn("credentials", { email, password, name, redirect: false });
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
    setUser(null);
    try {
      localStorage.removeItem('auth:user');
    } catch {}
  };

  const signInWithProvider = (provider: string) => {
    signIn(provider.toLowerCase());
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, setUser, signInWithProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 