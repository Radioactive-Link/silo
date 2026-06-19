import { requireAuth } from "@/lib/auth";
import Sidebar from "./components/Sidebar";

// require all dashboard pages to have authentication
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="w-full min-h-full flex flex-1">
      <div className="border-r-[#222222] border-r-2 border-dashed min-w-55">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 items-center justify-center pt-6">
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center sm:items-start gap-9">
          {children}
        </main>
      </div>
    </div>
  );
}
