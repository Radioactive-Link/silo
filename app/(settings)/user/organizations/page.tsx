import Link from "next/link";
import { Button } from "@/app/components/Button";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import Organizations from "../../components/Organizations";

export default function OrganizationListPage() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between mb-1">
        <h2>Organizations</h2>
        <Button>
          <Link href="/organizations/create">Create New +</Link>
        </Button>
      </div>
      <HorizontalDivider />
      <Organizations />
    </div>
  );
}
