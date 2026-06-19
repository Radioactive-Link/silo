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
    <>
      <div className="w-full flex flex-col gap-2">
        <h1>Dashboard</h1>
        <HorizontalDivider />
        <p>Hello, {session.user.name}!</p>
      </div>

      {children}
    </>
  );
}
