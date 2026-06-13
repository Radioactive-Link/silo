import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// require all dashboard pages to have authentication
export default async function DashboardLayout({
  children,
}: {
  children: React.Component;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}
