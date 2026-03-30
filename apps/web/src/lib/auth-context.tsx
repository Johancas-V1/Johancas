"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api, User } from "./api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("jcm-token");
      if (!token) {
        setUser(null);
        return;
      }
      const { user } = await api.auth.me();
      setUser(user);
    } catch {
      localStorage.removeItem("jcm-token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.auth.login({ email, password });
    localStorage.setItem("jcm-token", token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await api.auth.register({ name, email, password });
    localStorage.setItem("jcm-token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("jcm-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isPremium: user?.subscription === "premium",
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
