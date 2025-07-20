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

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || "",
        email: session.user.email || "",
        avatarUrl: session.user.image || "",
      });
    } else {
      setUser(null);
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