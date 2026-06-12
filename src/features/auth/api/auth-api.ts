import { isAuthSessionMissingError } from "@supabase/supabase-js";

import { supabase } from "@/shared/lib/supabase";

import type {
  AuthSessionChangeEvent,
  AuthSessionUser,
  LoginInput,
  SignUpInput,
  SignUpResult,
} from "../model/auth-types";
import { mapSupabaseAuthError } from "./auth-errors";
import { mapAuthSessionChangeEvent, mapAuthSessionUser } from "./auth-mappers";

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        display_name: input.displayName,
      },
    },
  });

  if (error) {
    throw mapSupabaseAuthError(error);
  }

  if (!data.session) {
    return {
      status: "emailVerificationSent",
      email: input.email,
    };
  }

  return {
    status: "authenticated",
    user: mapAuthSessionUser(data.session.user),
  };
}

export async function login(input: LoginInput): Promise<AuthSessionUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw mapSupabaseAuthError(error);
  }

  return mapAuthSessionUser(data.session.user);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    throw mapSupabaseAuthError(error);
  }
}

export async function getCurrentSessionUser(): Promise<AuthSessionUser | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    if (isAuthSessionMissingError(error)) {
      return null;
    }

    throw mapSupabaseAuthError(error);
  }

  return mapAuthSessionUser(data.user);
}

export function subscribeAuthSessionChange(
  callback: (event: AuthSessionChangeEvent, user: AuthSessionUser | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const mappedEvent = mapAuthSessionChangeEvent(event);

    if (!mappedEvent) {
      return;
    }

    callback(mappedEvent, session ? mapAuthSessionUser(session.user) : null);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
