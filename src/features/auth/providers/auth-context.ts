import { createContext } from "react";

import type { AuthSessionUser, AuthState } from "../model/auth-types";

export interface AuthContextValue {
  state: AuthState;
  user: AuthSessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  retrySession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
