import { type ReactNode, useCallback, useEffect, useState } from "react";

import type { User } from "@/interfaces/user";
import { setAuthFailureHandler } from "@/services/apiClient";

import { AuthContext, type AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredUser = (): User | null => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken"),
  );

  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const isSignedIn = Boolean(token && user);

  // ========================================
  // LOGIN
  // ========================================

  const login = useCallback((accessToken: string, signedInUser: User) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(signedInUser));

    setToken(accessToken);
    setUser(signedInUser);
  }, []);

  // ========================================
  // LOGOUT
  // ========================================

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }, []);

  // ========================================
  // AUTH FAILURE HANDLER
  // ========================================

  useEffect(() => {
    return setAuthFailureHandler(logout);
  }, [logout]);

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value: AuthContextType = {
    user,
    isSignedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
