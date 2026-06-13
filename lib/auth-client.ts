import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
const {
  signIn: _signIn,
  signUp: _unused,
  signOut: _signOut,
  useSession: _useSession,
} = authClient;

/** Client sign in. Provider is github. */
export function signIn() {
  return _signIn.social({ provider: "github", callbackURL: "/" });
}

/** Client sign out. */
export function signOut() {
  return _signOut();
}

/** Client useSession hook. */
export function useSession() {
  return _useSession();
}
