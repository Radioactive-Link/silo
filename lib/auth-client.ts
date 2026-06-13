import { createAuthClient } from "better-auth/react";

/** Authentication client for client-side components. */
export const authClient = createAuthClient();
const {
  signIn: _signIn,
  signOut: _signOut,
  useSession: _useSession,
} = authClient;

/** Client sign in. Provider is github. */
export function signIn() {
  return _signIn.social({ provider: "github", callbackURL: "/dashboard" });
}

/** Client sign out. */
export function signOut() {
  return _signOut();
}

/** Client useSession hook. */
export function useSession() {
  return _useSession();
}
