import type { PropsWithChildren } from "react";

import { AuthContext } from "./auth-context";
import { useAuthContextValue } from "./use-auth-context-value";
import { useAuthSessionSync } from "./use-auth-session-sync";

export function AuthProvider({ children }: PropsWithChildren) {
  useAuthSessionSync();
  const value = useAuthContextValue();

  return <AuthContext value={value}>{children}</AuthContext>;
}
