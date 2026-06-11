import type { AuthError as SupabaseAuthError } from "@supabase/supabase-js";
import { isAuthError as isSupabaseAuthErrorValue } from "@supabase/supabase-js";

import type { AuthErrorCode, AuthFailure } from "../model/auth-types";

const UNKNOWN_AUTH_ERROR_MESSAGE = "인증 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.";

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  invalid_email: "올바른 이메일 주소를 입력해 주세요.",
  validation_failed: "입력값을 확인한 후 다시 시도해 주세요.",
  email_already_exists: "이미 가입된 이메일입니다.",
  email_not_confirmed: "이메일 인증 후 다시 시도해 주세요.",
  weak_password: "비밀번호 조건을 확인해 주세요.",
  rate_limited: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  request_timeout: "요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.",
  session_expired: "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
  session_not_found: "로그인 세션을 찾을 수 없습니다. 다시 로그인해 주세요.",
  reauthentication_required: "보안을 위해 다시 로그인해 주세요.",
  unknown: UNKNOWN_AUTH_ERROR_MESSAGE,
};

export class AuthDomainError extends Error implements AuthFailure {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message = AUTH_ERROR_MESSAGES[code]) {
    super(message);
    this.name = "AuthDomainError";
    this.code = code;
  }
}

export function createAuthError(
  code: AuthErrorCode,
  message = AUTH_ERROR_MESSAGES[code],
): AuthDomainError {
  return new AuthDomainError(code, message);
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthDomainError) {
    return error.message;
  }

  return mapSupabaseAuthError(error).message;
}

export function isSupabaseAuthError(error: unknown): error is SupabaseAuthError {
  return isSupabaseAuthErrorValue(error);
}

export function mapSupabaseAuthError(error: unknown): AuthDomainError {
  if (!isSupabaseAuthError(error)) {
    return createAuthError("unknown");
  }

  switch (error.code) {
    case "invalid_credentials":
      return createAuthError("invalid_credentials");

    case "email_provider_disabled":
    case "email_address_invalid":
      return createAuthError("invalid_email");

    case "validation_failed":
      return createAuthError("validation_failed");

    case "email_exists":
    case "user_already_exists":
      return createAuthError("email_already_exists");

    case "email_not_confirmed":
      return createAuthError("email_not_confirmed");

    case "weak_password":
      return createAuthError("weak_password");

    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return createAuthError("rate_limited");

    case "request_timeout":
      return createAuthError("request_timeout");

    case "session_expired":
    case "refresh_token_not_found":
    case "refresh_token_already_used":
      return createAuthError("session_expired");

    case "session_not_found":
      return createAuthError("session_not_found");

    case "reauthentication_needed":
    case "reauthentication_not_valid":
    case "reauth_nonce_missing":
      return createAuthError("reauthentication_required");

    default:
      return createAuthError("unknown");
  }
}
