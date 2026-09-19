import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/authService";

export interface User {
  id: number;
  full_name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      });
  }, []);

  async function login() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
