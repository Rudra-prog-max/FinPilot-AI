import {
  createContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import { getCurrentUser, logoutCurrentUser } from "../services/userService";

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      if (mounted) {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("finpilot:unauthorized", handleUnauthorized);

    async function restoreSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (mounted) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        await getCurrentUser();
        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem("token");
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
      window.removeEventListener(
        "finpilot:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  function login() {
    setIsAuthenticated(true);
  }

  async function logout() {
    try {
      if (localStorage.getItem("token")) {
        await logoutCurrentUser();
      }
    } finally {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
