"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "./components/Button";
import { HorizontalDivider } from "./components/HorizontalDivider";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center pt-6">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center sm:items-start gap-3">
        <h1>Documentation</h1>
        <HorizontalDivider />
        <p>Welcome to the app.</p>
        <div>
          <Button onClick={() => signIn()}>Sign in</Button>
        </div>
      </main>
    </div>
  );
}
