import { type QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AuthSessionUser, LoginInput, SignupInput, SignupResult } from "../model/auth-types";
import { getCurrentSessionUser, login, logout, signup } from "./auth-api";

export const authQueryKeys = {
  all: ["auth"] as const,
  sessionUser: () => [...authQueryKeys.all, "session-user"] as const,
};

async function setAuthSessionUser(queryClient: QueryClient, user: AuthSessionUser | null) {
  await queryClient.cancelQueries({ queryKey: authQueryKeys.sessionUser() });
  queryClient.setQueryData(authQueryKeys.sessionUser(), user);
}

async function setAuthSessionUserFromSignupResult(queryClient: QueryClient, result: SignupResult) {
  if (result.status === "authenticated") {
    await setAuthSessionUser(queryClient, result.user);
    return;
  }

  await setAuthSessionUser(queryClient, null);
}

export function useCurrentSessionUserQuery() {
  return useQuery({
    queryKey: authQueryKeys.sessionUser(),
    queryFn: getCurrentSessionUser,
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignupInput) => signup(input),
    onSuccess: async (result) => {
      await setAuthSessionUserFromSignupResult(queryClient, result);
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (user) => {
      await setAuthSessionUser(queryClient, user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await setAuthSessionUser(queryClient, null);
    },
  });
}
