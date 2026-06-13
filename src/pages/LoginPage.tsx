import { useLocation, useNavigate } from "react-router";

import { PATHS } from "@/app/routes/paths";
import { isInternalRedirectPath, LoginForm } from "@/features/auth";

interface LoginRedirectState {
  redirectTo?: unknown;
}

function isLoginRedirectState(value: unknown): value is LoginRedirectState {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "redirectTo" in value;
}

function getLoginRedirectPath(state: unknown): string {
  if (!isLoginRedirectState(state)) {
    return PATHS.WORKSPACES;
  }

  if (typeof state.redirectTo !== "string" || !isInternalRedirectPath(state.redirectTo)) {
    return PATHS.WORKSPACES;
  }

  return state.redirectTo;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginRedirectPath = getLoginRedirectPath(location.state);

  return (
    <main>
      <LoginForm
        signupTo={PATHS.SIGNUP}
        onLoginSuccess={() => {
          void navigate(loginRedirectPath, { replace: true });
        }}
      />
    </main>
  );
}
