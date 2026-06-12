import { useMemo } from "react";

import { useCurrentSessionUserQuery } from "../api/auth-queries";
import { createAuthState } from "../model/auth-state";
import type { AuthContextValue } from "./auth-context";

export function useAuthContextValue(): AuthContextValue {
  const sessionUserQuery = useCurrentSessionUserQuery();
  const { data, error, isPending, refetch } = sessionUserQuery;
  const user = data ?? null;

  return useMemo<AuthContextValue>(() => {
    const state = createAuthState(user, isPending, error);

    return {
      state,
      user: state.user,
      isLoading: state.status === "loading",
      isAuthenticated: state.status === "authenticated",
      error,
      retrySession: () => {
        void refetch();
      },
    };
  }, [error, isPending, refetch, user]);
}
