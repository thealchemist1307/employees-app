import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, type User, type LoginInput } from "@/lib/api";

type AuthCtx = {
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored && token) {
      apiClient.setToken(token);
      return JSON.parse(stored);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await apiClient.login(input);
      setUser(result.user);
      apiClient.setToken(result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      localStorage.setItem("employeeViewMode", "grid");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    // keep other tabs in sync
    const onStorage = () => {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (stored && token) {
        apiClient.setToken(token);
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
        apiClient.setToken(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
} 