const REDIRECT_PARSE_BASE_URL = "http://app.local";

declare const internalRedirectPathBrand: unique symbol;

export type InternalRedirectPath = string & {
  readonly [internalRedirectPathBrand]: true;
};

export interface AuthRedirectOptions {
  redirectTo?: InternalRedirectPath;
}

export function isInternalRedirectPath(value: string): value is InternalRedirectPath {
  if (value.trim() !== value || value.includes("\\")) {
    return false;
  }

  try {
    new URL(value, REDIRECT_PARSE_BASE_URL);

    return value.startsWith("/") && !value.startsWith("//");
  } catch {
    return false;
  }
}

export function createAuthRedirectOptions(redirectTo?: string | null): AuthRedirectOptions {
  if (!redirectTo || !isInternalRedirectPath(redirectTo)) {
    return {};
  }

  return { redirectTo };
}
