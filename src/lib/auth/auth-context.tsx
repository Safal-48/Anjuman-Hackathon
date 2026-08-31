"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserProfile, UserRole, RoleOnboardingData } from "./types";
import { LoginInput, RegisterInput, ForgotPasswordInput } from "./schemas";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  updateOnboarding: (data: RoleOnboardingData) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  forgotPassword: (data: ForgotPasswordInput) => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: result.error || "Login failed" };
      }

      setUser(result.user);
      setIsLoading(false);

      if (!result.user.isOnboarded && result.user.role !== "admin") {
        router.push("/onboarding");
      } else if (result.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

      return { success: true, user: result.user };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: result.error || "Registration failed" };
      }

      setUser(result.user);
      setIsLoading(false);
      router.push("/onboarding");
      return { success: true, user: result.user };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const updateOnboarding = async (data: RoleOnboardingData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: result.error || "Failed to save profile" };
      }

      setUser(result.user);
      setIsLoading(false);
      router.push("/dashboard");
      return { success: true, user: result.user };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (data: ForgotPasswordInput) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || "Failed to process request" };
      }
      return { success: true, message: result.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isOnboarded: Boolean(user?.isOnboarded),
        isLoading,
        login,
        register,
        logout,
        updateOnboarding,
        forgotPassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
