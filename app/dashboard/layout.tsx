import { requireAuth } from "@/lib/auth";

// require all dashboard pages to have authentication
export default async function DashboardLayout({
  children,
}: {
  children: React.Component;
}) {
  await requireAuth();

  return <>{children}</>;
}
