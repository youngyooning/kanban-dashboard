import type { AuthChangeEvent, User } from "@supabase/supabase-js";

import type { AuthSessionChangeEvent, AuthSessionUser } from "../model/auth-types";
import { createAuthError } from "./auth-errors";

function requireAuthUserEmail(user: User): string {
  if (!user.email) {
    throw createAuthError("unknown", "사용자 이메일을 확인할 수 없습니다.");
  }

  return user.email.trim().toLowerCase();
}

export function mapAuthSessionUser(user: User): AuthSessionUser {
  return {
    id: user.id,
    email: requireAuthUserEmail(user),
  };
}

export function mapAuthSessionChangeEvent(event: AuthChangeEvent): AuthSessionChangeEvent | null {
  switch (event) {
    case "INITIAL_SESSION":
      return "initialSession";

    case "SIGNED_IN":
      return "signedIn";

    case "SIGNED_OUT":
      return "signedOut";

    case "TOKEN_REFRESHED":
      return "tokenRefreshed";

    case "USER_UPDATED":
      return "userUpdated";

    case "PASSWORD_RECOVERY":
    case "MFA_CHALLENGE_VERIFIED":
      return null;
  }
}
