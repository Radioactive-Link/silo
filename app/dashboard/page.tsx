"use client";

import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { HorizontalDivider } from "../components/HorizontalDivider";

export default function LandingPage() {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center pt-6">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center sm:items-start gap-3">
        <h1>Dashboard</h1>
        <HorizontalDivider />
        <p>Hello, {session.user.name}!</p>
      </main>
    </div>
  );
}
