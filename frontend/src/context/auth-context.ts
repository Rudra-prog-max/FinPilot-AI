import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
