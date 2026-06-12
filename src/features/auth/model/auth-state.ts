import type { AuthSessionUser, AuthState } from "./auth-types";

export function createAuthState(
  user: AuthSessionUser | null,
  isLoading: boolean,
  error: Error | null,
): AuthState {
  if (isLoading) {
    return {
      status: "loading",
      user: null,
    };
  }

  if (error) {
    return {
      status: "error",
      user,
      error,
    };
  }

  if (user) {
    return {
      status: "authenticated",
      user,
    };
  }

  return {
    status: "unauthenticated",
    user: null,
  };
}
