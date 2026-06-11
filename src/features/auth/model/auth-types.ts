export interface AuthSessionUser {
  id: string;
  email: string;
}

export interface SignUpInput {
  displayName: string;
  email: string;
  password: string;
}

export type SignUpResult =
  | {
      status: "authenticated";
      user: AuthSessionUser;
    }
  | {
      status: "emailVerificationSent";
      email: string;
    };

export interface LoginInput {
  email: string;
  password: string;
}

export type AuthState =
  | {
      status: "loading";
      user: null;
    }
  | {
      status: "authenticated";
      user: AuthSessionUser;
    }
  | {
      status: "unauthenticated";
      user: null;
    }
  | {
      status: "error";
      user: AuthSessionUser | null;
      error: Error;
    };

export type AuthErrorCode =
  | "invalid_credentials"
  | "invalid_email"
  | "validation_failed"
  | "email_already_exists"
  | "email_not_confirmed"
  | "weak_password"
  | "rate_limited"
  | "request_timeout"
  | "session_expired"
  | "session_not_found"
  | "reauthentication_required"
  | "unknown";

export interface AuthFailure {
  code: AuthErrorCode;
  message: string;
}

export type AuthSessionChangeEvent =
  | "initialSession"
  | "signedIn"
  | "signedOut"
  | "tokenRefreshed"
  | "userUpdated";
