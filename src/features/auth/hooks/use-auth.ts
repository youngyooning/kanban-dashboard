import { use } from "react";

import { AuthContext } from "../providers/auth-context";

export function useAuth() {
  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return authContext;
}
