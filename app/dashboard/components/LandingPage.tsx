"use client";

import { redirect } from "next/navigation";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { useSession } from "@/lib/auth-client";

export default function LandingPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center pt-6">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center sm:items-start gap-9">
        <div className="w-full flex flex-col gap-2">
          <h1>Dashboard</h1>
          <HorizontalDivider />
          <p>Hello, {session.user.name}!</p>
        </div>

        {children}
      </main>
    </div>
  );
}
